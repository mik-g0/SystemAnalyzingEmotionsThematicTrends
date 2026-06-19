import os
from transformers import pipeline
from backend.topic_engine import get_topic
from deep_translator import GoogleTranslator
from collections import Counter
from datetime import datetime


BASE_DIR = os.path.dirname(__file__)

print("Loading models...")

emotion_pipe = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",  # предобученная модель из HuggingFace
    top_k=3  # было top_k=1 — теперь возвращаем топ-3 эмоции с уверенностью
)

# Маппинг эмоций -> простая полярность (positive/negative/neutral)
# j-hartmann модель выдаёт: anger, disgust, fear, joy, neutral, sadness, surprise
EMOTION_POLARITY = {
    "anger": "negative",
    "disgust": "negative",
    "fear": "negative",
    "sadness": "negative",
    "joy": "positive",
    "surprise": "positive",
    "neutral": "neutral",
}

# Эмоции, которые считаем "негативными" для алертов в batch-анализе
NEGATIVE_EMOTIONS = {"anger", "sadness", "fear", "disgust"}


def safe_text(text):
    if text is None:
        return ""
    return str(text).strip()


def translate_to_english(text):
    try:
        return GoogleTranslator(source='auto', target='en').translate(text)
    except Exception:
        return text


def is_english(text):
    return all(ord(c) < 128 for c in text)


def predict(text):
    text = safe_text(text)

    if not text:
        return {
            "text": text,
            "emotion": "unknown",
            "confidence": 0.0,
            "top_emotions": [],
            "sentiment": "neutral",
            "topic": "empty"
        }

    if not is_english(text):
        text_en = translate_to_english(text)
    else:
        text_en = text

    raw_emotions = emotion_pipe(text_en)[0]  # список из top_k эмоций с score

    top_emotions = [
        {"label": e["label"], "score": round(e["score"], 3)}
        for e in raw_emotions
    ]

    main_emotion = top_emotions[0]["label"]
    confidence = top_emotions[0]["score"]

    sentiment = EMOTION_POLARITY.get(main_emotion, "neutral")

    topic = get_topic(text)

    return {
        "text": text,
        "emotion": main_emotion,
        "confidence": confidence,
        "top_emotions": top_emotions,
        "sentiment": sentiment,
        "topic": topic
    }


def predict_batch(texts: list[str]) -> dict:
    """
    Анализирует список текстов (комментариев) и возвращает:
    - результат по каждому тексту
    - агрегированную статистику (распределение эмоций/тем)
    - доминирующую эмоцию/тему
    - тревожные сигналы (всплеск негатива по теме)
    """
    if not texts:
        return {"error": "empty input"}

    results = []
    for t in texts:
        r = predict(t)
        results.append(r)

    # ---- агрегация ----
    emotions = Counter(r["emotion"] for r in results)
    topics = Counter(r["topic"] for r in results)

    total = len(results)

    emotion_distribution = [
        {"name": k, "count": v, "percent": round(v / total * 100, 1)}
        for k, v in emotions.most_common()
    ]

    topic_distribution = [
        {"name": k, "count": v, "percent": round(v / total * 100, 1)}
        for k, v in topics.most_common()
    ]

    dominant_emotion = emotions.most_common(1)[0][0] if emotions else "unknown"
    dominant_topic = topics.most_common(1)[0][0] if topics else "unknown"

    # ---- негатив в целом ----
    negative_count = sum(
        v for k, v in emotions.items() if k in NEGATIVE_EMOTIONS
    )
    negative_ratio = round(negative_count / total * 100, 1) if total else 0

    # ---- темы, где негатив непропорционально высок ----
    topic_negative_breakdown = {}
    for r in results:
        topic = r["topic"]
        topic_negative_breakdown.setdefault(topic, {"total": 0, "negative": 0})
        topic_negative_breakdown[topic]["total"] += 1
        if r["emotion"] in NEGATIVE_EMOTIONS:
            topic_negative_breakdown[topic]["negative"] += 1

    alerts = []
    for topic, counts in topic_negative_breakdown.items():
        ratio = counts["negative"] / counts["total"] if counts["total"] else 0
        if ratio >= 0.5 and counts["total"] >= 3:  # порог настраиваемый
            alerts.append({
                "topic": topic,
                "negative_ratio": round(ratio * 100, 1),
                "sample_size": counts["total"]
            })

    return {
        "total_texts": total,
        "results": results,
        "emotion_distribution": emotion_distribution,
        "topic_distribution": topic_distribution,
        "dominant_emotion": dominant_emotion,
        "dominant_topic": dominant_topic,
        "overall_negative_ratio": negative_ratio,
        "alerts": alerts,
        "analyzed_at": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    tests = [
        "I feel exhausted because of work and deadlines",
        "My family supports me and I love them",
        "I am worried about money and bills",
        "I enjoy programming and building software",
        "I feel anxious and depressed lately"
    ]

    for t in tests:
        print(predict(t))

    print("\n--- batch test ---")
    print(predict_batch(tests))