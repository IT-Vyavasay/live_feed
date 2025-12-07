# models.py
from django.db import models

class Security(models.Model):
    """
    Model to store security information.
    """
    
    # Choices for securityType field
    # SECURITY_TYPES = [
    #     ('EQUITY', 'Equity'),
    #     ('FUTURE', 'Future'),
    #     ('OPTION', 'Option'),
    #     ('CURRENCY', 'Currency'),
    #     ('COMMODITY', 'Commodity'),
    #     ('BOND', 'Bond'),
    #     # Add any other relevant security types as needed
    # ]
    
    securityType = models.CharField(
        max_length=10, 
      )
    
    instrumentToken = models.CharField(
        max_length=10, 
       )
    
    exchangeSegment = models.CharField(
        max_length=10,
     )
  
   

    def __str__(self):
        """
        Returns a string representation of the model instance.
        """
        return f"{self.securityType} | Token: {self.instrumentToken} | Segment: {self.exchangeSegment}"