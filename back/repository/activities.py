from fastapi import Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.orm import Activity

class ActivitiesRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
    def getActivities(self):
        return self.session.query(Activity).all()