import sys
import os
import asyncio
import django

# -------------------- PATH SETUP --------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

# -------------------- DJANGO SETUP ------------------
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trade_api.settings")
django.setup()

# -------------------- IMPORTS -----------------------
from socket_engine.crypto_ws import run_crypto_ws

# -------------------- RUN ---------------------------
if __name__ == "__main__":
    asyncio.run(run_crypto_ws())
