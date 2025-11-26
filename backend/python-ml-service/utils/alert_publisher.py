import requests, time, os

JAVA_ALERT_URL = os.environ.get("JAVA_ALERT_URL", "http://localhost:8080/api/v1/analytics/alerts")
_last_sent = {}
COOLDOWN = 60  # seconds per field+type on python side

def send_alert(field_id:int, alert_type:str, level:str, message:str):
    key = f"{field_id}_{alert_type}"
    now = time.time()
    last = _last_sent.get(key, 0)
    if now - last < COOLDOWN:
        return False
    _last_sent[key] = now

    payload = {
        "fieldId": int(field_id),
        "type": alert_type,
        "level": level,
        "message": message,
        "timestamp": int(now*1000)
    }
    try:
        requests.post(JAVA_ALERT_URL, json=payload, timeout=2)
        return True
    except Exception as e:
        print("Failed to send alert:", e)
        return False
