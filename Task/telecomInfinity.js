/**
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

 */
// 配置信息
let config = {
    name: " 中国电信 世界触手可及🤝",
    authTokenKey: "china_telecom_authToken_10000",
    CookieKey: "china_telecom_cookie",
    delay: 0, //自定义延迟签到,单位毫秒,(如填200则每个接口延迟0.2秒执行),默认无延迟
    info: 1, //是否显示手机归属地，1为显示，0为不显示
}
let $ = new Env(config.name),
     Y = $.time('yyyy'),
     M = $.getdata('Mon').slice(-2)||$.time('MM') ; //查询前几个月，可以')'号后减几

   let AUTHTOKEN = $.getdata(config.authTokenKey)
   let COOKIE = $.getdata(config.CookieKey)
var requests = {
    detail: {
        url: "https://e.189.cn/store/user/package_detail.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp"
        },
        body: "t=tysuit",
        method: "POST"
    },
    balance: {
        url: "https://e.189.cn/store/user/balance_new.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp",
            "User-Agent": "TYUserCenter/2.8 (iPhone; iOS 14.0; Scale/3.00)"
        },
        body: "t=tysuit",
        method: "POST"
    },
    info: {
        url: "https://e.189.cn/store/user/getExtInfo.do",
        headers: {
            "authToken": AUTHTOKEN,
            "type": "alipayMiniApp",
           // "Cookie": COOKIE
        },
        method: "GET"
    },
      bill: {
        url: `https://e.189.cn/store/user/bill.do?year=${Y}&month=${M}&t=tysuit`,
        headers: {
            "Cookie": COOKIE
        },
        method: "GET"
    }
}

