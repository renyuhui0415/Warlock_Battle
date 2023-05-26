from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self): #连接函数
        self.room_name = None; #当前用户加入房间编号为空

        for i in range(1000): #默认1000个房间
            name = "room-%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name #当前房间没有玩家 或者 当前房间未满 人数限制，那么就把该玩家添加带该房间
                break;

        if not self.room_name: #没有找到房间，就退出
            return

        await self.accept()

        if not cache.has_key(self.room_name):#如果为空房间的话，就创建一下房间
            cache.set(self.room_name,[],3600)

        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({
                'event': "create_player",
                'uuid': player['uuid'],
                'username': player['username'],
                'photo': player['photo'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name) #把用户添加到一个组里，后面可以群发消息

    async def disconnect(self, close_code): #断开连接
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

    async def create_player(self,data):
        players = cache.get(self.room_name) #获取房间内的玩家信息
        players.append({ #当前玩家添加到players
            'uuid': data['uuid'],
            'username': data['username'],
            'photo': data['photo'],
        })
        cache.set(self.room_name, players, 3600)#更新该房间内的玩家信息，重新存储到redis

        await self.channel_layer.group_send( #给房间内玩家群发消息
            self.room_name,
            {
                'type': "group_send_event",
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
            }
        )
    async def group_send_event(self,data):
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
