/*
更新时间:10-09 20:05
本脚本为京东旗下京喜app签到脚本
本脚本使用京东公共Cooike，支持双账号，获取方法请查看NobyDa大佬脚本说明

[task_local]
0 9 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/jingxi.js

~~~~~~~~~~~~~~~~
[MITM]
hostname = wq.jd.com
~~~~~~~~~~~~~~~~
*/

const $ = new Env('京喜');
let cookiesArr = [], cookie = '', signresult,todaypoint = 0;
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
} else {
  cookiesArr.push($.getdata('CookieJD'));
  cookiesArr.push($.getdata('CookieJD2'))
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      UserName = decodeURIComponent(cookie.match(/pt_pin=(\w+)/) && cookie.match(/pt_pin=(\w+)/)[1])
      $.index = i + 1;
      console.log(`\n开始【京东账号${$.index}】${UserName}\n`);
      await getsign();
      await Tasklist();
      await doublesign();
      await coininfo();
      await showmsg();
    if ($.isNode()){
       await notify.sendNotify($.name + " 账号昵称:" + nickname, $.sub+`\n`+$.desc)
         }
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function getsign() {
  return new Promise((resolve) => {
    const signurl = {
      url: 'https://wq.jd.com/pgcenter/sign/UserSignOpr?g_login_type=1',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://wqsh.jd.com/pingou/taskcenter/index.html"
      },
    }
    $.get(signurl, (err, resp, data) => {
      signres = JSON.parse(data)
      if (signres.retCode == '0') {
        nickname = signres.data.nickname
        totalpoints = signres.data.pgAmountTotal
        signdays = "已签" + signres.data.signDays + "天"
        if (signres.data.signStatus == 0) {
          signresult = "签到成功"
          signdays += " 今日获得" + data.match(/[0-9]+/g)[4] + "积分"

        } else if (signres.data.signStatus == 1) {
          signresult = "签到重复"
        }
      } else if (signres.retCode == '30003') {
        $.msg($.name, '【提示】京东cookie已失效,请重新登录获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
      }
      resolve()
    })
  })
}

function coininfo() {
  return new Promise((resolve, reject) => {
    const coinurl = {
      url: "https://wq.jd.com/pgcenter/sign/QueryPGDetail?sceneval=2",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://jddx.jd.com/m/jddnew/money/index.html"
      }
    }
    $.get(coinurl, (err, resp, data) => {
      let coindata = JSON.parse(data),
          localetime = new Date(new Date().toLocaleDateString()).getTime()/1000,
          item = coindata.data.list;
           daytotal = Number();
        var i = 0;
        for(i=0;i<item.length && item[i].time>=localetime;i++){
            if (item[i].activeId === '10000'){
             todaypoint = item[i].accountValue
            };
            if (item[i].activeId ==='30000'){
             daytotal += item[i].accountValue
           };
          }
       resolve()
     })
  })
}

function Tasklist(taskid) {
  return new Promise( (resolve) => {
    const url = {
      url: 'https://m.jingxi.com/pgcenter/task/QueryPgTaskCfgByType?&taskType=3',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://st.jingxi.com/pingou/task_center/task/index.html?jxsid="
      },
    }
    $.get(url, async (err, resp, data) => {
      totaskres = JSON.parse(data)
      var item = totaskres.data.tasks;
      let taskArr = [];
      for (task of item) {
        taskArr.push(task.taskId);
        await dotask(task.taskId);
        await taskFinish(task.taskId);
       }
      resolve()
    })
  })
}

function dotask(id) {
  return new Promise((resolve) => {
    const url = {
      url: `https://m.jingxi.com/pgcenter/task/drawUserTask?sceneval=2&taskid=${id}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://st.jingxi.com/pingou/task_center/task/index.html?jxsid="
      }
    }
    $.get(url, (err, resp, data) => {
      const task = JSON.parse(data)
     //console.log(task)
      resolve()
    })
  })
}
function taskFinish(taskId) {
  return new Promise((resolve) => {
    const url = {
      url: `https://m.jingxi.com/pgcenter/task/UserTaskFinish?sceneval=2&taskid=${taskId}&sceneval=2&g_login_type=1&g_ty=ls`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://st.jingxi.com/pingou/task_center/task/index.html?jxsid="
      }
    }
    $.get(url, (err, resp, data) => {
      const task = JSON.parse(data)
      //console.log(task)
      resolve()
    })
  })
}
function doublesign() {
  return new Promise((resolve) => {
    const doubleurl = {
      url: 'https://m.jingxi.com/double_sign/IssueReward?sceneval=2&g_login_type=1&g_ty=ajax',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://st.jingxi.com/pingou/jxapp_double_signin/index.html?ptag=139037.2.1"
      }
    }
    $.get(doubleurl, (err, resp, data) => {
      doub = JSON.parse(data)
      if (doub.retCode == 0) {
        doubleres = " 双签成功 🧧+ " + doub.data.jd_amount / 100 + "元";
        $.log($.name + "" + doubleres)
      }
      resolve()
    })
  })
}

function showmsg() {
  return new Promise((resolve) => {
 if(signresult){
    $.sub = "积分总计:" + totalpoints+" " + signresult
    $.desc = signdays +doubleres+ '\n' + "今日签到得" + todaypoint + "个金币 共计" +  (daytotal+todaypoint)+'个金币'
    $.msg($.name + " 账号昵称:" + nickname, $.sub, $.desc)
     }
   resolve()
  })
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}