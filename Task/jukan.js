/*
聚看点极速版签到任务
打开'我的'获取Cookie

https:\/\/www\.xiaodouzhuan\.cn\/jkd\/newMobileMenu\/infoMe\.action url script-request-body jukan.js

hostname = www.xiaodouzhuan.cn
~~~~~~~~~~~~~~~~

*/
const $ = new Env('聚看点')

let CookieArr=[],BodyArr=[];
let cookie = $.getdata('jukan_ck')
let bodys = $.getdata('jukan_body')
let UA = 'JuKanDian/5.6.5 (iPhone; iOS 14.2; Scale/3.00)'

if ($.isNode()) {
  if (process.env.JUKAN_COOKIE && process.env.JUKAN_COOKIE.indexOf('&') > -1) {
  JKCookie = process.env.JUKAN_COOKIE.split('&');
  }
 if (process.env.JUKAN_COOKIE && process.env.JUKAN_COOKIE.indexOf('\n') > -1) {
  JKCookie = process.env.JUKAN_COOKIE.split('\n');
  } else {
  JKCookie = process.env.JUKAN_COOKIE.split()
  }
  if (process.env.JUKAN_BODY && process.env.JUKAN_BODY.indexOf('&') > -1) {
  JKbody = process.env.JUKAN_BODY.split('&');
  }
 if (process.env.JUKAN_BODY && process.env.JUKAN_BODY.indexOf('\n') > -1) {
  JKbody = process.env.JUKAN_BODY.split('\n');
  } else {
  JKbody = process.env.JUKAN_BODY.split()
  }
  Object.keys(JKCookie).forEach((item) => {
        if (JKCookie[item]) {
          CookieArr.push(JKCookie[item])
        } 
    })
  Object.keys(JKbody).forEach((item) => {
        if (JKbody[item]) {
          BodyArr.push(JKbody[item])
        } 
    })
} else if (cookie.indexOf('&')>-1 &&bodys.indexOf('&')>-1){
 Object.keys(cookie.split('&')).forEach((item) => {
      CookieArr.push(cookie.split('&')[item])
    })
  Object.keys(bodys.split('&')).forEach((item) => {
      BodyArr.push(bodys.split('&')[item])
    })
} else {
   CookieArr.push(cookie)
   BodyArr.push(bodys)
}

if ($.isNode()) {
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}

if (typeof $request !== 'undefined') {
   if ($request && $request.method != `OPTIONS`) {
     const  bodyVal = $request.body
     const Cookieval = $request.headers['Cookie']
   if(Cookieval)$.setdata(Cookieval,'jukan_ck')
   if(bodyVal)$.setdata(bodyVal,'jukan_body')
     $.log(`Cookie:${Cookieval}`)
     $.log(`bodyVal:${bodyVal}`)
     $.msg($.name,"获取Cookie成功")
     $.done()
   }
} else {
!(async() => {
  if (!CookieArr[0]) {
    console.log($.name, '【提示】请把聚看点Cookie填入Github 的 Secrets 中，请以&或者换行隔开')
    return;
  }
  console.log(`您共提供${CookieArr.length}个聚看点账号Cookie`)
  for (let i = 0; i < CookieArr.length; i++) {
    if (CookieArr[i]) {
      cookieval = CookieArr[i]
      bodyval = BodyArr[i]
      ID =  decodeURIComponent(bodyval).match(/"openid" : "\w+"/)
      apptoken = decodeURIComponent(bodyval).match(/"apptoken" : "\w+"/)
      bodys = [bodyval,bodyval.replace(/time%22%20%3A%20%22\d+/, 'cateid%22%20:%20%2253')]
      $.index = i + 1;
      await getsign();
      await signShare();
 for (readbodyVal of bodys){
      await artList(readbodyVal)
   }
      await Stimulate("17")
   for( boxtype of [1,2]){
      await $.wait(1000)
      await BoxProfit(boxtype)
    }
      await userinfo()
  }
 } 
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}
//签到
function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url:  `https://www.xiaodouzhuan.cn/jkd/user/usersign.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: bodyval
      }
   $.post(signurl, async(error, response, data) => {
     let get_sign = JSON.parse(data)
      //$.log(data)
     if (get_sign.ret == "ok"){
         $.sub = `签到成功🎉`
         $.desc = `签到收益: +${get_sign.todaySignProfit}${get_sign.todaySignProfitType}💰，明日 +${get_sign.tomorrowSignProfit}${get_sign.tomorrowSignProfitType} 已签到 ${get_sign.signDays} 天\n` ;
           await invite()
         }  
     else if (get_sign.rtn_code == "R-ART-0008"){
         $.sub =  get_sign.rtn_msg
         $.desc = ``
         $.log($.sub)
         }
     else {
         $.sub = `签到失败❌`
         $.desc = `说明: `+ get_sign.rtn_msg
         $.msg($.name,$.sub,$.desc)
         $.done()
         }
     resolve()
    })
  })
}

function signShare() {
  return new Promise((resolve, reject) =>{
   let profiturl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/account/signShareAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: bodyval
      }
   $.post(profiturl, async(error, resp, data) => {
     //$.log(data+"\n")
     let sign_share = JSON.parse(data)
     if (sign_share.ret == "ok"){
       $.log("签到分享收益: +"+sign_share.profit)
        await Stimulate("23")
         }  else {
       $.log(sign_share.rtn_msg)
     }
       resolve()
    })
  })
}


function userinfo() {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url:  `https://www.xiaodouzhuan.cn/jkd/newMobileMenu/infoMe.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: bodyval
      }
   $.post(infourl, async(error, resp, data) => {
     let get_info = JSON.parse(data)
      if( get_info.ret=="ok"){
       userName = get_info.userinfo.username
       sumcash = get_info.userinfo.infoMeSumCashItem.title+get_info.userinfo.infoMeCurCashItem.value
       curcash = get_info.userinfo.infoMeCurCashItem.title+get_info.userinfo.infoMeCurCashItem.value
       gold = get_info.userinfo.infoMeGoldItem.title+": "+get_info.userinfo.infoMeGoldItem.value
    $.log("昵称:"+userName+"  "+gold +"\n"+sumcash + "/"+curcash )
     $.sub += " "+gold
     $.desc += sumcash + "/"+curcash 
     $.msg($.name+" 昵称:"+userName, $.sub, $.desc+"\n")
     }
     resolve()
    })
  })
}
function artList(readbodyVal) {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/newmobile/artlist.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: readbodyVal
      }
   $.post(infourl, async(error, resp, data) => {
     let get_list = JSON.parse(data)
      //$.log( data)
         $.log("【开始自动阅读】")
     if (get_list.ret == "ok"){
       for( lists of get_list.artlist){
          if(lists.item_type=="article"){
          art_Title = lists.art_title
          artid =lists.art_id
          screen_Name = lists.screen_name
          $.log("正在阅读文章: "+art_Title +"  -------- <"+screen_Name +">\n ")
         await readTask(lists.art_id,"1")
          }
         if(lists.item_type=="video"){
          art_Title = lists.art_title
          artid =lists.art_id
          arttype = "2"
          screen_Name = lists.screen_name
         $.log("正在观看视频: "+art_Title +"  -------- <"+screen_Name +">\n ")
          await readTask(lists.art_id,"2")
          }
        if(taskresult  == `R-ART-1002`|| taskresult ==`R-ART-0011`){
         break 
          }
         }
       }  
      resolve()
    })
  })
}


