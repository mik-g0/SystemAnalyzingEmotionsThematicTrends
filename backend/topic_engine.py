from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

TOPICS = {
    "work": """
        work job career workplace office tasks deadlines boss burnout schedule salary promotion
        работа работать работник карьера офис задачи сроки босс выгорание зарплата должность
    """,

    "family": """
        family parents children relationships marriage home support love relatives kids
        семья родители дети отношения брак дом поддержка любовь родственники
    """,

    "money": """
        finance salary debts bills investments savings income economy money cash cost price
        финансы зарплата долги счета инвестиции сбережения доход экономика деньги цена
    """,

    "technology": """
        technology software programming AI internet computers smartphone applications code bugs updates
        технология программное обеспечение программирование ИИ интернет компьютеры смартфон приложения код ошибки обновления
    """,

    "health": """
        health illness anxiety depression stress hospital medicine therapy doctor treatment wellness mental
        здоровье болезнь тревога депрессия стресс больница медицина терапия врач лечение мысленное
    """,

    "education": """
        school university studying exams homework learning science knowledge students teachers courses
        школа университет учёба экзамены домашние задания обучение наука знания студенты учителя курсы
    """,

    "entertainment": """
        movies music games hobbies leisure fun streaming books shows entertainment series
        фильмы музыка игры хобби досуг веселье потоковое видео книги сериалы развлечения
    """,

    "social": """
        friends communication society people social interaction conversations groups community network relationships
        друзья общение общество люди социальное взаимодействие разговоры группы сообщество сеть
    """,

    "shopping": """
        shopping products delivery customer service purchase store refund quality packaging order tracking
        магазин покупки доставка товар сервис обслуживание заказ магазин возврат качество упаковка отслеживание заказа курьер
    """,

    "pets": """
        pets dogs cats animals veterinary care pet love companion breed puppy kitten
        животные собаки кошки звери ветеринар забота питомец любовь компаньон щенок котенок
    """,

    "food": """
        food eating restaurant cooking cuisine meals drinks eating dining nutrition recipes restaurant
        еда есть ресторан готовка кухня блюда напитки питание рецепты ужин обед завтрак
    """,

    "travel": """
        travel vacation trip journey destination airport hotel tourism sightseeing adventure explore
        путешествие отпуск поездка путь пункт назначения аэропорт отель туризм осмотр приключение исследование
    """,
}

topic_names = list(TOPICS.keys())
topic_embeddings = model.encode([TOPICS[name] for name in topic_names])


def get_topic(text):
    """
    Определяет тему текста на основе косинусного сходства с якорями.
    Порог снижен с 0.35 до 0.25, чтобы лучше работать с мультиязычными текстами.
    """
    emb = model.encode([text])
    scores = cosine_similarity(emb, topic_embeddings)[0]

    best = np.max(scores)

    # Пониженный порог для мультиязычных текстов
    if best < 0.25:
        return "unknown"

    idx = int(np.argmax(scores))
    return topic_names[idx]
