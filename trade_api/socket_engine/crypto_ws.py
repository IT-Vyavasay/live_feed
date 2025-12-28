import asyncio
import json
import websockets
from datetime import datetime

from tick import Tick
from strategy_engine import on_tick

BINANCE_WS = "wss://stream.binance.com:9443/ws/btcusdt@ticker"

async def run_crypto_ws():
    while True:
        try:
            async with websockets.connect(
                BINANCE_WS,
                ping_interval=20,
                ping_timeout=20
            ) as ws:
                print("✅ Binance WS connected")

                async for msg in ws:
                    data = json.loads(msg)

                    symbol = data.get("s")
                    ltp_raw = data.get("c")

                    if not symbol or not ltp_raw:
                        continue

                    try:
                        ltp = float(ltp_raw)
                    except:
                        continue

                    tick = Tick(
                        instrument_token=symbol,
                        symbol=symbol,
                        ltp=ltp,
                        exchange="BINANCE",
                        timestamp=datetime.fromtimestamp(data["E"] / 1000)
                    )

                    on_tick(tick)

        except Exception as e:
            print("❌ Crypto WS error:", e)
            await asyncio.sleep(5)

