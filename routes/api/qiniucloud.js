const Router = require('koa-router')
const router = new Router()
var qiniu = require("qiniu");
const passport = require('koa-passport')
const cloudKey = require('../../config/keys').cloudKey
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = cloudKey.accessKey;
qiniu.conf.SECRET_KEY = cloudKey.secretKey;
//要上传的空间
const bucket = cloudKey.bucket;

const key = 'my-nodejs-logo.png';


filePath = '../../public/uploads/1555510429588.jpg'




router.get('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
      await uploadFile(token, key, filePath);
      ctx.body = {message: '上传成功！'};
    }
);


module.exports = router.routes();