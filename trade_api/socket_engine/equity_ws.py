from datetime import datetime
from tick import Tick
from strategy_engine.strategy_engine import on_tick

def on_message(message):
    if message.get("type") != "stock_feed":
        return

    for d in message.get("data", []):
        token = d.get("tk")
        ltp_raw = d.get("ltp")

        if not token or not ltp_raw:
            continue

        try:
            ltp = float(ltp_raw)
        except:
            continue

        tick = Tick(
            instrument_token=token,
            symbol=d.get("ts"),
            ltp=ltp,
            exchange="NSE",
            timestamp=datetime.now()
        )

        on_tick(tick)
