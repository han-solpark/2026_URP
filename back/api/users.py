from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from repository.users import UserRepository
from schema.request import SignUpRequest, LogInRequest
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
    user: User = User.create(username = request.username, hashed_password = hashed_password)
    # 4. user -> db save
    user: User = user_repo.save_user(user)
    # 5. return user(id, username)
    return True

@router.post("/log-in")
def user_log_in_handler(request: LogInRequest, user_repo: UserRepository = Depends(),
                        user_service: UserService = Depends()):
    # 1. request body(username, password)
    # 2. db read user
    user: User | None = user_repo.get_user_by_username(request.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # 3. user.password(해싱), request.password -> bcrypt.checkpw
    verified: bool = user_service.verify_password(request.password, user.password)
    if not verified:
        raise HTTPException(status_code=401, detail="Not Authorized")
    # 4. create jwt(유효하면)
    access_token: str = user_service.create_jwt(user.username)
    # 5. return jwt
    return JWTResponse(access_token=access_token)
