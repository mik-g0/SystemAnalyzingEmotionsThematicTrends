from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from backend.predict import predict
from backend.database.history_db import init_history_db, load_history, save_history
from backend.routes.auth import router as auth_router, get_current_user
from backend.database.users_db import init_users_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    init_history_db()
    init_users_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {"status": "ok"}


# -------- models ----------
class TextRequest(BaseModel):
    text: str


# -------- analyze (теперь защищён) ----------
@app.post("/analyze")
def analyze(
    req: TextRequest,
    current_user: dict = Depends(get_current_user)
):
    text = req.text
    result = predict(text)

    # сохраняем историю уже для конкретного пользователя
    save_history(current_user["id"], text, result["emotion"])

    return {
        "text": text,
        "emotion": result["emotion"],
        "topic_id": result["topic_id"],
        "topic": result["topic"]
    }


# -------- history (теперь защищён) ----------
@app.get("/history")
def get_history(
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    rows = load_history(current_user["id"], limit)
    return [
        {"text": t, "emotion": e, "timestamp": ts}
        for t, e, ts in rows
    ]

# @app.post("/wordcloud_trends")
# def wordcloud_trends(req: TextRequest):
#     """WordCloud для трендов"""
#     img_bytes = generate_wordcloud_image([req.text])
#     img_bytes.seek(0)
#
#     img_base64 = base64.b64encode(img_bytes.getvalue()).decode("utf-8")
#     return {"wordcloud": img_base64}
