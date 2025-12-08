import sys
import os
import time
import json
import threading

# --- 1. Path Fix to find NeoWebSocket.py ---
# Define the directory where NeoWebSocket.py resides
NEO_WEBSOCKET_DIR = "src/utils/kotak_neo_api_main_v2/neo_api_client"

# Add the directory to the system path
if NEO_WEBSOCKET_DIR not in sys.path:
    # Use os.path.abspath if necessary to handle relative paths
    sys.path.append(os.path.abspath(NEO_WEBSOCKET_DIR))

# Now import the class
try:
    from NeoWebSocket import NeoWebSocket 
except ImportError as e:
    print(f"Error importing NeoWebSocket: {e}")
    print("Please ensure the directory path is correct and NeoWebSocket.py is present.")
    sys.exit(1)

# --- 2. ⚠️ Replace with Your Actual Credentials and Gold Token ⚠️ ---
# You must get these from your successful Neo API login/token retrieval process
YOUR_SESSION_ID = "YOUR_SESSION_ID"  
YOUR_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN" 
YOUR_SERVER_ID = "1"        # Common workaround if hsServerId is empty
YOUR_DATA_CENTER = None     # Usually not needed for market data feed, can be None

# --- 3. Replace with your specific Gold contract token ---
# EXAMPLE: Use the actual token for the Gold contract you searched for on MCX
GOLD_INSTRUMENTS = [
    {
        "instrument_token": 133458,  # Replace with actual Gold futures token (e.g., Gold Dec 2025)
        "exchange_segment": "MCX"    # Use MCX for commodity futures
    }
]

# --- 4. Instantiate the client (ws will hold the NeoWebSocket object) ---
ws = None