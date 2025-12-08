import threading
import time 

from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI
from utils.constant import CONSUMER_KEY, MOBILE, UCC, MPIN, TOTP, ENVIRONMENT, MCX_GOLD_TOKEN



#NeoAPI
# If you run this script outside your project structure, ensure the import is just:
# from neo_api_client import NeoAPI 


 

# TOTP changes every 30 seconds. You must get the latest OTP from your Authenticator app
# and enter it here just before running the script.


# Use 'prod' for actual live trading.


# --- 2. WEBSOCKET CALLBACK FUNCTIONS ---

# This function prints every live price tick received
def on_message(message):
    print(f"💰 LIVE TICK: {message}")
    
def on_error(error_message):
    print(f"❌ ERROR: {error_message}")

def on_close(message):
    print(f"🛑 CONNECTION CLOSED: {message}")

def on_open(message):
    print(f"✅ CONNECTION OPENED: {message}")
    
    # 3.2. Define the Gold Commodity Token (Example: Gold Futures)
    # ⚠️ NOTE: You MUST replace this with the actual token for the specific Gold contract 
    # you want (e.g., GOLDM JUN 2026 contract). Use client.search_scrip() first!
   # <-- Replace with the correct token (obtained via scrip_master/search_scrip)
    
    instrument_tokens = [
        {"instrument_token": MCX_GOLD_TOKEN, "exchange_segment": "mcx_fo"} 
    ]
    
    # 3.3. Subscribe to the live feed for Gold
    # isDepth=True gives the full market depth (5 levels). isIndex=False for scrips.
    print(f"➡️ Subscribing to Gold Token: {MCX_GOLD_TOKEN}...")
    client.subscribe(instrument_tokens=instrument_tokens, isIndex=False, isDepth=False)


# --- 3. CLIENT INITIALIZATION AND AUTHENTICATION ---

# Instantiate client (V2 only requires consumer_key)
# If your specific installation throws a TypeError, you might need to re-add consumer_secret, 
# but generally, this is the correct V2 signature.
client = NeoAPI(
    environment=ENVIRONMENT, 
    access_token=None, 
    neo_fin_key=None, 
    consumer_key=CONSUMER_KEY
)

# Setup Callbacks for WebSocket events
client.on_message = on_message
client.on_error = on_error
client.on_close = on_close
client.on_open = on_open

try:
    print("\n--- Starting 2FA Login Process ---")
    
    # Step 1: TOTP Login to generate View Token
    print("Step 1/2: Running totp_login...")
    client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=TOTP)
    
    # Step 2: Validate with MPIN to generate final Trade Token
    print("Step 2/2: Running totp_validate...")
    client.totp_validate(mpin=MPIN)
    
    print("✨ Login successful. Trade token acquired.")
    
except Exception as e:
    print(f"🚨 Authentication Failed: {e}")
    exit()

# --- 4. START WEBSOCKET AND KEEP ALIVE ---

# Start the WebSocket connection in a separate thread
# Note: You can also use client.subscribe_to_orderfeed() here if you only want order status updates
websocket_thread = threading.Thread(target=client.subscribe_to_orderfeed)
websocket_thread.start()

print("\n--- WebSocket Thread Started ---")
print("Waiting for connection to open and Gold subscription to run (check 'on_open' message)...")

# Keep the main thread alive so the WebSocket thread can run in the background
try:
    while True:
        # Check status every 1 second
        time.sleep(1) 
except KeyboardInterrupt:
    print("\n[User Interrupt] Stopping WebSocket and exiting...")
    # Properly log out to terminate the session
    client.logout() 
    exit()