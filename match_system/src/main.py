#! /usr/bin/env python3

import glob
import sys
sys.path.insert(0, glob.glob('../../')[0]) #添加路径，这样才可以导入Django包

from match_server.match_service import Match #把生成的Match.py导入进来

from queue import Queue
from time import sleep
from threading import Thread

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from Warlock_Battle.asgi import channel_layer
from asgiref.sync import async_to_sync #可以将同步函数转化为异步函数
from django.core.cache import cache

queue = Queue() #消息队列

class Player:
    def __init__(self,score,uuid,username,photo,channel_name): #初始化操作
        self.score = score
        self.uuid = uuid
        self.username = username
        self.photo = photo
        self.channel_name = channel_name
        self.waiting_time = 0 #等待时间

class Pool:
    def __init__(self): #初始化操作
        self.players = [] #匹配池玩家为空

    def add_player(self,player): #向匹配池添加玩家
        self.players.append(player)

    def check_match(self,a,b): #判断是否匹配成功
        dt = abs(a.score - b.score) #分差
        a_max_dif = a.waiting_time * 50 #a能容忍的最大分差
        b_max_dif = b.waiting_time * 50 #b能容忍的最大分差
        return dt <= a_max_dif and dt <= b_max_dif #保证都能忍受分差

    def match_success(self,ps):
        print("Match Success： %s %s %s" % (ps[0].username,ps[1].username,ps[2].username))
        room_name = "room-%s-%s-%s" % (ps[0].uuid,ps[1].uuid,ps[2].uuid) #房间名
        players = [] #房间内玩家

        for p in ps: #把这3名玩家添加到一个房间内
            async_to_sync(channel_layer.group_add)(room_name,p.channel_name)
            players.append({
                'uuid': p.uuid,
                'username': p.username,
                'photo': p.photo,
                'hp': 100, #血量，后面会有一个积分榜
            })
        cache.set(room_name,players,3600) #数据存下来 有效期1小时

        for p in ps: #挨个通知创建create
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type': "group_send_event",
                    'event': "create_player",
                    'uuid': p.uuid,
                    'username': p.username,
                    'photo': p.photo
                }
            )


    def increase_waiting_time(self): #更新等待时间
        for player in self.players:
            player.waiting_time += 1;

    def match(self): #匹配一下
        #匹配逻辑，先排序，选取3个相邻玩家，看看两两是否可以匹配成功
        while len(self.players) >= 3: #满3人开始匹配
            self.players = sorted(self.players, key=lambda p: p.score) #按照分值排序
            flag = False #是否匹配成功
            for i in range(len(self.players) - 2): #这样不会越界访问
                a, b, c = self.players[i], self.players[i + 1], self.players[i + 2]
                if self.check_match(a,b) and self.check_match(a,c) and self.check_match(b,c):
                    self.match_success([a,b,c]) #调用匹配成功函数
                    self.players = self.players[:i] + self.players[i + 3:] #删除这三个玩家
                    flag = True
                    break

            if not flag: #不能匹配成功，就跳出循环，防止死循环
                break
        self.increase_waiting_time()

class MatchHandler:
    def add_player(self,score,uuid,username,photo,channel_name):
        print("Add Player: %s %d" % (username,score))
        player = Player(score,uuid,username,photo,channel_name) #实例化对象
        queue.put(player) #放进消息队列
        return 0

def get_player_from_queue():
    try:
        return queue.get_nowait() #从消息队列移除并返回player
    except:
        return None  #返回空

def worker():
    pool = Pool()
    while True: #无限死循环
        player = get_player_from_queue() #获得player
        if player: #如果不为空，就添加到匹配池，直到消息队列为空
            pool.add_player(player)
        else: #为空就开始匹配
            pool.match()
            sleep(1) #不能一直进行匹配，要不然cpu被占满，沉睡1s

if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    #无限制版，每一个玩家点击匹配，就开一个新线程
    server = TServer.TThreadedServer(
             processor, transport, tfactory, pfactory)


    Thread(target=worker, daemon=True).start()

    print('Starting the server...')
    server.serve()
    print('done.')
