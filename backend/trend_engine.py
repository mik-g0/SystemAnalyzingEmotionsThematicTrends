from collections import Counter, defaultdict

NEGATIVE_EMOTIONS = {"anger", "fear", "sadness", "disgust"}


def build_emotion_trends(rows):
    emotions_by_day = defaultdict(Counter)

    for row in rows:
        day = row["created_at"].date()
        emotions_by_day[day][row["emotion"]] += 1

    labels = sorted(emotions_by_day.keys())

    all_emotions = set()
    for counter in emotions_by_day.values():
        all_emotions.update(counter.keys())

    series = {}

    for emotion in all_emotions:
        series[emotion] = [
            emotions_by_day[day][emotion]
            for day in labels
        ]

    return {
        "labels": labels,
        "series": series
    }


def build_topic_trends(rows):
    topics_by_day = defaultdict(Counter)

    for row in rows:
        day = row["created_at"].date()
        topics_by_day[day][row["topic"]] += 1

    labels = sorted(topics_by_day.keys())

    all_topics = set()
    for counter in topics_by_day.values():
        all_topics.update(counter.keys())

    series = {}

    for topic in all_topics:
        series[topic] = [
            topics_by_day[day][topic]
            for day in labels
        ]

    return {
        "labels": labels,
        "series": series
    }


def build_negative_trend(rows):
    stats = defaultdict(lambda: {"negative": 0, "total": 0})

    for row in rows:

        day = row["created_at"][:10]

        stats[day]["total"] += 1

        if row["emotion"] in NEGATIVE_EMOTIONS:
            stats[day]["negative"] += 1

    result = []

    for day in sorted(stats.keys()):

        total = stats[day]["total"]
        negative = stats[day]["negative"]

        ratio = round(negative / total * 100, 1) if total else 0

        result.append({
            "date": day,
            "negative_ratio": ratio
        })

    return result


def get_top_topics(rows, limit=5):

    counter = Counter(row["topic"] for row in rows)

    return [
        {
            "topic": topic,
            "count": count
        }
        for topic, count in counter.most_common(limit)
    ]


def get_top_emotions(rows, limit=5):

    counter = Counter(row["emotion"] for row in rows)

    return [
        {
            "emotion": emotion,
            "count": count
        }
        for emotion, count in counter.most_common(limit)
    ]


def detect_growing_topics(topic_trends):

    result = []

    series = topic_trends["series"]

    for topic, values in series.items():

        if len(values) < 2:
            continue

        previous_values = values[:-1]

        if not previous_values:
            continue

        previous_avg = sum(previous_values) / len(previous_values)

        current = values[-1]

        if previous_avg == 0:
            continue

        growth = round(
            (current - previous_avg) / previous_avg * 100,
            1
        )

        result.append({
            "topic": topic,
            "growth_percent": growth
        })

    result.sort(
        key=lambda x: x["growth_percent"],
        reverse=True
    )

    return result


def detect_alerts(rows):

    topic_stats = {}

    for row in rows:

        topic = row["topic"]

        if topic not in topic_stats:
            topic_stats[topic] = {
                "total": 0,
                "negative": 0
            }

        topic_stats[topic]["total"] += 1

        if row["emotion"] in NEGATIVE_EMOTIONS:
            topic_stats[topic]["negative"] += 1

    alerts = []

    for topic, stats in topic_stats.items():

        total = stats["total"]

        if total < 3:
            continue

        ratio = stats["negative"] / total

        if ratio >= 0.5:

            alerts.append({
                "topic": topic,
                "negative_ratio": round(ratio * 100, 1),
                "sample_size": total,
                "message":
                    f"По теме '{topic}' доля негативных сообщений достигла "
                    f"{round(ratio * 100, 1)}%"
            })

    return alerts


def build_trends(rows):

    emotion_trends = build_emotion_trends(rows)

    topic_trends = build_topic_trends(rows)

    return {

        "emotion_trends": emotion_trends,

        "topic_trends": topic_trends,

        "negative_trend": build_negative_trend(rows),

        "top_topics": get_top_topics(rows),

        "top_emotions": get_top_emotions(rows),

        "growing_topics": detect_growing_topics(topic_trends),

        "alerts": detect_alerts(rows)
    }