import sys
import os
import time

# Add the parent directory (LIVE_FEED) to the system path for package discovery
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from neo_api_client import NeoAPI
from utils.constant import NEO_ACCESS_TOKEN, CONSUMER_KEY, CONSUMER_SECRET, DEV_ACCESS_TOKEN, API_TOKEN, MOBILE, NEO_FIN_KEY, SID, UCC, USER_PASSWORD, USER_ID, CLIENT_ID, CLIENT_PASSWORD, MPIN, TOTP, ENVIRONMENT, MCX_GOLD_TOKEN

print("initialize")
client = NeoAPI(environment='prod', access_token=NEO_ACCESS_TOKEN, neo_fin_key=NEO_FIN_KEY, consumer_key=NEO_ACCESS_TOKEN)


print("client created", )



# Step 1: Login TOTP → generates view_token
totp_num = input("Enter totp: ")
res= client.totp_login(mobile_number=MOBILE, ucc=UCC, totp=totp_num)
print("TOTP login successful",res)

# Step 2: Validate MPIN → prepares trade token
res2=client.totp_validate(MPIN)
print("MPIN validated",res2)

def on_message(message):
    print('[Res]: ', message)

def on_error(message):
    result = message
    print('[OnError]: ', result)
    
def on_open(message):
    print('[OnOpen]: ', message)
    
def on_close(message):
    print('[OnClose]: ', message)
 
 

# Setup Callbacks for websocket events (Optional)
client.on_message = on_message  # called when message is received from websocket
client.on_error = on_error  # called when any error or exception occurs in code or websocket
client.on_close = on_close  # called when websocket connection is closed
client.on_open = on_open  # called when websocket successfully connects

inst_tokens = [{"instrument_token": "11536", "exchange_segment": "nse_cm"},
               {"instrument_token": "1594", "exchange_segment": "nse_cm"},
               {"instrument_token": "11915", "exchange_segment": "nse_cm"},
               {"instrument_token": "13245", "exchange_segment": "nse_cm"}]

try:
    # Get live feed data
    client.subscribe(instrument_tokens=inst_tokens)
except Exception as e:
    print("Exception while connection to socket->socket: %s\n" % e)

 

  