import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def extract_keywords(df, topic_id, top_n=10):
    subset = df[df["topic"] == topic_id]["text"]

    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    X = vectorizer.fit_transform(subset)

    scores = X.sum(axis=0).A1
    words = vectorizer.get_feature_names_out()

    top_words = [words[i] for i in scores.argsort()[-top_n:][::-1]]
    return top_words