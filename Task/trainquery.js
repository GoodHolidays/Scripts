
/**
本脚本可查询火车余票及列车时刻查询
1.可更改出发地、目的地及列车车次
2.K值为列车车次所对应的序号或者车次，请不要填错，详情请看日志
3.部分列车无法查到列车时刻信息，部分列车总计时间有误，以时刻表为准，部分座席可能无票价，第一次运行会报错，请重新运行
4.提供所有席别余票信息，测试阶段，仅供参考
5.借鉴sazs34大佬的smart脚本
更新日志:
7月28日: 
取消手动座席选择，增加硬卧，软卧，商务座等所有票价信息，优化通知;
支持boxjs远程自定义配置，增加可自定义车次，车次序号设置过大时可显示经过车次，可根据车次序号进行设置，由于苹果限制，车次可能显示不全
增加点击通知链接跳转详情页
～～～～～～～～～～～～～～～～
QX 1.0.6+ :
[task_local]
0 * * * * trainquery.js
# Remote 远程
0 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, tag=火车票及列车时刻
～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
火车票及列车时刻 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]
cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/trainquery.js, enabled=true, tag=火车票及列车时刻

-----------------

 */


const leftstat ='北京'  //出发地

      tostat = '上海'   //目的地

      peo = 'ADULT'   //乘客类型，'ADULT'是成人，'0X00'是学生

      lefdate = '2020-08-15' //出发日期

      settrain = '1'  //车次序号或者列车车次!!

const $ = new Env('列车时刻查询')

  leftstation = $.getdata('left')||leftstat

  tostation = $.getdata('end')||tostat

  purpose = $.getdata('people')||peo

  leftdate = $.getdata('leavedate')||lefdate

let K = $.getdata('setrain')||settrain

