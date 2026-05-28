import os
from transformers import pipeline
from backend.topic_engine import get_topic
from deep_translator import GoogleTranslator


BASE_DIR = os.path.dirname(__file__)

print("Loading models...")

emotion_pipe = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base", #предобученная модель из HuggingFace
    top_k=1
)

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
            "topic": "empty"
        }

    if not is_english(text):
        text_en = translate_to_english(text)
    else:
        text_en = text

    emotion = emotion_pipe(text_en)[0][0]["label"]
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