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

var options = {
    scope: bucket,
    expires: 7200,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',

  };
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

function renderUniFileName() {
  const newDate = new Date(Date.now());
  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const date = newDate.getDate();
  const randomNum = Math.floor(Math.random() * 99999999);
  return `${year}-${month}-${date}/${randomNum}.jpg`
}


router.post('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
      console.log(ctx);
      let key = renderUniFileName();
      console.log(key);
      ctx.body = {
        token: uploadToken,
        key: key
        };
    }
);


module.exports = router.routes();