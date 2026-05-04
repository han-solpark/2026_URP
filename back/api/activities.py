from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from database.orm import Activity
from schema.response import ActivityResponse

router = APIRouter()

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
