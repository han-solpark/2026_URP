from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import JSON, Boolean, Column, Integer, String, ForeignKey,Text, Date

Base = declarative_base()

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    url = Column(String(255), unique=False, nullable=True)
    name = Column(String(200), unique=True, nullable=False)
    detail = Column(Text)
    category = Column(String(50))
    embedded = Column(JSON) 
    year = Column(String(10))
    persistence = Column(String(10))
    written_date = Column(Date)

    def __repr__(self): # java toString 같은 역할
        return f"<Activity(id={self.id}, name='{self.name}')>"