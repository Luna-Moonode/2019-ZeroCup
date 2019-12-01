import os,django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'RankViewDemo.settings')
django.setup()
import base64
from rankdemo import models
a = models.Share()

with open('bg3.png', 'rb') as f:
    base64str1 = base64.b64encode(f.read()).decode()
    base64str = 'data:image/jpeg;base64,%s' % base64str1
    a.name = 'nz/bg3.png'
    a.base64str = base64str
    a.save()

