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
from backend.file_reader import extract_text
from backend.trend_engine import build_trends
from backend.database.analyses import get_analyses_by_period

from datetime import datetime, timedelta
from collections import Counter, defaultdict
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
    """
    Возвращает:
    - текущее распределение эмоций/тем
    - эмоциональный индекс (0-100)
    - динамику за последние 30 дней
    - топ растущих тем
    - всплески негатива
    """
    rows = get_all_analyses()

    if not rows:
        return {
            "emotions": [],
            "topics": [],
            "emotional_index": 50,
            "timeline": {},
            "top_growing_topics": [],
            "alerts": []
        }

    # ---- текущее состояние (снимок) ----
    emotions = Counter(r["emotion"] for r in rows)
    topics = Counter(r["topic"] for r in rows)

    emotion_dist = [
        {"name": k, "count": v} for k, v in emotions.most_common()
    ]

    topic_dist = [
        {"name": k, "count": v} for k, v in topics.most_common()
    ]

    # ---- эмоциональный индекс (0-100) ----
    # 100 = все позитивные, 0 = все негативные, 50 = нейтрально
    NEGATIVE_EMOTIONS = {"anger", "sadness", "fear", "disgust"}
    POSITIVE_EMOTIONS = {"joy", "surprise"}

    positive_count = sum(emotions.get(e, 0) for e in POSITIVE_EMOTIONS)
    negative_count = sum(emotions.get(e, 0) for e in NEGATIVE_EMOTIONS)
    total = len(rows)

    if total > 0:
        # Индекс: 100 * (позитив - негатив) / всего + 50
        emotional_index = max(0, min(100, 50 + (50 * (positive_count - negative_count) / total)))
    else:
        emotional_index = 50

    # ---- временная динамика (последние 30 дней по дням) ----
    today = datetime.utcnow().date()
    timeline = defaultdict(lambda: {"emotions": Counter(), "topics": Counter()})

    for r in rows:
        if r["created_at"]:
            # r["created_at"] приходит как datetime или строка
            if isinstance(r["created_at"], str):
                date = datetime.fromisoformat(r["created_at"]).date()
            else:
                date = r["created_at"].date() if hasattr(r["created_at"], "date") else today

            # учитываем только последние 30 дней
            if (today - date).days <= 30:
                timeline[str(date)]["emotions"][r["emotion"]] += 1
                timeline[str(date)]["topics"][r["topic"]] += 1

    # конвертируем в JSON-friendly формат
    timeline_json = {}
    for date_str in sorted(timeline.keys()):
        timeline_json[date_str] = {
            "emotions": dict(timeline[date_str]["emotions"]),
            "topics": dict(timeline[date_str]["topics"])
        }

    # ---- топ растущих тем (негативный тренд) ----
    # сравниваем: доля темы неделю назад vs сейчас
    week_ago = today - timedelta(days=7)
    recent_rows = [r for r in rows if (
            (isinstance(r["created_at"], str) and datetime.fromisoformat(r["created_at"]).date() >= week_ago)
            or (hasattr(r["created_at"], "date") and r["created_at"].date() >= week_ago)
    )]
    old_rows = [r for r in rows if (
            (isinstance(r["created_at"], str) and datetime.fromisoformat(r["created_at"]).date() < week_ago)
            or (hasattr(r["created_at"], "date") and r["created_at"].date() < week_ago)
    )]

    top_growing = []
    if old_rows and recent_rows:
        old_topics = Counter(r["topic"] for r in old_rows)
        recent_topics = Counter(r["topic"] for r in recent_rows)

        for topic in topics.keys():
            old_ratio = old_topics.get(topic, 0) / len(old_rows) if old_rows else 0
            recent_ratio = recent_topics.get(topic, 0) / len(recent_rows) if recent_rows else 0
            growth = recent_ratio - old_ratio

            if growth > 0:
                top_growing.append({
                    "topic": topic,
                    "growth_pct": round(growth * 100, 1),
                    "old_ratio": round(old_ratio * 100, 1),
                    "recent_ratio": round(recent_ratio * 100, 1)
                })

        top_growing = sorted(top_growing, key=lambda x: x["growth_pct"], reverse=True)[:5]

    # ---- всплески негатива ----
    # дни, когда негатив выше среднего + есть заметный скачок
    negative_by_day = defaultdict(int)
    total_by_day = defaultdict(int)

    for r in rows:
        if r["created_at"]:
            if isinstance(r["created_at"], str):
                date = datetime.fromisoformat(r["created_at"]).date()
            else:
                date = r["created_at"].date() if hasattr(r["created_at"], "date") else today

            if (today - date).days <= 30:
                total_by_day[str(date)] += 1
                if r["emotion"] in NEGATIVE_EMOTIONS:
                    negative_by_day[str(date)] += 1

    avg_negative_ratio = negative_count / total if total > 0 else 0

    alerts = []
    for date_str in sorted(negative_by_day.keys()):
        if total_by_day[date_str] > 0:
            ratio = negative_by_day[date_str] / total_by_day[date_str]
            if ratio > avg_negative_ratio * 1.3:  # всплеск более чем на 30% от среднего
                alerts.append({
                    "date": date_str,
                    "negative_ratio": round(ratio * 100, 1),
                    "count": negative_by_day[date_str],
                    "severity": "high" if ratio > 0.7 else "medium"
                })

    return {
        "emotions": emotion_dist,
        "topics": topic_dist,
        "emotional_index": round(emotional_index, 1),
        "positive_ratio": round(positive_count / total * 100, 1) if total > 0 else 0,
        "negative_ratio": round(negative_count / total * 100, 1) if total > 0 else 0,
        "timeline": timeline_json,
        "top_growing_topics": top_growing,
        "alerts": alerts,
        "total_analyzed": total,
        "period": "last_30_days"
    }

# ---------------------------
# ROOT
# ---------------------------

@app.get("/")
def root():
    return {"status": "ok"}
