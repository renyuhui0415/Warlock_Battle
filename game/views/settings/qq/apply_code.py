from django.http import JsonResponse
from random import randint
from django.core.cache import cache #redis

"""
def get_state(): #获取随机state，可以过滤掉其他人的恶意攻击
    res = ""
    for i in range(8):
        res += str(randint(0,9))
    return res;
"""
def apply_code(requeset):
    """
    appid="xxx" #client_id 填自己的appid，在应用里面查看
    redirect_uri = quote("xxx") #重定向链接，自己设置的结束授权码的链接
    scope = "userinfo" #获取信息范围
    state = get_state()

    cache.set(state,True,7200) #存到内存里面，2个小时有效期

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/" #申请地址
    return JsonResponse({
        'result' : "success",
        'apply_code_url': apply_code_url +  "?appid=%s&redirect_uri%s&scope=%s&state=%s" %(appid,redirect_uri,scope,state)
        })
    """
    return JsonResponse({
        'result': "success",
        })

