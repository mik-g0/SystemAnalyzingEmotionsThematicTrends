from docx import Document
import fitz
import tempfile
import csv
import io
import json

# ---------------- TXT ----------------
async def read_txt(file) -> str:
    content = await file.read()
    return content.decode("utf-8", errors="ignore")


# ---------------- CSV ----------------
async def read_csv(file) -> str:
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")

    reader = csv.reader(io.StringIO(text))
    rows = list(reader)

    if not rows:
        return ""

    # Если есть колонка с текстом (часто называется text/comment/review) — берём её,
    # иначе склеиваем все ячейки строки через пробел.
    header = [h.strip().lower() for h in rows[0]]
    text_col_idx = None
    for candidate in ("text", "comment", "review", "message", "content", "текст", "комментарий"):
        if candidate in header:
            text_col_idx = header.index(candidate)
            break

    lines = []
    data_rows = rows[1:] if text_col_idx is not None else rows

    for row in data_rows:
        if not row:
            continue
        if text_col_idx is not None and text_col_idx < len(row):
            lines.append(row[text_col_idx].strip())
        else:
            lines.append(" ".join(cell.strip() for cell in row if cell.strip()))

    return "\n".join(l for l in lines if l)

# ---------------- json ----------------
async def read_json(file) -> str:
    content = await file.read()
    data = json.loads(content.decode("utf-8", errors="ignore"))

    # Предполагаем, что внутри массив объектов или строк
    if isinstance(data, list):
        # Если это список строк
        if all(isinstance(i, str) for i in data):
            return "\n".join(data)
        # If it's a list of dicts, try to find text keys
        lines = []
        for item in data:
            if isinstance(item, dict):
                for key in ("text", "comment", "message", "текст"):
                    if key in item:
                        lines.append(str(item[key]))
                        break
        return "\n".join(lines)
    return str(data)


# ---------------- DOCX ----------------
async def read_docx(file) -> str:
    content = await file.read()
    doc = Document(io.BytesIO(content))

    text = []
    for p in doc.paragraphs:
        if p.text.strip():
            text.append(p.text)

    return "\n".join(text)


# ---------------- PDF ----------------
async def read_pdf(file) -> str:
    content = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    doc = fitz.open(tmp_path)

    text = []
    for page in doc:
        page_text = page.get_text()
        if page_text.strip():
            text.append(page_text)

    doc.close()

    return "\n".join(text)


# ---------------- ROUTER ----------------
async def extract_text(file):
    filename = file.filename.lower()

    if filename.endswith(".txt"):
        return await read_txt(file)

    if filename.endswith(".csv"):
        return await read_csv(file)

    if filename.endswith(".docx"):
        return await read_docx(file)

    if filename.endswith(".pdf"):
        return await read_pdf(file)

    raise ValueError("Unsupported file format")
