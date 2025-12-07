# # 1. Instantiate the ScripSearch class
# from neo_api_client import ScripSearch

# from neo_api_client import NeoAPI

# # --- 1. Get Your Keys ---
# # Get your consumer key from the Kotak Neo Trade API Dashboard
# YOUR_CONSUMER_KEY = "YND9T" 
# # Use 'prod' for live trading, or 'uat' for testing
# ENVIRONMENT = "prod" 

# # --- 2. Initialize the Client ---
# # The client object is created here
# api_client = NeoAPI(
#     consumer_key=YOUR_CONSUMER_KEY, 
#     environment=ENVIRONMENT, 
#     access_token=None, 
#     neo_fin_key=None
# )

# search_engine = ScripSearch(api_client)

# # 2. Call the search method for active GOLD contracts on MCX
# # Passing "" for optional parameters
# search_results = search_engine.scrip_search(
#     symbol="GOLD", 
#     exchange_segment="mcx", 
#     expiry="", 
#     option_type="", 
#     strike_price="",
#     ignore_50multiple=""
# )

# # 3. Process the results to find the token
# if search_results and isinstance(search_results, list):
#     print("Found GOLD contracts:")
#     for contract in search_results:
#         # The relevant output columns, based on the DataFrame to JSON conversion, will contain:
#         # 'pSymbolName' (e.g., GOLD25DEC)
#         # 'instrument_token' (the numerical ID you need)
#         # 'pExpiryDate'
        
#         token = contract.get('pInstrumentToken') # This is the token you need
#         symbol_name = contract.get('pSymbolName')
        
#         print(f"Symbol: {symbol_name}, Token: {token}")
# else:
#     print(search_results) # Prints error or "No data found" message

# from ...bootstrap import debug_paths
# debug_paths()



# import sys
# import os

# # Add project root (src) to Python path
# CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "../../"))
# sys.path.append(PROJECT_ROOT)

# print("UPDATED PYTHONPATH =>", sys.path)

from utils.kotak_neo_api_main.neo_api_client.hi_b import fun

fun("hi12346")


#src/script/getInfo/instrumentToken.py