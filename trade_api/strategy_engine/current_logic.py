# engine/current_logic.py

from django.utils import timezone
from api.models import CurrentOrder, CloseOrder, PendingOrder
from utils.ws import send_ws_event
from django.utils import timezone
import re

def increment_last_number(text):
    # \d+ finds digits, $ ensures they are at the end of the string
    pattern = r"(\d+)$"
    
    def replace(match):
        number_str = match.group(1)
        length = len(number_str)
        # Increment and use zfill to preserve leading zeros
        incremented = int(number_str) + 1
        return str(incremented).zfill(length)

    return re.sub(pattern, replace, text)

def process_current_orders(token, ltp):
    trades = CurrentOrder.objects.filter(
        instrumentToken=token,
        status="OPEN"
    )

# Logic to execute order
    for trade in trades:
        print("STOPLOASS HIT==================>:", trade.tradeId)  
        # close_trade(trade, ltp, "SL")
        # print(f"Current trade data: ltp{ltp}; stopLoss{trade.stopLoss}; tradeTarget{trade.target}")
        if trade.stopLoss and (
            (not trade.isShortSell and ltp <= trade.stopLoss) or
            (trade.isShortSell and ltp >= trade.stopLoss)
        ):
            
            print("STOPLOASS HIT==================>:", trade.tradeId)  
            close_trade(trade, ltp, "SL")

        elif trade.target and (
            (not trade.isShortSell and ltp >= trade.target) or
            (trade.isShortSell and ltp <= trade.target)
        ):
            print("TARGET HIT==================>:", trade.tradeId)
            close_trade(trade, ltp, "TARGET")



def close_trade(trade, ltp, reason):
    print("step 2 CLOSING====================",trade.tradeId)
    # now = timezone.now()

    # Calculate PnL
    price_diff = (
        trade.entryPrice - ltp
        if trade.isShortSell
        else ltp - trade.entryPrice
    )
    pnl = price_diff * trade.qty
    open_at_str = trade.openAt.isoformat() if trade.openAt else None
    close_at_str = trade.closeAt.isoformat() if trade.closeAt else None
    common_data = {
        "tradeId": trade.tradeId,
        "strategyCode": trade.strategyCode,
        "isShortSell": trade.isShortSell,
        "qty": trade.qty,
        "entryPrice": trade.entryPrice,
        "exitPrice": ltp,
        "pnl": pnl,
        "openAt": open_at_str,
        "closeAt": close_at_str,
        "securityType": trade.securityType,
        "instrumentToken": trade.instrumentToken,
        "exchangeSegment": trade.exchangeSegment,
        "exitReason": reason,
        "status": "CLOSED",
    }

    previous_tradeId = trade.tradeId

    new_tradeId =  increment_last_number(previous_tradeId)


    

    # Send WebSocket event
    send_ws_event(
        group="trade_updates",
        event_type="trade_event",
        data={
            **common_data,
            "event": "TRADE_CLOSED",
        },
    )

    # Remove open trade
    print("step 2 DELETING====================",trade.tradeId)
    trade.delete()
    print("step 2 DELETED====================",trade.tradeId)

    if "_ro_" in trade.tradeId:
         previous_tradeId = trade.tradeId

         print("step 3 REORDERing====================",trade.tradeId,new_tradeId)

     
         pending_data = {
            "tradeId": new_tradeId,
            "strategyCode": trade.strategyCode,
            "isShortSell": trade.isShortSell,
            "qty": trade.qty,
            "entryPrice": trade.entryPrice,
            "openAt": trade.openAt,
            "securityType": trade.securityType,
            "instrumentToken": trade.instrumentToken,
            "exchangeSegment": trade.exchangeSegment,
            "status": "WAITING",
        }


         PendingOrder.objects.create(**pending_data  )
         CloseOrder.objects.create(**common_data)

         print("step 3 REORDER====================",new_tradeId)
    else: 
         CloseOrder.objects.create(**common_data)
    # Do something here
