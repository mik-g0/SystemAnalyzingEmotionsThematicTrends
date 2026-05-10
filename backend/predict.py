import os
from transformers import pipeline
from topic_engine import get_topic

BASE_DIR = os.path.dirname(__file__)

print("Loading models...")

emotion_pipe = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

def safe_text(text):
    if text is None:
        return ""
    return str(text).strip()


def predict(text):
    text = safe_text(text)

    if not text:
        return {
            "text": text,
            "emotion": "unknown",
            "topic": "empty"
        }

    emotion = emotion_pipe(text)[0][0]["label"]
    topic = get_topic(text)

    return {
        "text": text,
        "emotion": emotion,
        "topic": topic
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