# geek-image
极客图床，用来上传写Markown需要分享的图片

本项目2019年4月8日开始构建

19年5月5日上线啦~~~[http://pic.hackslog.com](http://pic.hackslog.com/)

## 运行

config文件夹下的keys.js

```
module.exports = {
    mongoURI: '' ,  //数据库连接的地址和密码
    secretOrKey: '',  //加密的字符串
    msm: {
        appKey: '',  //聚合数据的api申请的appKey
        signUpID: ''  //api模板的序号
    }
}
```

命令：

```
//服务端
npm run start
//客户端
npm run start
// 注册
// 登录
// 配置七牛云密钥
```

效果：

![image](http://qiniu.hackslog.cn/2019-04-21/811728198.png)

![image](http://qiniu.hackslog.cn/2019-04-21/615793546.png)

![image](http://qiniu.hackslog.cn/2019-04-21/392311125.png)

瀑布流（Pinterest）：

![image](http://qiniu.hackslog.cn/2019-04-25/334848397.png)

## 开发

* [vue2-dropzone](https://rowanwins.github.io/vue-dropzone/docs/dist/#/installation) 图片上传组件
  * [options](https://www.dropzonejs.com/#configuration-options) 
  * [drop中文版](http://wxb.github.io/dropzonejs.com.zh-CN/dropzonezh-CN/#installation) 
  * [dropzone的使用方法](https://blog.csdn.net/zyx1303031629/article/details/77449305) 
* [redis](https://github.com/MicrosoftArchive/redis/releases)
* [urlencode](https://www.npmjs.com/package/urlencode) 转换特殊字符，中文、日语等
* iview-Upload
  * before-upload：上传文件这前的事件钩子，若返回 false 或者 Promise 则停止自动上传
  * on-success: 上传文件成功后的事件钩子，返回 res(接口方返回的信息), file(上传文件), fileList(上传文件List)
  * [iView Upload实现手动上传](https://juejin.im/post/5aa92b32f265da2392360cb5)
* [koa-multer](https://www.npmjs.com/package/koa-multer)
* 七牛上传相关
  * [Koa2实现上传图片，并且同步上传到七牛云存储](https://segmentfault.com/a/1190000010398718)
  * [图床on七牛](https://cjting.me/web2.0/build-an-img-bed-on-qiniu/) 和对应的插件[源代码](https://github.com/fate-lovely/pic-on-qiniu/blob/master/qiniu.js)
  * [plupload](https://www.npmjs.com/package/plupload) JS-JDK需要依赖的 `npm install plupload`
  * [JavaScript SDK](https://developer.qiniu.com/kodo/sdk/1283/javascript) 客户端上传的依赖  `npm install qiniu-js`
  * [带你玩转七牛云存储——高级篇](https://cloud.tencent.com/developer/article/1156622)
  * [存储区域](https://developer.qiniu.com/kodo/manual/1671/region-endpoint) 根据bucket的不同地区会有不同的客户端上传地址，临近该数据中心访问更快
  * [魔法变量](https://developer.qiniu.com/kodo/manual/1235/vars)
  * [自定义响应内容](https://developer.qiniu.com/kodo/manual/1654/response-body#returnbody)
  * [七牛云上传测速](http://jssdk.demo.qiniu.io/performance)
  * [上传401报错码](https://developer.qiniu.com/kodo/kb/1330/upload-error-code-401) 
* [moment ](http://momentjs.cn/docs/#/displaying/) 格式化时间
* [vue-clipboard2](https://www.npmjs.com/package/vue-clipboard2) 将内容复制到剪贴板
* 阿里云OSS上传相关
  * [对象存储OSS](https://help.aliyun.com/document_detail/31947.html?spm=5176.87240.400427.2.70574614vr3oh2)
* 瀑布流相关
  * [vue-waterfall2](https://segmentfault.com/a/1190000017042878)
  * [vue-waterfall-easy](https://www.npmjs.com/package/vue-waterfall-easy)
  * [waterfall](https://github.com/watson-yan/waterfall) 
* [koa2-cors](https://github.com/zadzbw/koa2-cors) 允许跨域 
* [koa2-connect-history-api-fallback](https://www.npmjs.com/package/koa2-connect-history-api-fallback) 打包后访问`默认路径：默认端口/xxx`  无法访问，需要这个把路由转给vue-router
* [http-server](https://www.npmjs.com/package/http-server)

**VScode、Postman、mlab**



## 参考链接

* [教你如何用node连接redis](https://juejin.im/post/5ad208b451882555894a3ff2) 
* [Vue登录注册，并保持登录状态](https://blog.csdn.net/sinat_17775997/article/details/83450620)
* [页面刷新保持登录状态](https://juejin.im/post/5aa7d945518825558453ad8c) 
* [antDesign 图片上传](https://ant.design/components/upload-cn/)
* [iviw+axios实现图片预览及单请求批量上传](https://hayuq.com/blog/articles/189.shtml)
* [使用JSON Server](构建数据接口) 
* [Koa2之文件上下传](https://juejin.im/post/5abc451ff265da23a2292dd4) 
* [koa2下使用koa-multer上传文件](https://www.jianshu.com/p/f9062b969a6e)
* [异步上传图片](https://chenshenhai.github.io/koa2-note/note/upload/pic-async.html) 
* [使用$refs访问Vue中的DOM](https://www.w3cplus.com/vue/accessing-dom-refs.html)
* [mongodb数组更新操作](https://docs.mongodb.com/manual/reference/operator/update-array/)

## 接口

*  user
   *  获取验证码 POST  /api/users/code
      *  phone  接收验证码的手机号
   *  注册账户 POST  /api/users/register
      *  phone 手机号
      *  code 验证码
      *  password 密码
   *  登录账号 POST /api/users/login
      *  phone  手机号
      *  password 密码
   *  短信登录 POST api/users/codelogin
      *  phone 手机号
      *  code 验证码
*  upload
   *  上传图片到服务器的文件夹 POST  /api/upload/

```
curl http://localhost:3000/api/upload -F "file=@xxx.png"

mounted () {
	this.uploadList = this.$refs.upload.fileList;
}
```

* qiniu 
  * 上传文件  POST /api/qiniu/
    * filename 文件名
    * phone 用户手机号
  * 上传到特定的相册 POST /api/qiniu/foralbum
    * filename 文件名
    * phone 用户手机号
    * postId 相册的id
  * 保存和更改七牛配置信息 POST  /api/qiniu/config
    * accessKey
    * secretKey
    * bucketName
    * zone
    * bindURL
    * phone
  * 获取配置信息 GET  /api/qiniu/config?phone=xxx
* ablum
  * 获取所有相册信息 GET /api/album
  * 创建相册 POST /api/album/new
    * name 相册名字
    * phone 用户手机号
  * 相册重命名 POST /api/album/rename
    * albumID 所在相册的ID
    * name 重命名后的名字
  * 更改默认相册 POST /api/album/selected
    * selectedList 一个包含相册id的数组
  * 删除相册 POST /api/album/delete  后期增加管理相册的时候会有删除空间中的相片的需求
    * deleteList  需要删除的id号
  * 删除某些图片 POST /api/album/delete/image
    * deleteList  要删除图片的ID
    * albumID 所在相册的ID
  * 获取相册里的图片  GET /api/album/:id
  * 获取特定相册的信息 GET /api/album/info
    * albumID 相册的id 
  * 移动相册里的图片到另一个相册  POST /api/album/move
    * fromAlbum 原始相册的id
    * toAlbum 移动到的相册id
    * moveList 要转移的图片ID

## 部署概述

几个要点：

1. 服务端配置跨域。在开发环境下使用了cross-env来实现跨域，在产品上线的使用使用koa2-cors来实现
2. 配置客户端的环境变量。分别是.env.development和.env.production两个文件，其中变量是VUE_APP_开头，主要是axios的baseURL的配置。vue-router也有base配置，默认值是 `/` ,一般情况不用改
3. 数据库连接方式的改变。如果本来就是远程的数据库那不用改变

前端页面打包使用`npm run build命令` 复制出dist文件夹里面的静态文件到服务器即可。nginx安装后默认的静态文件放在`/var/www` 下面，不过也可以放在`/root` 和`/home` 等其他地方。部署的时候前端的端口没有意义，主要是注意axios请求后端的接口，使用pm2启动后端，前端用Nginx代理到自己的静态文件，因为静态文件里面有异步请求，自动会跟服务端进行交互。

简单的Nginx配置，在目录`/etc/nginx/conf.d/` 下面创建自己前端项目反向代理的配置文件，比如pic.config、blog.config等，修改完毕后nginx会自动跟nginx.conf合并

```
server {
        listen  80;
        server_name pic.hackslog.com;
        location / {
                root /var/www/pic/;
                try_files $uri $uri/ /index.html;
                index index.html;
        }
}
```



## 收获

* node连接Redis

```
npm install redis --save

```

* Linux使用redis

```
firewall-cmd --zone=public --add-port=6379/tcp --permanent 
```

* 通过v-for设定不同的ref需要使用绑定。不过$refs一般用来获取DOM的内容，不建议通过它来操作DOM，既然用了v-for，那么也能够从v-for中获取内容来替代。
* 使用七牛上传文件
  * 上传过程：
    * 根据AccessKey + SecretKey + bucket生成token，这个token从服务器返回给前端
    * 前端构建上传请求，上传文件到七牛云存储服务器
    * 七牛云存储服务器返回客户端文件上传的结果。
  * 踩坑指南：
    * js-sdk和plupload的版本对应问题
    * 前端生成Key是大写的
    * 上传凭证的有效期：因为时间戳的创建和验证在不同的服务端进行（在业务服务器创建，在云存储服务器验证），因此开发者的业务服务器需要尽可能校准时间，否则可能出现凭证刚创建就过期等各种奇怪的问题。
    * saveKey自定义资源名，如果客户端已指定Key, 以Key命名
    * 如果只有 callbackUrl 而没有 callbackBody，回调服务器收到的请求内容将为空
    * [Node.js SDK](https://developer.qiniu.com/kodo/sdk/1289/nodejs) 这个是新的qiniu npm开发文档，官网的Node.js SDK V6反而是旧的文档

![](http://qiniu.hackslog.cn/Snipaste_2019-04-17_16-33-14.png)

* 为了方便复制了代码，忘记了修改Schema导致的报错：` OverwriteModelError: Cannot overwrite `users` model once compiled.`
* 使用了浮动的话，父元素随着子元素增加大小增加的效果会消失，记得在父盒子的尾元素添加`clear:both` 
* 使用mongoose的findOneAndUpdate时，如果查找的是id，需要加 _id
* 在可迭代对象for..in中，判断item的序号不能使用`=== ` 
* 报错`Invalid prop: type check failed for prop "model". Expected Object, got Array` 一般出现在v-model中，我不小心在Form表单中绑定了数组
* mongoose的findById返回的直接是该元素
* Linux上使用命令`npm install pm2 -g` 后敲 `pm2 list` 得到的是 `pm2: command not found` 

这种情况要建立软链接，注意pm2的安装地址：

![image](http://qiniu.hackslog.cn/2019-05-05/260169984.png)

然后软链接的命令是： `ln /usr/local/nodejs/bin/pm2  /usr/local/bin/` ,完成后的效果：

![image](http://qiniu.hackslog.cn/2019-05-05/449891161.png)

* pm2常用命令：

```
pm2 start app.js  //启动文件
pm2 stop all #停止所有应用
pm2 stop 0 #停止id为0的应用
pm2 reload all #重启当下所有应用
pm2 list #列出pm2启动的程序
```

* Nginx配置   ，路径是`/etc/nginx/`
  * nginx -t检查配置是否正常 
  * sudo service nginx reload 静默更新   

```

server {
        listen  80;
        server_name pic.hackslog.com;
        location / {
                root /var/www/pic/;
                try_files $uri $uri/ /index.html;
                index index.html;
        }
}

```



![image](http://qiniu.hackslog.cn/2019-04-18/510067945.jpg)

## 问题

* 编程式导航params[不生效](https://router.vuejs.org/zh/guide/essentials/navigation.html)的情况
* mongoose嵌套数组的元素删除、替换