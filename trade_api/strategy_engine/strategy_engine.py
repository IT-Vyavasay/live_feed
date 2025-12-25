# engine/strategy_engine.py

from utills.debounce import should_process
from strategy_engine.pending_logic import process_pending_orders
from strategy_engine.current_logic import process_current_orders

def on_price_tick(token, ltp):
    """
    Called by Price Engine on every tick
    """

    if not should_process(token):
        return

    # 1. Pending → Current
    process_pending_orders(token, ltp)

    # 2. Current → Close
    process_current_orders(token, ltp)
