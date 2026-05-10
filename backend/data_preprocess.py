# backend/data_preprocess.py
import os
import pandas as pd
from datasets import load_dataset


def preprocess_emotion_dataset():
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

    os.makedirs("data/processed", exist_ok=True)
    df.to_csv("data/processed/emotion_dataset.csv", index=False)


if __name__ == "__main__":
    preprocess_emotion_dataset()