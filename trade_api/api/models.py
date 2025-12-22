from django.db import models

class BaseOrder(models.Model):
    tradeId = models.CharField(max_length=100, unique=True)

    strategyCode = models.CharField(max_length=50)   # frontend-selected strategy

    isShortSell = models.BooleanField(default=False)

    qty = models.IntegerField(default=0)

    entryPrice = models.FloatField(null=True, blank=True)
    exitPrice = models.FloatField(null=True, blank=True)

    openAt = models.DateTimeField(null=True, blank=True)
    closeAt = models.DateTimeField(null=True, blank=True)

    pnl = models.FloatField(default=0)

    securityType = models.CharField(max_length=50)
    instrumentToken = models.CharField(max_length=50)
    exchangeSegment = models.CharField(max_length=50)

    STATUS_CHOICES = (
        ("CREATED", "CREATED"),
        ("WAITING", "WAITING"),
        ("OPEN", "OPEN"),
        ("CLOSED", "CLOSED"),
        ("CANCELLED", "CANCELLED"),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    class Meta:
        abstract = True



class PendingOrder(BaseOrder):
    triggerPrice = models.FloatField()



class CloseOrder(BaseOrder):
    exitReason = models.CharField(max_length=50)  # SL / TARGET / MANUAL



class CurrentOrder(BaseOrder):
    stopLoss = models.FloatField(null=True, blank=True)
    target = models.FloatField(null=True, blank=True)




class Configuration(models.Model):
    iTokens = models.JSONField(default=list)
    debounceTime = models.IntegerField(default=0)


