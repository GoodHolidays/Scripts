'use strict';
exports.main_handler = async (event, context, callback) => {
  try {
    const { TENCENTSCF_SOURCE_TYPE, TENCENTSCF_SOURCE_URL } = process.env
    //如果想在一个定时触发器里面执行多个js文件需要在定时触发器的【附加信息】里面填写对应的名称，用 & 链接
    //例如我想一个定时触发器里执行jd_speed.js和jd_bean_change.js，在定时触发器的【附加信息】里面就填写 jd_speed&jd_bean_change
    for (const v of event["Message"].split("&")) {
      console.log(v);
      var request = require('request');
      switch (TENCENTSCF_SOURCE_TYPE) {
        case 'local':
          //1.执行自己上传的js文件
          delete require.cache[require.resolve('./Task/'+v+'.js')];
          require('./Task/'+v+'.js')
          break;
        default:
          //2.执行自定义远端js文件网址
          if (!TENCENTSCF_SOURCE_URL) return console.log('自定义模式需要设置TENCENTSCF_SOURCE_URL变量')
          request(`${TENCENTSCF_SOURCE_URL}${v}.js`, function (error, response, body) {
            eval(response.body)
          })
          break;
      }
    }
  } catch (e) {
    console.error(e)
  }
}
