# import threading
# import time 

# from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI
# from utils.constant import CONSUMER_KEY, MOBILE, UCC, MPIN, TOTP, ENVIRONMENT, MCX_GOLD_TOKEN



# #NeoAPI
# # If you run this script outside your project structure, ensure the import is just:
# # from neo_api_client import NeoAPI 


 

# # TOTP changes every 30 seconds. You must get the latest OTP from your Authenticator app
# # and enter it here just before running the script.


# # Use 'prod' for actual live trading.


# # --- 2. WEBSOCKET CALLBACK FUNCTIONS ---

# # This function prints every live price tick received
# def on_message(message):
#     print(f"💰 LIVE TICK: {message}")
    
# def on_error(error_message):
#     print(f"❌ ERROR: {error_message}")

# def on_close(message):
#     print(f"🛑 CONNECTION CLOSED: {message}")

# def on_open(message):
#     print(f"✅ CONNECTION OPENED: {message}")
    
#     # 3.2. Define the Gold Commodity Token (Example: Gold Futures)
#     # ⚠️ NOTE: You MUST replace this with the actual token for the specific Gold contract 
#     # you want (e.g., GOLDM JUN 2026 contract). Use client.search_scrip() first!
#    # <-- Replace with the correct token (obtained via scrip_master/search_scrip)
    
#     instrument_tokens = [
#         {"instrument_token": MCX_GOLD_TOKEN, "exchange_segment": "mcx_fo"} 
#     ]
    
#     # 3.3. Subscribe to the live feed for Gold
#     # isDepth=True gives the full market depth (5 levels). isIndex=False for scrips.
#     print(f"➡️ Subscribing to Gold Token: {MCX_GOLD_TOKEN}...")
#     client.subscribe(instrument_tokens=instrument_tokens, isIndex=False, isDepth=False)


# # --- 3. CLIENT INITIALIZATION AND AUTHENTICATION ---

# # Instantiate client (V2 only requires consumer_key)
# # If your specific installation throws a TypeError, you might need to re-add consumer_secret, 
# # but generally, this is the correct V2 signature.
# client = NeoAPI(
#     environment=ENVIRONMENT, 
#     access_token=None, 
#     neo_fin_key=None, 
#     consumer_key=CONSUMER_KEY
# )

# # Setup Callbacks for WebSocket events
# client.on_message = on_message
# client.on_error = on_error
# client.on_close = on_close
# client.on_open = on_open

# try:
#     print("\n--- Starting 2FA Login Process ---")
    
#     # Step 1: TOTP Login to generate View Token
#     print("Step 1/2: Running totp_login...")
#     client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=TOTP)
    
#     # Step 2: Validate with MPIN to generate final Trade Token
#     print("Step 2/2: Running totp_validate...")
#     client.totp_validate(mpin=MPIN)
    
#     print("✨ Login successful. Trade token acquired.")
    
# except Exception as e:
#     print(f"🚨 Authentication Failed: {e}")
#     exit()

# # --- 4. START WEBSOCKET AND KEEP ALIVE ---

# # Start the WebSocket connection in a separate thread
# # Note: You can also use client.subscribe_to_orderfeed() here if you only want order status updates
# websocket_thread = threading.Thread(target=client.subscribe_to_orderfeed)
# websocket_thread.start()

# print("\n--- WebSocket Thread Started ---")
# print("Waiting for connection to open and Gold subscription to run (check 'on_open' message)...")

# # Keep the main thread alive so the WebSocket thread can run in the background
# try:
#     while True:
#         # Check status every 1 second
#         time.sleep(1) 
# except KeyboardInterrupt:
#     print("\n[User Interrupt] Stopping WebSocket and exiting...")
#     # Properly log out to terminate the session
#     client.logout() 
#     exit()


# from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI
# import pandas as pd
# import urllib.request
# from io import StringIO
from utils.constant import CONSUMER_KEY, MOBILE, UCC, MPIN
# print(CONSUMER_KEY, MOBILE, UCC, MPIN)
from neo_api_client import NeoAPI


 
# access_token: It is optional. 
# environment: You pass prod to connect to live server
# neo_fin_key: It is optional. Pass None.
# consumer_key: this is the token that is available on your NEO app or website.
# To get consumer key, login to kotak NEO app or web -> invest tab -> trade api card. Generate application.
# with default application, you will have a copyable token. Pass this token in consumer_key.

client = NeoAPI(environment='prod', access_token=None, neo_fin_key=None, consumer_key=CONSUMER_KEY)


totp_value = input("Enter TOTP shown in your Authenticator app: ")
resp1 = client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=totp_value)
print("TOTP Login Response:", resp1)

resp2 = client.totp_validate(mpin=MPIN)
print("MPIN validation response:", resp2)

client.generate_trade_token()
print("Trade Token Activated. API session ready.")


# Login using TOTP

# Complete your TOTP registration from Kotak Securities website. Follow steps mentioned below.

# Visit https://www.kotaksecurities.com/platform/kotak-neo-trade-api/ and select Register for Totp.
# Totp registration is a one time step where you can register for totp on your mobile and start receiving totps.

# Step 1 - Verify your mobile no with OTP

# Step 2 - Select account, for which you want to register for totp

# Step 3 - Select option to register for totp

# Step 4 - You will receive a QR code, which is valid for 5 minutes

# Step 5 - Open any authenticator app, and scan the QR code

# Step 6 - You will start receiving the Totps on the authenticator apps

# Step 7 - Submit the totp on the QR code page to complete the Totp registration

# mobile_number: registered mobile number with the country code.
# ucc: Unique Client Code which you will find in mobile application/website under profile section
# totp: Time-based One-Time Password recieved on google authenticator application
# totp_login generates the view token and session id used to generate trade token
totp_value = input("Enter TOTP shown in your Authenticator app: ")
client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=totp_value)
print("✔ TOTP Login Successful")

# mpin: mpin for your neo account
# totp_validate generates the trade token
client.totp_validate(mpin=MPIN)
print("Session Active")

 

# Step 1 — Search GOLD Commodity scrip
scrip = client.search_scrip(
    exchange_segment="mcx_fo",
    symbol="GOLD",
    expiry="2025-02-05",  # MCX expiry example
    option_type="FUT",
    strike_price="0"
)

print("Search Result:", scrip)


# Step 2 — Valid GOLD instrument token sample
instrument_tokens = [
    {
        "instrument_token": "400000",     # Example GOLD FEB'25 future
        "exchange_segment": "mcx_fo"
    }
]


# Step 3 — Fetch Quote
quotes = client.quotes(
    instrument_tokens=instrument_tokens,
    quote_type="all"
)

print("Quotes Data:", quotes)


# Step 4 — Websocket Handlers

def on_message(message):
    print("WS Message:", message)
    
def on_error(error_message):
    print("WS Error:", error_message)

def on_close(message):
    print("WS Closed:", message)
    
def on_open(message):
    print("WS Open:", message)


client.on_message = on_message  
client.on_error = on_error  
client.on_close = on_close  
client.on_open = on_open  


# Step 5 — Subscribe live GOLD feed
client.subscribe(
    instrument_tokens=instrument_tokens,
    isIndex=False,
    isDepth=False
)

# Step 6 — Example unsubscribe
client.un_subscribe(
    instrument_tokens=instrument_tokens,
    isIndex=False,
    isDepth=False
)

# Step 7 — Subscribe to order feed
client.subscribe_to_orderfeed()
