import re
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
import datetime
from .serializers import *


class RankView(APIView):

    def get(self, request, *args, **kwargs):
        ret = [{
            "username": '此位置还没有人哦',
            "score": ""
        }]
        today = datetime.date.today()
        data = Rank.objects.filter(date=today).order_by('-score')
        ser = RankSerializers(instance=data, many=True)
        if data:
            return Response(ser.data)
        else:
            return Response(ret)

    def post(self, request, *args, **kwargs):
        db = Rank()
        ret = {
            'code': 500,
            'msg': 'Same Name Error'
        }
        username = request.POST.get("username", None)
        score = request.POST.get("score", None)
        score = int(score)
        # try:
        #     user = Rank.objects.get(username=username)
        #     if user:
        #         return Response(ret)
        # except:
        #     pass
        date = datetime.date.today()
        db.username = username
        db.score = score
        db.date = date

        stuff = {
            'username': username,
            'score': score,
            'date': date,
        }
        db.save()

        c = Rank.objects.filter(date=date).order_by('-score')
        for e, f in enumerate(c):
            rank = str(e + 1)
            h = f.username
            if h == username:
                return Response({"code": 200, "msg1": "succeeded", 'msg': stuff, 'rank': rank})
        return Response({'code': 404, 'msg': 'failed'})


class ShareView(APIView):
    def get(self, request, *args, **kwargs):
        previous = request.GET.get('game', None)
        share_name = previous
        name1 = share_name + '/bg1.png'
        name2 = share_name + '/bg2.png'
        name3 = share_name + '/bg3.png'
        try:
            strlist = [
                Share.objects.get(name=name1).base64str,
                Share.objects.get(name=name2).base64str,
                Share.objects.get(name=name3).base64str
            ]

            return Response({
                'bgsrc': strlist,
            })
        except:
            return Response({'code': 403, 'msg': 'Wrong Name'})
