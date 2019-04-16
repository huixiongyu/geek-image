const Router = require('koa-router')
const router = new Router()
var qiniu = require("qiniu");
const cloudKey = require('../../config/keys').cloudKey


//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = cloudKey.AK;
qiniu.conf.SECRET_KEY = cloudKey.SK;
//要上传的空间
const bucket = cloudKey.bucket;


function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}
//生成上传 Token
const token = uptoken(bucket, key);
//要上传文件的本地路径
filePath = './ruby-logo.png'
//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}
//调用uploadFile上传
uploadFile(token, key, filePath);             

