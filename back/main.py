from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.users import router as users_router
from api.recommendations import router as rec_router
from api.activities import router as act_router

app = FastAPI()

app.include_router(users_router)
app.include_router(rec_router)
app.include_router(act_router)

@app.get("/")
def health_check():
    return {"status": "ok"}