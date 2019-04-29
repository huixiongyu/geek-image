const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const cloudKey = require('../../config/keys').cloudKey
var qiniu = require("qiniu");

const User = require('../../models/User')
const Cloud = require('../../models/Cloud')
const Image = require('../../models/Image')
const Album = require('../../models/Album')

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

// 七牛的基础配置
let httpMap = new Map([
  ["z0", "http://upload.qiniup.com"],
  ["z1", "http://upload-z1.qiniup.com"],
  ["z2", "http://upload-z2.qiniup.com"],
  ["na0", "http://upload-na0.qiniup.com"],
  ["as0", "http://upload-as0.qiniup.com"]
])

let httpsMap = new Map([
  ["z0", "https://upload.qiniup.com"],
  ["z1", "https://upload-z1.qiniup.com"],
  ["z2", "https://upload-z2.qiniup.com"],
  ["na0", "https://upload-na0.qiniup.com"],
  ["as0", "https://upload-as0.qiniup.com"]
])
/*
@route POST /api/qiniu/
@desc 上传文件
@param filename  phone
*/
router.post('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
      // console.log(ctx);
      const filename = ctx.request.body.filename;
      const phone = ctx.request.body.phone;
      //判断文件类型是否允许
      let allowedFiles = ['jpg', 'jpeg', 'gif', 'png'];
      const fileArray = filename.split('.');
      const fileType = fileArray[fileArray.length - 1];
      const filterResult = allowedFiles.filter(item => item === fileType);
      // console.log(filterResult);
      if(filterResult.length === 0){
        ctx.status = 401;
        ctx.body = {
          message: '文件类型不允许！'
        }
        return ;
      }
      const key = filename;
      // console.log(key);
      const originURL = `${cloudKey.bindURL}/${key}`;
      const markdownURL = `![image](${cloudKey.bindURL}/${key})`;
      //保存到Image模型
      const findUser = await User.find({phone: phone});
      if(findUser.length === 0){
        ctx.status = 400;
        ctx.body = {message: '不存在的用户！'};
        return ;
      }
      const userId = findUser[0].id;
      const newImage =new  Image({
        user: userId,
        originURL,
        markdownURL
      });
      await newImage.save().catch(err => {
        console.log(err)
      });
      // console.log('保存到了Image模型！')
      //保存到默认相册和所有图片
      const findAlbum = await Album.find({selected: true});
      // console.log(findAlbum);
      const imageItem = {
        originURL,
        markdownURL
      }
      for(let item of findAlbum){
        const itemID = item.id;
        // console.log(itemID);
        const albumUpdate = await Album.findOneAndUpdate(
          {_id: itemID},
          {$push: {images: imageItem}},
          {new: true}
        );
        // console.log(albumUpdate);
      }
      // console.log('保存到了相册！');
      ctx.body = {
        token: uploadToken,
        key: key,
        originURL,
        markdownURL
      };
    }
);

/*
@route POST /api/qiniu/foralbum
@desc 上传文件
@param filename  phone postId
*/
router.post('/foralbum', passport.authenticate('jwt', { session: false }),
    async ctx => {
      // console.log(ctx);
      const filename = ctx.request.body.filename;
      const phone = ctx.request.body.phone;
      const postId = ctx.request.body.postId;
      //判断文件类型是否允许
      let allowedFiles = ['jpg', 'jpeg', 'gif', 'png'];
      const fileArray = filename.split('.');
      const fileType = fileArray[fileArray.length - 1];
      const filterResult = allowedFiles.filter(item => item === fileType);
      // console.log(filterResult);
      if(filterResult.length === 0){
        ctx.status = 401;
        ctx.body = {
          message: '文件类型不允许！'
        }
        return ;
      }
      const key = filename;
      // console.log(key);
      const originURL = `${cloudKey.bindURL}/${key}`;
      const markdownURL = `![image](${cloudKey.bindURL}/${key})`;
      //保存到Image模型
      const findUser = await User.find({phone: phone});
      if(findUser.length === 0){
        ctx.status = 400;
        ctx.body = {message: '不存在的用户！'};
        return ;
      }
      const userId = findUser[0].id;
      const newImage =new  Image({
        user: userId,
        originURL,
        markdownURL
      });
      await newImage.save().catch(err => {
        console.log(err)
      });
      // console.log('保存到了Image模型！')
      //保存到默认相册
      const findAlbum = await Album.findById(postId);
      if(!findAlbum){
        ctx.body = {message: '该相册不存在！'};
        ctx.status = 400;
        return;
      }
      const imageItem = {
        originURL,
        markdownURL
      }
      await Album.findOneAndUpdate(
          {_id: postId},
          {$push: {images: imageItem}},
          {new: true}
      );
      // 保存到  所有相册
      const findAllAlbum = await Album.find({name: '所有图片'});
      const itemID = findAllAlbum[0].id;
      console.log(itemID);
      await Album.findOneAndUpdate(
        {_id: itemID},
        {$push: {images: imageItem}},
        {new: true}
      );   
      ctx.body = {
        token: uploadToken,
        key: key,
        originURL,
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
@route GET /api/qiniu/config?phone=xxx
@desc 保存和更新七牛的配置
@params phone
*/
router.get('/config', passport.authenticate('jwt', { session: false }),
    async ctx => {
      const phone = ctx.query.phone
      // console.log(phone)
      const findUser = await User.find({phone: phone})
      if(findUser.length === 0){
        ctx.status = 400
        ctx.body = {message: '用户不存在！'}
        return 
      }
      const findCloud = await Cloud.find({user: findUser[0].id})
      if(findCloud.length === 0){
        ctx.status =400
        ctx.body = {message: '未存储配置信息！'}
        return
      }
      const zone = findCloud[0].zone
      const bindURL = findCloud[0].bindURL
      const accessKey = findCloud[0].accessKey
      const secretKey = findCloud[0].secretKey
      const bucketName = findCloud[0].bucketName
      if(bindURL.startsWith("http")){
        ctx.body = {
          address: httpMap.get(zone),
          bindURL,
          accessKey,
          secretKey,
          bucketName,
          zone
        }
      }else{
        ctx.body = {
          address: httpsMap.get(zone),
          bindURL,
          accessKey,
          secretKey,
          bucketName,
          zone          
        }
      }
      ctx.status = 200
    }
);

module.exports = router.routes();