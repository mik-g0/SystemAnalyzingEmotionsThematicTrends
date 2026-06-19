import re
from fastapi import FastAPI, UploadFile, File
from backend.auth import get_current_user
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from backend.database.db import init_db
from backend.database.users import create_user, get_user_by_email
from backend.database.analyses import save_analysis, get_history, get_all_analyses
from backend.utils.security import hash_password, verify_password, create_access_token
from backend.predict import predict, predict_batch
from collections import Counter
from backend.file_reader import extract_text


# ---------------------------
# MODELS (request bodies)
# ---------------------------

class AuthRequest(BaseModel):
    email: str
    password: str


class AnalyzeRequest(BaseModel):
    text: str


class BatchAnalyzeRequest(BaseModel):
    texts: list[str]


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
# ANALYSIS (ML) — один текст
# ---------------------------

@app.post("/analysis")
def analysis(req: AnalyzeRequest, user=Depends(get_current_user)):
    result = predict(req.text)

    save_analysis(
        user["id"],
        req.text,
        result["emotion"],
        result["topic"]
    )

    return result


@app.post("/analysis/file")
async def analyze_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    try:
        text = await extract_text(file)

        result = predict(text)

        save_analysis(
            user["id"],
            text[:5000],
            result["emotion"],
            result["topic"]
        )

        return result

    except Exception as e:
        return {"error": str(e)}


# ---------------------------
# BATCH ANALYSIS — массив текстов (комментарии)
# ---------------------------

@app.post("/analysis/batch")
def analysis_batch(req: BatchAnalyzeRequest, user=Depends(get_current_user)):
    result = predict_batch(req.texts)

    if "results" in result:
        for r in result["results"]:
            save_analysis(user["id"], r["text"], r["emotion"], r["topic"])

    return result


@app.post("/analysis/file/batch")
async def analyze_file_batch(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    try:
        text = await extract_text(file)

        # разбиваем на отдельные "комментарии": по строкам, отбрасывая пустые
        lines = [line.strip() for line in text.split("\n") if line.strip()]

        # если файл — это сплошная статья (мало строк, но длинные),
        # дополнительно разбиваем по предложениям
        if len(lines) < 3:
            lines = re.split(r'(?<=[.!?])\s+', text.strip())
            lines = [l.strip() for l in lines if l.strip()]

        result = predict_batch(lines)

        if "results" in result:
            for r in result["results"]:
                save_analysis(user["id"], r["text"][:5000], r["emotion"], r["topic"])

        return result

    except Exception as e:
        return {"error": str(e)}


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


@app.get("/trends")
def trends():
    rows = get_all_analyses()

    emotions = Counter(r["emotion"] for r in rows)
    topics = Counter(r["topic"] for r in rows)

    return {
        "emotions": [
            {"name": k, "count": v} for k, v in emotions.items()
        ],
        "topics": [
            {"name": k, "count": v} for k, v in topics.items()
        ]
    }

# ---------------------------
# ROOT
# ---------------------------

@app.get("/")
def root():
    return {"status": "ok"}
