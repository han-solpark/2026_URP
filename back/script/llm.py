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
            title = row.title
            detail = row.detail
            category = row.category

            prompt = f"""
            Return the following string format indicating which undergraduate year the following activity is suitable for:

            1 for 1st year, 2 for 2nd year, 3 for 3rd year, 4 for 4th year, or ALL for all years.

            Output exactly one word without any description. Only one of 1, 2, 3, 4, or ALL.

            The result must be within 10 characters in English. If the result is likely to exceed 10 characters, answer ERROR.
            
            The example is as follows.
            [입력] OO 기사 자격증 [출력] 4
            [입력] OO 공모전 [출력] 3
            [입력] OO 직원 채용 [출력] 4

            name: {title}\n
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