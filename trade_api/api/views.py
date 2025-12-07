from django.shortcuts import render
from rest_framework import viewsets
from .models import Security
from .serializers import SecuritySerializer

class SecurityViewSet(viewsets.ModelViewSet):
    queryset = Security.objects.all()
    serializer_class = SecuritySerializer


# Create your views here.
