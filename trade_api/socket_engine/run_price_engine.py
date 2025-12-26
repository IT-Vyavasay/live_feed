# run_price_engine.py

import os
import sys
import time
import signal
import pyotp
import django

# --------------------------------------------------
# Django Setup
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trade_api.settings")
django.setup()

# --------------------------------------------------
# Imports AFTER django.setup()
# --------------------------------------------------
from neo_api_client import NeoAPI
from utils.constant import NEO_ACCESS_TOKEN, MOBILE, NEO_FIN_KEY, UCC, MPIN
from socket_engine.price_engine import on_message as price_engine_on_message
from api.models import Configuration

# --------------------------------------------------
# Graceful shutdown handling
# --------------------------------------------------
RUNNING = True

def shutdown_handler(signum, frame):
    global RUNNING
    print("🛑 Price Engine shutting down...")
    RUNNING = False

signal.signal(signal.SIGINT, shutdown_handler)
signal.signal(signal.SIGTERM, shutdown_handler)

# --------------------------------------------------
# TOTP Setup
# --------------------------------------------------
secret = "XUQCQ6MTL2W3C7QWR6WV556QU4"
totp = pyotp.TOTP(secret)

# --------------------------------------------------
# Main runner
# --------------------------------------------------
def main():
    global RUNNING

    print("🚀 Initializing Neo client...")

    client = NeoAPI(
        environment="prod",
        access_token=NEO_ACCESS_TOKEN,
        neo_fin_key=NEO_FIN_KEY,
        consumer_key=NEO_ACCESS_TOKEN
    )

    # ------------------ Login ------------------
    otp = totp.now()
    print("Generated OTP:", otp)

    client.totp_login(
        mobile_number=MOBILE,
        ucc=UCC,
        totp=otp
    )
    client.totp_validate(MPIN)

    print("✅ Neo login successful")

    # ------------------ WebSocket Callbacks ------------------
    def on_error(message):
        print("[WS ERROR]:", message)

    def on_open(message):
        print("[WS OPEN]:", message)

    def on_close(message):
        print("[WS CLOSE]:", message)

    # IMPORTANT: Price Engine callback ONLY
    client.on_message = price_engine_on_message
    client.on_error = on_error
    client.on_open = on_open
    client.on_close = on_close

    # ------------------ Load Tokens from DB ------------------
    config = Configuration.objects.first()

    if not config or not config.iTokens:
        print("⚠️ No tokens now (Configuration.iTokens empty)")
        return

    inst_tokens = [
        {
            "instrument_token": t["instrument_token"],
            "exchange_segment": t["exchange_segment"]
        }
        for t in config.iTokens
    ]

    print("📡 Subscribing tokens:", inst_tokens)

    # ------------------ Subscribe ------------------
    try:
        client.subscribe(instrument_tokens=inst_tokens)
    except Exception as e:
        print("❌ WebSocket subscribe error:", e)
        return

    # ------------------ Keep process alive ------------------
    print("🟢 Price Engine running...")
    while RUNNING:
        time.sleep(1)

    print("🛑 Price Engine stopped cleanly")


# --------------------------------------------------
# Entry point (IMPORTANT for PM2)
# --------------------------------------------------
if __name__ == "__main__":
    main()
