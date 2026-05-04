from fastapi import FastAPI
from api.users import router as users_router
from api.recommendations import router as rec_router
from api.activities import router as act_router

app = FastAPI()

# 작성하신 users 라우터를 통합합니다.
app.include_router(users_router)
app.include_router(rec_router)
app.include_router(act_router)

@app.get("/")
def health_check():
    return {"status": "ok"}