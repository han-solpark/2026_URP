from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.users import router as users_router
from api.recommendations import router as rec_router
from api.activities import router as act_router

app = FastAPI()

app.include_router(users_router)
app.include_router(rec_router)
app.include_router(act_router)

origins = [
    "http://localhost:3000",  # 예: React, Next.js 등 로컬 개발 서버 기본 주소
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # OPTIONS를 포함한 모든 메서드 허용
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}