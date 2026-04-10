from typing import List

from sqlalchemy import select, delete
from fastapi import Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.orm import User, Recommendation, PastActivity, Activity

from torch import *
import torch.nn.functional as F
from schema.request import RecommendRequest

import os
from pathlib import Path
from dotenv import load_dotenv

import google.genai as genai
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")
LLM_KEY = os.getenv("LLM_KEY")

class RecommendationRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
        self.activities = self.session.query(Activity).all() #list
        self.ability_map = {}

    def call_llm(self, prompt: str): # 추천 이유 생성하는 용도
        client = genai.Client(api_key = LLM_KEY)

        try:
            response = client.models.generate_content(
                model='gemini-3-flash-preview', 
                contents=prompt
            )
            return response.text.strip()
        
        except Exception as e:
            return f"에러가 발생했습니다: {str(e)}"
        
    def get_past_activities(self, user_id: str) -> List[PastActivity]:
        # user_id에 해당하는 모든 과거 활동을 조회합니다.
        query = select(PastActivity).where(PastActivity.user_id == user_id)
        result = self.session.execute(query)
        return result.scalars().all()
    
    def recommend(self, user_id: str, request:RecommendRequest):
        user_orm = self.db.query(User).filter(User.id == user_id).first()
        # 가중치 가져오기
        pref_weight = request.pref_weight
        activity_weight = request.activity_weight
        type_weight = request.type_weight

        # 선호 벡터 만들기
        preference_vector = torch.tensor(user_orm.preferense_embedding)

        # 능력 벡터 만들기
        ability = user_orm.ability # dict
        ability_vector = torch.zeros(768)
        for trait, score in ability.items():
            if trait in self.ability_map:
                # 각 유형 임베딩 * 사용자의 해당 점수
                ability_vector += self.ability_map[trait] * score
        
        activity_lookup = {a.activity_id: a.embedding for a in self.activities}

        # 과거 활동 벡터 만들기
        past_activities = self.get_past_activities(user_id)
        past_activity_vector = torch.zeros(768)
        count = 0
        
        for pa in past_activities:
            # pa.activity_id를 이용해 activities 테이블의 embedding 추출
            target_embedding = activity_lookup.get(pa.activity_id)
            if target_embedding:
                past_activity_vector += torch.tensor(target_embedding)
                count += 1
        
        if count > 0:
            past_activity_vector /= count

        # 이제 ability_vector, preference_vector, past_activity_vector 만들어짐
        # 이제 정규화를 좀 해보자
        p_vec = F.normalize(preference_vector, p=2, dim=0)
        a_vec = F.normalize(ability_vector, p=2, dim=0)
        h_vec = F.normalize(past_activity_vector, p=2, dim=0)

        user_v = (pref_weight * p_vec) + (activity_weight * a_vec) + (type_weight * h_vec)
        user_v = F.normalize(user_v, p=2, dim=0)

        results = []
        for activity in self.activities:
            if activity.embedding:
                activity_emb = torch.tensor(activity.embedding)
                activity_emb = F.normalize(activity_emb, p=2, dim=0)
                
                score = torch.dot(user_v, activity_emb).item()
                
                results.append({
                    "activity_id": activity.activity_id,
                    "fitness_score": score
                })

        top_5_results = sorted(results, key=lambda x: x['fitness_score'], reverse=True)[:5]

        # likes true인 애들은 그대로 두자
        keep_query = select(Recommendation.activity_id).where(
            (Recommendation.user_id == user_id) & (Recommendation.likes == True)
        )
        kept_ids = set(self.session.execute(keep_query).scalars().all())

        # likes 아닌 애들은 지워버림
        delete_stmt = delete(Recommendation).where(
            (Recommendation.user_id == user_id) & 
            (Recommendation.likes != True) # likes가 False이거나 아직 결정 안 된(None) 경우
        )
        self.session.execute(delete_stmt)

        # 새로운 추천 활동 5개 넣기
        for res in top_5_results:
            if res['activity_id'] not in kept_ids:
                activity = self.session.query(Activity).filter(
                    Activity.activity_id == res["activity_id"]
                ).first()
                reason_for_recommendation = self.call_llm(f"""
                        이 활동이 다음 활동을 선호하는 학생에게 추천되었어. 
                        너는 이제 왜 이 활동이 학생에게 잘 맞을 지 추천 이유를  100자 이내로 설명해 줘야 해.
                        추천 이유만을 문장으로 답변해 주고, 만약 100자가 넘을것 같으면 ERROR라고 답변해.
                        추천된 활동: {activity.title}
                        사용자의 선호 문장: {user_orm.preference}""")
                
                # ERROR 반환 시 처리: 기본 문구로 대체
                if "ERROR" in reason_for_recommendation:
                    reason = f"{activity.title} 활동은 사용자님의 평소 관심사와 핵심 역량에 잘 부합하여 추천합니다."
                new_rec = Recommendation(
                    user_id=user_id,
                    activity_id=res['activity_id'],
                    fitness_score=res['fitness_score'],
                    likes=False,
                    reason_for_recommendation=reason_for_recommendation
                )
                self.session.add(new_rec)
        
        self.session.commit()
        
        return top_5_results