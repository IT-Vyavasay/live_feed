# engine/pending_logic.py

from django.utils import timezone
from api.models import PendingOrder, CurrentOrder
from utils.ws import send_ws_event

def process_pending_orders(token, ltp):
    orders = PendingOrder.objects.filter(
        instrumentToken=token,
        status__in=["CREATED", "WAITING"]
    )
  
    # print(f"Processing {len(orders)} pending orders for token {token} at LTP {ltp}")
    for order in orders:
        
        if order.strategyCode == "TEST_STRATEGY": 
            
            open_trade(order, ltp)

from django.utils import timezone

def open_trade(order, ltp):

    now = timezone.now()
    stop_loss = ltp * 0.955
    target = ltp * 1.05

    common_data = {
        "tradeId": order.tradeId,
        "strategyCode": order.strategyCode,
        "isShortSell": order.isShortSell,
        "qty": order.qty,
        "entryPrice": ltp,
        "stopLoss": stop_loss,
        "target": target,
        "openAt": now.isoformat(),
        "securityType": order.securityType,
        "instrumentToken": order.instrumentToken,
        "exchangeSegment": order.exchangeSegment,
        "status": "OPEN",
    }

    # Remove pending order
    print("ORDER DELETING==================>:", order.tradeId)  
    order.delete()
    print("ORDER DELETED==================>:", order.tradeId)  
    # Create open trade
    print("ORDER ADDING==================>:", order.tradeId)  
    CurrentOrder.objects.create(**common_data)
    print("ORDER ADDED==================>:", order.tradeId)  
    # Send WebSocket event 
    send_ws_event(
        group="trade_updates",
        event_type="trade_event",
        data={
            **common_data,
            "event": "TRADE_OPENED",
        },
    )


