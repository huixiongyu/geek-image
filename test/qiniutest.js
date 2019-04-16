const cloudKey = require('../config/keys').cloudKey
var qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
var accessKey = cloudKey.accessKey;
var secretKey = cloudKey.secretKey;
//要上传的空间
const bucket = cloudKey.bucket;

var options = {
    scope: bucket,
  };
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

console.log(uploadToken);
