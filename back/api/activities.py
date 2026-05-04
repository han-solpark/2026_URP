import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from fastapi import APIRouter, Depends
from repository.activities import ActivitiesRepository

router = APIRouter(prefix = "/activities")

@router.get("")
def activities_handler(repo: ActivitiesRepository = Depends()):
    return repo.getActivities()