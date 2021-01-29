更新时间: 2020-11-16 09:40
赞赏:电视家邀请码`893988`,农妇山泉 -> 有点咸，万分感谢
本脚本仅适用于电视家签到，支持Actions多账号运行，请用'#'或者换行隔开‼️
获取Cookie方法:
1.将下方[rewrite_local]和[Task]地址复制的相应的区域，无需添加 hostname，每日7点、12点、20点各运行一次，其他随意
2.APP登陆账号后，点击菜单栏'领现金',即可获取Cookie，进入提现页面，点击随机金额，可获取提现地址!!
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
By Facsuny
感谢 chavyleung 等
~~~~~~~~~~~~~~~~~~~~
loon 2.10+ :
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家
~~~~~~~~~~~~~~~~~~~~~
# 获取电视家 Cookie.
Surge 4.0
[Script]
电视家 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
~~~~~~~~~~~~~~~~~~

QX 1.0.6+ :
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

[rewrite_local]
http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
~~~~~~~~~~~~~~~~~
