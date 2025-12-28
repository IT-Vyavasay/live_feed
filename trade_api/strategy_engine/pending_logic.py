# engine/pending_logic.py

from django.utils import timezone
from api.models import PendingOrder, CurrentOrder

def process_pending_orders(token, ltp):
    orders = PendingOrder.objects.filter(
        instrumentToken=token,
        status__in=["CREATED", "WAITING"]
    )
# Logic to execute order
    for order in orders:
        if order.strategyCode == "TEST_STRATEGY":
            open_trade(order, ltp)

        # if order.isShortSell and ltp <= order.triggerPrice:
        #     open_trade(order, ltp)

        # elif not order.isShortSell and ltp >= order.triggerPrice:
        #     open_trade(order, ltp)


def open_trade(order, ltp):
    print("Testt",order)
    CurrentOrder.objects.create(
        tradeId=order.tradeId,
        strategyCode=order.strategyCode,
        isShortSell=order.isShortSell,
        qty=order.qty,
        entryPrice=ltp,
        stopLoss=ltp*0.995,
        target=ltp*1.05,
        openAt=timezone.now(),
        securityType=order.securityType,
        instrumentToken=order.instrumentToken,
        exchangeSegment=order.exchangeSegment,
        status="OPEN"
    )
    order.delete()
