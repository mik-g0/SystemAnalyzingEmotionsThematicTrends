import streamlit as st
import requests
from PIL import Image
import io
import base64
import pandas as pd

st.set_page_config(page_title="Emotion Analyzer", layout="wide")
st.title("Emotion Analyzer MVP")

tab1, tab2 = st.tabs(["Analyze", "History"])

# Вкладка Analyze
with tab1:
    st.markdown("### Enter Text for Analysis")
    user_input = st.text_area("Enter your text:", "", height=200)

    if st.button("Analyze Emotion"):
        if user_input.strip():
            try:
                response = requests.post(
                    "http://127.0.0.1:8000/analyze",
                    json={"text": user_input}
                )
                data = response.json()
                emotion = data["emotion"]
                wordcloud_base64 = data["wordcloud"]

                img_bytes = base64.b64decode(wordcloud_base64)
                img = Image.open(io.BytesIO(img_bytes))

                st.success(f"Predicted Emotion: {emotion}")
                st.image(img, width=700, caption="WordCloud for this text")

            except Exception as e:
                st.error(f"Error contacting backend: {e}")
        else:
            st.warning("Please enter some text!")

#  Вкладка History
with tab2:
    st.markdown("### Analysis History")

    try:
        history_response = requests.get("http://127.0.0.1:8000/history?limit=10")
        history_data = history_response.json()

        if history_data:
            df = pd.DataFrame(history_data)

            #  KPI
            kpi_col1, kpi_col2, kpi_col3 = st.columns(3)
            kpi_col1.metric("Total Analyses", len(df))
            kpi_col2.metric("Positive", (df['emotion'] == "Positive").sum())
            kpi_col3.metric("Negative", (df['emotion'] == "Negative").sum())

            #  Emotion Distribution
            st.markdown("#### Emotion Distribution")
            st.bar_chart(df['emotion'].value_counts())

            #  WordCloud трендов
            st.markdown("#### Trending Keywords WordCloud")
            all_texts = " ".join(df['text'].tolist())
            wc_response = requests.post(
                "http://127.0.0.1:8000/wordcloud_trends",
                json={"text": all_texts}
            )
            wc_data = wc_response.json()
            trend_img_bytes = base64.b64decode(wc_data['wordcloud'])
            trend_img = Image.open(io.BytesIO(trend_img_bytes))
            st.image(trend_img, width=700, caption="WordCloud for last 10 analyses")

            #  Отображение последних записей
            st.markdown("#### Last Analyses")
            for entry in history_data:
                color = "#8DA3A6" if entry["emotion"] == "Positive" else "#C7A59E"
                st.markdown(f"""
                <div style="
                    background-color:{color};
                    padding:15px;
                    border-radius:12px;
                    margin-bottom:10px;
                    font-family: 'Arial';
                    font-size: 14px;
                    line-height:1.5;
                    word-wrap: break-word;
                ">
                    <b>Text:</b> {entry['text']}<br>
                    <b>Emotion:</b> {entry['emotion']}
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info("No history found yet.")

    except Exception as e:
        st.error(f"Error fetching history: {e}")