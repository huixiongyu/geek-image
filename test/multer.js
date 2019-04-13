const Koa=require('koa')
const multer=require('koa-multer')
const Router=require('koa-router')
const views=require('koa-views')
const path=require('path')
const app=new Koa()

//加载模板引擎
app.use(views(path.join(__dirname,'../views'),{
  extension:'ejs'
}))

const router=new Router()
router.get('/',async (ctx,next)=>{
  let title = 'hello koa2'
  await ctx.render('index', {
    title
  })
})

//文件上传
//配置
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置
var upload = multer({ storage: storage });
//路由
router.post('/upload',upload.single('file'),async(ctx,next)=>{
  console.log('abc')
  ctx.body = {
    filename: ctx.req.file.filename//返回文件名
  }
})

app.use(router.routes(), router.allowedMethods())

app.listen(5555,()=>{
  console.log('Server is running at port 5555...')
})