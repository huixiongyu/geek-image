const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const cloudKey = require('../../config/keys').cloudKey
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
var accessKey = cloudKey.AK;
var secretKey = cloudKey.SK;
//要上传的空间
const bucket = cloudKey.bucket;
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;

var localFile =  '../../public/uploads/1555510429588.jpg'

var options = {
    scope: bucket,
    expires: 7200,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',

  };
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key='test.jpg';

// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});






router.get('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
      await uploadFile(token, key, filePath);
      ctx.body = {message: '上传成功！'};
    }
);


module.exports = router.routes();