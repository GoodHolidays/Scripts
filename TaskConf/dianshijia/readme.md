

  [toc]  

 # <center> 电视家使用说明 </center>

 [跳转至底部](#注意事项)  ----  [回到主页](https://github.com/Sunert/Scripts)

### IOS配置教程
 
#### Surge:
* [模块地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/surge.sgmodule)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/surge.sgmodule
 ```
 * 本地重写
 
 ```
[Script]

电视家 = type=cron,cronexp=1 7,12,20 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
```
#### Shadowrocket(Cron配置): 

```
[Script]
电视家 = type=cron,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,cronexpr="1 7,12,20 * * *",timeout=20,enable=true
```
####  Loon:

* [插件地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/loon.plugin)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/loon.plugin
 ```
* 本地重写
  
 ```
[Script]
cron "1 7,12,20 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家
```
#### Quantumult X:
   * [远程重写配置](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/qx_rewite.txt)
   
```
[rewrite_remote]
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/dianshijia/qx_rewite.txt
```
   * 本地重写配置
   
```
[rewrite_local]
http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
```
   * 本地任务配置
   
```
[task_local]
1 7,12,20 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
```
###  获取Cookie方法

赞赏:电视家邀请码`893988`，农妇山泉 -> 有点咸，万分感谢  

   1. APP登陆账号后，点击菜单栏'领现金'，即可获取Cookie
   2. 进入提现页面，点击随机金额，可获取提现地址!!  
   3. 无需添加 hostname，每日7点、12点、20点各运行一次，其他随意

  
 >>> [回到顶部](#IOS配置教程)

### Nodejs 配置密钥 (Github Actions)

<details>

  <summary>
    <span style="font-size:22">
       Actions Secrets 
    </span>
  </summary>  

| Name | 脚本相关YML | Value分割符 | 必须 / 可选 | 注意事项及样式(其中"xxx"代表任意字符) |
| :-------: | :------: | :-------: | ------ | ------- |
| DSJ_HEADERS | <span style="font-size:18; color:#0000ff">电视家dianshijia.yml</span> | #或换行 | 必须 | 请求地址: "http://api.gaoqingdianshi.com/api/v2/sign/signin"， <br>签到请求头: { xxx } |
| DSJ_DRAWAL | 同上 | #或换行 | 必须 | 请求地址: "http://api.gaoqingdianshi.com/api/v2/cash/withdrawal"， <br>即提现请求地址 |
| DSJ_NOTIFY_CONTROL | 同上 | true/false | 可选 | 电视家通知开关 <br>默认不推送 |

</details>

 >>> [回到上一页](..)
 
### 注意事项:
 > 





  
  
  
  
  
