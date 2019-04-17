const multer = require('koa-multer')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
//配置
var storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')  //注意路径必须存在
    },    //修改文件名称
    filename(ctx,file,cb){
        console.log(file.originalname);
        const filenameArr = file.originalname.split('.');
        console.log(filenameArr);
        const fileName = Date.now() + '.' + filenameArr[filenameArr.length-1];
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

router.post('/', upload.single('file'), async (ctx, next) => {
    console.log(ctx.req.file.filename);
    ctx.body = {
        filename: ctx.req.file.filename//返回文件名
    }
})

module.exports = router.routes();