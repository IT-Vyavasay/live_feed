# engine/debounce.py

import time
from utils.shared import LAST_PROCESSED_TIME
from api.models import Configuration

def should_process(token):
    config = Configuration.objects.first()
    debounce_sec = config.debounceTime if config else 0 # 0 sec

    if debounce_sec == 0:
        return True  # every tick

    now = time.time()
    last = LAST_PROCESSED_TIME.get(token, 0)

    if now - last >= debounce_sec:
        LAST_PROCESSED_TIME[token] = now
        return True

    return False
