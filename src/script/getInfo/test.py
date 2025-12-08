import json
from utils.kotak_neo_api_main_v2.neo_api_client import NeoAPI
from utils.constant import USER_ID, CONSUMER_KEY, TOKEN, MOBILE, UCC, MPIN

# Your test instrument token
RELIANCE_NSE_TOKEN = "11729"

try:
    # 1) Initialize client
    client = NeoAPI(
        environment="prod",
        consumer_key=CONSUMER_KEY,
        neo_fin_key=None,
        access_token=None
    )

    print("✔ NeoAPI Client Initialized")

    # 2) Read TOTP
    totp_value = input("Enter TOTP shown in your Authenticator app: ")

    # 3) Login first stage (TOTP validation)
    login_response = client.totp_login(
        mobile_number=MOBILE,
        ucc=UCC,
        totp=totp_value
    )

    if login_response.get("status") != "success":
        print("❌ Login Failed:", login_response)
        exit()

    print("✔ TOTP Login Successful")

    # 4) MPIN validation
    validation_response = client.totp_validate(mpin=MPIN)

    if validation_response.get("status") != "success":
        print("❌ MPIN Validation Failed:", validation_response)
        exit()

    print("✔ MPIN Validation Successful")
    print("✔ Session Active")

    # ---------- Fetch Live Quotes ----------
    scrip_list = [
        # {"exchange_segment": "nse_cm", "instrument_token": RELIANCE_NSE_TOKEN}
        # For MCX gold use:
        {"exchange_segment": "mcx_fo", "instrument_token": YOUR_GOLD_TOKEN}
    ]

    print("⏳ Fetching live quote...")

    quotes_response = client.quotes(scrip_list=scrip_list)

    print(json.dumps(quotes_response, indent=2))

    if quotes_response.get("status") == "success" and quotes_response.get("data"):
        item = quotes_response["data"][0]
        print("\n====== LIVE QUOTE ======")
        print("Symbol:", item.get("trading_symbol"))
        print("Exchange:", item.get("exchange_segment"))
        print("Token:", item.get("instrument_token"))
        print("LTP:", item.get("last_traded_price"))
        print("Time:", item.get("last_traded_time"))
        print("========================\n")

except Exception as e:
    print("❌ ERROR:", e)
