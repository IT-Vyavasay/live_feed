# views.py
from rest_framework import viewsets
from .models import PendingOrder, CloseOrder, CurrentOrder, Configuration
from .serializers import (
    PendingOrderSerializer,
    CloseOrderSerializer,
    CurrentOrderSerializer,
    ConfigurationSerializer,
)
from .mixins import WebSocketModelMixin
import logging
logger = logging.getLogger(__name__)


class PendingOrderViewSet(viewsets.ModelViewSet):
    queryset = PendingOrder.objects.all()
    serializer_class = PendingOrderSerializer


class CloseOrderViewSet(WebSocketModelMixin, viewsets.ModelViewSet):
    queryset = CloseOrder.objects.all()
    serializer_class = CloseOrderSerializer
    ws_model_name = "CloseOrder"

    def perform_create(self, serializer):
        logger.info("Sending CloseOrder CREATED socket event")

        instance = serializer.save()
        self.send_ws("CREATED", instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self.send_ws("UPDATED", instance)

    def perform_destroy(self, instance):
        self.send_ws("DELETED", instance)
        instance.delete()


class CurrentOrderViewSet(viewsets.ModelViewSet):
    queryset = CurrentOrder.objects.all()
    serializer_class = CurrentOrderSerializer


class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
