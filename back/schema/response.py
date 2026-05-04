
from pydantic import BaseModel
from typing import Optional

class UserSchema(BaseModel):
    user_id: int
    name: str
    school_year: int
    has_test_result: bool
    ability_url: str
    ability: dict

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
