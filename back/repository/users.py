from typing import List

from sqlalchemy import select, delete
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.orm import User


class UserRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
    def get_user_by_username(self, username: str) -> User | None:
        return self.session.scalar(select(User).where(User.username == username))
    def save_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user