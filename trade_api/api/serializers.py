from rest_framework import serializers
from .models import Security

class SecuritySerializer(serializers.ModelSerializer):
        class Meta:
            model = Security
            fields = '__all__'