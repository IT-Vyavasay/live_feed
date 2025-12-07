# 1. Instantiate the ScripSearch class
from scrip_search import ScripSearch

search_engine = ScripSearch(api_client)

# 2. Call the search method for active GOLD contracts on MCX
# Passing "" for optional parameters
search_results = search_engine.scrip_search(
    symbol="GOLD", 
    exchange_segment="mcx", 
    expiry="", 
    option_type="", 
    strike_price="",
    ignore_50multiple=""
)

# 3. Process the results to find the token
if search_results and isinstance(search_results, list):
    print("Found GOLD contracts:")
    for contract in search_results:
        # The relevant output columns, based on the DataFrame to JSON conversion, will contain:
        # 'pSymbolName' (e.g., GOLD25DEC)
        # 'instrument_token' (the numerical ID you need)
        # 'pExpiryDate'
        
        token = contract.get('pInstrumentToken') # This is the token you need
        symbol_name = contract.get('pSymbolName')
        
        print(f"Symbol: {symbol_name}, Token: {token}")
else:
    print(search_results) # Prints error or "No data found" message