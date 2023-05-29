from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from match_system.src.match_server.match_service import Match
from game.models.player.player import Player #把player类导入，为了获得score
from channels.db import database_sync_to_async #讲同步函数转换为异步函数需要的包


class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self): #连接函数
        await self.accept()

    async def disconnect(self, close_code): #断开连接
        if self.room_name:
            print('disconnect')
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data): #接受数据
        data = json.loads(text_data)
        event = data['event']

        if event == "create_player":
            await self.create_player(data)
        elif event == "move_to":
            await self.move_to(data)
        elif event == "shoot_ball":
            await self.shoot_ball(data)
        elif event == "attack":
            await self.attack(data)
        elif event == "flash":
            await self.flash(data);
        elif event == "message":
            await self.message(data)

    async def create_player(self,data):
        self.room_name = None
        self.uuid = data['uuid']
        # Make socket
        transport = TSocket.TSocket('127.0.0.1', 9090)

        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(transport)

        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        # Create a client to use the protocol encoder
        client = Match.Client(protocol)

        # Connect!
        transport.open()

        def db_get_player(): #查询username对象
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(db_get_player)() #讲同步函数换为异步函数，获取对象

        client.add_player(player.score, data['uuid'], data['username'], data['photo'], self.channel_name)

        # Close!
        transport.close()


    async def group_send_event(self,data):
        if not self.room_name:
            keys = cache.keys('*%s*' % (self.uuid))
            if keys:
                self.room_name = keys[0]
        await self.send(text_data=json.dumps(data))#群发消息
    async def move_to(self,data):
        await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': "group_send_event",
                    'event': "move_to",
                    'uuid': data['uuid'],
                    'tx': data['tx'],
                    'ty': data['ty'],
                    }
                )
        async def shoot_ball(self,data):
            await self.channel_layer.group_send(
                    self.room_name,
                    {
                        'type': "group_send_event",
                        'event': "shoot_ball",
                        'uuid': data['uuid'],
                        'ball_skill': data['ball_skill'],
                        'tx': data['tx'],
                        'ty': data['ty'],
                        'ball_uuid': data['ball_uuid'],
                        }
                    )
            async def attack(self,data):
                await self.channel_layer.group_send(
                        self.room_name,
                        {
                            'type': "group_send_event",
                            'event': "attack",
                            'uuid': data['uuid'],
                            'attackee_uuid': data['attackee_uuid'],
                            'x': data['x'],
                            'y': data['y'],
                            'angle': data['angle'],
                            'damage': data['damage'],
                            'ball_uuid': data['ball_uuid'],
                            }
                        )

                async def flash(self,data):
                    await self.channel_layer.group_send(
                            self.room_name,
                            {
                                'type': "group_send_event",
                                'event': "flash",
                                'uuid': data['uuid'],
                                'tx': data['tx'],
                                'ty': data['ty'],
                                }
                            )
                    async def message(self,data):
                        await self.channel_layer.group_send(
                                self.room_name,
                                {
                                    'type': "group_send_event",
                                    'event': "message",
                                    'uuid': data['uuid'],
                                    'username': data['username'],
                                    'text': data['text'],
                                    }
                                )