!(async () => {
  await namecheck()
  await trainscheck()
  await prize()
  await traintime()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())


//站点编码
function namecheck() {
  return new Promise((resolve, reject) =>{
const stationnocheck = {
    url: `https://kyfw.12306.cn/otn/resources/js/framework/station_name.js`,
    method: 'GET',
};
 $.get(stationnocheck, (err, resp, data) => {
    //console.log(response.statusCode + "\n\n" + data);
    statno =data.split(`${leftstation}`)[1].split("|")[1]
    tostat = data.split(`${tostation}`)[1].split("|")[1]
    resolve()
   })
  })
}

let nowDate = $.time('yyyy-MM-dd');
if (nowDate > leftdate ){
 $.msg(`火车查询错误❌`,"日期错误,请检查后重试",'')
}

// 获取车次列表
function trainscheck() {
 return new Promise((resolve, reject) =>{
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=${leftdate}&leftTicketDTO.from_station=${statno}&leftTicketDTO.to_station=${tostat}&purpose_codes=${purpose}`,
    method: 'GET',
    headers: {'Cookie' : 'JSESSIONID=1B1CEADF1B9F831C25E71D7F2D996294'}
};
 $.get(myRequest, (err, resp, data) => {
  //console.log('余票信息' + "\n\n" + data);
  let ress = JSON.parse(data)
try {
    let reg = /^[a-zA-Z][0-9]+$/
  for (i=0;i<ress.data.result.length;i++){
      yupiaoinfo = ress.data.result[i].split("|")
      train = yupiaoinfo[3],
      starttime = yupiaoinfo[8],
      arrivetime = yupiaoinfo[9],
      total = yupiaoinfo[10].split(":")[0]+'小时'+yupiaoinfo[10].split(":")[1]+'分钟',
      yingzuo = yupiaoinfo[29],
      yingwo = yupiaoinfo[28],
      ruanwo = yupiaoinfo[23],
      yideng = yupiaoinfo[31],
      erdeng = yupiaoinfo[30],
      wuzuo = yupiaoinfo[26],
      trainlist =  '['+(i+1)+'] 车次:'+train+" "+starttime+"--"+ arrivetime+" 总计时间:"+total+'\n一等座:'+yideng+' 二等座:'+erdeng+ ' 硬座:'+yingzuo+" 硬卧:"+yingwo+ "  软卧:"+ ruanwo+' 无座:'+wuzuo+'\n'
   //trainno = ress.data.result[i].split("|")[2]
      $.log(trainlist)
if(reg.test(K) && K== ress.data.result[i].split("|")[3]){
   K  = i+1
  }
}
if (K<=ress.data.result.length){
 info = ress.data.result[K-1].split("|")
      //console.log(info)
      traincode = info[3]  //列车车次
      trainno = info[2]    //列车编码
      fromstationno = info[16] //发车站序号
      tostationno = info[17]   //目的地序号
      fromstation = info[4]    //始发站编码
      endstation = info[5]     //终点站编码
      leftstationcode = info[6] //出发站编码
      tostationcode = info[7]   //目的地编码
      setyingzuo = info[29]     //硬座余票
      setyingwo = info[28]      //硬卧余票
      setyideng = info[31]      //一等座余票
      seterdeng = info[30]      //二等座余票
      setruanzuo = info[24]     //软座余票
      setwuzuo = info[26]       //无座余票
      setdongwo = info[33]      //动卧余票
      setshangwu = info[32]      //商务座余票
      setruanwopro = info[21]    //高级软卧余票
      setruanwo = info[23]      //软卧余票
      seattypes = info[35]      //座席代码
      totaltime  = info[10].split(":")[0]+'小时'+info[10].split(":")[1]+'分钟' //运行时间
      resolve()
  }
else if (!reg.test(K) && K>ress.data.result.length){
   var trainlist = ""
for (y=0;y<ress.data.result.length;y++){
   trainlist +=  (y+1)+'. '+ress.data.result[y].split("|")[3]+" "+ress.data.result[y].split("|")[8]+"-"+ ress.data.result[y].split("|")[9]+" 历时"+ress.data.result[y].split("|")[10].split(":")[0]+'时'+ress.data.result[y].split("|")[10].split(":")[1]+'分\n'
    }
 $.msg(`火车查询错误❌`,"共"+ress.data.result.length+"辆列车经过,请检查后重试",trainlist)
 return
}
}catch(e){
      $.msg(`火车查询错误❌`,"无此方向列车经过,请检查后重试",e)
      resolve()
      return 
     }
   })
  })
}


function prize() {
 return new Promise((resolve, reject) =>{
   var timestamp=$.startTime;
   const prizeurl = {
    url: `https://kyfw.12306.cn/otn/leftTicket/queryTicketPrice?train_no=${trainno}&from_station_no=${fromstationno}&to_station_no=${tostationno}&seat_types=${seattypes}&train_date=${leftdate}`,
    method: 'GET',
    headers : {'Accept-Encoding' : `gzip, deflate, br`,
'Connection' : `keep-alive`,
'Accept' : `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
'Host' : `kyfw.12306.cn`,
'Cookie' : `_uab_collina=159587465195914267490366; JSESSIONID=2D2C3ED0892CE56ADB0576B030CC1344; _jc_save_fromDate=${leftdate}; _jc_save_fromStation=${leftstation}%2C${leftstationcode}; _jc_save_toDate=${leftdate}; _jc_save_toStation=${tostation}%2${tostationcode}; _jc_save_wfdc_flag=dc; BIGipServerotn=250610186.64545.0000; route=9036359bb8a8a461c164a04f8f50b252;  RAIL_EXPIRATION=${timestamp}`,
'User-Agent' : `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/13.0 Safari/604.1`,
'Accept-Language' : `zh-cn` }
}
 $.get(prizeurl, (err, resp, data) => {
    //console.log('票价信息: 响应码: ' +resp.statusCode+" \n"+ data+'\n');
    if ( data == -1){
    $.msg('列车查询失败‼️', '该'+traincode+'次列车车票暂停发售或者查询失败,请重试', err)
     return
    }
   let result = JSON.parse(data)
   if (result.data.M){
   setyideng += `(${result.data.M})  `
   }
   if (result.data.O){
   seterdeng += `(${result.data.O})  `
   }
   if (result.data.A3){
   setyingwo += `(${result.data.A3})  `
   }
   if (result.data.F){
   setdongwo += `(${result.data.F})  `
   }
   if (result.data.A1){
   setyingzuo += `(${result.data.A1})  `
   }
   if (result.data.A2){
   setruanzuo += `(${result.data.A2})  `
   }
   if (result.data.WZ){
   setwuzuo += `(${result.data.WZ})  `
   }
   if (result.data.A9){
   setshangwu += `(${result.data.A9})  `
   }
   if (result.data.AI){
   setruanwo += `(${result.data.AI})  `
   }
   if (result.data.A4){
   setruanwo += `(${result.data.A4})  `
   }
   if (result.data.A6){
   setruanwopro += `(${result.data.A6})  `
   }
   if (result.data.AJ){
   setyingwo += `(${result.data.AJ})  `
   }
  })
resolve()
 })
}

function traintime() {
 return new Promise((resolve, reject) =>{
   const myRequest = {
    url: `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${trainno}&from_station_telecode=${fromstation}&to_station_telecode=${endstation}&depart_date=${leftdate}`,
    method: 'GET',
}
 $.get(myRequest, (err, resp, data) => {
   var detail = ""
    //console.log(response.statusCode + "\n\n" + data);
   let result = JSON.parse(data)
   if (result.status == true) {
const traincode = result.data.data[0].station_train_code
const arrivetime = result.data.data[0].arrive_time
   starttime = result.data.data[0].start_time
   stationname = result.data.data[0].station_name
   startstation = result.data.data[0].start_station_name
   edstation = result.data.data[0].end_station_name

if (setyideng){
   detail += '一等座: '+setyideng
  }
if (seterdeng){
   detail += ' 二等座: '+seterdeng
  }
if (setshangwu){
   detail += '\n商务座: '+setshangwu
  }
if (setyingzuo){
   detail += '硬座: '+setyingzuo
  }
if (setruanzuo){
   detail += ' 软座: '+setruanzuo  
  }
if (setwuzuo){
   detail += ' 无座: '+setwuzuo
  }
if (setruanwo){
   detail += '\n软卧: '+setruanwo
  }
if (setyingwo){
   detail += ' 硬卧: '+setyingwo
  }
if (setruanwopro){
   detail += ' 高级软卧: '+setruanwopro
  }
if (setdongwo){
  detail += ' 动卧: '+setdongwo
  }
if (purpose=='0X00'){
  purpose = '学生票 '
}
else {
  purpose = '成人票 '
}
  if(detail==""){
    detail += "该列车车票暂停发售或已停运,点击打开详情页查看"
  }
else{
     detail +="\n"+leftstation+'到达目的地'+tostation+'历时'+totaltime+'\n'+arrivetime +'--'+starttime+ '  '+stationname
}
for (i=1;i<result.data.data.length;i++){
    detail  += `\n`+result.data.data[i].arrive_time +'--'+result.data.data[i].start_time+ '  '+result.data.data[i].station_name
  }
  const openurl = encodeURI(`https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=${leftstation},${leftstationcode}&ts=${tostation},${tostationcode}&date=${leftdate}&flag=N,N,Y`)
const title = traincode+ "次列车"
const subTitle = '始发站: '+startstation+ '--终点站: '+edstation+' ('+purpose+ ')'
  $.msg(title+ " - 出行日期: " +leftdate, subTitle, detail, { "open-url": `${openurl}`})
  //console.log(traincode+'次列车  \n'+detail)
  }
  resolve()
  })
 })
}


function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}