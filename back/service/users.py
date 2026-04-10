
import os
from pathlib import Path
from schema.request import ResultReportRequest
import requests
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import time
from urllib.parse import urlparse, parse_qs
from torch import *

import bcrypt
from datetime import datetime, timedelta
from jose import jwt

load_dotenv(Path(__file__).resolve().parents[2] / ".env")
LLM_KEY = os.getenv("LLM_KEY")

model = SentenceTransformer(
            "snunlp/KR-SBERT-V40K-klueNLI-augSTS"
        )

class UserService:
    encoding = "UTF-8"
    secret_key = "05383d6bcf5516e8814cd26540c777061aa4e84e70d2a4b84f99e1af17faee50"
    # 이 토큰이 서버가 직접 발급했고, 중간에 위·변조되지 않았다는 것을 증명하기 위한 비밀 키
    # 스택 카나리 느낌이라고 생각하기
    # secret_key를 아는 주체만 올바른 서명 생성 가능
    def hash_password(self, plain_password:str) ->str:
        hashed_password: bytes = bcrypt.hashpw(plain_password.encode(self.encoding), salt=bcrypt.gensalt())
        return hashed_password.decode(self.encoding)

    def verify_password(self, plain_password:str, hashed_password:str):
        return bcrypt.checkpw(plain_password.encode(self.encoding), hashed_password.encode(self.encoding))

    def create_jwt(self, username: str) -> str:
        return jwt.encode({
            "sub": username,
            "exp": datetime.now() + timedelta(days=1),
        }, self.secret_key, algorithm="HS256")

    def decode_jwt(self, access_token:str) -> str:
        payload: dict = jwt.decode(access_token, self.secret_key, algorithms=["HS256"])
        return payload["sub"]

    def request_result_report(self, request: ResultReportRequest) -> str:
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

    # 선호 활동 문장 임베딩 용도
    def embedding(self, text: str):

        embedded = model.encode(
                    text,  # 임베딩할 대상
                    convert_to_tensor=True,       # PyTorch Tensor
                    normalize_embeddings=True # 정규화
                   )
        return embedded.tolist()
    
    def parse_result(self, result_url:str):
        # 1. seq 추출
        parsed = urlparse(result_url)
        seq = parse_qs(parsed.query).get("seq", [None])[0]

        if not seq:
            raise ValueError("Invalid result_url: seq 없음")

        res = requests.get(
            f"https://www.career.go.kr/cloud/api/inspect/report",
            params={"seq": seq}
        )
        res.raise_for_status()

        report = res.json()

        # 3. 주요능력 + T점수 바로 추출
        result = {}

        for i in range(1, 10):
            name = report.get(f"code{i}nm")
            t = report.get(f"t{i}")

            if name and t is not None:
                result[name] = int(t)

        exp_data = {k: math.exp(v) for k, v in result.items()}
    
        # 2. 합계 계산
        total = sum(exp_data.values())
    
        return {k: v / total for k, v in exp_data.items()}
