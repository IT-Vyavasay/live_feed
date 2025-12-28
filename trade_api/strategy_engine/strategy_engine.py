# strategy_engine/strategy_engine.py

from utils.debounce import should_process
from strategy_engine.pending_logic import process_pending_orders
from strategy_engine.current_logic import process_current_orders

def on_tick(tick):
    if not should_process(tick.instrument_token):
        return

    process_pending_orders(tick.instrument_token, tick.ltp)
    process_current_orders(tick.instrument_token, tick.ltp)
