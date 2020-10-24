
/*
更新时间: 2020-10-13 21:21
赞赏:电视家邀请码`893988`,农妇山泉 -> 有点咸，万分感谢
本脚本仅适用于电视家签到，支持Actions多账号运行，请用'#'或者换行隔开‼️
获取Cookie方法:
1.将下方[rewrite_local]和[Task]地址复制的相应的区域，无需添加 hostname，每日7点、12点、20点各运行一次，其他随意
2.APP登陆账号后，点击菜单栏'领现金',即可获取Cookie，进入提现页面，点击随机金额，可获取提现地址!!
3.非专业人士制作，欢迎各位大佬提出宝贵意见和指导
By Facsuny
感谢 chavyleung 等
~~~~~~~~~~~~~~~~~~~~
loon 2.10+ :
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家

http-request http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js, timeout=10, tag=电视家
~~~~~~~~~~~~~~~~~~~~~
# 获取电视家 Cookie.
Surge 4.0
[Script]
电视家 = type=cron,cronexp=0 8 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js,script-update-interval=0

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

电视家 = type=http-request,pattern=http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
~~~~~~~~~~~~~~~~~~

QX 1.0.6+ :
[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

[rewrite_local]
http:\/\/api\.gaoqingdianshi\.com\/api\/v\d\/sign\/signin url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js

http:\/\/api\.gaoqingdianshi\.com\/api\/v2\/cash\/withdrawal url script-request-header https://raw.githubusercontent.com/Sunert/Scripts/master/Task/dianshijia.js
~~~~~~~~~~~~~~~~~

*/
const walkstep = '20000';//每日步数设置，可设置0-20000
const gametimes = "1999";  //游戏时长
const logs = 0   //响应日志开关,默认关闭
const $ = new Env('电视家')
const notify = $.isNode() ? require('./sendNotify') : '';
let sleeping = "",detail=``,subTitle=``;
const dianshijia_API = 'http://api.gaoqingdianshi.com/api'
let tokenArr = [], DsjurlArr = [], DrawalArr = [],drawalVal;
if ($.isNode()) {
  if (process.env.DSJ_HEADERS && process.env.DSJ_HEADERS.indexOf('#') > -1) {
  Dsjheaders = process.env.DSJ_HEADERS.split('#');
  console.log(`您选择的是用"#"隔开\n`)
  }
  else if (process.env.DSJ_HEADERS && process.env.DSJ_HEADERS.indexOf('\n') > -1) {
  Dsjheaders = process.env.DSJ_HEADERS.split('\n');
  console.log(`您选择的是用换行隔开\n`)
  } else {
      Dsjheaders = process.env.DSJ_HEADERS.split()
  };

  if (process.env.DSJ_DRAWAL && process.env.DSJ_DRAWAL.indexOf('#') > -1) {
      Drawals = process.env.DSJ_DRAWAL.split('#');
  }
  else if (process.env.DSJ_DRAWAL && process.env.DSJ_DRAWAL.indexOf('\n') > -1) {
      Drawals = process.env.DSJ_DRAWAL.split('\n');
  } else {
      Drawals = process.env.DSJ_DRAWAL.split()
  };
  Object.keys(Dsjheaders).forEach((item) => {
        if (Dsjheaders[item]) {
          tokenArr.push(Dsjheaders[item])
        }
    });
    Object.keys(Drawals).forEach((item) => {
        if (Drawals[item]) {
          DrawalArr.push(Drawals[item])
        }
    });
    console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
    console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
 } else {
    tokenArr.push($.getdata('sy_signheader_dsj'))
    DrawalArr.push($.getdata('drawal_dsj'))
 }
 
if (isGetCookie = typeof $request !== 'undefined') {
   GetCookie();
   $.done()
} 
  
 !(async () => {
  if (!tokenArr[0]) {
    $.msg($.name, '【提示】请先获取电视家一cookie')
    return;
  }
    console.log(`------------- 共${tokenArr.length}个账号\n`)
  for (let i = 0; i < tokenArr.length; i++) {
    if (tokenArr[i]) {
      signheaderVal = tokenArr[i];
      drawalVal = DrawalArr[i];
      $.index = i + 1;
      console.log(`开始【电视家${$.index}】`)
  await signin();     // 签到
  await signinfo();   // 签到信息
  if (drawalVal != undefined){
  await Withdrawal()
   } else {
       detail += `【金额提现】❌ 请获取提现地址 \n`
  };// 金额提现
  await run();
  await tasks(); // 任务状态
  await getGametime();// 游戏时长
  await total();      // 总计
  await cash();       // 现金
  await cashlist();   // 现金列表
  await coinlist();   // 金币列表
  if ($.isNode()&& process.env.DSJ_NOTIFY_CONTROL == false) {
       await notify.sendNotify($.name, subTitle+'\n'+ detail)
     }
    }
   }
  })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
    
