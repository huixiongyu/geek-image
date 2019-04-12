const Router = require('koa-router')
const router = new Router()
var request = require('request');
var querystring = require('querystring');
const MSM = require('../..config/keys.js').msm;
const redis = requier('../../config/reids');


function getRandom(){
    return Math.floor(Math.random()*10000);
}

/*
@ api  POST /api/code/
@desc 
*/
router.post('/', async ctx => {
    const phone = ctx.request.body.phone;
    const numCode = getRandom(); 
    const queryData = querystring.stringify({
        "mobile": phone,  // 接受短信的用户手机号码
        "tpl_id": MSM.signUpID,  // 您申请的短信模板ID，根据实际情况修改
        "tpl_value": `#app#=Imaged&#code#=${numCode}`,  // 您设置的模板变量，根据实际情况修改
        "key": MSM.appKey,  // 应用APPKEY(应用详细页查询)
    });
    const queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
    request(queryUrl,async function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 打印接口返回内容
            
            var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
            console.log(jsonObj);
            await redis.setKey(phone, numCode);
        } else {
            console.log('请求异常');
        }
    }) 
    ctx.status = 200;
}
);


module.exports = router.routes();