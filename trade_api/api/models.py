from django.db import models

class BaseOrder(models.Model):
    tradeId = models.CharField(
        max_length=100,
        unique=True,
        default=""
    )

    strategyCode = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        default=None
    )

    isShortSell = models.BooleanField(default=False)

    qty = models.IntegerField(default=0)

    entryPrice = models.FloatField(null=True, blank=True, default=None)
    exitPrice = models.FloatField(null=True, blank=True, default=None)

    openAt = models.DateTimeField(null=True, blank=True, default=None)
    closeAt = models.DateTimeField(null=True, blank=True, default=None)

    pnl = models.FloatField(default=0.0)

    securityType = models.CharField(max_length=50, default="")
    instrumentToken = models.CharField(max_length=50, default="")
    exchangeSegment = models.CharField(max_length=50, default="")

    STATUS_CHOICES = (
        ("CREATED", "CREATED"),
        ("WAITING", "WAITING"),
        ("OPEN", "OPEN"),
        ("CLOSED", "CLOSED"),
        ("CANCELLED", "CANCELLED"),
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="CREATED"
    )

    class Meta:
        abstract = True


class PendingOrder(BaseOrder):
    triggerPrice = models.FloatField(default=0.0)


class CloseOrder(BaseOrder):
    exitReason = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        default=None
    )


class CurrentOrder(BaseOrder):
    stopLoss = models.FloatField(null=True, blank=True, default=None)
    target = models.FloatField(null=True, blank=True, default=None)


class Configuration(models.Model):
    iTokens = models.JSONField(default=list)
    debounceTime = models.IntegerField(default=0)