function GetCookie() {
 if ($request && $request.method != 'OPTIONS'&&$request.url.match(/\/sign\/signin/)) {
  const signheaderVal = JSON.stringify($request.headers)
  $.log(`signheaderVal:${signheaderVal}`)
  if (signheaderVal) $.setdata(signheaderVal, 'sy_signheader_dsj')
  $.msg($.name, `获取Cookie: 成功`, ``)
  }
 else if ($request && $request.method != 'OPTIONS'&&$request.url.match(/\/cash\/withdrawal/)) {
  const drawalVal = $request.url
  $.log(`drawalVal:${drawalVal}`)
  if (drawalVal) $.setdata(drawalVal, 'drawal_dsj')
  $.msg($.name, `获取提现地址: 成功`, ``)
  }
}
async function run() { 
 if ($.isNode()) {
      if ($.time('HH')>11){
       await sleep();
       await CarveUp();
    }
   else if($.time('HH') > 3&&$.time('HH') <5){
       await getCUpcoin();
       await walk();
    }
   else if($.time('HH') > 22 ){
       await wakeup()
    }
 }
  else {
   if ($.time('HH')>17){
       await sleep();
       await CarveUp();
    }
   else if($.time('HH') > 11&&$.time('HH') <14){
       await getCUpcoin();
       await walk();
    }
   else if($.time('HH') > 6&&$.time('HH') <9){
       await wakeup()
    }
  }
}
   
function signin() {      
   return new Promise((resolve, reject) =>
     {
      $.get({url: `${dianshijia_API}/v5/sign/signin?accelerate=0&ext=0&ticket=`, headers: JSON.parse(signheaderVal)}, async(error, response, data) =>
       {
      if(logs)$.log(`${$.name}, 签到结果: ${data}\n`)
      let result = JSON.parse(data)
      if  (result.errCode == 0) 
          { signinres = `签到成功 `
            var h = result.data.reward.length
          if (h>1){
            detail = `【签到收益】`+signinres+`${result.data.reward[0].count}金币，奖励${result.data.reward[1].name} `
           }else
             {detail = `【签到收益】`+signinres+`+${result.data.reward[0].count}金币 `
             }
           }
    else if  (result.errCode == 4)
           {
            detail = `【签到结果】 重复 🔁 `
           }       
    else if  (result.errCode == 6)
           {
            subTitle = `【签到结果】 失败`
            detail = `原因: ${result.msg}`
         if ($.isNode()) {
             await   notify.sendNotify($.name,subTitle+'\n'+detail)
            }
            return
           }  
       resolve()
       })
    })
}

function signinfo() {
  return new Promise((resolve, reject) => {
     $.get({ url: `${dianshijia_API}/v4/sign/get`, headers: JSON.parse(signheaderVal)}, (error, response, data) => 
  {
   if(logs)$.log(`${$.name}, 签到信息: ${data}\n`)
     let result = JSON.parse(data)
     if (result.errCode == 0) 
    {
     var d = `${result.data.currentDay}`
     for (i=0; i < result.data.recentDays.length;i++)      
        {
       if (d == result.data.recentDays[i].day)
          {detail += ` 连续签到${d}天\n`
             }
           }  
        resolve()
        }
    })
  })
}             

