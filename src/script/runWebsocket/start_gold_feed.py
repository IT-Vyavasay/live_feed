import time
import json
from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI,TotpAPI,LoginAPI
from utils.constant import CONSUMER_KEY, MOBILE, UCC, MPIN, TOTP, ENVIRONMENT, MCX_GOLD_TOKEN, PASSWORD


# --- ⚠️ Configuration: REPLACE THESE VALUES ⚠️ ---

# 1. API Credentials (Get these from your Kotak Neo API Dashboard) 
# NOTE: The latest V2 SDK typically does not require a consumer_secret for the NeoAPI object initialization.
# Set ENVIRONMENT to 'prod' for live market data
ENVIRONMENT = "prod"

# 2. Login Credentials (Required for daily session token generation)
MOBILE_NUMBER = MOBILE

# 3. Instrument Details for Gold (Replace with the actual token for your desired contract)
# You must search the scrip master file or use the scrip_search method to get the correct token.
# This example uses a placeholder token for a typical MCX Gold Future.
GOLD_FUTURE_TOKEN = 133458  # Example: Token for GOLD (MCX) contract
EXCHANGE_SEGMENT = "MCX"    # Gold is traded on MCX

# --- Global Client and Data Store ---
client = None
live_feed_data = {} # Dictionary to store latest LTP for subscribed tokens

# --- WebSocket Handler Functions ---

def on_open_handler():
    """Called when the WebSocket connection is successfully established."""
    print("✅ WebSocket connection opened.")
    
    # 3. Subscribe to the Gold instrument
    instrument_tokens = [
        {
            "instrument_token": str(GOLD_FUTURE_TOKEN),
            "exchange_segment": EXCHANGE_SEGMENT
        }
    ]

    # The subscribe method starts the live feed streaming
    client.subscribe(instrument_tokens=instrument_tokens)
    print(f"Subscription request sent for Gold token: {GOLD_FUTURE_TOKEN} on {EXCHANGE_SEGMENT}")


def on_message_handler(message):
    """Called when a message (live tick data or confirmation) is received."""
    # The message is a list of dictionaries for tick data
    if isinstance(message, list):
        for item in message:
            # Live data for subscribed instruments has 'tk' (token) and 'ltp' (Last Traded Price)
            token = item.get('tk')
            ltp = item.get('ltp')
            
            if token and ltp:
                # Update the global data store
                live_feed_data[token] = ltp
                print(f"🟢 LIVE PRICE | Token: {token} | LTP: ₹{ltp} | Time: {time.strftime('%H:%M:%S')}")

    elif isinstance(message, str):
        print(f"ℹ️ Confirmation/Message: {message}")


def on_error_handler(error):
    """Called on a WebSocket error."""
    print(f"❌ WebSocket Error: {error}")


def on_close_handler():
    """Called when the WebSocket connection is closed."""
    print("🛑 WebSocket connection closed.")

# --- Main Execution Logic ---

def get_live_gold_price():
    global client
    
    # 1. Initialize the NeoAPI Client
    client = NeoAPI(
        consumer_key=CONSUMER_KEY, 
        environment=ENVIRONMENT
        # V2 does NOT need consumer_secret or access_token here initially
    )

    # 2. Perform Login and 2FA
    try:
        api_client = client.api_client 
        
        # --- Authentication ---
        print("Starting Login (Step 1 of 2)...")
        login_api = LoginAPI(api_client) 
        
        # NOTE: Use the correct method. Common SDKs use `login_init` or just `login`.
        # Assuming `login` is the correct method for mobile/password step:
        login_response = login_api.login(mobileNumber=MOBILE_NUMBER, password=PASSWORD) 
        
        print("Login success. Proceeding to 2FA validation...")
        
        totp_api = TotpAPI(api_client) 
        
        # This step finalizes the session credentials needed for trading/market data
        validate_response = totp_api.totp_login(
            mobile_number=MOBILE_NUMBER, 
            ucc=UCC, 
            totp=TOTP
        )
        
        print("✅ 2FA Validation successful. Client is ready.")
        
    except Exception as e:
        print(f"❌ Authentication Failed: {e}")
        # The first error occurred inside the __init__ of NeoAPI 
        # or during the first line of the try block.
        # If the error is still 'base64_token', the issue is in the SDK installation/version.
        return

    # 3. Set WebSocket Callbacks (Remains the same)
    client.on_open = on_open_handler
    client.on_message = on_message_handler
    client.on_error = on_error_handler
    client.on_close = on_close_handler

    # 4. Start the WebSocket Connection Thread (Remains the same)
    client.start_websocket()

    # 5. Keep the main thread alive to listen for feed data
    try:
        print("Listening for live feed updates. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping feed and closing connection...")
        # Optional: Explicitly close the WebSocket if the client object has the underlying socket
        # In the V2 SDK, the client manages the connection, which should close gracefully on script exit.
        
    print("Script finished.")

if __name__ == "__main__":
    get_live_gold_price()