from fastapi import FastAPI
from backend.auth import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from backend.database.db import init_db
from backend.database.users import create_user, get_user_by_email
from backend.database.analyses import save_analysis, get_history
from backend.utils.security import hash_password, verify_password, create_access_token
from backend.predict import predict


# ---------------------------
# MODELS (request bodies)
# ---------------------------

class AuthRequest(BaseModel):
    email: str
    password: str


class AnalyzeRequest(BaseModel):
    text: str


# ---------------------------
# APP LIFESPAN
# ---------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)


# ---------------------------
# CORS
# ---------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# AUTH
# ---------------------------

@app.post("/register")
def register(req: AuthRequest):
    if get_user_by_email(req.email):
        return {"error": "user exists"}

    create_user(req.email, hash_password(req.password))
    return {"status": "ok"}


@app.post("/login")
def login(req: AuthRequest):
    user = get_user_by_email(req.email)

    if not user:
        return {"error": "user not found"}

    if not verify_password(req.password, user["password_hash"]):
        return {"error": "wrong password"}

    token = create_access_token({"sub": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ---------------------------
# ANALYSIS (ML)
# ---------------------------

from backend.auth import get_current_user
from fastapi import Depends


@app.post("/analyze")
def analyze(req: AnalyzeRequest, user=Depends(get_current_user)):
    result = predict(req.text)

    save_analysis(
        user["id"],
        req.text,
        result["emotion"],
        result["topic"]
    )

    return result

# ---------------------------
# HISTORY
# ---------------------------

@app.get("/history")
def history(user=Depends(get_current_user)):
    rows = get_history(user["id"])

    return [
        {
            "text": r["text"],
            "emotion": r["emotion"],
            "topic": r["topic"],
            "time": r["created_at"]
        }
        for r in rows
    ]


# ---------------------------
# ROOT
# ---------------------------

@app.get("/")
def root():
    return {"status": "ok"}