function total() {
 return new Promise((resolve, reject) => {
   $.get({url: `${dianshijia_API}/coin/info`, headers: JSON.parse(signheaderVal)}, (error, response, data) => {
     if(logs)$.log(`${$.name}, 总计: ${data}\n`)
     let result = JSON.parse(data)
     subTitle = `待兑换金币: ${result.data.coin} ` 
   try{
      if(result.data.tempCoin){
       for (i=0;i<result.data.tempCoin.length;i++) {  
      coinid = result.data.tempCoin[i].id
      $.get({ url: `http://api.gaoqingdianshi.com/api/coin/temp/exchange?id=`+coinid, headers: JSON.parse(signheaderVal)}, (error, response, data))    
        }
       }
      }
     catch(err){
      console.log(err) }
    resolve()
     })
  }) 
}
function cash() {
  return new Promise((resolve, reject) => {
    $.get({ url: `${dianshijia_API}/cash/info`, headers: JSON.parse(signheaderVal)}, (error, response, data) => 
      {
      if(logs)$.log(`现金: ${data}\n`)
      let cashresult = JSON.parse(data)
      subTitle += '现金:'+ cashresult.data.amount/100+'元 额度:'+cashresult.data.withdrawalQuota/100+'元'
      cashtotal = cashresult.data.totalWithdrawn/100
       resolve()
      })
   })
}
function cashlist() {
  return new Promise((resolve, reject) => {
    $.get({ url: `${dianshijia_API}/cash/detail`, 
     headers: JSON.parse(signheaderVal)}, (error, response, data) => {
      const result = JSON.parse(data)
       let  totalcash = Number(),cashres = ""
       var time = new Date(new Date(new Date().toLocaleDateString()).getTime())/1000
  try{
     if (result.errCode == 0) {
    for (i=0;i<result.data.length;i++){
 if
(result.data[i].type==2&&result.data[i].ctime>=time){
      cashres = `✅ 今日提现:`+result.data[i].amount/100+`元 `
        } 
      }
    if(cashres&&cashtotal){
      detail += `【提现结果】`+cashres+`共计提现:`+cashtotal+`元\n`
     }
     else if(cashtotal){
      detail += `【提现结果】今日未提现 共计提现:`+cashtotal+`元\n`
    }
   }
  }
 catch (error){
       console.log(`提现列表失败，可忽略: ${data}`)
    }
   resolve()
    })
  })
}
function tasks(tkcode) {
 return new Promise(async (resolve, reject) => {  
  let taskcode = ['1M005','1M002','playTask','SpWatchVideo','Mobilewatchvideo','MutilPlatformActive']
   for(code of taskcode){
      await dotask(code)
    }
  resolve()
 })
}
function dotask(code) {
 return new Promise((resolve, reject) => {  
    $.get({ url: `${dianshijia_API}/v4/task/complete?code=${code}`, headers: JSON.parse(signheaderVal)}, (error, response, data) => {
       taskres = JSON.parse(data)
   if (taskres.errCode==0){
     console.log('任务代码:'+code+'，获得金币:'+taskres.data.getCoin)
       if (code== 'playTask'&&taskres.data.doneStatus == 3) {
       detail += `【播放任务】🔕 完成/共计 `+taskres.data.dayCompCount+`/`+taskres.data.dayDoCountMax+` 次\n`
        } 
       }
  if (taskres.errCode==4000){
     //console.log('任务代码:'+code+'，'+taskres.msg)
       }
     })
     resolve()
  })
}

function walk() {
  return new Promise((resolve, reject) => {
    let url = { url: `${dianshijia_API}/taskext/getWalk?step=${walkstep}`, headers: JSON.parse(signheaderVal)}
   $.get(url, (error, response, data) => 
      {
      if(logs)$.log(`走路任务: ${data}\n`)
      const result = JSON.parse(data)
       if (result.data.unGetCoin>10){
      $.get({ url: `${dianshijia_API}/taskext/getCoin?code=walk&coin=${result.data.unGetCoin}&ext=1`, headers: JSON.parse(signheaderVal)}, (error, response, data) => 
      {
      })
     }
    resolve()
     })
  })
}

