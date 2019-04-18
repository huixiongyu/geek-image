const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const cloudKey = require('../../config/keys').cloudKey
var qiniu = require("qiniu");

const User = require('../../models/User')
const Cloud = require('../../models/Cloud')

const validateQiniuInput = require('../../validation/qiniu-config')
//需要填写你的 Access Key 和 Secret Key
var accessKey = cloudKey.AK;
var secretKey = cloudKey.SK;
//要上传的空间
const bucket = cloudKey.bucket;

var options = {
    scope: bucket,
    expires: 7200,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  };
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

/*
@route POST /api/qiniu/
@desc 上传文件
@param filename  phone
*/
router.post('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
      // console.log(ctx);
      const filename = ctx.request.body.filename;
      //判断文件类型是否允许
      let allowedFiles = ['jpg', 'jpeg', 'jif', 'png'];
      const fileArray = filename.split('.');
      const fileType = fileArray[fileArray.length - 1];
      const filterResult = allowedFiles.filter(item => item === fileType);
      console.log(filterResult);
      if(filterResult.length === 0){
        ctx.status = 401;
        ctx.body = {
          message: '文件类型不允许！'
        }
        return ;
      }
      const key = filename;
      // console.log(key);
      const orginURL = `${cloudKey.bindURL}/${key}`;
      const markdownURL = `![image](${cloudKey.bindURL}/${key})`;
      //保存到Image模型


      //保存到特定相册
      ctx.body = {
        token: uploadToken,
        key: key,
        orginURL,
        markdownURL
      };
    }
);

/*
@route POST /api/qiniu/config
@desc 保存和更新七牛的配置
@params AK, SK ,blucket, zone, url
*/
router.post('/config', passport.authenticate('jwt', { session: false }),
    async ctx => {
      const { errors, isValid } = validateQiniuInput(ctx.request.body)
      // 判断是否验证通过
      if (!isValid) {
          ctx.status = 400
          ctx.body = errors
          return
      }
      const { accessKey, secretKey, bucketName, zone, bindURL, phone } = ctx.request.body;
      const findUser = await User.find({phone: phone});
      if(findUser.length === 0){
        ctx.status = 401
        ctx.body = {message: '用户不存在'}
        return
      }
      const findCloud = await Cloud.find({accessKey:accessKey});
      if(findCloud.length === 0){
        const postID = findUser[0].id
        const newCloud = new Cloud({
          accessKey,
          secretKey,
          bucketName,
          zone,
          bindURL,
          user: postID,
          cloudName: 'qiniu'
        })
        await newCloud.save().catch(err => {
          console.log(err)
        });
        ctx.status = 200
        ctx.body = {message: '创建成功！'}
      }else{
        const updateCloud = findCloud[0]
        updateCloud.secretKey = secretKey
        updateCloud.bucketName = bucketName
        updateCloud.zone = zone
        updateCloud.bindURL = bindURL
        await Cloud.findOneAndUpdate(
          { accessKey: accessKey },
          { $set: updateCloud },
          { new: true }
        );
        ctx.status = 200
        ctx.body = { message: '更改成功！'}
      }
    }
)

/*
@route POST /api/qiniu/config
@desc 保存和更新七牛的配置
@params AK, SK ,blucket, zone, url
*/
router.get('/config', passport.authenticate('jwt', { session: false }),
    async ctx => {
    }
);

module.exports = router.routes();