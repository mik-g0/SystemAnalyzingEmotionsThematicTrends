from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


TOPICS = {
    "work": "work job my job career workplace office tasks work stress deadlines boss burnout",
    "family": "family parents children relationships marriage home support love",
    "money": "finance salary debts bills investments savings income economy",
    "technology": "technology software programming AI internet computers smartphone applications",
    "health": "health illness anxiety depression stress hospital medicine therapy",
    "education": "school university studying exams homework learning science",
    "entertainment": "movies music games hobbies leisure fun streaming books",
    "social": "friends communication society people social interaction conversations",
    "shopping": "shopping products delivery customer service purchase store refund",
    "pets": "pets dogs cats animals veterinary care pet love"
}

topic_names = list(TOPICS.keys())
topic_embeddings = model.encode(list(TOPICS.values()))


def get_topic(text):
    emb = model.encode([text])
    scores = cosine_similarity(emb, topic_embeddings)[0]

    best = np.max(scores)

    if best < 0.35:
        return "unknown"

    idx = int(np.argmax(scores))
    return topic_names[idx]