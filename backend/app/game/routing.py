from django.urls import re_path

from game import consumers

websocket_urlpatterns = [
        re_path(r'ws/game/(?P<id>\w+)/$', consumers.GameRoomConsumer.as_asgi()),
        re_path(r'ws/tournament/(?P<id>\w+)/$', consumers.TournamentConsumer.as_asgi()),
]
