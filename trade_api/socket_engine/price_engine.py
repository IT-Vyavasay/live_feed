# engine/price_engine.py

from utils.shared import PRICE_CACHE
from strategy_engine.strategy_engine import on_price_tick

def on_message(message):
    try:
        token = message.get("instrument_token")
        ltp = float(message.get("last_traded_price"))

        PRICE_CACHE[token] = {
            "ltp": ltp,
            "timestamp": message.get("exchange_time")
        }

        # forward tick to strategy engine
        on_price_tick(token, ltp)

    except Exception as e:
        print("Price Engine Error:", e)
