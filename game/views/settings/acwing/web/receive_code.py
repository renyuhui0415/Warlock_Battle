from django.shortcuts import redirect
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from random import randint

def receive_code(request):
    date = request.GET
    code = date.get('code')
    state = date.get('state')

    if not cache.has_key(state): #判断是不是其他人恶意攻击，是的话返回原来的页面
        return redirect("index")
    cache.delete(state) #如果是自己发的，通过后删除，一对一关系

    #python库，携带下面三个参数向 该链接发送GET请求
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': "5372",
        'secret': "15f0fdd6cc554874bb1868fcfca53074",
        'code': code
    }

    #把返回结果变成字典
    access_token_res = requests.get(apply_access_token_url,params=params).json()

    #存数据
    access_token = access_token_res['access_token']
    openid = access_token_res['openid'] #相当于身份证

    #数据库是否已经存在该用户，存在直接登录
    players = Player.objects.filter(openid=openid)
    if players.exists():
        login(request,players[0].user)
        return redirect("index")

    #拿着access_token + openid 去资源服务器调用用户信息
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        'access_token': access_token,
        'openid': openid
    }

    #存储数据
    userinfo_res = requests.get(get_userinfo_url,params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']

    #反正用户名重复
    while User.objects.filter(username=username).exists():
        username += str(randint(0,9))

    #创建用户并登录
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user,photo=photo,openid=openid)

    login(request,user)

    return redirect("index")
