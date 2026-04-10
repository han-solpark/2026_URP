import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from fastapi import APIRouter, Depends

from repository.recommendations import RecommendationRepository
from schema.request import RecommendRequest
from service.users import UserService

from tests.security import get_access_token

router = APIRouter(prefix = "/recommendations")

@router.post("/recommend", status_code=201)
def recommend_handler(request: RecommendRequest,
                    access_token: str = Depends(get_access_token), 
                    user_service: UserService = Depends(),
                    recommendation_repo: RecommendationRepository = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return recommendation_repo.recommend(user_id, request)

