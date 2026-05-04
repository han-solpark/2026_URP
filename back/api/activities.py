<<<<<<< HEAD
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from fastapi import APIRouter, Depends
from repository.activities import ActivitiesRepository
=======
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.orm import Activity
from schema.response import ActivityResponse
>>>>>>> 31c8269d288dde394d3e0093e6fc1a83591a135b

router = APIRouter(prefix = "/activities")

<<<<<<< HEAD
@router.get("")
def activities_handler(repo: ActivitiesRepository = Depends()):
    return repo.getActivities()
=======
@router.get("/activities", response_model=list[ActivityResponse])
def activities_handler(session: Session = Depends(get_db)):
    activities = session.query(Activity).all()
    return [
        ActivityResponse(
            activity_id=a.activity_id,
            title=a.title,
            category=a.category,
            source_url=a.source_url,
            detail=a.detail,
            proper_school_year=a.proper_school_year,
        )
        for a in activities
    ]
>>>>>>> 31c8269d288dde394d3e0093e6fc1a83591a135b
