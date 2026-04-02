from dateutil.relativedelta import relativedelta

import sys
import os
from pathlib import Path

# 부모 디렉토리를 path에 추가
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

from database.connection import SessionFactory  # 이미 만들어둔 설정 재사용
from database.orm import Activity              # ORM 모델

import google.genai as genai
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")
LLM_KEY = os.getenv("LLM_KEY")

def update_year():
    session = SessionFactory()
    
    try:
        rows = session.query(Activity).all()
    
        for row in rows:
            name = row.name
            detail = row.detail
            category = row.category

            prompt = f"""
            다음 활동이 대학교 학부생 몇 학년에게 적합할지 다음과 같은 문자열 형식으로 반환해줘.
            1학년이면 1, 2학년이면 2, 3학년이면 3, 4학년이면 4, 모든 학년에게 상관이 없으면 ALL
            설명 없이 딱 한 단어만 출력해. 1, 2, 3, 4, ALL 중 딱 하나로만.
            결과물은 반드시 영문 기준 10자 이내여야 한다. 만약 결과가 10자를 넘을 것 같으면 ERROR라고 대답해.
            예시는 다음과 같아.
            [입력] OO 기사 자격증 [출력] 4
            [입력] OO 공모전 [출력] 3
            [입력] OO 직원 채용 [출력] 4

            name: {name}\n
            detail: {detail}\n
            category: {category}\n
            """

            row.year = call_llm(prompt)
            
        # 3. 변경 사항 일괄 반영
        session.commit()
        
    except Exception as e:
        print(f"에러 발생: {e}")
        session.rollback()

    finally:
        session.close()


def call_llm(prompt: str):
    client = genai.Client(api_key = LLM_KEY)

    try:
        response = client.models.generate_content(
            model='gemini-3-flash-preview', 
            contents=prompt
        )
        return response.text.strip()
    
    except Exception as e:
        return f"에러가 발생했습니다: {str(e)}"
    
if __name__ == "__main__":
    update_year()
    
    print("데이터베이스 업데이트가 완료되었습니다.")