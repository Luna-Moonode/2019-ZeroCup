from rest_framework.urls import url
from . import views

urlpatterns =[
    url(r'^rank/$', views.RankView.as_view()),
    url(r'^outcome/$', views.QianShiView.as_view())

]