function sleep() {
  return new Promise((resolve, reject) => {
    let url = { url: `${dianshijia_API}/taskext/getSleep?ext=1`, headers: JSON.parse(signheaderVal)}
     $.get(url, (error, response, data) => {
  try {
      if(logs)$.log(`睡觉任务: ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode==0){
      sleeping = result.data.name+'报名成功 🛌'
      }
else if (result.errCode==4006){
      sleeping = '睡觉中😴'
      }
else {
      sleeping = ''
    }
    }
 catch (e) {
        $.msg($.name, `睡觉结果: 失败`, `说明: ${e}`)}
    resolve()
   })
 })
}

function wakeup() {
  return new Promise((resolve, reject) => {
    let url = { url: `${dianshijia_API}/taskext/getCoin?code=sleep&coin=1910&ext=1`, 
    headers: JSON.parse(signheaderVal)}
   $.get(url, (error, response, data) => {
      if(logs)$.log(`睡觉打卡: ${data}\n`)
   })
resolve()
 })
}


function coinlist() {
 return new Promise((resolve, reject) => {
    setTimeout(() =>  {
   let url = { url: `${dianshijia_API}/coin/detail`, 
    headers: JSON.parse(signheaderVal)}
   $.get(url, (error, response, data) => {
    //console.log(`金币列表: ${data}`)
      let  result = JSON.parse(data)
      let onlamount =  0, vdamount = 0,
          gamestime = 0, todaysign = 0;
   var time = new Date(new Date(new Date().toLocaleDateString()).getTime())/1000
  try {
    for (i=0;i<result.data.length && result.data[i].ctime >= time;i++){
     if (result.data[i].from=="领取走路金币"){
      detail += `【走路任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="领取睡觉金币"){
      detail += `【睡觉任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="手机分享"){
      detail += `【分享任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="双端活跃"){
      detail += `【双端活跃】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="播放任务"){
      detail += `【播放任务】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="领取瓜分金币"){
      detail += `【瓜分金币】✅ 获得金币`+result.data[i].amount+'\n'
      }
     if (result.data[i].from=="游戏时长奖励"){
      gamestime += result.data[i].amount
      }
     if (result.data[i].from =="激励视频"){
      vdamount += result.data[i].amount
     }
     if (result.data[i].from=="手机在线"){
      onlamount += result.data[i].amount
      }
     if (result.data[i].from=="签到"){
      todaysign += result.data[i].amount
      }
   }
   if(todaysign){
    detail += `【每日签到】✅ 获得金币`+todaysign+'\n'
   }
   if(vdamount){
    detail += `【激励视频】✅ 获得金币`+vdamount+'\n'
   }
   if(onlamount){
    detail += `【手机在线】✅ 获得金币`+onlamount+'\n'
   }
   if(gamestime){
   detail += `【游戏时长】✅ 获得金币`+gamestime+'\n'
   }
   if(i>0){
   detail += `【任务统计】共完成${i+1}次任务🌷`
   }
   $.msg($.name+`  `+sleeping, subTitle, detail)
    resolve()
  } catch(error) {
   console.log(`获取任务金币列表失败，错误代码${error}+ \n响应数据:${data}`)
     $.msg($.name+`  `+sleeping, subTitle, detail)
      resolve()
     }
    })
   },1000)
 })
}

function CarveUp() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `${dianshijia_API}/v2/taskext/getCarveUp?ext=1`, 
     headers: JSON.parse(signheaderVal),
   }
    $.get(url, (error, response, data) => {
      if(logs)$.log(`瓜分百万金币: ${data}`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      detail += `【金币瓜分】✅ 报名成功\n`
    } 
   })
resolve()
 })
}
function getCUpcoin() {
  return new Promise((resolve, reject) => {
    $.get({ url: `${dianshijia_API}/taskext/getCoin?code=carveUp&coin=0&ext=1`, headers: JSON.parse(signheaderVal)}, (error, response, data) => {
   if(logs) $.log(`瓜分百万金币: ${data}`)
   })
   resolve()
 })
}
function Withdrawal() {
  return new Promise((resolve, reject) => {
    $.get({url: drawalVal, headers: JSON.parse(signheaderVal)}, (error, response, data) => {
    if(logs)$.log(`金币随机兑换 : ${data}\n`)
      const result = JSON.parse(data)
     if (result.errCode == 0) {
      detail += `【金额提现】✅ 到账`+result.data.price/100+`元 🌷\n`
    } 
    resolve()
   })
 })
}
function getGametime() {
  return new Promise((resolve, reject) => {
    let url = { 
     url: `${dianshijia_API}/v4/task/complete?code=gameTime&time=${gametimes}`, 
     headers: JSON.parse(signheaderVal),
   }
    $.get(url, (error, response, data) => {
    if(logs)$.log(`游戏时长: ${data}\n`)
   })
resolve()
 })
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
