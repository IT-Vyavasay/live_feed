import os
import sys
import pyotp
import django

# ------------------ Django Setup ------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
django.setup()

# ------------------ Imports ------------------
from neo_api_client import NeoAPI
from utils.constant import NEO_ACCESS_TOKEN, MOBILE, NEO_FIN_KEY, UCC, MPIN
from price_engine import on_message as price_engine_on_message
from api.models import Configuration

# ------------------ TOTP ------------------
secret = "XUQCQ6MTL2W3C7QWR6WV556QU4"
totp = pyotp.TOTP(secret)

# ------------------ Neo Client ------------------
print("Initializing Neo client...")
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

print("Neo login successful")

# ------------------ WebSocket Callbacks ------------------
def on_error(message):
    print("[WS ERROR]:", message)

def on_open(message):
    print("[WS OPEN]:", message)

def on_close(message):
    print("[WS CLOSE]:", message)

# IMPORTANT: only ONE on_message (Price Engine)
client.on_message = price_engine_on_message
client.on_error = on_error
client.on_open = on_open
client.on_close = on_close

# ------------------ Load Tokens from DB ------------------
config = Configuration.objects.first()

if not config or not config.iTokens:
    print("⚠️ No tokens now (Configuration.iTokens empty)")
    sys.exit(0)

inst_tokens = [
    {
        "instrument_token": token["instrument_token"],
        "exchange_segment": token["exchange_segment"]
    }
    for token in config.iTokens
]

print("Subscribing tokens:", inst_tokens)

# ------------------ Subscribe ------------------
try:
    client.subscribe(instrument_tokens=inst_tokens)
except Exception as e:
    print("WebSocket subscribe error:", e)
