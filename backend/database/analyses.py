from backend.database.db import get_connection


def save_analysis(user_id: int, text: str, emotion: str, topic: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO analyses (user_id, text, emotion, topic)
        VALUES (?, ?, ?, ?)
    """, (user_id, text, emotion, topic))

    conn.commit()
    conn.close()


def get_history(user_id: int, limit: int = 20):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT text, emotion, topic, created_at
        FROM analyses
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    """, (user_id, limit))

    rows = cur.fetchall()
    conn.close()
    return rows