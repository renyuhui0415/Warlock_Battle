from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache


def get_state(): #获取随机state，可以过滤掉其他人的恶意攻击
    res = ""
    for i in range(8):
        res += str(randint(0,9))
    return res;

def apply_code(requeset):
    response_type = "code"
    client_id ="102052672" #client_id 填自己的appid，QQ互联应用基本信息里面查看
    redirect_uri = quote("https://www.renyuhui.top/settings/qq/receive_code") #重定向链接，自己设置的结束授权码的链接
    scope = "userinfo" #获取信息范围
    state = get_state()

    cache.set(state,True,7200) #存到内存里面，2个小时有效期

    apply_code_url = "https://graph.qq.com/oauth2.0/authorize" #申请地址
    return JsonResponse({
        'result' : "success",
        'apply_code_url' : apply_code_url + "?response_type=%s&client_id=%s&redirect_uri=%s&state=%s&scope=%s" %(response_type,client_id,redirect_uri,state,scope)
        })

