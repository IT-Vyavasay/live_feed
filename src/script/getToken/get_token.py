# Assuming you have an authenticated client object
# client = neo_api_client.NeoAPI(...)

# 1. Get the list of instruments for the specific contract type and exchange
# The exact method name might vary (e.g., get_master_contract_list, search_instrument)
search_results = client.search_instrument(
    'GOLD', # The symbol name
    'MCX'   # The exchange segment
)

# 2. Iterate through results to find the required expiry
for instrument in search_results:
    if 'trading_symbol' in instrument and 'GOLD' in instrument['trading_symbol'] and '25DEC' in instrument['trading_symbol']:
        # This is the Gold December 2025 future contract
        gold_token = instrument['instrument_token']
        gold_segment = instrument['exchange_segment']
        
        # Once you have these values, you use them in your run_websocket.py
        # INSTRUMENTS = [{ "instrument_token": gold_token, "exchange_segment": gold_segment }]