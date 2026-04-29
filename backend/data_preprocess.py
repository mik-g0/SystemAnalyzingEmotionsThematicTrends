from datasets import load_dataset
import os
import pandas as pd
from backend.utils.utils import clean_text

def preprocess_emotion_dataset():
    """создаст data/processed/emotion_dataset.csv"""
    dataset = load_dataset("go_emotions")
    train = dataset["train"]

    label_names = train.features["labels"].feature.names

    def decode(labels):
        if len(labels) == 0:
            return "neutral"
        return label_names[labels[0]]

    data = []
    for row in train:
        data.append({
            "text": row["text"],
            "emotion": decode(row["labels"])
        })

    df = pd.DataFrame(data)

    allowed_emotions = [
        "joy", "anger", "sadness", "fear", "neutral",
        "love", "surprise", "disgust", "gratitude",
        "optimism", "admiration", "annoyance",
        "confusion", "curiosity"
    ]

    df = df[df["emotion"].isin(allowed_emotions)]

    os.makedirs("data/processed", exist_ok=True)

    df.to_csv("data/processed/emotion_dataset.csv", index=False)

def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """
    Полная очистка датасета для NLP задач:
    - удаление NaN
    - очистка текста
    - удаление пустых строк
    """

    # 1. удалить пустые строки
    df = df.dropna()

    # 2. очистка текста
    df["text"] = df["text"].apply(clean_text)

    # 3. убрать пустые после очистки
    df = df[df["text"].str.strip() != ""]

    # 4. (опционально) сброс индексов
    df = df.reset_index(drop=True)

    return df