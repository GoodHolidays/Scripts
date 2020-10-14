
const cookieName = '米读阅读时长'
const $ = new Env(cookieName)
let tokenArr = [], TimeArr = [],SignArr= [];

if ($.isNode()) {
  if (process.env.MIDU_TOKEN && process.env.MIDU_TOKEN.split('#') && process.env.MIDU_TOKEN.split('#').length > 0) {
  miduToken = process.env.MIDU_TOKEN.split('#');
  }
 if (process.env.MIDU_TIME && process.env.MIDU_TIME.split('#') && process.env.MIDU_TIME.split('#').length > 0) {
  ReadBodys = process.env.MIDU_TIME.split('#');
  }
  if (process.env.MIDU_SIGN && process.env.MIDU_SIGN.split('#') && process.env.MIDU_SIGN.split('#').length > 0) {
  SignBodys = process.env.MIDU_SIGN.split('#');
  }
    Object.keys(miduToken).forEach((item) => {
        if (miduToken[item]) {
          tokenArr.push(miduToken[item])
        }
      })
    Object.keys(ReadBodys).forEach((item) => {
        if (ReadBodys[item]) {
          TimeArr.push(ReadBodys[item])
        }
      })
    Object.keys(SignBodys).forEach((item) => {
        if (SignBodys[item]) {
          SignArr.push(SignBodys[item])
        }
    })
  } else {
      tokenArr.push($.getdata('tokenMidu_read'));
      TimeArr.push($.getdata('senku_readTimebody_midu'));
      SignArr.push($.getdata('senku_signbody_midu'))
}

