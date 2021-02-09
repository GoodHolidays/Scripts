

  [toc]  

 # <center> 腾讯新闻使用说明 </center>

 [跳转至底部](#注意事项)  ----  [回到主页](https://github.com/Sunert/Scripts)

### IOS配置教程
 ```
[MITM]
hostname = api.inews.qq.com
 ```
#### Surge:
* [模块地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/surge.sgmodule)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/surge.sgmodule
 ```
 * 本地重写
 
 ```
[Script]
腾讯新闻 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js,script-update-interval=0

腾讯新闻 = type=http-request,pattern=https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js, requires-body=true
```
#### Shadowrocket(Cron配置): 

```
[Script]
腾讯新闻 = type=cron,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js,cronexpr="1 */6 * * *",timeout=20,enable=true
```
####  Loon:

* [插件地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/loon.plugin)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/loon.plugin
 ```
* 本地重写
  
 ```
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js, enabled=true, tag=腾讯新闻
http-request https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js, requires-body=true, enabled=true, tag=腾讯新闻
```
#### Quantumult X:
   * [远程重写配置](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/qx_rewite.txt)
   
```
[rewrite_remote]
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/txnews/qx_rewite.txt
```
   * 本地重写配置
   
```
[rewrite_local]
https:\/\/api\.inews\.qq\.com\/event\/v1\/user\/event\/report\? url script-request-body https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js
```
   * 本地任务配置
   
```
[task_local]
1 */5 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js, tag=腾讯新闻
```
###  获取Cookie方法

  1. 打开腾讯新闻app，阅读几篇文章，倒计时结束后即可获取阅读Cookie
  
  2. 看一次推荐视频，获取视频地址

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
| TXNEWS_COOKIE | <span style="font-size:18; color:#0000ff">腾讯新闻 txnews.yml</span> | & | 必须 | 请求地址: "https://api.inews.qq.com/event/v1/user/event/report?"，  <br>腾讯新闻 Cookie: openxx=xxx |
| TXNEWS_SIGN | 同上 | # | 必须 | 请求地址同上， 阅读请求地址链接 |
| TXNEWS_VIDEO | 同上 | # | 必须 | 请求地址同上， 视频请求地址链接 |
| TXNEWS_NOTIFY_CONTROL | 同上 | true/false | 可选 | 腾讯新闻通知开关 <br>默认当余额大于2元且通知间隔为50时推送通知 |

</details>

 >>> [回到上一页](..)
 
### 注意事项:
   1. 可能腾讯有某些限制，有些号码无法领取红包，手动阅读几篇，能领取红包，一般情况下都是正常的
   2. 此脚本根据阅读篇数开启通知，默认阅读50篇通知一次
   3. 支持boxjs配置，增加通知跳转链接https://news.qq.com/FERD/cjRedDown.htm，需手动领取此红包





  
  
  
  
  
