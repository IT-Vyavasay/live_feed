now web socket run properly in socket_crypto and socket_equity. i want to make documentation to start  socket so i can follow same process in other project without getting any mistack. give correct info which we colloe to start start socket in both file.   methin all file in which we change and ange and package which we instal from start to end inclusind setting.py

Great 👍
Below is a clean, end-to-end, copy-paste-safe documentation you can reuse for any future project to run Python socket engines + Django WebSocket (Channels) correctly using systemd — without mistakes.

This doc is written as if you are starting from scratch.

✅ Production Documentation
Python Socket Engine + Django WebSocket (Channels + Redis + systemd)
🧱 Final Architecture (IMPORTANT)
systemd
 ├─ trade_api.service        → Django + ASGI + Channels (WS clients)
 ├─ socket_crypto.service   → Market socket → pending_logic
 ├─ socket_equity.service   → Market socket → pending_logic
 └─ redis-server             → Message bridge


Redis is mandatory because sockets and Django run in different processes.

1️⃣ Project Folder Structure (REQUIRED)
live_feed/
├── trade_api/
│   ├── manage.py
│   ├── trade_api/
│   │   ├── settings.py
│   │   ├── asgi.py
│   │   └── urls.py
│   ├── api/
│   │   ├── consumers.py
│   │   └── routing.py
│   ├── socket_engine/
│   │   ├── runner_crypto.py
│   │   ├── runner_equity.py
│   │   ├── crypto_ws.py
│   │   └── equity_ws.py
│   ├── strategy_engine/
│   │   └── pending_logic.py
│   └── utils/
│       └── ws.py
├── venv/
└── requirements.txt

2️⃣ Python Packages (INSTALL ALL)

Activate venv:

source venv/bin/activate


Install:

pip install django djangorestframework
pip install channels channels-redis
pip install gunicorn uvicorn
pip install websockets

3️⃣ Install Redis (OS level)
sudo apt update
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server


Verify:

redis-cli ping
# PONG

4️⃣ Django settings.py (MANDATORY)
INSTALLED_APPS = [
    ...
    "rest_framework",
    "channels",
    "api",
]

ASGI_APPLICATION = "trade_api.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}


🚫 DO NOT USE InMemoryChannelLayer in production

5️⃣ Django ASGI (trade_api/asgi.py)
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from api.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trade_api.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),
})

6️⃣ WebSocket Routing (api/routing.py)
from django.urls import re_path
from .consumers import TradeConsumer

websocket_urlpatterns = [
    re_path(r"ws/trades/$", TradeConsumer.as_asgi()),
]

7️⃣ WebSocket Consumer (api/consumers.py)
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class TradeConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("trade_updates", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("trade_updates", self.channel_name)

    async def trade_event(self, event):
        await self.send_json(event["data"])

8️⃣ Common WebSocket Sender (IMPORTANT)

Create:

trade_api/utils/ws.py

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_ws_event(group: str, event_type: str, data: dict):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    async_to_sync(channel_layer.group_send)(
        group,
        {
            "type": event_type,
            "data": data,
        }
    )

9️⃣ pending_logic.py (Socket → WS bridge)
from django.utils import timezone
from api.models import CurrentOrder
from utils.ws import send_ws_event

def open_trade(order, ltp):
    trade = CurrentOrder.objects.create(
        tradeId=order.tradeId,
        strategyCode=order.strategyCode,
        qty=order.qty,
        entryPrice=ltp,
        openAt=timezone.now(),
        instrumentToken=order.instrumentToken,
        status="OPEN"
    )

    if order.strategyCode == "TEST_STRATEGY":
        send_ws_event(
            group="trade_updates",
            event_type="trade_event",
            data={
                "event": "TRADE_OPENED",
                "tradeId": trade.tradeId,
                "price": trade.entryPrice,
            },
        )

🔟 Socket Runners (NO Django server here)
runner_crypto.py
import asyncio
import django
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trade_api.settings")
django.setup()

from socket_engine.crypto_ws import run_crypto_ws

if __name__ == "__main__":
    asyncio.run(run_crypto_ws())


(Same structure for runner_equity.py)

1️⃣1️⃣ systemd: Django API (ASGI)
sudo nano /etc/systemd/system/trade_api.service

[Unit]
Description=Django Trade API
After=network.target redis-server.service

[Service]
User=root
WorkingDirectory=/var/my_work/live_feed/trade_api
ExecStart=/var/my_work/live_feed/venv/bin/gunicorn trade_api.asgi:application -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8001 --workers 2
Restart=always

[Install]
WantedBy=multi-user.target

1️⃣2️⃣ systemd: Socket Crypto
sudo nano /etc/systemd/system/socket_crypto.service

[Unit]
Description=Crypto Socket Engine
After=network.target redis-server.service

[Service]
User=root
WorkingDirectory=/var/my_work/live_feed/trade_api
ExecStart=/var/my_work/live_feed/venv/bin/python -u socket_engine/runner_crypto.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

1️⃣3️⃣ systemd: Socket Equity
sudo nano /etc/systemd/system/socket_equity.service

[Unit]
Description=Equity Socket Engine
After=network.target redis-server.service

[Service]
User=root
WorkingDirectory=/var/my_work/live_feed/trade_api
ExecStart=/var/my_work/live_feed/venv/bin/python -u socket_engine/runner_equity.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

1️⃣4️⃣ Enable & Start ALL Services
sudo systemctl daemon-reload

sudo systemctl enable redis-server trade_api socket_crypto socket_equity
sudo systemctl start redis-server trade_api socket_crypto socket_equity

1️⃣5️⃣ Verify
sudo systemctl status trade_api
sudo systemctl status socket_crypto
sudo systemctl status socket_equity


All must show:

Active: active (running)

1️⃣6️⃣ Logs (DEBUGGING)
journalctl -u trade_api -f
journalctl -u socket_crypto -f
journalctl -u socket_equity -f

1️⃣7️⃣ Client WebSocket URL
wss://<your-domain>/ws/trades/

🚫 Common Mistakes (AVOID THESE)

❌ Using InMemoryChannelLayer
❌ Running sockets via PM2
❌ Using gunicorn WSGI for WebSockets
❌ Wrong WorkingDirectory
❌ Relative paths without understanding systemd
❌ Missing -u flag for Python logs

✅ Final Truth

If you follow this document step by step, your socket engines and WebSocket delivery will work in any project without surprises.

If you want, next I can:

Convert this into a README.md

Add per-user WebSocket auth

Add health checks

Add Docker version

Just say 👍




To temporarily stop any of those services, use stop:
sudo systemctl stop trade_api
sudo systemctl stop socket_crypto
sudo systemctl stop socket_equity
To temporarily stop any of those services, use restart:
sudo systemctl restart trade_api
sudo systemctl restart socket_crypto
sudo systemctl restart socket_equity
Stop AND prevent auto-restart (still temporary):
sudo systemctl stop trade_api
sudo systemctl disable trade_api
sudo systemctl stop socket_crypto
sudo systemctl disable socket_crypto
sudo systemctl stop socket_equity
sudo systemctl disable socket_equity
Start again later
sudo systemctl enable trade_api
sudo systemctl start trade_api
sudo systemctl enable socket_crypto
sudo systemctl start socket_crypto
sudo systemctl enable socket_equity
sudo systemctl start socket_equity
journalctl -u trade_api -f
journalctl -u socket_crypto -f
journalctl -u socket_equity -f