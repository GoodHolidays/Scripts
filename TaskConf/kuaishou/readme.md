

  [toc]  

 # <center> 快手视频签到使用说明 </center>

 [跳转至底部](#注意事项)  ----  [回到主页](https://github.com/Sunert/Scripts)

### IOS配置教程
 ```
[MITM]
hostname = nebula.kuaishou.com, activity.m.kuaishou.com
 ```
#### Surge:
* [模块地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/surge.sgmodule)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/surge.sgmodule
 ```
 * 本地重写
 
 ```
[Script]
快手视频 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js,script-update-interval=0

# 获取快手视频 Cookie.
快手正式版 = type=http-request,pattern=https:\/\/activity\.m\.kuaishou\.com\/rest\/wd\/taskCenter\/\w+\/module\/list,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js
快手极速版 = type=http-request,pattern=https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js
```
#### Shadowrocket(Cron配置): 

```
[Script]
快手视频 = type=cron,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js,cronexpr="35 5 0 * * *",timeout=20,enable=true
```
####  Loon:

* [插件地址](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/loon.plugin)

 ```
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/loon.plugin
 ```
* 本地重写
  
 ```
[Script]
cron "4 0 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js, enabled=true, tag=快手视频

http-request https:\/\/activity\.m\.kuaishou\.com\/rest\/wd\/taskCenter\/\w+\/module\/list script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js, enabled=true, tag=快手视频正式版
http-request https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js, enabled=true, tag=快手视频极速版
```
#### Quantumult X:
   * [远程重写配置](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/qx_rewite.txt)
   
```
[rewrite_remote]
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/kuaishou/qx_rewite.txt
```
   * 本地重写配置
   
```
[rewrite_local]
https:\/\/activity\.m\.kuaishou\.com\/rest\/wd\/taskCenter\/\w+\/module\/list url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js
https:\/\/nebula\.kuaishou\.com\/nebula\/task\/earning\? url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js
```
   * 本地任务配置
   
```
[task_local]
1 0 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/kuaishou.js, tag=快手视频
```
###  获取Cookie方法
  1. 点击视频页悬浮红包，或者进入设置，点击"积分兑好礼"即可

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
| KS_TOKEN | <span style="font-size:18; color:#0000ff"> 快手视频 </span> | &或换行 | 必须 | 请求地址: "https://activity.m.kuaishou.com/rest/wd/taskCenter/lowActive/module/list"， <br>任务Cookie: uid=xxx&gsid=xxx&s=xxx |

</details>

 >>> [回到上一页](..)
 
### 注意事项:
 * 本脚本仅限快手视频"低活国庆"部分任务，不能自动刷视频，可以自动领取视频积分
 * 本脚本仅适用于快手双版本签到，仅支持正式版获取多Cookie，建议使用正式版获取Cookie





  
  
  
  
  
