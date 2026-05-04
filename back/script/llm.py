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
from concurrent.futures import ThreadPoolExecutor
def update_year():
    session = SessionFactory()
    
    try:
        rows = session.query(Activity).filter(Activity.proper_school_year == None).all()
        if not rows:
            print("업데이트할 새로운 데이터가 없습니다.")
            return
        
        # 1. 병렬 처리를 위한 함수 내부 정의
        def get_year_label(row):
            prompt = f"""
            Return the following string format indicating which undergraduate year the following activity is suitable for:

            1 for 1st year, 2 for 2nd year, 3 for 3rd year, 4 for 4th year, or ALL for all years.

            Output exactly one word without any description. Only one of 1, 2, 3, 4, or ALL.

            The result must be within 10 characters in English. If the result is likely to exceed 10 characters, answer ERROR.
            
            The example is as follows.
            [입력] OO 기사 자격증 [출력] 4
            [입력] OO 공모전 [출력] 3
            [입력] OO 직원 채용 [출력] 4

            name: {row.title}\n
            detail: {row.detail}\n
            category: {row.category}\n
            """
            # LLM 호출만 병렬로 수행
            result = call_llm(prompt)
            return row, result

        # 2. 스레드 풀을 사용하여 병렬 실행 (max_workers는 API 제한에 따라 조절)
        print(f"총 {len(rows)}개의 데이터를 처리 중입니다...")
        with ThreadPoolExecutor(max_workers=10) as executor:
            # map을 통해 모든 row에 대해 get_year_label 실행
            llm_results = list(executor.map(get_year_label, rows))

        # 3. 메인 스레드에서 결과 일괄 반영
        for row, year_label in llm_results:
            row.proper_school_year = year_label # 기존 코드의 row.year를 모델 필드명에 맞춰 수정 (proper_school_year 맞죠?)

        session.commit()
        print("모든 데이터 업데이트 완료!")
        
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