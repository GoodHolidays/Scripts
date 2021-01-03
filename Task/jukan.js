/*
聚看点签到任务，不支持Actions跑阅读任务，其他任务可运行
打开'我的'获取Cookie
更新时间: 2021-01-03 12:03
https:\/\/www\.xiaodouzhuan\.cn\/jkd\/newMobileMenu\/infoMe\.action url script-request-body jukan.js

可自动提现，提现需填写微信真实姓名，设置提现金额，默认30，此设置可以boxjs内完成，也可本地配置

hostname = www.xiaodouzhuan.cn
~~~~~~~~~~~~~~~~

*/
const $ = new Env('聚看点')
const drawcash = $.getdata('jukan_cash') || "30" //提现金额
const wxname = $.getdata('jukan_name') || ""//微信真实名字，可以在双引号内填入
let CookieArr=[],BodyArr=[];
let bodys = $.getdata('jukan_body')
let signtimes = $.getdata('jukan_times')
let cashout = $.getdata('jukan_out')|| false
let UA = 'JuKanDian/5.6.5 (iPhone; iOS 14.2; Scale/3.00)'
let taskresult = "",sumnotify ="";

if ($.isNode()) {
  if (process.env.JUKAN_BODY && process.env.JUKAN_BODY.indexOf('&') > -1) {
  JKbody = process.env.JUKAN_BODY.split('&');
  }
  else if (process.env.JUKAN_BODY && process.env.JUKAN_BODY.indexOf('\n') > -1) {
  JKbody = process.env.JUKAN_BODY.split('\n');
  } else {
  JKbody = process.env.JUKAN_BODY.split()
  }
  Object.keys(JKbody).forEach((item) => {
        if (JKbody[item]) {
          BodyArr.push(JKbody[item])
        } 
    })
} else if (bodys.indexOf('&')>-1){
  Object.keys(bodys.split('&')).forEach((item) => {
      BodyArr.push(bodys.split('&')[item])
    })
} else {
   BodyArr.push(bodys)
}

if ($.isNode()) {
      console.log(`============ 脚本执行-国际标准时间(UTC)：${new Date().toLocaleString()}  =============\n`)
      console.log(`============ 脚本执行-北京时间(UTC+8)：${new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleString()}  =============\n`)
}

