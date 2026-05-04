from database.orm import Activity
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

router = APIRouter()

@router.get("/activities")
def activities_handler