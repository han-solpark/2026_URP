from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:rootpassword@127.0.0.1:3306/myapp_db"

engine = create_engine(DATABASE_URL, echo=True)
SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# 이 엔진을 사용하는 하나의 트랜잭션 단위 작업 공간
# FastAPI 요청 하나 -> MYSQL 트랜잭션 하나

def get_db():
    session = SessionFactory()
    try:
        yield session # yield가 나오면 그 값을 API한테 넘김.
    finally:
        session.close()