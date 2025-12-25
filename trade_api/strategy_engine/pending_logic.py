# engine/pending_logic.py

from django.utils import timezone
from api.models import PendingOrder, CurrentOrder

def process_pending_orders(token, ltp):
    orders = PendingOrder.objects.filter(
        instrumentToken=token,
        status__in=["CREATED", "WAITING"]
    )

    for order in orders:
        if order.isShortSell and ltp <= order.triggerPrice:
            open_trade(order, ltp)

        elif not order.isShortSell and ltp >= order.triggerPrice:
            open_trade(order, ltp)


def open_trade(order, ltp):
    CurrentOrder.objects.create(
        tradeId=order.tradeId,
        strategyCode=order.strategyCode,
        isShortSell=order.isShortSell,
        qty=order.qty,
        entryPrice=ltp,
        openAt=timezone.now(),
        securityType=order.securityType,
        instrumentToken=order.instrumentToken,
        exchangeSegment=order.exchangeSegment,
        status="OPEN",
        stopLoss=None,
        target=None
    )
    order.delete()
