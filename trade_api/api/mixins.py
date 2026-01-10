from utils.ws import send_ws_event


class WebSocketModelMixin:
    ws_group = "trade_updates"
    ws_event_type = "trade_event"
    ws_model_name = None  # override if needed

    def ws_payload(self, action, instance):
        return {
            "model": self.ws_model_name or instance.__class__.__name__,
            "action": action,
            "id": instance.id,
        }

    def send_ws(self, action, instance):
        send_ws_event(
            group=self.ws_group,
            event_type=self.ws_event_type,
            data=self.ws_payload(action, instance),
        )
