/*
更新时间: 2021-02-20 20:50
https:\/\/czapp\.bestpay\.com\.cn\/payassistant-client\?method=queryPhoneBalance url script-request-body bestPay.js
hostname = czapp.bestpay.com.cn
翼支付打开权益专区，点击套餐详情，重进翼支付App时需重新获取请求，即重写配置不必禁用

*/
const $ = new Env('翼支付电信套餐');
const bodyVal = $.getdata('bestpay_tele');
const queryTime = $.getdata('bestpay_bill').replace("-","")||parseInt($.time("yyyyMM")-1);
const cash = $.getdata('tele_balance')||"10";

let isGetCookie = typeof $request !== 'undefined'
if (isGetCookie) {
   GetCookie()
} else {
!(async () => {
  await queryBalance();
  await queryResource();
  await queryBill();
  $.msg($.name,$.sub,$.desc)
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
}
function GetCookie() {
  if ($request.body) {
    var bodyValue = $request.body;
    if ($.getdata('bestpay_tele') != (undefined || null)) {
      if ($.getdata('bestpay_tele') != bodyValue) {
        var bodys = $.setdata(bodyValue, 'bestpay_tele');
        if (!bodys) {
          $.msg("更新" + $.name + "请求失败‼️", "", "");
          $.log(`获取请求体: 失败`);
        } else {
          $.msg("更新" + $.name + "请求成功 🎉", "", "");
          $.log($.name+`, 获取请求: 成功, body: ${bodyValue}`)
        }
      }
    } else {
      var bodys = $.setdata(bodyValue, 'bestpay_tele');
      if (!bodys) {
        $.msg("首次写入" + $.name + "请求失败‼️", "", "");
      } else {
        $.msg("首次写入" + $.name + "请求成功 🎉", "", "");
      }
    }
  } else {
    $.msg("写入" + $.name + "请求失败‼️", "", "配置错误, 无法读取请求体, ");
  }
 $.done()
}


function config(api,queryApi) {
   return {
     url:'https://czapp.bestpay.com.cn/payassistant-client?method='+api,
     headers:{
       Host: 'czapp.bestpay.com.cn',
       Referer: 'https://h5.bestpay.com.cn/subapps/payassistant/payassistant-new/index.html?hybridVersion=3.0&channel=quanyi',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Bestpay/10.1.91 hybridVersion/3.0 /sa-sdk-ios',
      'Content-Type': 'application/x-www-form-urlencoded'
     },
      body: bodyVal+"&"+queryApi
   }
}


function queryResource() {
  return new Promise((resolve) =>{
    $.post(config('queryUserResource', 'BILLCYCLE='+$.time("yyyyMM")), (error, resp, data) =>{
      let result = JSON.parse(data);
      try {
        if (result.RESPONSECODE == "000000") {
          products = result.RESULTDATASET;
        //$.log(JSON.stringify(products,null,2));
          $.desc = "使用详情:\n";
          $.log("已开套餐:")
          for (x in products) {
            productsname = products[x].PRODUCTOFFNAME,
            offerType = products[x].OFFERTYPE,
            ratableid = products[x].RATABLERESOURCEID;
          $.log(" "+productsname+" 类型:"+offerType);
            if (ratableid) {
              unitType = products[x].UNITTYPEID,
              ratableName = products[x].RATABLERESOURCENAME,
              mainname = productsname,
              ratableAmount = products[x].RATABLEAMOUNT,
              balanceAmount = products[x].BALANCEAMOUNT,
              usageAmount = products[x].USAGEAMOUNT;
              if(unitType !== "KB") {
                usageAmount += unitType,
                ratableAmount += unitType ,
                balanceAmount += unitType
             } else if (unitType == "KB") {
                usageAmount = formatFlow(usageAmount),
                ratableAmount = formatFlow(ratableAmount),
                balanceAmount = formatFlow(balanceAmount);
                ratableName = ratableName?ratableName:productsname;
              } 
             $.desc += " "+ratableName +":"+(balanceAmount?"总计:"+ratableAmount+" 使用:"+usageAmount+" 剩余:"+balanceAmount+"\n":"");
            }
          }
         $.log("\n"+$.desc)
        }
      } catch(e) {
       $.log("查询套餐信息错误"+ $.log(JSON.stringify(result,null,2)))
      } finally {
        resolve()
      }
    })
  })
}

function queryBill() {
  return new Promise((resolve) =>{
    $.post(config('detailBillQueryNew', 'BILLCYCLE=' + queryTime), (error, resp, data) =>{
      let result = JSON.parse(data);
      $.log(queryTime+"期账单明细:")
      $.desc += queryTime+"期账单明细:\n"
      try {
        billDate = result.BILLINGCYCLE,
        userName = result.customerName,
        cashTotal = result.TOTAL / 100,
        discount = result.CHARGEFREEDISCOUNT / 100,
        mustPay = result.CHARGECORPUSDISCOUNT / 100;
        for (lists of result.RESULTDATASET) {
          billName = lists.CHARGETYPENAME,
          billCharge = lists.CHARGE / 100;
          $.desc += " "+billName + " 费用 " + billCharge + "元\n"
          $.log(" "+billName + " 费用 " + billCharge + "元")
        }
      } catch(e) {
        $.log("获取账单明细失败" + $.log(JSON.stringify(result, null, 2)))
      } finally {
        resolve()
      }
    })
  })
}

function queryBalance() {
  return new Promise((resolve) =>{
    $.post(config('queryPhoneBalance'), (error, resp, data) =>{
      let result = JSON.parse(data);
      try {
        addressCity = result.CITYNAME,
        teleNO = result.PRODUCTNO,
        teleNO = teleNO.substr(0,3)+"****"+teleNO.substr(7)
        balance = result.TELEBALANCE / 100,
        userBalance = result.USAGEAMOUNT,
        payAmount = result.payAmount / 100,
        comBalance = result.COMBALANCE / 100;
        if (balance < cash) {
          $.msg($.name, "您的号码: " + teleNO + " 余额为" + balance + "元", "余额小于" + cash + "元，请您及时充值")
        }
        $.sub = "归属地:"+addressCity+" 号码:"+teleNO+" 余额:"+balance+"元"
      } catch(e) {
        $.log("获取手机余额失败" + $.log(JSON.stringify(result, null, 2)))
      } finally {
        resolve()
      }
    })
  })
}

function formatFlow(number) {
    if (number/1024 < 1024) {
        return (number/1024).toFixed(2) + "MB"
    }
    return (number/1024/1024).toFixed(2) + "GB"
}


function Env(name,opts){class Http{constructor(env){this.env=env};send(opts,method='GET'){opts=typeof opts==='string'?{url:opts}:opts;let sender=this.get;if(method==='POST'){sender=this.post};return new Promise((resolve,reject)=>{sender.call(this,opts,(err,resp,body)=>{if(err)reject(err);else resolve(resp)})})};get(opts){return this.send.call(this.env,opts)};post(opts){return this.send.call(this.env,opts,'POST')}};return new(class{constructor(name,opts){this.name=name,this.http=new Http(this),this.data=null,this.dataFile='box.dat',this.logs=[],this.isMute=false,this.isNeedRewrite=false,this.logSeparator='\n';this.startTime=new Date().getTime();Object.assign(this,opts);this.log('',`🔔${this.name}, 开始!`)};isNode(){return'undefined'!==typeof module&&!!module.exports};isQuanX(){return'undefined'!==typeof $task};isSurge(){return'undefined'!==typeof $httpClient&&'undefined'===typeof $loon};isLoon(){return'undefined'!==typeof $loon};toObj(str,defaultValue=null){try{return JSON.parse(str)}catch{return defaultValue}};toStr(obj,defaultValue=null){try{return JSON.stringify(obj)}catch{return defaultValue}};getjson(key,defaultValue){let json=defaultValue;const val=this.getdata(key);if(val){try{json=JSON.parse(this.getdata(key))}catch{}};return json};setjson(val,key){try{return this.setdata(JSON.stringify(val),key)}catch{return false}};  getScript(url){return new Promise((resolve)=>{this.get({url},(err,resp,body)=>resolve(body))})};runScript(script,runOpts){return new Promise((resolve)=>{let httpapi=this.getdata('@chavy_boxjs_userCfgs.httpapi');httpapi=httpapi?httpapi.replace(/\n/g,'').trim():httpapi;let httpapi_timeout=this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout');httpapi_timeout=httpapi_timeout?httpapi_timeout*1:20;httpapi_timeout=runOpts&&runOpts.timeout?runOpts.timeout:httpapi_timeout;const[key,addr]=httpapi.split('@');const opts={url:`http://${addr}/v1/scripting/evaluate`,body:{script_text:script,mock_type:'cron',timeout:httpapi_timeout},headers:{'X-Key':key,'Accept':'*/*'}};this.post(opts,(err,resp,body)=>resolve(body))}).catch((e)=>this.logErr(e))};loaddata(){if(this.isNode()){this.fs=this.fs?this.fs:require('fs');this.path=this.path?this.path:require('path');const curDirDataFilePath=this.path.resolve(this.dataFile);const rootDirDataFilePath=this.path.resolve(process.cwd(),this.dataFile);const isCurDirDataFile=this.fs.existsSync(curDirDataFilePath);const isRootDirDataFile=!isCurDirDataFile&&this.fs.existsSync(rootDirDataFilePath);if(isCurDirDataFile||isRootDirDataFile){const datPath=isCurDirDataFile?curDirDataFilePath:rootDirDataFilePath;try{return JSON.parse(this.fs.readFileSync(datPath))}catch(e){return{}}}else return{}}else return{}};writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require('fs');this.path=this.path?this.path:require('path');const curDirDataFilePath=this.path.resolve(this.dataFile);const rootDirDataFilePath=this.path.resolve(process.cwd(),this.dataFile);const isCurDirDataFile=this.fs.existsSync(curDirDataFilePath);const isRootDirDataFile=!isCurDirDataFile&&this.fs.existsSync(rootDirDataFilePath);const jsondata=JSON.stringify(this.data);if(isCurDirDataFile){this.fs.writeFileSync(curDirDataFilePath,jsondata)}else if(isRootDirDataFile){this.fs.writeFileSync(rootDirDataFilePath,jsondata)}else{this.fs.writeFileSync(curDirDataFilePath,jsondata)}}};lodash_get(source,path,defaultValue=undefined){const paths=path.replace(/\[(\d+)\]/g,'.$1').split('.');let result=source;for(const p of paths){result=Object(result)[p];if(result===undefined){return defaultValue}};return result};lodash_set(obj,path,value){if(Object(obj)!==obj)return obj;if(!Array.isArray(path))path=path.toString().match(/[^.[\]]+/g)||[];path.slice(0,-1).reduce((a,c,i)=>(Object(a[c])===a[c]?a[c]:(a[c]=Math.abs(path[i+1])>>0===+path[i+1]?[]:{})),obj)[path[path.length-1]]=value;return obj};getdata(key){let val=this.getval(key);if(/^@/.test(key)){const[,objkey,paths]=/^@(.*?)\.(.*?)$/.exec(key);const objval=objkey?this.getval(objkey):'';if(objval){try{const objedval=JSON.parse(objval);val=objedval?this.lodash_get(objedval,paths,''):val}catch(e){val=''}}};return val};setdata(val,key){let issuc=false;if(/^@/.test(key)){const[,objkey,paths]=/^@(.*?)\.(.*?)$/.exec(key);const objdat=this.getval(objkey);const objval=objkey?(objdat==='null'?null:objdat||'{}'):'{}';try{const objedval=JSON.parse(objval);this.lodash_set(objedval,paths,val);issuc=this.setval(JSON.stringify(objedval),objkey)}catch(e){const objedval={};this.lodash_set(objedval,paths,val);issuc=this.setval(JSON.stringify(objedval),objkey)}}else{issuc=this.setval(val,key)};return issuc};getval(key){if(this.isSurge()||this.isLoon()){return $persistentStore.read(key)}else if(this.isQuanX()){return $prefs.valueForKey(key)}else if(this.isNode()){this.data=this.loaddata();return this.data[key]}else{return(this.data&&this.data[key])||null}};setval(val,key){if(this.isSurge()||this.isLoon()){return $persistentStore.write(val,key)}else if(this.isQuanX()){return $prefs.setValueForKey(val,key)}else if(this.isNode()){this.data=this.loaddata(),this.data[key]=val,this.writedata();return true}else{return(this.data&&this.data[key])||null}};initGotEnv(opts){this.got=this.got?this.got:require('got');this.cktough=this.cktough?this.cktough:require('tough-cookie');this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar();if(opts){opts.headers=opts.headers?opts.headers:{};if(undefined===opts.headers.Cookie&&undefined===opts.cookieJar){opts.cookieJar=this.ckjar}}}; get(opts,callback=()=>{}){if(opts.headers){delete opts.headers['Content-Type'];delete opts.headers['Content-Length']};if(this.isSurge()||this.isLoon()){if(this.isSurge()&&this.isNeedRewrite){opts.headers=opts.headers||{};Object.assign(opts.headers,{'X-Surge-Skip-Scripting':false})};$httpClient.get(opts,(err,resp,body)=>{if(!err&&resp){resp.body=body,resp.statusCode=resp.status};callback(err,resp,body)})}else if(this.isQuanX()){if(this.isNeedRewrite){opts.opts=opts.opts||{};Object.assign(opts.opts,{hints:false})};$task.fetch(opts).then((resp)=>{const{statusCode:status,statusCode,headers,body}=resp;callback(null,{status,statusCode,headers,body},body)},(err)=>callback(err))}else if(this.isNode()){this.initGotEnv(opts);this.got(opts).on('redirect',(resp,nextOpts)=>{try{if(resp.headers['set-cookie']){const ck=resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString();if(ck){this.ckjar.setCookieSync(ck,null)};nextOpts.cookieJar=this.ckjar}}catch(e){this.logErr(e)}}).then((resp)=>{const{statusCode:status,statusCode,headers,body}=resp;callback(null,{status,statusCode,headers,body},body)},(err)=>{const{message:error,response:resp}=err;callback(error,resp,resp&&resp.body)})}};post(opts,callback=()=>{}){if(opts.body&&opts.headers&&!opts.headers['Content-Type']){opts.headers['Content-Type']='application/x-www-form-urlencoded'};if(opts.headers)delete opts.headers['Content-Length'];if(this.isSurge()||this.isLoon()){if(this.isSurge()&&this.isNeedRewrite){opts.headers=opts.headers||{};Object.assign(opts.headers,{'X-Surge-Skip-Scripting':false})};$httpClient.post(opts,(err,resp,body)=>{if(!err&&resp){resp.body=body,resp.statusCode=resp.status};callback(err,resp,body)})}else if(this.isQuanX()){opts.method='POST';if(this.isNeedRewrite){opts.opts=opts.opts||{};Object.assign(opts.opts,{hints:false})};$task.fetch(opts).then((resp)=>{const{statusCode:status,statusCode,headers,body}=resp;callback(null,{status,statusCode,headers,body},body)},(err)=>callback(err))}else if(this.isNode()){this.initGotEnv(opts);const{url,..._opts}=opts;this.got.post(url,_opts).then((resp)=>{const{statusCode:status,statusCode,headers,body}=resp;callback(null,{status,statusCode,headers,body},body)},(err)=>{const{message:error,response:resp}=err;callback(error,resp,resp&&resp.body)})}};time(fmt,ts=null){const date=ts?new Date(ts):new Date();var o={"M+":date.getMonth()+1,"d+":date.getDate(),"h":date.getHours()%12==0?12:date.getHours()/12<1?"上午"+date.getHours()%12:"下午"+date.getHours()%12,"H+":date.getHours(),"m+":date.getMinutes(),"s+":date.getSeconds(),"q+":Math.floor((date.getMonth()+3)/3),"S":date.getMilliseconds()};var week={"0":"\u65e5","1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length))};if(/(E+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1)?(RegExp.$1.length>2?"\u661f\u671f":"\u5468"):"")+week[date.getDay()+""])};for(var k in o){if(new RegExp("("+k+")").test(fmt)){fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)))}};return fmt};msg(title=name,subt='',desc='',opts){const toEnvOpts=(rawopts)=>{if(!rawopts)return rawopts;if(typeof rawopts==='string'){if(this.isLoon())return rawopts;else if(this.isQuanX())return{'open-url':rawopts};else if(this.isSurge())return{url:rawopts};else return undefined}else if(typeof rawopts==='object'){if(this.isLoon()){let openUrl=rawopts.openUrl||rawopts.url||rawopts['open-url'];let mediaUrl=rawopts.mediaUrl||rawopts['media-url'];return{openUrl,mediaUrl}}else if(this.isQuanX()){let openUrl=rawopts['open-url']||rawopts.url||rawopts.openUrl;let mediaUrl=rawopts['media-url']||rawopts.mediaUrl;return{'open-url':openUrl,'media-url':mediaUrl}}else if(this.isSurge()){let openUrl=rawopts.url||rawopts.openUrl||rawopts['open-url'];return{url:openUrl}}}else{return undefined}};if(!this.isMute){if(this.isSurge()||this.isLoon()){$notification.post(title,subt,desc,toEnvOpts(opts))}else if(this.isQuanX()){$notify(title,subt,desc,toEnvOpts(opts))}};if(!this.isMuteLog){let logs=['','==============📣\u7CFB\u7EDF\u901A\u77E5📣=============='];logs.push(title);subt?logs.push(subt):'';desc?logs.push(desc):'';console.log(logs.join('\n'));this.logs=this.logs.concat(logs)}};log(...logs){if(logs.length>0){this.logs=[...this.logs,...logs]};console.log(logs.join(this.logSeparator))};logErr(err,msg){const isPrintSack=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();if(!isPrintSack){this.log('',`❗️${this.name}, \u9519\u8BEF!`,err)}else{this.log('',`❗️${this.name}, \u9519\u8BEF!`,err.stack)}};wait(time){return new Promise((resolve)=>setTimeout(resolve,time))};done(val={}){const endTime=new Date().getTime();const costTime=(endTime-this.startTime)/1000;this.log('',`🔔${this.name}, \u7ED3\u675F! 🕛 ${costTime} \u79D2`);this.log();if(this.isSurge()||this.isQuanX()||this.isLoon()){$done(val)}}})(name,opts)}
