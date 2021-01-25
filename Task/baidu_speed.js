/*
百度极速版签到任务

本脚本默认使用chavyleung大佬和Nobyda的贴吧ck，获取方法请看大佬仓库说明，内置自动提现，提现金额默认30元

~~~~~~~~~~~~~~~~

*/
const $ = new Env('百度极速版')

let CookieArr = [];
let UA = `Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 SP-engine/2.24.0 info baiduboxapp/5.1.1.10 (Baidu; P2 14.2)`;
const withcash = $.getdata("cash_baidu")||30;
let tip = 0,totaltips=0;
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
      await userInfo();
      await getsign();
      await firstbox();
      await TaskCenter()
      await showmsg()
     //await drawPrize();
  }
 } 
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

//签到
function getsign() {
    return new Promise((resolve, reject) =>{
        let signurl = {
            url: `https://haokan.baidu.com/activity/acusercheckin/update`,
            headers: {
                Cookie: cookieval,
                'User-Agent': UA
            },
            body: 'productid=2&ugus=9766888061'
        }
        $.post(signurl, async(error, response, data) =>{
            let get_sign = JSON.parse(data);
            if (get_sign.errno == 0) {
                $.desc = get_sign.data.tips+` 收益: $ {get_sign.data.bonus.coin}💰\n`;
                $.log($.desc+"\n"+data);
                await invite()
            } else if (get_sign.errno == 10053) {
                $.desc = "【签到结果】"+get_sign.msg+"\n"
                $.log( "签到结果: "+ $.desc)
            } else {
                $.sub = `签到失败❌`,
                $.desc = `说明: ` + get_sign.msg,
                $.msg($.name, $.sub, $.desc);
                return
            }
            resolve()
        })
    })
}

