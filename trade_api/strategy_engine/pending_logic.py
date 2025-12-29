# engine/pending_logic.py

from django.utils import timezone
from api.models import PendingOrder, CurrentOrder


def process_pending_orders(token, ltp):
    orders = PendingOrder.objects.filter(
        instrumentToken=token,
        status__in=["CREATED", "WAITING"]
    )
    print(f"Processing {len(orders)} pending orders for token {token} at LTP {ltp}")
    for order in orders:
        if order.strategyCode == "TEST_STRATEGY":
            open_trade(order, ltp)


def open_trade(order, ltp):
    print("Opening trade:", order.tradeId)

    CurrentOrder.objects.create(
        tradeId=order.tradeId,
        strategyCode=order.strategyCode,
        isShortSell=order.isShortSell,
        qty=order.qty,
        entryPrice=ltp,
        stopLoss=ltp * 0.995,   # ✅ ONLY ONCE
        target=ltp * 1.05,      # ✅ ONLY ONCE
        openAt=timezone.now(),
        securityType=order.securityType,
        instrumentToken=order.instrumentToken,
        exchangeSegment=order.exchangeSegment,
        status="OPEN"
    )

    order.delete()

