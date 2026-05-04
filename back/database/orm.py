from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import JSON, Boolean, Column, Integer, String, ForeignKey,Text, Date, Float

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

    @classmethod
    def create(cls, user_id:str, password: str, name: str, school_year:int):
        return cls(
            user_id = user_id,
            password=password,
            name = name,
            school_year = school_year
        )
        
    def __repr__(self):
        # 자바의 toString 같은 역할
        return f"<User(id='{self.user_id}', name='{self.name}')>"
    
class PastActivity(Base):
    __tablename__ = "past_activities"

    # 복합 기본키 및 외래키 설정
    user_id = Column(String(20), ForeignKey("users.user_id"), primary_key=True)
    activity_id = Column(Integer, ForeignKey("activities.activity_id"), primary_key=True)
    
    performed_school_year = Column(Integer, comment="수행 학기")
    activity_satisfaction = Column(Integer, comment="활동 만족도")
    carrier_satisfation = Column(Integer, comment="경로 만족도")

    # 관계 설정: 객체 관점에서 유저와 활동 정보에 바로 접근 가능
    user = relationship("User", backref="past_activities")
    activity = relationship("Activity", backref="past_activities")

    def __repr__(self):
        return f"<PastActivity(user_id='{self.user_id}', activity_id={self.activity_id})>"
    
class Recommendation(Base):
    __tablename__ = "recommendations"

    # 복합 기본키 및 외래키 설정
    user_id = Column(String(20), ForeignKey("users.user_id"), primary_key=True)
    activity_id = Column(Integer, ForeignKey("activities.activity_id"), primary_key=True)
    
    fitness_score = Column(Float, comment="적합도 점수")
    reason_for_recommendation = Column(Text, comment="추천 사유")
    likes = Column(Boolean, default=False, comment="좋아요 여부")

    # 관계 설정 (객체 참조용)
    user = relationship("User", backref="recommendations")
    activity = relationship("Activity", backref="recommendations")

    def __repr__(self):
        return f"<Recommendation(user_id='{self.user_id}', activity_id={self.activity_id}, score={self.fitness_score})>"