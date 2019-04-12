var request = require('request');
var querystring = require('querystring');
const MSM = require('./config/keys.js').msm;

var queryData = querystring.stringify({
    "mobile": "",  // 接受短信的用户手机号码
    "tpl_id": MSM.signUpID,  // 您申请的短信模板ID，根据实际情况修改
    "tpl_value": "#app#=helloworld&#code#=8263",  // 您设置的模板变量，根据实际情况修改
    "key": MSM.appKey,  // 应用APPKEY(应用详细页查询)
});

var queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;

request(queryUrl, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body) // 打印接口返回内容
		
		var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
		console.log(jsonObj)
	} else {
		console.log('请求异常');
	}
}) 