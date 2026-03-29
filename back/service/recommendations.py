
import os
from pathlib import Path
from dotenv import load_dotenv
from sentence_transformers.util import cos_sim
from torch import *

import google.genai as genai
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")
LLM_KEY = os.getenv("LLM_KEY")

class RecommendationService:
    @staticmethod
    def call_llm(prompt: str): # 추천 이유 생성하는 용도
        client = genai.Client(api_key = LLM_KEY)

        try:
            response = client.models.generate_content(
                model='gemini-3-flash-preview', 
                contents=prompt
            )
            return response.text.strip()
        
        except Exception as e:
            return f"에러가 발생했습니다: {str(e)}"
        
    @staticmethod # 추천해서 실제로 어떤 활동 추천하는 지랑 활동 스코어 인덱스 5개 추출
    def get_recommendations(student_emb, activity_embeddings, top_k=5):
        cosine_scores = cos_sim(student_emb, activity_embeddings)
        scores = cosine_scores[0]
        top_results = torch.topk(scores, k=min(top_k, len(scores)))

        return top_results.values.tolist(), top_results.indices.tolist()