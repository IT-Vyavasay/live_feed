# import sys
# import os
# import pyotp

# secret = "XUQCQ6MTL2W3C7QWR6WV556QU4"

# totp = pyotp.TOTP(secret)

# # Add the parent directory (LIVE_FEED) to the system path for package discovery
# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
# from neo_api_client import NeoAPI
# from utils.constant import NEO_ACCESS_TOKEN, MOBILE, NEO_FIN_KEY,   UCC,   MPIN

# print("initialize")
# client = NeoAPI(environment='prod', access_token=NEO_ACCESS_TOKEN, neo_fin_key=NEO_FIN_KEY, consumer_key=NEO_ACCESS_TOKEN)


# print("client created", )



# otp = totp.now()
# print("otp",otp) 

# res= client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=otp)
# print("TOTP login successful",res)

# # Step 2: Validate MPIN → prepares trade token
# res2=client.totp_validate(MPIN)
# print("MPIN validated",res2)

# def on_message(message):
#     print('[Res]: ', message)

# def on_error(message):
#     result = message
#     print('[OnError]: ', result)
    
# def on_open(message):
#     print('[OnOpen]: ', message)
    
# def on_close(message):
#     print('[OnClose]: ', message)
 
 

# # Setup Callbacks for websocket events (Optional)
# client.on_message = on_message  # called when message is received from websocket
# client.on_error = on_error  # called when any error or exception occurs in code or websocket
# client.on_close = on_close  # called when websocket connection is closed
# client.on_open = on_open  # called when websocket successfully connects
# # Take itoke from Configuration => iTokens
# inst_tokens = [ 
                
#                {"instrument_token": "11915", "exchange_segment": "nse_cm"},
#                 ]

# try:
#     # Get live feed data
#     client.subscribe(instrument_tokens=inst_tokens)
# except Exception as e:
#     print("Exception while connection to socket->socket: %s\n" % e)

 
import asyncio
import json
import websockets

async def live_btc_price():
    url = "wss://stream.binance.com:9443/ws/btcusdt@ticker"

    while True:
        try:
            async with websockets.connect(url, ping_interval=20, ping_timeout=20) as ws:
                print("✅ Connected to Binance WebSocket")

                async for message in ws:
                    data = json.loads(message)
                    price = data.get("c")
                    if price:
                        print(data)

        except Exception as e:
            print("❌ Connection error:", e)
            print("🔄 Reconnecting in 5 seconds...")
            await asyncio.sleep(5)

asyncio.run(live_btc_price())

  