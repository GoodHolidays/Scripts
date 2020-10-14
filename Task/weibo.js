/*
更新时间: 2020-10-13 21:25

本脚本仅适用于微博每日签到，支持Actions多账号运行  
获取Cookie方法:
1.将下方[rewrite_local]和[MITM]地址复制的相应的区域下
2.打开微博App，刷微博视频，获取Cookie，获取后请注释或禁用Cookie
3.打开微博钱包点击签到，获取Cookie，
4.钱包签到时获取Cookie,已经签到无法获取
5.非专业人士制作，欢迎各位大佬提出宝贵意见和指导

by Macsuny
~~~~~~~~~~~~~~~~
Surge 4.0 :
[Script]
weibo.js = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js,script-update-interval=0

# 获取微博 Cookie.
weibo.js = type=http-request,pattern=https:\/\/api\.weibo\.cn\/\d\/page\/\w+\?gsid,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js
# 微博钱包签到Cookie
weibo.js = type=http-request,pattern=https:\/\/pay\.sc\.weibo\.com\/aj\/mobile\/home\/welfare\/signin\/do\?,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

~~~~~~~~~~~~~~~~
Loon 2.1.0+
[Script]
# 本地脚本
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js, enabled=true, tag=新浪微博

http-request https:\/\/api\.weibo\.cn\/\d\/page\/\w+\?gsid script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

http-request https:\/\/pay\.sc\.weibo\.com\/aj\/mobile\/home\/welfare\/signin\/do\? script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

-----------------

QX 1.0.6+ :
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

[rewrite_local]
https:\/\/api\.weibo\.cn\/\d\/page\/\w+\?gsid url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

# 钱包签到Cookie
https:\/\/pay\.sc\.weibo\.com\/aj\/mobile\/home\/welfare\/signin\/do\? url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/weibo.js

~~~~~~~~~~~~~~~~
[MITM]
hostname = api.weibo.cn, pay.sc.weibo.com
~~~~~~~~~~~~~~~~
*/

const $ = new Env('新浪微博')
const notify = $.isNode() ? require('./sendNotify') : '';
let tokenArr = [],payArr = [];

if (isGetCookie = typeof $request !==`undefined`) {
   GetCookie();
   $.done()
} 
if ($.isNode()) {
  if (process.env.WB_TOKEN && process.env.WB_TOKEN.split('#') && process.env.WB_TOKEN.split('#').length > 0) {
  wbtoken = process.env.WB_TOKEN.split('#');
  }
  else if (process.env.WB_TOKEN && process.env.WB_TOKEN.split('\n') && process.env.WB_TOKEN.split('\n').length > 0) {
  wbtoken = process.env.WB_TOKEN.split('\n');
  };
  if (process.env.WB_PAY && process.env.WB_PAY.split('#') && process.env.WB_PAY.split('#').length > 0) {
  wbPay = process.env.WB_PAY.split('#');
  }
  else if (process.env.WB_PAY && process.env.WB_PAY.split('\n') && process.env.WB_PAY.split('\n').length > 0) {
  wbPay = process.env.WB_PAY.split('\n');
  };
  Object.keys(wbtoken).forEach((item) => {
        if (wbtoken[item]) {
          tokenArr.push(wbtoken[item])
        }
    });
    Object.keys(wbPay).forEach((item) => {
        if (wbPay[item]) {
          payArr.push(wbPay[item])
        }
    });
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    tokenArr.push($.getdata('sy_token_wb'))
    payArr.push($.getdata('sy_payheader_wb'))
}
 
!(async () => {
  if (!tokenArr[0]) {
    $.msg($.name, '【提示】请先获取新浪微博一cookie')
    return;
  }
   console.log(`------------- 共${tokenArr.length}个账号\n`)
  for (let i = 0; i < tokenArr.length; i++) {
    if (tokenArr[i]) {
      token = tokenArr[i];
      payheaderVal = payArr[i];
      $.index = i + 1;
      console.log(`\n开始【微博签到${$.index}】`)
     await getsign();
     await doCard();
 if (payheaderVal !== undefined){
     await paysign()
    } else {
    paybag = `【钱包签到】❌ 未获取Cooiekie`
    };
    $.msg($.name, nickname, wbsign+paybag+docard)
  if ($.isNode()) {
       await notify.sendNotify($.name, nickname+'\n'+ wbsign+paybag+docard)
     }
   }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function GetCookie() {
if ($request && $request.method != 'OPTIONS' && $request.url.match(/\/\d\/[a-z]+\/\w+\?gsid/)) {
  const signurlVal = $request.url
  const token = signurlVal.split(`?`)[1]
  //const signheaderVal = JSON.stringify($request.headers)
   $.log(`token:${token}`)
  if (token) $.setdata(token, 'sy_token_wb')
  $.msg($.name, `获取微博签到Cookie: 成功`, ``)
} else if ($request && $request.method != 'OPTIONS' && $request.url.match(/\/home\/welfare\/signin\/do\?_=[1-9]+/)) {
  const payheaderVal = JSON.stringify($request.headers)
  if (payheaderVal) $.setdata(payheaderVal,  'sy_payheader_wb')
  $.msg($.name, `获取微博钱包Cookie: 成功`, ``)}
}

//微博签到
function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url: `https://api.weibo.cn/2/checkin/add?${token}`,
      headers: {"User-Agent": `Weibo/46902 (iPhone; iOS 14; Scale/3.00)`}}
     $.post(signurl, async(error, response, data) => {
     let result = JSON.parse(data)
     if (result.status == 10000){
         wbsign = `【微博签到】✅ 连续签到${result.data.continuous}天，收益: ${result.data.desc}💰\n`  
         }  
     else if (result.errno == 30000){
         wbsign = `【每日签到】 🔁  `
       }
     else if (result.status == 90005){
         wbsign = `【每日签到】‼️`+ result.msg + '\n'
       }
     else {
         wbsign = `【每日签到】 ❌ 签到失败`+result.errmsg
         $.msg($.name, wbsign, ``)
       if ($.isNode()) {
         await notify.sendNotify($.name, wbsign)
           }
         return
        }
     resolve()
    })
  })
}

function doCard() {
  return new Promise((resolve, reject) =>{
   let doCardurl =  {
      url: `https://api.weibo.cn/2/!/ug/king_act_home?${token}`,
      headers: {"User-Agent": `Weibo/46902 (iPhone; iOS 14; Scale/3.00)`}}
  $.get(doCardurl, (error, response, data) => {
     let result = JSON.parse(data)
      if (result.status ==10000){
       nickname = "昵称: "+result.data.user.nickname
       signday = result.data.signin.title.split('<')[0]
       docard = `【每日打卡】 ✅ `+ signday+'天 积分总计: '+result.data.user.energy
       }
     else {
       docard = `【每日打卡】 ❌ 活动过期或失效`
         }
     resolve()
     })
  })
}

// 钱包签到
function paysign() {
 return new Promise((resolve, reject) =>{
   $.post({url: `https://pay.sc.weibo.com/aj/mobile/home/welfare/signin/do?_=${$.startTime+10}`,headers: JSON.parse(payheaderVal)
     }, (error, response, data) => {
   try{
     let result = JSON.parse(data)
     if (result.status == 1){
          paybag = `【微博钱包】 ✅ +`+ result.score+' 分\n'
         }  
     else if (result.code == 100000){
          paybag = `【微博钱包】 🔁\n`
         }
       }
     catch(error){
       paybag = `【钱包签到】❌ Cookie失效`+'\n'
       }
      resolve()
     })
  })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
