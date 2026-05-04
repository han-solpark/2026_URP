from typing import List

from sqlalchemy import select, delete
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.orm import User
from schema.response import UserSchema
from schema.request import UserModifyRequest


class UserRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
    def get_user_by_username(self, username: str) -> User | None:
        return self.session.scalar(select(User).where(User.user_id == username))
    def save_user(self, user: User) -> User:
        try: 
            self.session.add(user)
            self.session.commit()
            self.session.refresh(user)
            return user
        except Exception as e:
            self.session.rollback()
            raise e
    
    def get_user_info(self, user_id: str) -> UserSchema:
        user_orm = self.session.query(User).filter(User.id == user_id).first()
        
        # 수동으로 필요한 데이터만 뽑아서 스키마 생성
        return UserSchema(
            user_id = user_orm.user_id,
            name = user_orm.name,
            school_year=user_orm.school_year, # 이름이 다른 경우
            has_test_result=(user_orm.ability is not None),
            ability_url=user_orm.ability_url,
            ability = user_orm.ability
        )
    
    def modify_user_info(self, user_id: str, request: UserModifyRequest) -> UserSchema:
        user_orm = self.session.query(User).filter(User.id == user_id).first()
        update_dict = request.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(user_orm, key, value)

        try:
            self.session.commit()
            self.session.refresh(user_orm)
            return user_orm
        except Exception as e:
            self.session.rollback()
            raise e
    
    def test_result(self, user_id:str, result_url:str, parse: dict):
        user_orm = self.session.query(User).filter(User.id == user_id).first()

        if not user_orm:
            raise ValueError(f"User with id {user_id} not found")
    
        user_orm.ability_url = result_url
        user_orm.ability = parse

        try:
            self.session.commit()
            self.session.refresh(user_orm)
            return user_orm
        except Exception as e:
            self.session.rollback()
            raise e
        
    def save_preference(self, user_id:str, preference:str, embedding:list):
        user_orm = self.session.query(User).filter(User.id == user_id).first()

        if not user_orm:
            raise ValueError(f"User with id {user_id} not found")
        
        user_orm.preference = preference
        user_orm.preference_embedding = embedding

        try:
            self.session.commit()
            self.session.refresh(user_orm)
            return user_orm
        except Exception as e:
            self.session.rollback()
            raise e
