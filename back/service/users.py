
import os
from pathlib import Path
from schema.request import ResultReportRequest
import requests
from dotenv import load_dotenv
import time

class UserService:
    @staticmethod
    def request_result_report(request: ResultReportRequest) -> str:
        load_dotenv(Path(__file__).resolve().parents[2] / ".env")
        CAREERNET_KEY = os.getenv("CAREERNET_KEY")

        # 1. API 엔드포인트 URL
        url = "https://www.career.go.kr/inspct/openapi/test/report"

        # 2. 요청 헤더 설정
        headers = {
            "Content-Type": "application/json"
        }
        payload = request.model_dump()

        payload.update({
            "apikey": CAREERNET_KEY,
            "qestrnSeq": "10",
            "trgetSe":"100208",
            "school":"성균관대학교",
            "startDtm" : int(time.time() * 1000)
        })

        print(payload)

        try:
            response = requests.post(
                url=url,
                json = payload,
                headers=headers
            )
            if response.status_code == 200:
                return response.json()["RESULT"]["url"]
            else:
                raise Exception(f"API 요청 실패: {response.status_code}, {response.text}")
            
        except:
            raise


    #def parse_result(self, result_url:str) -> int[9]:

if __name__ == "__main__":
    # AI 사용 랜덤 답변 샘플 생성
    sample_data = ResultReportRequest(
        gender="100323",
        grade="2",
        answers="2,4,1,5,3,2,3,1,4,2,5,3,2,1,4,5,3,2,4,1,3,5,2,4,1,2,3,5,4,2,1,3,4,5,2,3,1,4,2,5,3,1,2,4,5,3,2,1,4"
    )

    print("🚀 커리어넷 API 요청을 시작합니다...")
    result_url = UserService.request_result_report(sample_data)
    
    print("\n[최종 결과]")
    print(result_url)