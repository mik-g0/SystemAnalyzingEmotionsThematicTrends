import re
from wordcloud import WordCloud
from io import BytesIO
from PIL import Image
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS



stop_words = set(stopwords.words("english"))
custom_stop = {"im", "dont", "like", "just", "really"}

EMO_MAP = {
    "admiration": "positive",
    "amusement": "positive",
    "joy": "positive",
    "love": "positive",
    "gratitude": "positive",
    "optimism": "positive",

    "anger": "negative",
    "annoyance": "negative",
    "disgust": "negative",
    "sadness": "negative",
    "fear": "negative",

    "confusion": "neutral",
    "curiosity": "neutral",
    "surprise": "neutral",
    "neutral": "neutral"
}


def clean_text(text):
    """
    Приводит текст к нижнему регистру, убирает цифры и спецсимволы.
    """
    text = text.lower()

    # ссылки и html
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"<.*?>", "", text)

    # только буквы
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    # одиночные буквы
    text = re.sub(r"\b[a-z]\b", "", text)

    # лишние пробелы
    text = re.sub(r"\s+", " ", text).strip()

    if not text or len(text) < 3:
        return ""

    # удаляем stopwords
    words = text.split()
    words = [w for w in words if w not in ENGLISH_STOP_WORDS and w not in custom_stop]
    return " ".join(words)


# def generate_wordcloud_image(texts):
#     """
#     Возвращает BytesIO объект с изображением WordCloud,
#     который можно конвертировать в Base64
#     """
#     all_text = " ".join(texts)
#     wc = WordCloud(width=800, height=400, background_color="white").generate(all_text)
#
#     # Генерируем изображение и сохраняем в BytesIO
#     img_buffer = BytesIO()
#     wc.to_image().save(img_buffer, format='PNG')
#     img_buffer.seek(0)  # важно вернуться в начало буфера
#     return img_buffer  # возвращаем BytesIO, а не PIL.Image