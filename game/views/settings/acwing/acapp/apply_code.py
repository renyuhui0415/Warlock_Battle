from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache #redis

def get_state(): #获取随机state，可以过滤掉其他人的恶意攻击
    res = ""
    for i in range(8):
        res += str(randint(0,9))
    return res;

def apply_code(requeset):
    appid="5372" #client_id 
    redirect_uri = quote("https://www.renyuhui.top/settings/acwing/acapp/receive_code/") #重定向链接
    scope = "userinfo" #获取信息范围
    state = get_state() 

    cache.set(state,True,7200) #存到内存里面，2个小时有效期

    return JsonResponse({
        'result' : "success",
        'appid': appid,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state,
        })
