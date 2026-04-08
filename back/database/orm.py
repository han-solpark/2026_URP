from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import JSON, Boolean, Column, Integer, String, ForeignKey,Text, Date

Base = declarative_base()

class Activity(Base):
    __tablename__ = "activities"

    activity_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    source_url = Column(String(255), unique=False, nullable=True)
    title = Column(String(200), unique=True, nullable=False)
    detail = Column(Text)
    category = Column(String(50))
    embedding = Column(JSON) 
    proper_school_year = Column(String(10))
    written_date = Column(Date)

    def __repr__(self): # java toString 같은 역할
        return f"<Activity(id={self.id}, name='{self.name}')>"
    
class User(Base):
    __tablename__ = "users"

    user_id = Column(String(20), primary_key=True)
    password = Column(String(20), nullable=False)
    name = Column(String(20), comment="이름")
    school_year = Column(Integer, comment="학기")
    ability = Column(JSON, comment="검사 결과 능력")
    ability_url = Column(String(100))
    preference = Column(Text, comment="선호 문장을 벡터로 치환한 데이터")
    preference_embedding = Column(JSON, comment="선호 문장 키워드 문자")

    def __repr__(self):
        # 자바의 toString 같은 역할
        return f"<User(id='{self.user_id}', name='{self.name}')>"