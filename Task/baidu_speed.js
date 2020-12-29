/*
百度极速版签到任务

本脚本默认使用chavyleung大佬和Nobyda的贴吧ck，获取方法请看大佬仓库说明

~~~~~~~~~~~~~~~~

*/
const $ = new Env('百度极速版')

let CookieArr = [];

if ($.isNode()) {
  if (process.env.BAIDU_COOKIE && process.env.BAIDU_COOKIE.indexOf('&') > -1) {
  StartBody = process.env.BAIDU_COOKIE.split('&');
  }
 if (process.env.BAIDU_COOKIE && process.env.BAIDU_COOKIE.indexOf('\n') > -1) {
  BDCookie = process.env.BAIDU_COOKIE.split('\n');
  } else {
  BDCookie = process.env.BAIDU_COOKIE.split()
  }
  Object.keys(BDCookie).forEach((item) => {
        if (BDCookie[item]) {
          CookieArr.push(BDCookie[item])
        } 
    })
} else {
 CookieArr.push($.getdata(`chavy_cookie_tieba`)||$.getdata(`CookieTB`))
}
if ($.isNode()) {
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}

!(async() => {
  if (!CookieArr[0]) {
    console.log($.name, '【提示】请把百度Cookie填入Github 的 Secrets 中，请以&或者换行隔开')
    return;
  }
  console.log(`您共提供${CookieArr.length}个百度账号Cookie`)
  for (let i = 0; i < CookieArr.length; i++) {
    if (CookieArr[i]) {
      cookieval = CookieArr[i];
      $.index = i + 1;
      await getsign();
      await coinInfo();
      await firstbox();
      await TaskCenter()
      await getRewards();
     //await drawPrize();
  }
 } 
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//签到
function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url:  `https://haokan.baidu.com/activity/acusercheckin/update`,
      headers: {Cookie:cookieval},
      body: 'productid=2&ugus=9766888061'
      }
   $.post(signurl, (error, response, data) => {
     let get_sign = JSON.parse(data)
     if (get_sign.errno == 0){
         $.sub = get_sign.data.tips+`🎉`
         $.desc = `签到收益: ${get_sign.data.bonus.coin}💰，`  
         }  
     else if (get_sign.errno == 10053){
         $.sub =  get_sign.msg
          $.desc = ``
         }
     else {
         $.sub = `签到失败❌`
         $.desc = `说明: `+ get_sign.msg
         $.msg($.name,$.sub,$.desc)
         return
         }
     resolve()
    })
  })
}

function coinInfo() {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url: `https://haokan.baidu.com/activity/h5/displaybyday?type=1&page=1&productid=2`,
      headers: {Cookie:cookieval}
      }
   $.get(infourl, (error, response, data) => {
     let get_info = JSON.parse(data)
     if (get_info.errno == 0){
         $.sub += ' 今日收益: ' + get_info.data.datalist.data[0].desc
         }  
      resolve()
    })
  })
}

function getRewards() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/tasks/taskreward?productid=2`,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, async(error, response, data) => {
     let get_reward = JSON.parse(data)
     if (get_reward.errno == 0&&get_reward.data.coin!==0){
         $.desc += '获得总收益: +' + get_reward.data.coin
         await invite()
         }  
       resolve()
    })
  })
}

function invite() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/h5/vault?productid=2&inviteCode=WKQLC6&pkg=%5Bpkg%5D `,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, (error, response, data) => {
   //  let get_reward = JSON.parse(data)
      resolve()
    })
  })
}


