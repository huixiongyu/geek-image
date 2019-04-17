const multer = require('koa-multer')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const cloudKey = require('../../config/keys').cloudKey
var qiniu = require("qiniu");
//文件上传到服务器
let fileName = ''
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')  //注意路径必须存在
    },    //修改文件名称
    filename(ctx,file,cb){
        console.log(file.originalname);
        const filenameArr = file.originalname.split('.');
        console.log(filenameArr);
        fileName = Date.now() + '.' + filenameArr[filenameArr.length-1];
        console.log(fileName);
        cb(null, fileName);
      }
})
//加载配置
var upload = multer({
     storage: storage,
     limits: {
        fileSize: 1024*1024*5 // 限制5M
      }
});


//七牛上传配置
const accessKey = cloudKey.AK;
const secretKey = cloudKey.SK;
const bucket = cloudKey.bucket;
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
var options = {
    scope: bucket,
    expires: 7200,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)"}'
  };

//生成token
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

//准备上传配置
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

router.post('/',upload.single('file'), async (ctx, next) => {
    var localFile= `public/uploads/${fileName}`;
    var key= fileName;  
    console.log('路由里面的fileName');
    console.log(key);
    await formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
        respBody, respInfo) {
        if (respErr) {
            throw respErr;
        }
        if (respInfo.statusCode == 200) {
            console.log(respBody);
            ctx.body = {data: respBody};
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
})


// router.post('/', upload.single('file'), async (ctx, next) => {
//     console.log(ctx.req.file.filename);
//     ctx.body = {
//         filename: ctx.req.file.filename//返回文件名
//     }
// })

module.exports = router.routes();