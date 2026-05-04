
from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    user_id: str
    name: str
    school_year: int
    has_test_result: bool
    ability_url: Optional[str] = None
    ability: Optional[dict] = None 

    class Config:
        orm_mode = True

class JWTResponse(BaseModel):
    access_token: str

class LikedActiviteisResponse(BaseModel):
    activity_id: int
    category: str
    title: str
    source_url: str
    reason_for_recommendation: str

class PastActivitiesResponse(BaseModel):
    grade1: Optional[list[int]] = None
    grade2: Optional[list[int]] = None
    grade3: Optional[list[int]] = None
    grade4: Optional[list[int]] = None

class RecommendActivitiesResponse(BaseModel):
    activity_id:int
    source_url: str
    category: str
    title: str
    reason_for_recommendation: str
    fitness_score: float
    liked: bool

class ActivityResponse(BaseModel):
    activity_id: int
    title: str
    category: str
    source_url: Optional[str] = None
    detail: Optional[str] = None
    proper_school_year: Optional[str] = None
