<h1 align="center">Actions Secrets 环境变量配置说明 :</h1>

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
|  |  | - |  |  |
| TXNEWS_COOKIE | <span style="font-size:18; color:#0000ff">腾讯新闻 txnews.yml</span> | & | 必须 | 请求地址: "https://api.inews.qq.com/event/v1/user/event/report?"，  <br>腾讯新闻 Cookie: openxx=xxx |
| TXNEWS_SIGN | 同上 | # | 必须 | 请求地址同上， 阅读请求地址链接 |
| TXNEWS_VIDEO | 同上 | # | 必须 | 请求地址同上， 视频请求地址链接 |
| TXNEWS_NOTIFY_CONTROL | 同上 | true/false | 可选 | 腾讯新闻通知开关 <br>默认当余额大于2元且通知间隔为50时推送通知 |
|  |  |  | - |  |
| DSJ_HEADERS | <span style="font-size:18; color:#0000ff">电视家dianshijia.yml</span> | #或换行 | 必须 | 请求地址: "http://api.gaoqingdianshi.com/api/v2/sign/signin"， <br>签到请求头: { xxx } |
| DSJ_DRAWAL | 同上 | #或换行 | 必须 | 请求地址: "http://api.gaoqingdianshi.com/api/v2/cash/withdrawal"， <br>即提现请求地址 |
| DSJ_NOTIFY_CONTROL | 同上 | true/false | 可选 | 电视家通知开关 <br>默认不推送 |
|  |  |  | - |  |
| WB_TOKEN | <span style="font-size:18; color:#0000ff">微博 </span> | #或换行 | 必须 | 请求地址: "https://api.weibo.cn/xxx?gsid="， <br>签到token: gsid=xxx |
| WB_PAY | 同上 | #或换行 | 必须 | 请求地址:"https://pay.sc.weibo.com/aj/mobile/home/welfare/signin/do"， <br> 提现请求头 |
|  |  |  | - |  |
| JD_COOKIE | <span style="font-size:18; color:#0000ff">京喜 jingxi.yml</span> | &或换行| 必须 | 京东cookie,多个账号的cookie使用`&`隔开或者换行。具体获取参考[浏览器获取京东cookie教程](https://github.com/lxk0301/scripts/blob/master/backUp/GetJdCookie.md) 或者 [插件获取京东cookie教程](https://github.com/lxk0301/scripts/blob/master/backUp/GetJdCookie2.md) |

<br>

<details>
  <summary>
    <span style="font-size:22">
       相关通知推送 
    </span>
  </summary>  

| Name | 脚本相关YML | Value分割符 | 必须 / 可选 | 注意事项及样式(其中"xxx"代表任意字符) |
| :-------: | :------: | ------- | ------ | ------- |
| PUSH_KEY | 微信推送 | - | 可选 | cookie失效推送[server酱的微信通知](http://sc.ftqq.com/3.version) |
| BARK_PUSH | BARK推送 | - | 可选 | cookie失效推送BARK这个APP,填写内容是app提供的`设备码`，例如：https://api.day.app/123 ，那么此处的设备码就是`123`，再不懂看 [这个图](icon/bark.jpg) |
| BARK_SOUND | BARK推送 | - | 可选 | bark推送声音设置，例如`choo`,具体值请在`bark`-`推送铃声`-`查看所有铃声` |
| TG_BOT_TOKEN | telegram推送 | - | 可选 | tg推送,填写自己申请[@BotFather](https://t.me/BotFather)的Token,如`10xxx4:AAFcqxxxxgER5uw` , [具体教程](https://github.com/lxk0301/scripts/pull/37#issuecomment-692415594) |
| TG_USER_ID | telegram推送 | - | 可选 | tg推送,填写[@getuseridbot](https://t.me/getuseridbot)中获取到的纯数字ID, [具体教程](https://github.com/lxk0301/scripts/pull/37#issuecomment-692415594) |
| DD_BOT_TOKEN | 钉钉推送 | - | 可选 | 钉钉推送[官方文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq) ,只需`https://oapi.dingtalk.com/robot/send?access_token=XXX` 等于符号后面的XXX， 注：如果钉钉推送只填写`DD_BOT_TOKEN`，那么安全设置需勾选`自定义关键词`，内容输入输入`账号`即可，其他安全设置不要勾选 |
| DD_BOT_SECRET |   钉钉推送 | - | 可选 | 密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的字符串 , 注:填写了`DD_BOT_TOKEN`和`DD_BOT_SECRET`，钉钉机器人安全设置只需勾选`加签`即可，其他选项不要勾选,再不懂看 [这个图](icon/DD_bot.png) |

</details>

 ## 以上为配置方法详见[@lxk0301](https://raw.githubusercontent.com/lxk0301/jd_scripts/master/githubAction.md)
   
***
   ## ***感谢***
 * [@lxk0301](https://t.me/lxk0301)
 * [@chavy](https://t.me/chavyleung)
   
  