if (isGetCookie = typeof $request !== 'undefined') {
    GetCookie()
    $.done()
} else {
 !(async() => {
  await cron()
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}
function GetCookie() {
    if ($request && $request.headers) {
        var cookieVal = $request.headers['authToken']
        var COOKIE = $request.headers['Cookie']
      $.setdata(COOKIE, config.CookieKey)
        if (cookieVal) {
            if ($.setdata(cookieVal, config.authTokenKey)) {
                $.msg(config.name, '获取authToken: 成功', '')
              // console.log(`[${config.name}] 获取authToken: 成功, authToken: ${cookieVal}, Cookie: [${COOKIE}]` )
            }
        }
    }
}

async function cron() {
    if (!AUTHTOKEN) {
        $.msg(config.name, "请获取authToken", "下载安装APP[天翼账号中心]获取")
        return
    }
    let detail = await httpRequest(requests.detail, config.delay)
    let balance = await httpRequest(requests.balance, config.delay)
    let bill = await httpRequest(requests.bill, config.delay)
    var info = {}
    if (config.info) {
        info = await httpRequest(requests.info, config.delay)
    }
    await parseData(detail, balance, info, bill)
}

async function httpRequest(resq, delay = 0, statusCode = 200) {
    return new Promise(resolve => {
      setTimeout(() => {
            var adapterClient = $.get;
            if (typeof resq.method != "undefined") {
                if (resq.method == "POST") {
                    adapterClient = $.post
                }
                if (resq.method == "GET") {
                    adapterClient = $.GET
                }
                delete resq.method
            }
          $.post(resq, function (error, response, body) {
                try {
                    if (!error) {
                        if (typeof response.statusCode == "undefined" || response.statusCode == statusCode) {
resolve(JSON.parse(body));
                        }
                    } else {
                        $.msg('', 'httpRequest', error)
                        resolve("")
                    }
                } catch (e) {
                    $.msg('', 'httpRequest catch', e)
                    resolve("")
                }
            });
     }, parseInt(delay))
    })
}

function parseData(detail, balance, info, bill) {
    return new Promise(async(resolve) => {
        if (!info || !detail  || !balance|| !bill) {
            resolve("done")
            return
        }
        if (balance.result != 0) {
            $.msg(config.name, "获取余额信息失败", `${balance.msg}`)
            resolve("done")
            return
        }
        if (config.info && info.result != 10000) {
            $.msg(config.name, "", "获取手机号归属地信息失败，请稍后重试")
            resolve("done")
            return
        }
        if (bill.paraFieldResult !=null){
            bill = `无`
            resolve("done")
            //return
        }
        await notify(detail, balance, info, bill)
        resolve("done")
    })
}

function notify(data, balance, exdata, bldata) {
 return new Promise((resolve) => {
  let productname = "中国电信", voiceAmount = " ", voiceUsage = " ", voiceBalance = " ", msgUsage = "", msgBalance = "", msgAmount = "",usagedCommon,balanceCommon,totalCommon,message;
  //console.log(data)  //套餐信息
 try {
    var subtitle = ""
    if (config.info) {
        subtitle = "【手机】" + exdata.mobileShort + "  (" + exdata.province + "-" + exdata.city + ")"
    } //手机号码
    for (i = 0; i < data.items.length; i++) {
        for (k = 0; k < data.items[i].items.length; k++) {
            let item = data.items[i].items[k]
            if (data.items[i].offerType == '11' || data.items[i].offerType == '21') {
                productname = data.items[i].productOFFName
            } else {
                productname = data.items[0].productOFFName
            }
            message = "【套餐】" + productname; //主套餐名称
            if (item.nameType == '401100' || item.nameType == '431100') {
                msgUsage = item.usageAmount, 
                msgAmount = item.ratableAmount, 
                msgBalance = item.balanceAmount
            }
            if (msgUsage) {
                msginfo = "【短信】已用: " + msgUsage + "条 剩余: " + msgBalance + "条 合计: " + msgAmount + "条",
            message += "\n" + msginfo
            }; //短信余量
            let VoiceArr = data.items[i].items;
            if (item.nameType == '131100') {
             for ( Voiceiterm of VoiceArr)
                    voiceAmount = Voiceiterm.ratableAmount, 
                    voiceBalance = Voiceiterm.balanceAmount, 
                    voiceUsage = Voiceiterm.usageAmount
              }
             voice = "【通话】已用: " + voiceUsage + "分钟 剩余: " + voiceBalance + "分钟 合计: " + voiceAmount + "分钟";
             message += "\n" + voice; //语音
    
            if (item.nameType == "331101") {
                usagedCommon = formatFlow(item.usageAmount / 1024),
                balanceCommon = item.ratableResourcename,
                totalCommon = data.items[i].productOFFName
            } // 畅享套餐
            else if (item.nameType == "331100") {
                usagedCommon = formatFlow(item.usageAmount / 1024),
                balanceCommon = formatFlow(item.balanceAmount / 1024),
                totalCommon = formatFlow(item.ratableAmount / 1024)
            }; //套餐流量
            if (usagedCommon) {
                flow = "【流量】已用: " + usagedCommon + "  剩余:" + balanceCommon + "  合计:" + totalCommon, 
                message += "\n" + flow
            }
        }
    }
} catch(err) {
    console.log("查询错误，错误原因:" + err + '\n套餐响应数据:' + JSON.stringify(data) + '\n请将以上数据机主姓名删除后反馈给作者')
}; //以上为套餐用量

   //console.log(balance)  //话费余额
           message += "\n" + "【话费】剩余: " + (parseInt(balance.totalBalanceAvailable) / 100).toFixed(2) + "元"; 

   //console.log(bldata.items)  //账单信息
try {
  if (bldata != '无') {
    message += ` ${M}月消费合计: ` + bldata.items[0].sumCharge / 100 + '元'
  };
  if (bldata == '无') {
    message = message + "\n" + `【$ {
      M
    }月账单】` + bldata
  } else if (typeof bldata.items[0].acctName != "undefined" && bldata.serviceResultCode == 0) {
    billcharge = bldata.items[0].items; 
    bills = `【${M}月话费账单】` + "\n   " + billcharge[1].chargetypeName + ':    ' + billcharge[1].charge / 100 + '元' + "\n   " + billcharge[2].chargetypeName + ':  ' + billcharge[2].charge / 100 + '元' + "\n   " + billcharge[0].chargetypeName + ':  ' + billcharge[0].charge / 100 + '元',
    message = message + "\n" + bills
  }; //账单明细
  $.msg(config.name, subtitle, message)
} catch(err) {
    console.log("查询错误，错误原因:" + err + '\n账单响应数据:' + JSON.stringify(bldata) + '\n请将以上数据机主姓名删除后反馈给作者')
    }
    resolve("done")
  })
}

// MB 和 GB 自动转换
function formatFlow(number) {
    if (number < 1024) {
        return number.toFixed(2) + "MB"
    }
    return (number / 1024).toFixed(2) + "GB"
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}