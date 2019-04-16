# geek-image
极客图床，用来上传写Markown需要分享的图片

本项目2019年4月8日开始构建



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
  * [存储区域](https://developer.qiniu.com/kodo/manual/1671/region-endpoint) 根据bucket的不同地区会有不同的客户端上传地址
  * [魔法变量](https://developer.qiniu.com/kodo/manual/1235/vars)
* [moment ](http://momentjs.cn/docs/#/displaying/) 格式化时间



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





## 功能完善

* 短信验证
* 七牛云
* 阿里云
* 又拍云
* chrome插件，上传和解析网站的画廊（图流）功能
* Electron客户端



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
*  upload
   *  上传图片到服务器的文件夹 POST  /api/upload/

```
curl http://localhost:3000/api/upload -F "file=@xxx.png"

mounted () {
	this.uploadList = this.$refs.upload.fileList;
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



