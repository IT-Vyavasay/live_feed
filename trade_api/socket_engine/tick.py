
# tick.py
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Tick:
    instrument_token: str   # 11536 | BTCUSDT
    symbol: str             # TCS-EQ | BTCUSDT
    ltp: float
    exchange: str           # NSE | BINANCE
    timestamp: datetime
