

  [toc]  

 # <center> 中青看点使用说明 </center>

 [跳转至底部](#注意事项)

### IOS配置教程
 ```
[MITM]
hostname = *.youth.cn, ios.baertt.com 
 ```
#### Surge:
 
 ```
[Script]
中青看点 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,script-update-interval=0
中青看点 = type=http-request,pattern=https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign),script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/complete,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/article\/red_packet,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
中青看点 = type=http-request,pattern=https:\/\/ios\.baertt\.com\/v5\/\w+\/withdraw\d?\.json,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
```
#### Shadowrocket(Cron配置): 

```
[Script]
中青看点 = type=cron,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js,cronexpr="1 */6 * * *",timeout=20,enable=true
```
####  Loon:
 
 ```
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, enabled=true, tag=中青看点
http-request https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
http-request https:\/\/ios\.baertt\.com\/v5\/article\/complete script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/article\/red_packet script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
http-request https:\/\/ios\.baertt\.com\/v5\/\w+\/withdraw\d?\.json script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js, requires-body=true
```
#### Quantumult X:
   * [远程重写配置](https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/youth/qx_rewite.txt)
   
```
[rewrite_remote]
https://raw.githubusercontent.com/Sunert/Scripts/master/TaskConf/youth/qx_rewite.txt
```
   * 本地重写配置
   
```
[rewrite_local]
https:\/\/\w+\.youth\.cn\/TaskCenter\/(sign|getSign) url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
https?:\/\/ios\.baertt\.com\/v5\/article\/complete url script-request-body https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
https:\/\/ios\.baertt\.com\/v5\/article\/red_packet url script-request-body https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
https:\/\/ios\.baertt\.com\/v5\/user\/app_stay\.json url script-request-body https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
https:\/\/ios\.baertt\.com\/v5\/\w+\/withdraw\d?\.json url script-request-body https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
```
   * 本地任务配置
   
```
[task_local]
1 */5 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/youth.js
```
###  获取Cookie方法
  * 打开极速版APP，进去个人中心，或者签到一次，提示获取Cookie
  - 浏览一篇短文，等待倒计时结束，提示获取阅读请求及阅读时长
  * 向下滑动，文末有惊喜红包，点击惊喜红包，获取惊喜红包请求(不必选)
  - 正常提现一次，获取提现请求(可选)
  
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
| YOUTH_HEADER | <span style="font-size:18; color:#0000ff"> 中青看点 youth.yml </span> |  #  | 必须 | 请求地址:  "https://kd.youth.cn/TaskCenter/getSign"，  <br>中青签到请求头: { xxx } |
| YOUTH_ARTBODY | 同上 | & | 必须 | 请求地址: "https://ios.baertt.com/v5/article/complete"， <br>阅读请求体: p=xxx |
| YOUTH_REDBODY | 同上 | & | 必须 | 请求地址: "https://ios.baertt.com/v5/article/red_packet"， <br>惊喜红包请求体: p=xxx |
| YOUTH_TIME | 同上 | & | 必须 | 请求地址: "https://ios.baertt.com/v5/user/app_stay.json"，  <br>阅读时长请求体: p=xxx |
| YOUTH_NOTIFY_CONTROL | 同上 | true/false | 可选 | 中青通知开关 <br>默认当转盘次数为50或者100并且余额大于10元时推送通知 |
|  |  |  | - |  |
| YOUTH_READ | <span style="font-size:18; color:#0000ff">中青阅读 youth_read.yml</span> | &或者换行 | 必须 | 请求地址: "https://ios.baertt.com/v5/article/complete"，  <br>阅读请求体: p=xxx |
| YOUTH_START | <span style="font-size:18; color:#0000ff">中青浏览赚 youth_gain.yml</span> | & | 必须 | 请求地址: "https://ios.baertt.com/v5/task/browse_start.json"，  <br>阅读请求体: p=xxx |
| YOUTH_END | 同上 | & | 必须 | 请求地址: "https://ios.baertt.com/v5/task/browse_end.json"，  <br>阅读请求体: p=xxx |

</details>

 >>> [回到上一页](..)
 
### 注意事项:
 > __提现金额需该请求一致，只更改提现金额无效，默认30元__





  
  
  
  
  
