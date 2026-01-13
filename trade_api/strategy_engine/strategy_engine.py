# strategy_engine/strategy_engine.py
 
from utils.debounce import should_process
from strategy_engine.pending_logic import process_pending_orders
from strategy_engine.current_logic import process_current_orders
from asgiref.sync import sync_to_async 
from api.models import PendingOrder, CurrentOrder
def on_tick_sync(tick):
    # orders = PendingOrder.objects.all()
    # for order in orders:
    #     print(order.tradeId)
    if not should_process(tick.instrument_token): 
   
        return

    process_pending_orders(tick.instrument_token, tick.ltp)
    process_current_orders(tick.instrument_token, tick.ltp)



on_tick_async = sync_to_async(on_tick_sync, thread_sensitive=True)
