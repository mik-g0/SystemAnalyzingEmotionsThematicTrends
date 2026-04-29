import pandas as pd
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from data_preprocess import preprocess_dataframe

# 1. данные
df = pd.read_csv("data/processed_with_topics.csv")
df = preprocess_dataframe(df)

texts = df["text"].tolist()

# 2. эмбеддинги
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# 3. модель
topic_model = BERTopic(
    embedding_model=embedder,
    min_topic_size=50,    # 👈 убрать мелкие шумовые группы
    verbose=True
)

# 4. обучение
topics, probs = topic_model.fit_transform(texts)

# 5. 🔥 УБРАТЬ ШУМ (-1)
topics = topic_model.reduce_outliers(texts, topics)


topic_info = topic_model.get_topic_info()
print(topic_info)

# 7. сохранить
topic_model.save("models/bertopic_model")

print("BERTopic model saved")