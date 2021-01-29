更新时间: 2020-10-12 20:05
 1.根据原版脚本修改，增加上月账单信息，需重新获取Cookie，打开app即可
 2.适合流量畅享套餐使用，其他套餐，自行测试，此项仅供测试 
 3.可能因地区不同，脚本不一定适用
 By Macsuny 修改
 感谢原版作者提供脚本
 * 下载安装 天翼账号中心 登陆 获取authToken

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# quantumultx
 [rewrite_local]
 ^https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do url script-request-header telecomInfinity.js
 # MITM = e.189.cn
 [task_local]
 10 8 * * * telecomInfinity.js

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# [Loon]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js, enabled=true, tag=电信套餐查询

http-request ^https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 
# Surge 4.0 :
[Script]
电信套餐查询 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js,script-update-interval=0

电信套餐查询 = script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/telecomInfinity.js,type=http-request,pattern=https?:\/\/e\.189\.cn\/store\/user\/package_detail\.do

~~~~~~~~~~~~~~~~~~~~~
 # MITM
hostname = e.189.cn
