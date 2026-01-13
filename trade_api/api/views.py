# views.py
from rest_framework import viewsets
from .models import PendingOrder, CloseOrder, CurrentOrder, Configuration
from .serializers import (
    PendingOrderSerializer,
    CloseOrderSerializer,
    CurrentOrderSerializer,
    ConfigurationSerializer,
) 


class PendingOrderViewSet(viewsets.ModelViewSet):
    queryset = PendingOrder.objects.all()
    serializer_class = PendingOrderSerializer


class CloseOrderViewSet(viewsets.ModelViewSet):
    queryset = CloseOrder.objects.all()
    serializer_class = CloseOrderSerializer



class CurrentOrderViewSet(viewsets.ModelViewSet):
    queryset = CurrentOrder.objects.all()
    serializer_class = CurrentOrderSerializer


class ConfigurationViewSet(viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
