from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# лёгкая модель эмбеддингов
model = SentenceTransformer("all-MiniLM-L6-v2")

# фиксированные темы (их можно расширять)
TOPICS = {
    "work_stress": "work job deadlines stress boss pressure burnout",
    "family": "family parents children love relationship support home",
    "money": "money finance salary debt bills expenses poverty",
    "technology": "technology software programming computers AI internet",
    "health": "health anxiety depression tired illness pain hospital",
    "entertainment": "movies music games entertainment fun leisure",
    "social": "friends social communication relationships talk people"
}

topic_names = list(TOPICS.keys())
topic_embeddings = model.encode(list(TOPICS.values()))


def get_topic(text):
    emb = model.encode([text])
    scores = cosine_similarity(emb, topic_embeddings)[0]

    best = np.max(scores)

    if best < 0.25:
        return "unknown"

    idx = int(np.argmax(scores))
    return topic_names[idx]