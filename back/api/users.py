import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from fastapi import APIRouter, Depends, HTTPException

from repository.users import UserRepository
from repository.recommendations import RecommendationRepository
from repository.past_activites import PastActivitiesRepository
from schema.request import PastActivitiesRequest, SignUpRequest, LogInRequest, PreferenceRequest, UserModifyRequest, ResultReportRequest, LikedActivitiesRequest
from schema.response import JWTResponse, UserSchema
from service.users import UserService
from database.orm import User

from tests.security import get_access_token

router = APIRouter(prefix = "/users")

@router.post("/sign-up", status_code=201)
def user_sign_up_handler(request: SignUpRequest, user_service: UserService = Depends(), user_repo: UserRepository = Depends()):
    # 1. request body (username, password)
    hashed_password: str = user_service.hash_password(request.password)
    # 2. password -> hashing -> hashed_password
    # 3. User(username, hashed_password)
    user: User = User.create(user_id = request.user_id, password = hashed_password, name = request.name, school_year = request.school_year)
    # 4. user -> db save
    user: User = user_repo.save_user(user)
    # 5. return user(id, username)
    return True

@router.post("/log-in", status_code=201)
def user_log_in_handler(request: LogInRequest, user_repo: UserRepository = Depends(),
                        user_service: UserService = Depends()):
    # 1. request body(username, password)
    # 2. db read user
    user: User | None = user_repo.get_user_by_username(request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # 3. user.password(해싱), request.password -> bcrypt.checkpw
    verified: bool = user_service.verify_password(request.password, user.password)
    if not verified:
        raise HTTPException(status_code=401, detail="Not Authorized")
    # 4. create jwt(유효하면)
    access_token: str = user_service.create_jwt(user.user_id)
    # 5. return jwt
    return JWTResponse(access_token=access_token)

@router.get("/check-username/{id}")
def user_check_username_handler(id: str, user_repo: UserRepository = Depends()):
    user: User | None = user_repo.get_user_by_username(id)

    if not user:
        return {"available": True}
    
    return {"available": False}

@router.get("/me")
def user_info_handler(access_token: str = Depends(get_access_token), 
                    user_repo: UserRepository = Depends(), 
                    user_service: UserService = Depends()) -> UserSchema:
    user_id = user_service.decode_jwt(access_token)

    return user_repo.get_user_info(user_id)

@router.put("/me")
def user_modify_handler(request: UserModifyRequest,
                    access_token: str = Depends(get_access_token), 
                    user_repo: UserRepository = Depends(), 
                    user_service: UserService = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return user_repo.modify_user_info(user_id, request)

@router.post("/me/test-result", status_code=201)
def user_test_result_handler(request: ResultReportRequest,
                    access_token: str = Depends(get_access_token), 
                    user_repo: UserRepository = Depends(), 
                    user_service: UserService = Depends()):
    '''
    sample_data = ResultReportRequest(
        gender="100323",
        grade="2",
        answers="2,4,1,5,3,2,3,1,4,2,5,3,2,1,4,5,3,2,4,1,3,5,2,4,1,2,3,5,4,2,1,3,4,5,2,3,1,4,2,5,3,1,2,4,5,3,2,1,4"
    )'''
    user_id = user_service.decode_jwt(access_token)

    result_url = user_service.request_result_report(request)
    parse = user_service.parse_result(result_url)

    return user_repo.test_result(user_id=user_id, result_url=result_url, parse=parse)

@router.post("/me/preference", status_code=201)
def user_preference_handler(request: PreferenceRequest,
                    access_token: str = Depends(get_access_token), 
                    user_repo: UserRepository = Depends(), 
                    user_service: UserService = Depends()):
    user_id = user_service.decode_jwt(access_token)

    embedding = user_service.embedding(request.preference)

    return user_repo.save_preference(user_id, request.preference, embedding)

@router.post("/me/liked-activities", status_code=201)
def user_liked_activities_handler(request: LikedActivitiesRequest,
                                  access_token: str = Depends(get_access_token),
                                  rec_repo: RecommendationRepository = Depends(),
                                  user_service: UserService = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return rec_repo.like_activity(user_id, request)

@router.get("/me/liked-activities", status_code=200)
def user_liked_get_handler(access_token: str = Depends(get_access_token),
                           user_service: UserService = Depends(),
                           rec_repo: RecommendationRepository = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return rec_repo.get_like_activity(user_id)

@router.post("/me/past-activities", status_code=201)
def user_past_activities_handler(request: PastActivitiesRequest,
                                 access_token: str = Depends(get_access_token),
                                 pa_repo: PastActivitiesRepository = Depends(),
                                 user_service: UserService = Depends()):

    user_id = user_service.decode_jwt(access_token)

    return pa_repo.past_activities(user_id, request)

@router.get("/me/past-activities")
def get_past_activities_handler(access_token: str = Depends(get_access_token),
                                 pa_repo: PastActivitiesRepository = Depends(),
                                 user_service: UserService = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return pa_repo.get_past_activities(user_id)


@router.delete("/me/past-activities/{activity_id}")
def delete_past_activities_handler(activity_id = int,
                                 access_token: str = Depends(get_access_token),
                                 pa_repo: PastActivitiesRepository = Depends(),
                                 user_service: UserService = Depends()):
    user_id = user_service.decode_jwt(access_token)

    return pa_repo.delete_past_activities(user_id, activity_id)


