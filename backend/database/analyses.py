from backend.database.db import get_connection


# =========================
# SAVE
# =========================

def save_analysis(user_id: int, text: str, emotion: str, topic: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO analyses (user_id, text, emotion, topic)
        VALUES (%s, %s, %s, %s)
    """, (user_id, text, emotion, topic))

    conn.commit()
    conn.close()


# =========================
# HISTORY (user-specific)
# =========================

def get_history(user_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT text, emotion, topic, created_at
        FROM analyses
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user_id, ))

    rows = cur.fetchall()
    conn.close()
    return rows


# =========================
# ANALYTICS SOURCE (IMPORTANT FIX)
# =========================

def get_all_analyses():
    conn = get_connection()
    cur = conn.cursor()

    # 🔥 FIX: обязательно включаем created_at
    cur.execute("""
        SELECT emotion, topic, created_at
        FROM analyses
        WHERE created_at IS NOT NULL
    """)

    rows = cur.fetchall()
    conn.close()

    return rows


# =========================
# PERIOD FILTER (PostgreSQL FIXED)
# =========================

def get_analyses_by_period(days: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT emotion, topic, created_at
        FROM analyses
        WHERE created_at >= NOW() - INTERVAL '%s days'
        ORDER BY created_at
    """, (days,))

    rows = cur.fetchall()
    conn.close()

    return rows


# =========================
# DATE RANGE (PostgreSQL FIXED)
# =========================

def get_analyses_between_dates(from_date: str, to_date: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT emotion, topic, created_at
        FROM analyses
        WHERE created_at BETWEEN %s AND %s
        ORDER BY created_at
    """, (from_date, to_date))

    rows = cur.fetchall()
    conn.close()

    return rows