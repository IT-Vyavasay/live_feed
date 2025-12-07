import threading
import time
from neo_api_client import NeoAPI

from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI
# If you run this script outside your project structure, ensure the import is just:
# from neo_api_client import NeoAPI 


# --- 1. CONFIGURATION: REPLACE WITH YOUR ACTUAL CREDENTIALS ---

# ⚠️ IMPORTANT: These must be replaced with your live credentials
YOUR_CONSUMER_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJWaWV3Il0sImV4cCI6MTc2NTIxODYwMCwianRpIjoiNDcyN2I1MDctNTQ4My00MjMwLTlhYzQtM2M0ZDg1ZGM4NjNlIiwiaWF0IjoxNzY1MTM0MDMwLCJpc3MiOiJsb2dpbi1zZXJ2aWNlIiwic3ViIjoiODQ3ZTkyMGUtMjZkZC00ZDdmLWExYjgtNWZjMDlmY2VkODNhIiwidWNjIjoiWU5EOVQiLCJuYXAiOiIiLCJ5Y2UiOiJlWVxcNiMtIzU5cVx0XHJcdTAwMDZ9XHUwMDAwXHUwMDEwYiIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.HM5yLu7bXQRUsLvx7VD54SQhl0Ui3C9O5M5lOdqJ1n66vyX3oR9ZE60XsCVcYE26RIZgDs8sdlu7T48ps4_9OwnB99X5bJ_tbfAWCLbN-5VJU-upuNuGmLt3aF9T-uTNaPev9u5fWCmvynd3p5hSn0l1uIo3ttki_-Q7-uG0iKDacn3PJIx-BdJKJdt6W9ddgqabzQUpQpL98L8l7piEdMHikuwG4ULZF-zKUC3k_B3gc0TKBHmH9bNSSFmn3v07GvKcruMTLD1TOY-MM4JOubKL5PWuFMHjDDnPNLShV6FKJokia1hZnC9-v1BiUXq7eFxU_YV95zybxYLFkUYzcQ" # 1 day expiy
YOUR_MOBILE = "7698421288" 
YOUR_UCC = "YND9T" 
YOUR_MPIN = "421288" 

# TOTP changes every 30 seconds. You must get the latest OTP from your Authenticator app
# and enter it here just before running the script.
YOUR_TOTP = "123456" 

# Use 'prod' for actual live trading.
ENVIRONMENT = "prod" 

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
    MCX_GOLD_TOKEN = '208579' # <-- Replace with the correct token (obtained via scrip_master/search_scrip)
    
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
    consumer_key=YOUR_CONSUMER_KEY
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
    client.totp_login(mobile_number=YOUR_MOBILE, ucc=YOUR_UCC, totp=YOUR_TOTP)
    
    # Step 2: Validate with MPIN to generate final Trade Token
    print("Step 2/2: Running totp_validate...")
    client.totp_validate(mpin=YOUR_MPIN)
    
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