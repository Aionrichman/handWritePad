from django.db import models


class PredictResult(models.Model):
    image = models.TextField()
    result = models.PositiveIntegerField()
    correct = models.BooleanField(default=True)
    log_time = models.DateField(auto_now=True)
