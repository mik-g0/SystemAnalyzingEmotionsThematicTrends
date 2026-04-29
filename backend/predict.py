import joblib
from bertopic import BERTopic
from backend.topic_labels import TOPIC_LABELS
import os
import joblib


BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")

# загрузка моделей
emotion_model = joblib.load(os.path.join(MODEL_DIR, "emotion_model.pkl"))
vectorizer = joblib.load(os.path.join(MODEL_DIR, "vectorizer.pkl"))
topic_model = BERTopic.load(os.path.join(MODEL_DIR, "bertopic_model"))


def predict(text):
    # эмоция
    emotion = emotion_model.predict(vectorizer.transform([text]))[0]

    # тема
    topic_id, _ = topic_model.transform([text])
    topic_id = topic_id[0]

    return {
        "text": text,
        "emotion": emotion,
        "topic_id": int(topic_id),
        "topic": TOPIC_LABELS.get(topic_id, "Unknown")
    }


# тесты
tests = [
    "I love my family and friends",
    "This is terrible and stressful",
    "Thank you so much for help",
    "Work is exhausting and I hate it",
]

for t in tests:
    print(predict(t))