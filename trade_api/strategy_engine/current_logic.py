# engine/current_logic.py

from django.utils import timezone
from api.models import CurrentOrder, CloseOrder

def process_current_orders(token, ltp):
    trades = CurrentOrder.objects.filter(
        instrumentToken=token,
        status="OPEN"
    )

# Logic to execute order
    for trade in trades:
        if trade.stopLoss and (
            (not trade.isShortSell and ltp <= trade.stopLoss) or
            (trade.isShortSell and ltp >= trade.stopLoss)
        ):
            close_trade(trade, ltp, "SL")

        elif trade.target and (
            (not trade.isShortSell and ltp >= trade.target) or
            (trade.isShortSell and ltp <= trade.target)
        ):
            close_trade(trade, ltp, "TARGET")


def close_trade(trade, ltp, reason):
    pnl = (
        (ltp - trade.entryPrice) * trade.qty
        if not trade.isShortSell
        else (trade.entryPrice - ltp) * trade.qty
    )

    CloseOrder.objects.create(
        tradeId=trade.tradeId,
        strategyCode=trade.strategyCode,
        isShortSell=trade.isShortSell,
        qty=trade.qty,
        entryPrice=trade.entryPrice,
        exitPrice=ltp,
        pnl=pnl,
        openAt=trade.openAt,
        closeAt=timezone.now(),
        securityType=trade.securityType,
        instrumentToken=trade.instrumentToken,
        exchangeSegment=trade.exchangeSegment,
        exitReason=reason,
        status="CLOSED"
    )
    trade.delete()
