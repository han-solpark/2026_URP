from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def main():
    return {"ping": "pong"}

# uvicorn main:app