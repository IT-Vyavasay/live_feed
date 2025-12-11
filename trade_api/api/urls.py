from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    PendingOrderViewSet,
    CloseOrderViewSet,
    CurrentOrderViewSet,
    ConfigurationViewSet
)

router = DefaultRouter()
router.register("pending-order", PendingOrderViewSet)
router.register("close-order", CloseOrderViewSet)
router.register("current-order", CurrentOrderViewSet)
router.register("configuration", ConfigurationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