function TaskCenter() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/h5/vault?_format=json&productid=2&channel=2`,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl, async(error, resp, data) => {
  try{
     let get_tasks = JSON.parse(data)
      //$.log("获取任务数据"+data)
       tasks = get_tasks.data.comps
      for ( x in tasks){
         //taskid = tasks[x].taskId
         id = tasks[x].id
        if(id == 962){
         for (jingangs  of  tasks[x].data.jingang_list_ios ){
         if(jingangs.jingangType==2){
          tid = jingangs.jingangTid
          taskName = '【'+jingangs.jingangName+'】'
          RefererUrl = jingangs.jingangUrl
        $.log(taskName+"tid:"+tid)
        if ($.isNode()){
           await $.wait(1000)
           await get_pkg();
          } 
else if(tasks[x].data.countDown[tid].countDown ==0){
           await $.wait(1000)
           await get_pkg();
          } else {
           $.log( "  请等待"+Number(tasks[x].data.countDown[tid].countDown/60).toFixed(2)+"分钟")
           }
          }
         }
        } else {
       let taskArr = tasks[x].data.tasklist
         for (y in taskArr){
          tid = taskArr[y].id
          taskName = "【"+taskArr[y].title+"】"
           $.log(taskName+" tid:"+tid)
          if (taskArr[y].taskStatus==1 ){
            $.log(taskName +" 已完成" )
            $.desc += taskName +" 已完成"
           }else if(taskArr[y].type == 'openApp'){
            RefererUrl = taskArr[y].adLink
            await get_pkg()
           } else if(taskArr[y].type == 'watch'){
            // $.log(tasklists.+'\n')
             cmd = tid==346 ? 100:184
             await get_search()
           };
          }
         }
       }
      } catch(e){
        $.logErr(e, resp);
      } finally {
 $.msg($.name, $.sub, $.desc)
        resolve()
      }
    })
  })
}

//首页宝箱
function firstbox() {
  return new Promise((resolve, reject) =>{
   let bdurl =  {
      url: 'https://mbrowser.baidu.com/lite/gold/receive?service=bdbox',
      headers: {Cookie:cookieval},
     body: 'task_type=-1&task_id=-1'
}
   $.post(bdurl, (error, response, data) => {
     let get_first = JSON.parse(data)
     //$.log("【首页宝箱】\n"+data +'\n')
     if (get_first.err_no == 0){
         $.desc += "【首页宝箱】"+ get_first.data.result.tips +"， "+get_first.data.result.countdown_time+"秒后再次开启宝箱\n"
         }  
      else if (get_first.err_no == 10079){
         $.desc +=  "【首页宝箱】"+ get_first.tip+'\n'
       }  
      else if (get_first.err_no == 10060){
         $.desc +=  get_first.tip+'\n'
       }
       //$.msg($.name, $.sub, $.desc)
     resolve()
    })
  })
}



//视频
function get_pkg() {
  return new Promise((resolve, reject) =>{
   let pkgurl =  {
      url: `https://haokan.baidu.com/activity/acad/rewardad?device=%7B%22imei_md5%22%3A%22%22%2C%22device_type%22%3A1%2C%22model%22%3A%22IPHONE%22%2C%22manufacturer%22%3A%22Apple%22%2C%22os_version%22%3A%2213.7%22%2C%22idfa%22%3A%22_a2S8_aq28_qa28qii2A8laJ28gxC28Q_iXni0uKvNYIPviVzaHtiYah2ul6iHim_l2880uQvflqisa9liBgIgarv8oIOHutlhSPu_ux2a_Wi-uRz_qAC%22%2C%22androidId%22%3A%22%22%2C%22geo%22%3A%7B%22lat%22%3A%22%22%2C%22lon%22%3A%22%22%7D%2C%22screen_width%22%3A1242%2C%22screen_height%22%3A2208%7D&network=%7B%22connect_type%22%3A1%2C%22carrier%22%3A0%7D&productid=2&tid=${tid}&type=1`,
      headers:{Cookie:cookieval,'Referer':RefererUrl}
      }
   $.get(pkgurl, async(error, resp, data) => {
     let get_pkg = JSON.parse(data)
       // $.log("数据: "+data+'\n')
     if (get_pkg.errno == 0&&get_pkg.data.isDone ==0){
       Pkg = get_pkg.data.adInfo[0].material.pkg
       taskid = get_pkg.data.taskPf.taskId;
        //$.log("\n"+taskid +" "+ Pkg)
       await activeBox()
       }  
    else if (get_pkg.errno == 0&&get_pkg.data.isDone ==1){
        $.desc += taskName +" 已完成\n"
        $.log(taskName +" 已完成\n")
       } 
      resolve()
    })
  })
}
//缩减开宝箱时间
function chestTime() {
  return new Promise((resolve, reject) =>{
   let timeurl =  {
      url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=chestTime&rewardVideoPkg=${Pkg}`,
      headers: {Cookie:cookieval,Referer: `https://eopa.baidu.com/page/pagekey-qWYNoPr0?type=1&tid=695&productid=2&chesttid=669&chestname=chestTime`}
      }
   $.get(timeurl, (error, response, data) => {
     let get_chest = JSON.parse(data)
$.log(data)
     if (get_chest.errno == 11006){
         $.log("开宝箱任务"+get_chest.errmsg)
         }  
       else if (get_chest.errno == 0){
         $.log("开宝箱时间缩减"+get_chest.data.awardTime/60+"分钟")
         }  
      else if (get_chest.errno == 19001&&get_chest.data.originData.errno==10074 ){
         //$.desc += get_chest.data.originData.msg
         $.log("开宝箱任务ID:"+taskid+ get_chest.data.originData.msg)
         }  
       resolve()
    })
  })
}

