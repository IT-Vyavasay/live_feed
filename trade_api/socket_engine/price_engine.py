# engine/price_engine.py

from utils.shared import PRICE_CACHE
 

from strategy_engine.strategy_engine import on_price_tick

def on_message(message):
    try:
        if not message:
            return

        msg_type = message.get("type")

        # We only care about stock_feed
        if msg_type != "stock_feed":
            return

        data_list = message.get("data", [])
        if not isinstance(data_list, list):
            return

        for tick in data_list:
            token = tick.get("tk")
            ltp_str = tick.get("ltp")
            print("tick===============>",tick)

            # Validate data
            if not token or not ltp_str:
                continue

            try:
                ltp = float(ltp_str)
            except ValueError:
                continue

            # 🔥 Forward clean tick to Strategy Engine
            on_price_tick(token, ltp)

    except Exception as e:
        print("❌ Price Engine Error:", e)

