本脚本仅适用于数码之家每日签到
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域
下，

2.登陆数码之家电脑版网页，签到一次,即可获取Cookie，获取后请禁用或注释掉❗️ 签过到的需次日获取

3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

by Macsuny
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
数码之家 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js,script-update-interval=0

# 数码之家 Cookie.
数码之家 = type=http-request,pattern=https:\/\/www\.mydigit\.cn\/plugin\.php\?id=k_misign:sign&operation=qiandao,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js, enabled=true, tag=数码之家

http-request https:\/\/www\.mydigit\.cn\/plugin\.php\?id=k_misign:sign&operation=qiandao script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
-----------------

QX 1.0. 7+ :
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js

[rewrite_local]
https:\/\/www\.mydigit\.cn\/plugin\.php\?id=k_misign:sign&operation=qiandao url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/mydigit.js
~~~~~~~~~~~~~~~~
[MITM]
hostname = www.mydigit.cn
