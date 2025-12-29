# strategy_engine/strategy_engine.py
 
from utils.debounce import should_process
from strategy_engine.pending_logic import process_pending_orders
from strategy_engine.current_logic import process_current_orders
from asgiref.sync import sync_to_async

def on_tick_sync(tick):
    print("Tick123:", tick.instrument_token)

    if not should_process(tick.instrument_token):
        print("step0")
        return

    print("step1")
    process_pending_orders(tick.instrument_token, tick.ltp)
    process_current_orders(tick.instrument_token, tick.ltp)



on_tick_async = sync_to_async(on_tick_sync, thread_sensitive=True)
