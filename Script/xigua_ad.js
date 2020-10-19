/*
 西瓜视频去除内容页广告 
[rewrite_local]
https:\/\/api3-normal-c-hl\.ixigua\.com\/video\/app\/stream\/ url script-response-body xigua_ad.js
[mitm]
hostname = api*-normal-c-hl.ixigua.com
*/
 var obj = JSON.parse($response.body);
 for (i=0; i< obj.data.length;i++){
  if(obj.data[i].content.indexOf("ad_label") > -1) {
      delete obj.data[i].content
    }
 }
$done(JSON.stringify(obj))