function readTask(artid,arttype) {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/newmobile/artDetail.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: `jsondata={"appid":"xzwl","channel":"IOS","relate":1,"artid":"${artid}","os":"IOS",${ID},${apptoken},"appversion":"5.6.5"}`
      }
   $.post(rewurl, async(error, resp, data) => {
     //$.log(data)
     if(resp.statusCode ==200){
         await $.wait(31000) 
         await finishTask(artid,arttype)
       } else {
        $.log("阅读失败: "+data)
      }
       resolve()
    })
  })
}

function finishTask(artid,arttype) {
  return new Promise((resolve, reject) =>{
   let finishurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/account/readAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},      body: `jsondata={"read_weal":"0","appid":"xzwl","paytype":${arttype},"channel":"IOS",${apptoken},"appversion":"5.6.5",${ID},"os":"iOS","artid":"${artid}","readmodel":"1"}`
      }
   $.post(finishurl, async(error, response, data) => {
     $.log(data+"\n")
     let do_read = JSON.parse(data)
          taskresult = do_read.rtn_code
     if (do_read.ret == "ok"){
       $.log("获得收益: +"+do_read.profit +"\n")
         }  
       resolve()
    })
  })
}

//激励视频
function Stimulate(position) {
  return new Promise((resolve, reject) =>{
   let stimurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/account/stimulateAdvAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},      
      body: `jsondata={"read_weal":"0","appid":"xzwl", "position" : ${position},${apptoken},"appversion":"5.6.5",${ID},"os":"iOS","channel":"iOS"}`
      }
   $.post(stimurl, async(error, response, data) => {
     //$.log(data+"\n")
     let do_stim = JSON.parse(data)
     if ( do_stim.ret == "ok"){
          $.log( do_stim.profit_title+": +"+ do_stim.profit +"(以实际情况为准)")
         }  
       resolve()
    })
  })
}

function BoxProfit() {
  return new Promise((resolve, reject) =>{
   let profiturl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/task/getTaskBoxProfit.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: `box_type=${boxtype}`
      }
      $.log(boxtype)
      $.log(cookieval)
   $.post(profiturl, async(error, resp, data) => {
     //$.log(data+"\n")
     let do_box = JSON.parse(data)
     if (do_box.ret == "ok"&&do_box.profit>0){
       $.log("获得收益: +"+do_box.profit)
          position = do_box.advertPopup.position
          await Stimulate(position)
          $.log(position)
         }  
       else if (do_box.rtn_code=='TAS-A-1'){
         $.log("计时金币"+do_box.rtn_msg)
        }
       resolve()
    })
  })
}


function invite() {
   let rewurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/member/receiveMonkeyXd.action?userid=f99d2227a3be4a1599e936e0522537ac`,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, (error, response, data) => {
  })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
