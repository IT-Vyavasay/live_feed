from rest_framework import serializers
from .models import PendingOrder, CloseOrder, CurrentOrder, Configuration

class PendingOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingOrder
        fields = '__all__'


class CloseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloseOrder
        fields = '__all__'


class CurrentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentOrder
        fields = '__all__'


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = '__all__'