//任务中心宝箱
function activeBox2() {
  return new Promise((resolve, reject) =>{
   let actboxurl =  {
      url: `https://haokan.baidu.com/activity/acuserchest/opennew`,
      headers: {Cookie:cookieval},
      body: `taskid=${taskid}&productid=2&ugus=5256798061`
      }
   $.post(actboxurl, async(error, response, data) => {
     let act_box = JSON.parse(data)
     //$.log('actbox: ' + data)
     if (act_box.errno == 0){
         $.desc += '开宝箱获得收益: +' + act_box.data.coin
 
       } else if (act_box.errno == 10060){
        //taskid = '669'
       await chestTime()
       $.desc += act_box.msg
      }
     resolve()
    })
  })
}
function activeBox() {
  return new Promise((resolve, reject) =>{
   let actboxurl =  {
      url: `https://haokan.baidu.com/activity/tasks/active?productid=2&id=${tid}`,
      headers: {Cookie:cookieval,Referer:RefererUrl}
      }
   $.get(actboxurl, async(error, response, data) => {
     //let act_box = JSON.parse(data)
     //$.log('actbox: ' + data)
       await $.wait(25000);
       await Tasks();
     resolve()
    })
  })
}


function Tasks() {
  return new Promise((resolve) =>{
   let taskurl =  {
      url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=coin&rewardVideoPkg=${Pkg}&_=`+new Date().getTime()+`&sys=ios&rewardVideoDrawKey=&source=0&appid=0&bid=0&chestTid=0&signAim=0&date=`,
      headers: {Cookie:cookieval,Referer:RefererUrl}
      }
   $.get(taskurl, async(error, response, data) => {
     let do_task = JSON.parse(data)
        await $.wait(20000);
         //$.log(data+'\n')
     if (do_task.errno == 0){
         $.desc += taskName + "获得收益"+ do_task.data.coin +"\n"
         $.log("  获得收益: +"+do_task.data.coin+'\n  ')
     }  else if (do_task.errno == 19001){
        $.desc += taskName + "  "+ do_task.data.originData.msg + "\n"
      }else if (do_task.errno == 11004){
        $.desc += taskName + "  "+ do_task.errmsg + "\n"
      }
    resolve()
   })
  })
}

function get_search() {
  return new Promise((resolve) =>{
   let geturl =  {
      url: `https://mbd.baidu.com/searchbox?action=feed&cmd=${cmd}&imgtype=webp&network=1_0&osbranch=i3&osname=baiduboxapp&ua=1242_2208_iphone_5.0.0.11_0&uid=A49D6DBEA0E8C89406AD1484C84D9134FCF6C8758FHLNHLAJSR&ut=iPhone10%2C1_14.2`,
      headers: {Cookie:cookieval}
      }
   $.get(geturl, async(error, resp, data) => {
     let get_search = JSON.parse(data)
          //$.log(data+'\n')
     if (get_search.errno == 0 ) {
     for ( item in get_search.data[`${cmd}`].itemlist.items){
        searchId = get_search.data[`${cmd}`].itemlist.items[item].id
        searchname = get_search.data[`${cmd}`].itemlist.items[item].data.title
         $.log(" 阅读任务: "+searchname+ "\n  任务ID: "+searchId)
         await searchBox(searchId)
         await $.wait(30000)
        }
         //$.desc += taskName + do_search.data[`${cmd}`].tips +"\n"
     }  else {
       // $.desc += taskName + "  "+ do_search.data[`${cmd}`].tips + "\n"
      }
    resolve()
   })
  })
}



function searchBox(id) {
  return new Promise((resolve) =>{
   let searchurl =  {
      url: `https://mbd.baidu.com/searchbox?action=feed&cmd=197&imgtype=webp&network=1_0&osbranch=i3&osname=baiduboxapp&ua=1242_2208_iphone_5.0.0.11_0&uid=A49D6DBEA0E8C89406AD1484C84D9134FCF6C8758FHLNHLAJSR&ut=iPhone10%2C1_14.2`,
      headers: {Cookie:cookieval},
      body: `data={"origin_nid":"${id}","taskid":"${tid}"}`
      }
   $.post(searchurl, async(error, resp, data) => {
     let do_search = JSON.parse(data)
          //$.log(data+'\n')
     if (do_search.errno == 0 && do_search.data['197'].istip == 1) {
        $.log("  获得收益: " +do_search.data[`197`].tips+'\n')
         //$.desc +=  do_search.data[`197`].tips +"\n"
     }  else {
        $.log("\n")
      }
    resolve()
   })
  })
}

function doubleBox() {
  return new Promise((resolve, reject) =>{
   let douboxurl =  {
      url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=chestDouble&rewardVideoPkg=${Pkg}`,
      headers: {Cookie:cookieval,Referer: `Referer: https://eopa.baidu.com/page/pagekey-ASKWNd8W?productid=2&type=1&tid=346`}
      }
   $.get(douboxurl, (error, response, data) => {
     let get_doubox = JSON.parse(data)
     if (get_doubox.errno == 0){
         $.desc += '开宝箱获得双倍收益: +' + get_doubox.data.awardCoin
         }  
     resolve()
    })
  })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
