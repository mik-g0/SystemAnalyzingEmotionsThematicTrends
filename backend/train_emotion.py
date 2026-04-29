# backend/train_emotion.py
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

from backend.utils.utils import clean_text, EMO_MAP


df = pd.read_csv("data/processed/emotion_dataset.csv")

df["text"] = df["text"].apply(clean_text)
df["emotion"] = df["emotion"].map(EMO_MAP)
df = df.dropna()

X = df["text"]
y = df["emotion"]


X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# TF-IDF
vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1,2)
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# модель
model = LogisticRegression(max_iter=1000)

model.fit(X_train_vec, y_train)

pred = model.predict(X_test_vec)
print(classification_report(y_test, pred))

joblib.dump(model, "models/emotion_model.pkl")
joblib.dump(vectorizer, "models/tfidf.pkl")