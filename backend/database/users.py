from backend.database.db import get_connection


def create_user(email: str, password_hash: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        (email, password_hash)
    )

    conn.commit()
    conn.close()


def get_user_by_email(email: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    )

    user = cur.fetchone()
    conn.close()
    return user