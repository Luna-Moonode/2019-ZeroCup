from django.db import models
import datetime


# Create your models here.
class Rank(models.Model):
    username = models.CharField(max_length=32, unique=True)
    clearence = [
        (1, 'Normal'),
        (2, 'VIP'),
        (3, 'SVIP'),
    ]
    userclearence = models.IntegerField(choices=clearence, default=1)
    score = models.IntegerField(default=0)
    date = models.CharField(max_length=16)

class GameResultView(models.Model):
    name = models.CharField(max_length=32, unique=True)
    base64str = models.CharField(max_length=10^20, default='none')


