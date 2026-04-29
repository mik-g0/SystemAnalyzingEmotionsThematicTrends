from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from backend.predict import predict
from backend.database.history_db import init_history_db, load_history, save_history
from backend.routes.auth import router as auth_router

app = FastAPI()

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

# -------- startup ----------
@app.on_event("startup")
def startup():
    init_history_db()

# -------- models ----------
class TextRequest(BaseModel):
    text: str


# -------- analyze ----------
@app.post("/analyze")
def analyze(req: TextRequest):
    text = req.text
    result = predict(text)

    save_history(1, text, result["emotion"])

    return {
        "text": text,
        "emotion": result["emotion"],
        "topic_id": result["topic_id"],
        "topic": result["topic"]
    }


# -------- history ----------
@app.get("/history")
def get_history(limit: int = 10):
    rows = load_history(limit)
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
