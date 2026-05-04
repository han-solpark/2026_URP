from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.users import router as users_router
from api.recommendations import router as rec_router
from api.activities import router as activities_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 작성하신 users 라우터를 통합합니다.
app.include_router(users_router)
app.include_router(rec_router)
app.include_router(activities_router)

@app.get("/")
def health_check():
    return {"status": "ok"}