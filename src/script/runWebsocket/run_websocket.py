import time
import json
import threading
from neo_api_client.api.scrip_search import ScripSearch 
from neo_api_client.NeoWebSocket import NeoWebSocket# Import the class you saved
 

# --- ⚠️ 1. REPLACE WITH YOUR ACTUAL CREDENTIALS ⚠️ ---
# You must obtain these dynamically from a successful login using neo_api_client
YOUR_SESSION_ID = "Y6c1b36b2-e34f-43b5-8c22-1978501b2632" 
YOUR_ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJWaWV3Il0sImV4cCI6MTc2NTEzMjIwMCwianRpIjoiZDI4ZTE1NjctMmM0Zi00Njc5LThhZWYtMmVkODE3ZmE3ZTE4IiwiaWF0IjoxNzY1MDc3MjE0LCJpc3MiOiJsb2dpbi1zZXJ2aWNlIiwic3ViIjoiODQ3ZTkyMGUtMjZkZC00ZDdmLWExYjgtNWZjMDlmY2VkODNhIiwidWNjIjoiWU5EOVQiLCJuYXAiOiIiLCJ5Y2UiOiJlWVxcNiMtIzU5cVx0XHJcdTAwMDZ9XHUwMDAwXHUwMDEwYiIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.pFs_O292oL1RUT5wp8QWJ6nUoXPTqGMH-fVYrKUFLZ_iqyMFO-B_P8NQaA6ez-NiKw6EEi4ZloqcA5IyWJ7sS0S3wTTcNQYkXKygPt7smx7QhB_WVPukVXSeDSnOsOCaEHR7XSr2RgxfwgjmeQscGx_s9Cc9ZzgWTy8v1GfJ9RluyAYlzY9UI3pQWsudz5jiuCPEJPVzG7JaXaIaWnvUTsT4huevddv_XuFMXr0E96IGvn80WoHOeXxrGmOWE0Qwb_ghkR-NibfG1aIglt6FOIM9pZ0gfJM0ePf3R0OZdyy97ztrLWQpZ8MqvJ3fJ4EmR6qh5YrbjyMCsux9Lk-_vA" 
YOUR_SERVER_ID = "1" 

# --- 2. DEFINE THE INSTRUMENT TO SUBSCRIBE TO ---
# Example: Subscribing to a hypothetical token for NIFTY 50 (replace with your actual scrip)
INSTRUMENTS = [
    {
        "instrument_token": 26000,   # Replace with actual token (e.g., NIFTY 50 token)
        "exchange_segment": "NSE"    # Replace with actual segment (e.g., 'NSE', 'BSE', 'MCX')
    }
    # You can add more instruments here
]

# --- 3. DEFINE HANDLER CALLBACKS ---

def on_open_handler():
    """Called when the WebSocket connection is established."""
    print("✅ WebSocket connection opened.")
    print("Subscribing to instruments...")
    
    # Call the subscription method from the NeoWebSocket class
    # isIndex=True if subscribing to an index (like NIFTY 50), False for stocks/futures
    ws.get_live_feed(
        instrument_tokens=INSTRUMENTS,
        isIndex=False, # Set to True if the token is for an Index
        isDepth=False  # Set to True if you want Market Depth (Level 3)
    )

def on_message_handler(message):
    """Called when a message (feed update or confirmation) is received."""
    # print(f"Received raw message: {message}")
    
    # Check if the message is a live stock feed update
    if message.get('type') == 'stock_feed':
        data = message.get('data', [])
        print("\n--- 🟢 LIVE FEED UPDATE ---")
        # The 'data' is usually a list of dictionaries with price updates
        print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        for item in data:
             # Example of how a token 'tk' (instrument token) and 'ltp' (Last Traded Price) might be
             if isinstance(item, dict) and 'tk' in item:
                 print(f"Token: {item.get('tk')}, LTP: {item.get('ltp', 'N/A')}")
        print("----------------------------\n")
        
    elif isinstance(message, str) and "Un-Subscribed Successfully" in message:
        print(f"🟢 {message}")

def on_error_handler(error):
    """Called on a WebSocket error."""
    print(f"❌ WebSocket Error: {error}")

def on_close_handler():
    """Called when the WebSocket connection is closed."""
    print("🛑 WebSocket connection closed.")


# --- 4. START THE CONNECTION ---

# 1. Instantiate the NeoWebSocket client
ws = NeoWebSocket(
    sid=YOUR_SESSION_ID,
    token=YOUR_ACCESS_TOKEN,
    server_id=YOUR_SERVER_ID
)

# 2. Assign the handler functions
ws.on_open = on_open_handler
ws.on_message = on_message_handler
ws.on_error = on_error_handler
ws.on_close = on_close_handler

print("Starting Neo WebSocket connection thread...")

# 3. Start the WebSocket connection in a background thread
ws.start_websocket_thread()

# 4. Keep the main thread alive to listen for feed data
try:
    while ws.is_hsw_open == 0:
        time.sleep(1) # Wait until the socket is open
    
    print("Listening for live feed updates. Press Ctrl+C to stop.")
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\nStopping feed and closing connection...")
    # Attempt a clean shutdown
    if ws.hsWebsocket:
        ws.hsWebsocket.close()
    
print("Script finished.")