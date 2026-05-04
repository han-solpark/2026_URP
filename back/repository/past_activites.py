
from sqlalchemy import select, delete
from fastapi import Depends
from sqlalchemy.orm import Session

from database.connection import get_db
from database.orm import PastActivity
from schema.response import PastActivitiesResponse
from schema.request import PastActivitiesRequest
from collections import defaultdict

class PastActivitiesRepository:
    def __init__(self, session: Session = Depends(get_db)):
        self.session = session
    def past_activities(self, user_id: str, request: PastActivitiesRequest):
        try:
            new_records = []
            
            grade_mapping = {
                "grade1": 1,
                "grade2": 2,
                "grade3": 3,
                "grade4": 4
            }

            for field_name, year_value in grade_mapping.items():
                activity_ids = getattr(request, field_name)
                
                if activity_ids:
                    for act_id in activity_ids:

                        record = PastActivity(
                            user_id=user_id,
                            activity_id=act_id,
                            performed_school_year=year_value
                        )

                        new_records.append(record)

            if new_records:
                self.session.add_all(new_records)
                self.session.commit()

                return {"status": "success", "count": len(new_records)}
            
            return {"status": "success", "message": "저장할 데이터가 없습니다."}

        except Exception as e:
            self.session.rollback()
            raise e
        
    def get_past_activities(self, user_id: str) -> PastActivitiesResponse:
        stmt = (
            select(PastActivity.activity_id, PastActivity.performed_school_year)
            .where(PastActivity.user_id == user_id)
        )
        
        result = self.session.execute(stmt).all()

        grade_data = defaultdict(list)
        
        for row in result:
            grade_data[row.performed_school_year].append(row.activity_id)

        return PastActivitiesResponse(
            grade1=grade_data.get(1),
            grade2=grade_data.get(2),
            grade3=grade_data.get(3),
            grade4=grade_data.get(4)
        )
    
    def delete_past_activities(self, user_id: str, activity_id: int):
        try:
            stmt = (
                delete(PastActivity)
                .where(PastActivity.user_id == user_id)
                .where(PastActivity.activity_id == activity_id)
            )
            
            result = self.session.execute(stmt)
            self.session.commit()
            
            return result.rowcount > 0

        except Exception as e:
            self.session.rollback()
            return False