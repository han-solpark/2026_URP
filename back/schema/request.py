from pydantic import BaseModel
from typing import Optional

class ResultReportRequest(BaseModel): # 심리검사 결과 레포트 요청 스키마
    # 심리검사 이용 가이드라인 pdf 따라 만들었습니다
    apikey: Optional[str] = ""
    qestrnSeq: Optional[str] = ""
    trgetSe: Optional[str] = ""        
    gender: str          
    school: Optional[str] = ""
    grade: str           
    startDtm: Optional[int] = 0
    answers: str        

class SignUpRequest(BaseModel):
    user_id: str
    password: str
    name: str
    school_year: int

class LogInRequest(BaseModel):
    user_id: str
    password: str

class UserModifyRequest(BaseModel):
    school_year: Optional[int] = None

class PreferenceRequest(BaseModel):
    preference: str

class RecommendRequest(BaseModel):
    pref_weight: int
    activities_weight: int
    type_weight: int

class LikedActivitiesRequest(BaseModel):
    activity_id: int

class PastActivitiesRequest(BaseModel):
    grade1: Optional[list[int]] = None
    grade2: Optional[list[int]] = None
    grade3: Optional[list[int]] = None
    grade4: Optional[list[int]] = None
