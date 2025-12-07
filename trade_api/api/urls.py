from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SecurityViewSet

router = DefaultRouter()
router.register(r'securities', SecurityViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]