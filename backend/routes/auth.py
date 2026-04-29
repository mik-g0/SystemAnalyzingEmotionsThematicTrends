from fastapi import APIRouter, HTTPException
from backend.database.users_db import create_user, get_user

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter()

# --------- config ----------
SECRET_KEY = "secret"
ALGORITHM = "HS256"
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


# --------- helpers ----------
def hash_password(password):
    return pwd.hash(password)


def verify_password(password, hashed):
    return pwd.verify(password, hashed)


def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=2)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# --------- REGISTER ----------
@router.post("/register")
def register(data: dict):
    username = data["username"]
    password = data["password"]

    ok = create_user(username, hash_password(password))

    if not ok:
        raise HTTPException(400, "User exists")

    return {"message": "registered"}


# --------- LOGIN ----------
@router.post("/login")
def login(data: dict):
    username = data["username"]
    password = data["password"]

    user = get_user(username)

    if not user:
        raise HTTPException(401, "User not found")

    user_id, user_name, hashed = user

    if not verify_password(password, hashed):
        raise HTTPException(401, "Wrong password")

    token = create_token({"sub": user_name, "id": user_id})

    return {
        "access_token": token,
        "user_id": user_id
    }