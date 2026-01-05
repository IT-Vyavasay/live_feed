from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    PendingOrderViewSet,
    CloseOrderViewSet,
    CurrentOrderViewSet,
    ConfigurationViewSet,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

router = DefaultRouter()
router.register("pending-order", PendingOrderViewSet)
router.register("close-order", CloseOrderViewSet)
router.register("current-order", CurrentOrderViewSet)
router.register("configuration", ConfigurationViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),

    # 🔹 API endpoints
    path("api/", include(router.urls)),

    # 🔹 OpenAPI schema
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    # 🔹 Swagger UI
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
