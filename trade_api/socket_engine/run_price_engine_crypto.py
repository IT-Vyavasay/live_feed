import asyncio
from trade_api.socket_engine.crypto_ws import run_crypto_price_engine

if __name__ == "__main__":
    asyncio.run(run_crypto_price_engine())