!(async () => {
  if (!tokenArr[0]){
    $.msg($.name, '【提示】米读一cookie');
    console.log($.name, '【提示】米读一cookie');
    return;
  }
  if ($.isNode()){
      console.log(`\n============ 脚本执行来自 Github Action  ==============\n`)
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}=============\n`)
     };
  for (let i = 0; i < tokenArr.length; i++) {
    if (tokenArr[i]) {
      tokenVal = tokenArr[i];
      bodyVal = TimeArr[i];
      drawVal = SignArr[i];
      //console.log(bodyVal)
      $.index = i + 1;
      console.log(`-------------------------\n\n开始【米读账号${$.index}】`)
    $.log(`🔔 ${cookieName}`)
    await readTime();
    await drawPrize();
    await prizeTask();
    await prizeInfo();
    await dice_roll();
    await dice_double();
    await signDay();
    await signVideo()
   }
 }
})()
  .catch((e) => $.log(`❌ ${cookieName} 签到失败: ${e}`))


// 阅读时长
function readTime() {
  return new Promise((resolve, reject) => {
    let request = {
    url: "https://apiwz.midukanshu.com/user/readTimeBase/readTime",
    headers: {'token' : tokenVal,'User-Agent' : `MRSpeedNovel/0918.1649 CFNetwork/1128.0.1 Darwin/19.6.0`,'mobile-brand': 'iPhone','Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyVal,
    }
        $.post(request, (error, response, data) => {
            try {
                $.log(`❕ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                readtime = JSON.parse(data)
                let subTitle = ''
                let detail = ''
                if (readtime && readtime.code == 0) {
                    const coin = readtime.data.coin
                    const readTotalMinute = readtime.data.readTotalMinute
                    const total_coin = readtime.data.total_coin
                    coin == 0 ? detail += `` : detail += `【阅读时长】获得${coin}💰`
                    if (readTotalMinute % 20 == 0) {
                        readTotalMinute ? detail += ` 阅读时长${readTotalMinute / 2}分钟,该账户:${total_coin}💰` : detail += `该账户:${total_coin}💰`
                        $.msg(cookieName, subTitle, detail)
                    } else if ($.getdata('debug') == 'true') {
                        readTotalMinute ? detail += ` 阅读时长${readTotalMinute / 2}分钟,该账户:${total_coin}💰` : detail += `该账户:${total_coin}💰`
                        $.msg(cookieName, subTitle, detail)
                        
                        
                    }
                } else if (readTime.code != 0) {
                    detail += `【阅读时长】错误代码${readtime.code},错误信息${readtime.message}`
                    $.msg(cookieName, subTitle, detail)
                } else {
                    detail += '【阅读时长】失败'
                    $.msg(cookieName, subTitle, detail)
                }
                resolve()
            } catch (e) {
                $.msg(cookieName, `阅读时长: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} readTime - 签到失败: ${e}`)
                $.log(`❌ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}
function drawPrize() {
    return new Promise((resolve, reject) => {
        const drawPrizeurlVal = 'https://apiwz.midukanshu.com/wz/task/drawPrize'
        const url = {
            url: drawPrizeurlVal,
            headers: {},
            body: drawVal
        }
        url.headers['token'] = tokenVal
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 qapp miduapp'
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} drawPrize - response: ${JSON.stringify(response)}`)
                if (data) {
                    drawprize = JSON.parse(data)
                }
                resolve()
            } catch (e) {
                // $.msg(cookieName, `抽奖: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} drawPrize - 抽奖失败: ${e}`)
                $.log(`❌ ${cookieName} drawPrize - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 观看视频获取抽奖机会
function prizeTask() {
    return new Promise((resolve, reject) => {
        const prizeTaskurlVal = 'https://apiwz.midukanshu.com/wz/task/prizeTask'
        const url = {
            url: prizeTaskurlVal,
            headers: {},
            body: drawVal       
       }
        url.headers['token'] = tokenVal
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} prizeTask - response: ${JSON.stringify(response)}`)
                if (data) {
                    prizetask = JSON.parse(data)
                }
                resolve()
            } catch (e) {
                // $.msg(cookieName, `观看视频抽奖: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} prizeTask - 观看视频抽奖失败: ${e}`)
                $.log(`❌ ${cookieName} prizeTask - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 抽奖信息
function prizeInfo() {
    return new Promise((resolve, reject) => {
        const prizeInfourlVal = 'https://apiwz.midukanshu.com/wz/task/prizeList'
        const url = {
            url: prizeInfourlVal,
            headers: {},
            body: drawVal
        }
        url.headers['token'] = tokenVal
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        $.post(url, (error, response, data) => {
            try {
                // $.log(`🐍🐢 ${cookieName} prizeInfo - response: ${JSON.stringify(response)}`)
                if (data) {
                    prizeinfo = JSON.parse(data)
                }
                resolve()
            } catch (e) {
                // $.msg(cookieName, `抽奖信息: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} prizeInfo - 抽奖信息失败: ${e}`)
                $.log(`❌ ${cookieName} prizeInfo - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 掷骰子
function dice_roll() {
    return new Promise((resolve, reject) => {
        const dice_roll_urlVal = 'https://apiwz.midukanshu.com/wz/dice/roll'
        const url = {
            url: dice_roll_urlVal,
            headers: {},
            body: drawVal
        }
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} dice_roll - response: ${JSON.stringify(response)}`)
                if (JSON.parse(data).code == 0) {
                    rollList=JSON.parse(data)
                }
                resolve()
            } catch (e) {
                $.msg(cookieName, `掷骰子: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} dice_roll - 掷骰子失败: ${e}`)
                $.log(`❌ ${cookieName} dice_roll - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 骰子双倍奖励
function dice_double() {
    return new Promise((resolve, reject) => {
        const dice_double_urlVal = 'https://apiwz.midukanshu.com/wz/dice/doubleReward'
        const url = {
            url: dice_double_urlVal,
            headers: {},
            body: drawVal
        }
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        url.headers['token'] = tokenVal
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} dice_double - response: ${JSON.stringify(response)}`)
                if (JSON.parse(data).code == 0) {
                    doubleList=JSON.parse(data)
                }
                resolve()
            } catch (e) {
                $.msg(cookieName, `骰子双倍奖励: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} dice_double - 骰子双倍奖励失败: ${e}`)
                $.log(`❌ ${cookieName} dice_double - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}
  
// 每日签到
function signDay() {
    return new Promise((resolve, reject) => {
        const signurlVal = 'https://apiwz.midukanshu.com/wz/task/signInV2' 
        const url = {
            url: signurlVal,
            headers: {},
            body: drawVal
        }
        url.headers['token'] = tokenVal
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} signDay - response: ${JSON.stringify(response)}`)
                _signDay = JSON.parse(data)
                resolve()
            } catch (e) {
                $.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} signDay - 签到失败: ${e}`)
                $.log(`❌ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 签到视频奖励
function signVideo() {
    return new Promise((resolve, reject) => {
        const signVideourlVal = 'https://apiwz.midukanshu.com/wz/task/signVideoReward' 
        const url = {
            url: signVideourlVal,
            headers: {},
            body: drawVal
        }
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        url.headers['token'] = tokenVal
        $.post(url, (error, response, data) => {
            try {
                $.log(`🐍🐢 ${cookieName} signVideo - response: ${JSON.stringify(response)}`)
                _signVideo = JSON.parse(data)
                resolve()
            } catch (e) {
                $.msg(cookieName, `签到视频: 失败`, `说明: ${e}`)
                $.log(`❌ ${cookieName} signVideo - 签到视频失败: ${e}`)
                $.log(`❌ ${cookieName} signVideo - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
