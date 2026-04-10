from typing import List

from pydantic import BaseModel

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