if (typeof $request !== 'undefined') {
   if ($request && $request.method != `OPTIONS`) {
     const  bodyVal = $request.body
   if(bodyVal)$.setdata(bodyVal,'jukan_body')
     $.log(`bodyVal:${bodyVal}`)
     $.msg($.name,"获取请求成功")
     $.done()
   }
} else {
!(async() => {
  if (!BodyArr[0]) {
    console.log($.name, '【提示】请把聚看点Cookie填入Github 的 Secrets 中，请以&或者换行隔开')
    return;
  }
  console.log(`您共提供${BodyArr.length}个聚看点账号Cookie\n————————————————————————————————————\n`)
  for (let i = 0; i < BodyArr.length; i++) {
    if (BodyArr[i]) {
      bodyval = BodyArr[i]
      ID =  decodeURIComponent(bodyval).match(/"openid" : "(\w+)"/)[1]
      apptoken = decodeURIComponent(bodyval).match(/"apptoken" : "(\w+)"/)[1]
      appVersion = decodeURIComponent(bodyval).match(/"appversion" : "(.*)"/)[1]
      cookieval = `xz_jkd_appkey=${ID}!iOS!${appVersion}`
      times = Date.parse(new Date())/1000
      $.index = i + 1;
   console.log("聚看点账号"+$.index+"任务开始\n")
      await sign();
      await getsign();
      await stimulate();
      await TimeBox();
      await userinfo();
      await LuckDrawLevel();
   for(boxtype of [1,2]){
      await $.wait(1000);
      await BoxProfit(boxtype)
    }   
     for ( x =18;x<32;++x){
      await Stimulate(x)
     }
  if (cashout==true&&curcash >= drawcash && wxname){
        await realname();
      //await Withdraw() //实名未通过，强制提现，可取消此注释，不保证成功
   }
   if (signtimes&&signtimes<5){
      await WelfareCash();
   }
   if(new Date().getTimezoneOffset() != '-480'){
    continue
   } else {
     await artTotal() 
}  
   if ((150-artcount) == 0&&(50-videocount) ==0){
     $.msg($.name+" 昵称:"+userName, $.sub, $.desc+"<今日阅读任务已完成>",{'media-url': calendarpic })
     }
     $.log("\n"+ $.name+"账号"+$.index+" : "+userName+ "  本次运行任务已结束\n~~~~~~~~~~~~~~~~~~\n")
   }
 } 
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}
//签到
function sign() {
  return new Promise((resolve, reject) =>{
   let profiturl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/account/homeSignAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: bodyval
      }
   $.post(profiturl, async(error, resp, data) => {
     //$.log(data+"\n")
   try{
     let sign_res = JSON.parse(data)
     if (sign_res.ret == "ok"){
       calendarpic = sign_res.calendar_pic
       //$.log("签到收益: +"+`calendar_pic`)
         }  else {
       $.log(sign_res.rtn_msg)
        }
       } catch (e) {
        $.logErr(e, data)
      } finally {
        resolve();
      }
    })
  })
}

function getsign() {
  return new Promise((resolve, reject) =>{
   let signurl =  {
      url:  `https://www.xiaodouzhuan.cn/jkd/user/usersign.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: bodyval
      }
   $.post(signurl, async(error, response, data) => {
   try{
     let get_sign = JSON.parse(data)
      //$.log(data)
     if (get_sign.ret == "ok"){
       signtimes = get_sign.signDays
      if(signtimes) $.setdata(signtimes, 'jukan_times')
         $.sub = `签到成功🎉`
         $.desc = `签到收益: +${get_sign.todaySignProfit}${get_sign.todaySignProfitType}💰，明日 +${get_sign.tomorrowSignProfit}${get_sign.tomorrowSignProfitType} 已签到 ${signtimes} 天\n` ;
           await signShare()
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
       } catch (e) {
        $.logErr(e, data)
      } finally {
        resolve();
      }
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
        await invite()
         }  else {
       $.log(sign_share.rtn_msg)
     }
       resolve()
    })
  })
}


function LuckDrawLevel() {
  return new Promise((resolve, reject) =>{
   let Levelurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/activity/advluckdraw/getLuckDrawLevel.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: bodyval
      }
   $.post(Levelurl, async(error, resp, data) => {
     try {
       get_drawLevel = JSON.parse(data)
      //$.log(data)  
      if (get_drawLevel.ret == "ok"){
       unNum = get_drawLevel.data.unFinishNum
      if(unNum>0){
       $.log("转盘任务剩余"+unNum+`次，去转盘任务`)  
        for(k=0;k<10&&k<unNum;++k){
           await $.wait(1000)
           await LuckDrawGold()
        }
     } 
      if(lktotalProfit){
        $.desc += "【转盘任务】金币总计:"+ lktotalProfit+"剩余次数"+unNum+"次\n"
      }
       let liststatus = JSON.parse(get_drawLevel.data.list)
      for ( var x in liststatus){
           if(liststatus[x].status ==1 ){
            await LuckBox(x)
       }
}
    if( get_drawLevel.luckName =="神秘宝箱" ){
        $.log(get_drawLevel.rtn_msg +`去领取神秘宝箱奖励`)  
        await Stimulate("11")
       }

       }  else if (get_drawLevel.ret =="failed"){
       $.log("转盘次数"+get_drawLevel.return_msg)  
          }
         } catch (e) {
        $.logErr(e, data)
      } finally {
        resolve();
      }
    })
  })
}

function LuckDrawGold() {
  return new Promise((resolve, reject) =>{
   let DrawGoldurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/activity/advluckdraw/getLuckDrawGold.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: bodyval
      }
   $.post(DrawGoldurl, async(error, resp, data) => {
      //$.log(data+"\n")
     let get_drawGold = JSON.parse(data)
     if (get_drawGold.ret == "ok"){
       $.log(get_drawGold.return_msg)
       await LuckProfit()
       }  else if (get_drawGold.ret =="failed"){
       $.log(get_drawGold.rtn_msg +` 转盘抽奖失败`)  
     }
       resolve()
    })
  })
}

function LuckBox(x) {
  return new Promise((resolve, reject) =>{
   let Boxurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/activity/advluckdraw/getLuckDrawBox.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: `num=${x}`
      }
   $.post(Boxurl, async(error, resp, data) => {
    // $.log(data+"\n")
     let Timebox = JSON.parse(data)
     if (Timebox.ret == "ok"){
       $.log("时段宝箱开启成功，获取金币+"+ Timebox.data)
       }  else if (Timebox.ret =="failed"){
       $.log(`时段宝箱开启失败`+Timebox.return_msg)  
       }
       resolve()
    })
  })
}

function LuckProfit() {
  return new Promise((resolve, reject) =>{
   let LuckProfiturl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/activity/advluckdraw/getTotalLuckProfit.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: bodyval
      }
   $.post(LuckProfiturl, async(error, resp, data) => {
     //$.log(data+"\n")
     let luckProfit = JSON.parse(data)
     if (luckProfit.ret == "ok"){
       lktotalProfit = luckProfit.data.totalProfit
       $.log("转盘任务成功，总计金币: "+ lktotalProfit+ luckProfit.return_msg)
       }  else if (luckProfit.ret =="failed"){
       $.log(`转盘抽奖失败`)  
       }
       resolve()
    })
  })
}

function WelfareCash() {
  return new Promise((resolve, reject) =>{
   let welurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/activity/cashweal/noviceWelfareCash.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}
      }
   $.post(welurl, async(error, resp, data) => {
     //$.log(data+"\n")
     let _welfareCash = JSON.parse(data)
     if (_welfareCash.ret == "ok"){
       $.log("新手福利提现: 成功")
         } else {
       $.log(_welfareCash.rtn_msg)
     }
       resolve()
    })
  })
}

function TimeBox() {
  return new Promise((resolve, reject) =>{
   let boxurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/account/openTimeBoxAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
       body: bodyval
      }
   $.post(boxurl, async(error, resp, data) => {
     //$.log(data+"\n")
     let _timebox = JSON.parse(data)
     if (_timebox.ret == "ok"){
       //$.log("定时宝箱开启成功，获得收益+"+_timebox.profit + "  下次需"+_timebox.next_time+"分钟")
       await $.wait(2000)
       await  Stimulate(_timebox.advertPopup.position)
         }  else {
       $.log(_timebox.rtn_msg)
     }
       resolve()
    })
  })
}

function realname() {
  return new Promise((resolve, reject) =>{
   let realurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/userWithdraw/verifyIdentity.action?realname=`+encodeURIComponent(wxname),
      headers: {Cookie:cookieval}
      }
   $.get(realurl, async(error, resp, data) => {
       let get_name = JSON.parse(data)
      if (get_name.ret=="ok"){
       $.log("恭喜您，实名验证通过" + get_name.return_msg)
         await Withdraw()
      } else  if(get_name.ret== "failed"){
         $.log("实名验证" + get_name.return_msg)
        // $.msg($.name,get_name.return_msg)
      }
       resolve()
    })
  })
}

//提现
function Withdraw() {
  return new Promise((resolve, reject) =>{
   let drawurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/userWithdraw/userWithdrawPost.action`,
      headers: {Cookie:cookieval,'User-Agent':UA,'Referer': 'https://www.xiaodouzhuan.cn/jkd/weixin20/userWithdraw/userWithdraw.action'}, body: `type=wx&sum=${sumcash}&mobile=&pid=0&accountid=&productcode=`
      }
   $.post(drawurl, async(error, resp, data) => {
       $.log("提现"+drawcash+"元"+data+"\n")
       $.desc += "提现"+drawcash+"元  "+data+"\n"
       resolve()
    })
  })
}


function  Cashstatus() {
  return new Promise((resolve, reject) =>{
   let drawurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/userWithdraw/userWithdrawPost.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}
}
   $.post(drawurl, async(error, resp, data) => {
       $.log("提现"+drawcash+"元"+data+"\n")
       $.desc += "提现"+drawcash+"元  "+data+"\n"
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
  try{
     let get_info = JSON.parse(data)
      if( get_info.ret=="ok"){
       userName = get_info.userinfo.username
       sumcash = get_info.userinfo.infoMeSumCashItem.title+get_info.userinfo.infoMeSumCashItem.value
       curcashtitle = get_info.userinfo.infoMeCurCashItem.title
       curcash = get_info.userinfo.infoMeCurCashItem.value
       gold = get_info.userinfo.infoMeGoldItem.title+": "+get_info.userinfo.infoMeGoldItem.value
    $.log("昵称:"+userName+"  "+gold +"\n"+sumcash + "/"+curcashtitle+curcash )
     $.sub += " "+gold
     $.desc += sumcash + " ~~~~ "+curcashtitle+curcash+"\n"
     }
     } catch (e) {
        $.logErr(e, data)
      } finally {
        resolve();
      }
    })
  })
}

function artTotal() {
  return new Promise((resolve, reject) =>{
   let infourl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/station/readAccount.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      } 
   $.post(infourl, async(error, resp, data) => {
     try{
      artcount = data.match(/(今日奖励次数\((\d+)次\))/g)[0].match(/\d+/)
      videocount = data.match(/(今日奖励次数\((\d+)次\))/g)[1].match(/\d+/)
      artcoin = data.match(/gold"\>\+(\d+金币)/)[1]
      videocoin =  data.match(/\d+金币/g)[7]
      readtotal = data.match(/gold1"\>\+(\d+金币)/)[1]
      sharetotal = data.match(/\d+金币/g)[9]
      $.desc += "【今日阅读统计】\n  文章: " +Number(artcount) + "次 收益: "+artcoin+"\n  视频: " +Number(videocount)  + "次 收益: "+videocoin+"\n"
      $.desc += "【昨日阅读统计】\n  自阅收益: " +readtotal +"  分享收益: "+sharetotal +"\n"
      $.log( "当前阅读次数"+artcount+"次，视频次数"+videocount+"次\n")
       if(150-artcount > 0 ){
       readbodyVal = bodyval.replace(/time%22%20%3A%20%22\d+%22/, `time%22%20%3A%20%22${times}%22%2C%20`+'%22cateid%22%20%3A%203')
        await artList(readbodyVal)
       }  else if ( artcount == 0  ){
          $.log("今日阅读任务已完成，本次跳过")
       };
       if(50-videocount > 0 ){
         readbodyVal = bodyval.replace(/time%22%20%3A%20%22\d+%22/,`time%22%20%3A%20%22${times+31000}%22%2C%20`+'%22cateid%22%20%3A%2053')
        await artList(readbodyVal)
        }  else if ( artcount == 0  ){
        $.log("今日视频任务已完成，本次跳过")
        };
        } catch (e) {
          $.logErr(e, data)
        } finally {
          resolve(data);
        }
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
       // $.log( data)
     if (get_list.ret == "ok"){
       for( lists of get_list.artlist){
          if(lists.item_type=="article"){
          art_Title = lists.art_title
          artid =lists.art_id
          screen_Name = lists.screen_name
          $.log(" 【阅读文章】: "+art_Title +"  -------- <"+screen_Name +">\n ")
          await readTask(lists.art_id,"1")
          }
         if(lists.item_type=="video"){
          art_Title = lists.art_title
          artid =lists.art_id
          screen_Name = lists.screen_name
         $.log(" 【观看视频】: "+art_Title +"  -------- <"+screen_Name +">\n ")
          await readTask(lists.art_id,"2")
          }
        if(taskresult == 'R-ART-1002'|| taskresult ==`R-ART-0011`){
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
      body: `jsondata={"appid":"xzwl","channel":"IOS","relate":1,"artid":"${artid}","os":"IOS","openid":"${ID}","apptoken":"${apptoken}","appversion":"${appVersion}"}`
      }
   $.post(rewurl, async(error, resp, data) => {
     if(resp.statusCode ==200){
     for(s=0;s<2;++s){
        $.log(`   开始第${s+1}次阅读，请等待30s\n`)
         await $.wait(30000) 
         await finishTask(artid,arttype)
       }
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
      headers: {Cookie:cookieval,'User-Agent':UA},      
      body: `jsondata={"appid":"xzwl","read_weal":0,"paytype":"${arttype}","securitykey":"","channel":"iOS","time":"${times}","apptoken":"${apptoken}","appversion":"${appVersion}","openid":"${ID}","os":"iOS","artid":${artid},"accountType":"0","readmodel":"1"}`
      }
   $.post(finishurl, async(error, response, data) => {
     //$.log(data+"\n")
     let do_read = JSON.parse(data)
         taskresult = do_read.rtn_code
     if (do_read.ret == "ok"){
       $.log("   获得收益: +"+do_read.profit +"\n")
         }  else {
           $.log(do_read.rtn_msg)
        }
       resolve()
    })
  })
}


function stimulate() {
  return new Promise((resolve, reject) =>{
   let Advurl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/newmobile/stimulateAdv.action`,
      headers: {Cookie:cookieval,'User-Agent':UA},
      body: `jsondata={"read_weal":"0","appid":"xzwl", "position":"17","time" : "${times}", "apptoken" : "${apptoken}","appversion":"${appVersion}","openId":"${ID}","os":"iOS","channel":"iOS"}`
      }
   $.post(Advurl, async(error, resp, data) => {
       //$.log(data+"\n")
     let _Adv = JSON.parse(data)
     if (_Adv.ret == "ok"&&_Adv.status==1){
          $.log("视频"+ _Adv.videoType+"获得红包: +"+_Adv.rewardAmount+_Adv.rewardName)
         await $.wait(1000)
         await Stimulate("17")
         }  else {
       $.log("视频广告红包，"+ _Adv.message)
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
      body: `jsondata={"read_weal":"0","appid":"xzwl", "position" : ${position},"time" : "${times}","apptoken":"${apptoken}","appversion":"5.6.5","openid":"${ID}","os":"iOS","channel":"iOS"}`
      }
   $.post(stimurl, async(error, resp, data) => {
       //$.log(data+"\n")
     let do_stim = JSON.parse(data)
    if(typeof do_stim.profit_title == "undefined"){
   } else {
          $.log( do_stim.profit_title+ "position"+": "+position+"  获得收益 +"+ do_stim.profit)
         await $.wait(2000)
         }  
       resolve()
    })
  })
}

function BoxProfit(boxtype) {
  return new Promise((resolve, reject) =>{
   let profiturl =  {
      url: `https://www.xiaodouzhuan.cn/jkd/task/getTaskBoxProfit.action`,
      headers: {Cookie:cookieval,'User-Agent':UA}, body: `box_type=${boxtype}`
      }
   $.post(profiturl, async(error, resp, data) => {
        //$.log(data+"\n")
     let do_box = JSON.parse(data)
     if (do_box.ret == "ok"&&do_box.profit>0){
          $.log("计时宝箱获得收益: +"+do_box.profit)
          //$.desc += "【计时宝箱】+"+do_box.profit+"金币\n"
          position = do_box.advertPopup.position
          await Stimulate(position)
         // $.log(position)
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
      url: `https://www.xiaodouzhuan.cn/jkd/weixin20/member/bindTeacher.action?teacherCode=24222820`,
      headers: {Cookie:cookieval},
      body: bodyval
      }
   $.get(rewurl, (error, resp, data) => {
    //$.log(data)
  })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
