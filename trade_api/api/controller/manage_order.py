from trade_api.api.models import PendingOrder, CurrentOrder, CloseOrder
from django.utils import timezone

def move_pending_to_current(pending, ltp):
    CurrentOrder.objects.create(
        tradeId=pending.tradeId,
        strategyCode=pending.strategyCode,
        isShortSell=pending.isShortSell,
        qty=pending.qty,
        entryPrice=ltp,
        openAt=timezone.now(),
        securityType=pending.securityType,
        instrumentToken=pending.instrumentToken,
        exchangeSegment=pending.exchangeSegment,
        status="OPEN"
    )
    pending.delete()



    def close_trade(current, ltp, reason):
        CloseOrder.objects.create(
            tradeId=current.tradeId,
            strategyCode=current.strategyCode,
            isShortSell=current.isShortSell,
            qty=current.qty,
            entryPrice=current.entryPrice,
            exitPrice=ltp,
            pnl=(ltp - current.entryPrice) * current.qty,
            openAt=current.openAt,
            closeAt=timezone.now(),
            securityType=current.securityType,
            instrumentToken=current.instrumentToken,
            exchangeSegment=current.exchangeSegment,
            exitReason=reason,
            status="CLOSED"
        )
        current.delete()