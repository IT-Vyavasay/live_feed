from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def send_ws_event(
    group: str,
    event_type: str,
    data: dict,
):
    """
    Common WebSocket sender for all services

    :param group: channel group name (e.g. 'trade_updates')
    :param event_type: consumer handler name (e.g. 'trade_event')
    :param data: JSON-serializable payload
    """
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
