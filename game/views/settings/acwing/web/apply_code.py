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
    redirect_uri = quote("https://app5372.acapp.acwing.com.cn/settings/acwing/web/receive_code/") #重定向链接
    scope = "userinfo" #获取信息范围
    state = get_state() 

    cache.set(state,True,7200) #存到内存里面，2个小时有效期

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/" #申请地址
    return JsonResponse({
        'result' : "success",
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state)
        })
