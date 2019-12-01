from  rest_framework import serializers
from .models import *


class RankSerializers(serializers.ModelSerializer):
    username = serializers.CharField()
    score = serializers.CharField()
    date = serializers.CharField()

    class Meta:
        model = Rank
        fields = ['username', 'score', 'date']