function userInfo() {
    return new Promise((resolve, reject) => {
       let infourl = {
            url: `https://haokan.baidu.com/activity/h5/income?productid=2&from=1005640h&network=1_0&osname=baiduboxapp`,
           headers: {
             Cookie:cookieval,
             'User-Agent': UA
           }
        };
        $.get(infourl, async(error, resp, data) => {
            try {
                if (resp.statusCode == 200) {
                    username = data.match(/user_name":"(\w+)/)[1],
                    chargemoney = data.match(/charge_money":"(\d+\.\d+)/)[1],
                    waitingcoin = data.match(/waiting_coin":(\d+)/)[1],
                    availablecoin = data.match(/available_coin":(\d+)/)[1],
                    invitecode = data.match(/invite_code":"(\w+)/)[1]
                }
                 $.sub= "昵称:"+username+" 现金:"+ chargemoney+" 金币:"+availablecoin
                $.log("获取用户信息成功，昵称: "+username+ " 现金:"+chargemoney+"元");
                if (chargemoney >= withcash && $.time("HH") == 6) {
                    await withDraw(withcash)
                }
            } catch(error) {
                $.msg($.name, "获取用户信息失败"),
                $.log("用户信息详情页错误\n" + data)
            }
            resolve()
        })
    })
}

function withDraw(cash) {
    return new Promise((resolve, reject) =>{
        let cashurl = {
            url: `https://haokan.baidu.com/activity/acuserwithdraw/confirm?productid=2&amount=${cash*100}&trade_type=1`,
            headers: {
                Cookie: cookieval,
                'User-Agent': UA
            }
        }
        $.get(cashurl, (error, response, data) =>{
            let get_cash = JSON.parse(data);
            if (get_cash.errno == 0) {
                $.sub = ' 提现成功: 到账 ' + get_cash.data.money + "元 ",
                $.msg($.name, $.sub)
            } else {
                $.log(data + "\n " + get_cash.msg),
                $.msg($.name, get_cash.msg)
            }
            resolve()
        })
    })
}


function invite() {
  return new Promise((resolve, reject) =>{
   let rewurl =  {
      url: `https://haokan.baidu.com/activity/h5/vault?productid=2&inviteCode=RW9ZSW&pkg=%5Bpkg%5D `,
      headers: {Cookie:cookieval}
      }
   $.get(rewurl,(error,resp,data) => {
      if ( error ) {
        //$.log("响应错误")
       }
      resolve()
    })
  })
}

function TaskCenter() {
  return new Promise((resolve, reject) =>{
    let rewurl = {
      url: `https://haokan.baidu.com/activity/h5/vaultnew?productid=2&fromcsr=1&system=ios&_format=json`,
      headers: {
        Cookie: cookieval,
       'User-Agent': UA
      }
    }
    $.get(rewurl, async(error, resp, data) =>{
      try {
        let get_tasks = JSON.parse(data);
        $.log("获取任务数据成功")
        tasks = get_tasks.data.comps;
        for (x in tasks) {
          taskid = tasks[x].taskId;
          id = tasks[x].id;
          await getConfigs()
        }
      } catch(e) {
        $.logErr(e, data);
      } finally {
        $.msg($.name, $.sub, $.desc)
      }
    })
  })
}

async function getConfigs() {
    if (id == 1081) {
        tasknName = "<" + tasks[x].data.words + ">",
        RefererUrl = tasks[x].data.btnlinkios;
        $.log(tasks[x].data.words)
    };
    if (id == 1068) {
        for (HeadBox of tasks[x].data.unOpenHeadBoxDialog.btn) {
            taskName = "【"+HeadBox.btnText+"】 ",
            RefererUrl = HeadBox.iosAdUrl;
            $.log(HeadBox.btnText)
        };
        for (openBox of tasks[x].data.gameheader.progressList) {
            taskstatus = openBox.status,
            taskid = openBox.coinRequired;
            //$.log(openBox.status)
        };
        for (jingangs of tasks[x].data.jingang.list) {
            jingangType = jingangs.jingangType,
            taskName = "【"+jingangs.jingangName+"】 ",
            RefererUrl = jingangs.jingangUrl,
            tid = jingangs.jingangTid;
            //$.log(jingangs.jingangName);
            if (jingangType == 2) {
                if (tasks[x].data.jingang.countDown[tid].countDown == 0) {
                    await $.wait(1000);
                    await get_pkg(tid);
                } else {
                    $.log(taskName+ " 请等待" + Number(tasks[x].data.jingang.countDown[tid].countDown / 60).toFixed(2) + "分钟")
                }
            }
        }
    }
    if (id == 52) {
        for (signs of tasks[x].data.checkin_list) {
            if (tasks[x].data.current_date == signs.date && signs.is_checkin == 0) {
                await getsign()
            }
        }
    }
    if (id == 963) {
        $.log(tasks[x].data.recommendCompName)
    }
    if (id == 277) {
        $.log("\n去完成" + tasks[x].data.title) 
        for (daily of tasks[x].data.tasklist) {
                     taskName = "【"+daily.title +"】 ";
                //taskName += "【"+taskName+"】 "
                     tid = daily.id;
                     taskType = daily.type
            if (taskType == "openApp") {
                tid = tid == '395' ? "385": tid,
                RefererUrl = daily.adLink;
                await get_pkg()
            } else if (taskType == 'watch') {
                    tips = daily.tips; 
                    count = daily.total_count
                    $.log("\n"+ taskName + tips+"总计"+count+"次"); 
                 if(daily.taskStatus==0){
                    await get_search("184")
                 }
                 if(daily.taskStatus==1){
                   $.log(taskName+ "任务已完成")
                 }
            }
        }
    }
    if(id==278){
      $.log(tasks[x].data.tasklist[0].title)
    }
    if(id==10){
      $.log(tasks[x].name)
    }
}



//首页宝箱
function firstbox() {
    return new Promise((resolve, reject) =>{
        let bdurl = {
            url: 'https://mbrowser.baidu.com/lite/gold/receive?service=bdbox',
            headers: {
                "Cookie": cookieval,
                "User-Agent": UA
            },
            body: 'task_type=-1&task_id=-1'
        }
        $.post(bdurl, (error, resp, data) =>{
            let get_first = JSON.parse(data)
            //$.log("获取首页宝箱信息:"+data +'\n')
            if (get_first.err_no == 0) {
                $.desc += "【首页宝箱】" + get_first.data.result.tips + "， " + get_first.data.result.countdown_time + "秒后再次开启宝箱\n"
            } else if (get_first.err_no == 10079) {
                $.desc += "【首页宝箱】" + get_first.tip + '\n'
            } else if (get_first.err_no == 10060) {
                $.desc += get_first.tip + '\n'
            }
            resolve()
        })
    })
}



//视频
function get_pkg() {
    return new Promise((resolve, reject) =>{
        let pkgurl = {
            url: `https://haokan.baidu.com/activity/acad/rewardad?device=%7B%22imei_md5%22%3A%22%22%2C%22device_type%22%3A1%2C%22model%22%3A%22IPHONE%22%2C%22manufacturer%22%3A%22Apple%22%2C%22os_version%22%3A%2214.2%22%2C%22androidId%22%3A%22%22%7D%2C%22screen_width%22%3A1242%2C%22screen_height%22%3A2208&network=%7B%22connect_type%22%3A1%2C%22carrier%22%3A0%7D&productid=2&tid=${tid}&type=1`,
            headers: {
                Cookie: cookieval,
                'User-Agent': UA,
                'Referer': RefererUrl
            }
        }
        $.get(pkgurl, async(error, resp, data) =>{
            let get_pkg = JSON.parse(data);      
            if (get_pkg.errno == 0 && get_pkg.data.isDone == 0) {
                Pkg = get_pkg.data.adInfo[0].material.pkg,
                taskid = get_pkg.data.taskPf.taskId;
                $.log(" 获取任务数据成功，去做任务");
                //$.log("\n"+taskid +" "+ Pkg)
                await activeBox()
            } else if (get_pkg.errno == 0 && get_pkg.data.isDone == 1) {
                $.desc += taskName + "已完成\n";       
                $.log(taskName + "已完成\n")
            }
            resolve()
        })
    })
}

function activeBox() {
  return new Promise((resolve, reject) =>{
   let actboxurl =  {
      url: `https://haokan.baidu.com/activity/tasks/active?productid=2&id=${tid}`,
      headers: {Cookie:cookieval,'User-Agent': UA,Referer:RefererUrl}
      }
   $.get(actboxurl, async(error, response, data) => {
     //let act_box = JSON.parse(data)
     $.log('  任务激活成功，等待10s获取收益' )
       await $.wait(10000);
       await Tasks();
     resolve()
    })
  })
}


function Tasks() {
    return new Promise((resolve) =>{
        let taskurl = {
            url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=coin&rewardVideoPkg=${Pkg}&_=`+new Date().getTime()+`&sys=ios&rewardVideoDrawKey=&source=0&appid=0&bid=0&chestTid=0&signAim=0`,
            headers: {
                Cookie: cookieval,
                'User-Agent': UA,
                Referer: RefererUrl
            }
        }
        $.get(taskurl, async(error, response, data) =>{
            try {
                let do_task = JSON.parse(data);
                if (do_task.errno == 0) {
                    $.desc += taskName + "获得收益" + do_task.data.coin + "\n";
                    $.log(taskName+ "  获得收益: +" + do_task.data.coin);
                    await $.wait(2000)
                } else if (do_task.errno == 19001) {
                    $.desc += taskName + "  " + do_task.errmsg + "\n"
                    $.log(taskName + "  " + do_task.errmsg)
                  
                } else if (do_task.errno == 11004) {
                    $.desc += taskName + "  " + do_task.errmsg + "\n";
                    $.log(taskName + "  " + do_task.errmsg)
                }
            } catch(e) {
                $.logErr(e, data);
            } finally {
                resolve()
            }
        })
    })
}
function get_search(cmd) {
    return new Promise((resolve) =>{
        let geturl = {
            url: `https://mbd.baidu.com/searchbox?action=feed&cmd=${cmd}&network=1_0&osbranch=i3&osname=baiduboxapp&uid=A49D6DBEA0E8C89406AD1484C84D9134FCF6C8758FHLNHLAJSR&ut=iPhone10%2C1_14.2&ua=1242_2208_iphone_5.0.0.11_0&fv=12.1.0.0`,
            headers: {
                Cookie: cookieval,
                'User-Agent': UA
            }
        }
        $.get(geturl, async(error, resp, data) =>{
           // $.log(data+'\n')
            try {
             let get_search = JSON.parse(data)
                if (get_search.errno == 0) {
                    for (items of get_search.data[`${cmd}`].itemlist.items) {
                        searchId = items.id,
                        searchname = items.data.title;
                        author = items.data.author
                   if(items.data.mode=="video"||items.data.type=="video"){
                        $.log("\n 观看视频: " + searchname + "  —————— "+author +"\n 任务ID:  " + searchId);
                      }
                  if(items.data.mode=="text"){
                        $.log("\n 阅读短文: " + searchname + "\n 任务ID:  " + searchId +"  —————— "+items.data.tag ? items.data.tag:"");
                      }
                  if(items.data.mode=="ad"){
                        $.log("\n 打开广告: " + author+": "+searchname + "\n 任务ID:  " + searchId);
                      }
                        if( Number(tip) > 3){
                       $.log("\n\n  请等待30s获取收益")
                        await $.wait(30000)
                      } else {
                        $.log("   金币小于3时，加速运行")
                        await $.wait(5000)
                      }
                       await searchBox(searchId);
                       totaltips += tip
                     }
                   $.desc += taskName + "获得收益"+ totaltips + tips + "\n"
              }
            } catch(error) {
                $.logErr(error+data);
            } finally {
                resolve()
            }
        })
    })
}

function searchBox(id) {
    return new Promise((resolve) =>{
        let searchurl = {
            url: `https://mbd.baidu.com/searchbox?action=feed&cmd=197&imgtype=webp&network=1_0&osbranch=i3&osname=baiduboxapp&ua=1242_2208_iphone_5.0.0.11_0&uid=A49D6DBEA0E8C89406AD1484C84D9134FCF6C8758FHLNHLAJSR&ut=iPhone10%2C1_14.2`,
            headers: {"Cookie":cookieval,'User-Agent': UA},
            body: `data={"origin_nid":"${id}","taskid":"${tid}"}`
        };
        $.post(searchurl, async(error, resp, data) =>{
    //$.log(error + resp.statusCode+"  "+data)
         try{
            let do_search = JSON.parse(data)
            if (do_search.errno == 0 && do_search.data['197'].istip == 1) {
                $.log("   获得收益: " + do_search.data[`197`].tips); 
                tip = Number(do_search.data[`197`].righttips)
                //totaltips += Number(tip)
                 await $.wait(2000)
            } else if (do_search.data[`197`].tips == "") {
                //$.log("  获得收益: " + do_search.data[`197`].istip + '\n')
                 //tip += do_search.data[`197`].righttips 
            } else {
            $.log("获得收益失败")
            }
            }catch(e) {
                $.logErr(e+data);
            } finally {
                resolve()
            }
        })
    })
}
//缩减开宝箱时间
function chestTime() {
  return new Promise((resolve, reject) =>{
   let timeurl =  {
      url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=chestTime&rewardVideoPkg=${Pkg}`,
      headers: {Cookie:cookieval,'User-Agent': UA,Referer:RefererUrl}
      }
   $.get(timeurl, (error, resp, data) => {
     $.log(data)
  try{
     let get_chest = JSON.parse(data)
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
       } catch(e){
        $.logErr(e+data);
      } finally {
        resolve()
      }
    })
  })
}

//任务中心宝箱
function activeBox2() {
  return new Promise((resolve, reject) =>{
   let actboxurl =  {
      url: `https://haokan.baidu.com/activity/acuserchest/opennew`,
      headers: {Cookie:cookieval,'User-Agent': UA},
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
function doubleBox() {
  return new Promise((resolve, reject) =>{
   let douboxurl =  {
      url: `https://eopa.baidu.com/api/task/1/task/${taskid}/complete?rewardType=chestDouble&rewardVideoPkg=${Pkg}`,
      headers: {Cookie:cookieval,'User-Agent': UA,Referer:RefererUrl}
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

function showmsg() {
     $.msg($.name,$.sub,$.desc)

}



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
