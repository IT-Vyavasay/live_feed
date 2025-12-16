from django.db import models

class BaseOrder(models.Model):
    tradeId = models.CharField(max_length=100)
    isShortSell = models.BooleanField(default=False)
    openAt = models.DateTimeField(null=True, blank=True)
    closeAt = models.DateTimeField(null=True, blank=True)
    entryPrice = models.FloatField(null=True, blank=True)
    exitPrice = models.FloatField(null=True, blank=True)
    securityType = models.CharField(max_length=50)
    instrumentToken = models.CharField(max_length=50)
    exchangeSegment = models.CharField(max_length=50)

    class Meta:
        abstract = True


class PendingOrder(BaseOrder):
    pass


class CloseOrder(BaseOrder):
    pass


class CurrentOrder(BaseOrder):
    pass


class Configuration(models.Model): 
    iTokens = models.JSONField(default=list)   # stores array
    debounceTime = models.IntegerField(default=0)
