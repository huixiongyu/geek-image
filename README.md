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
* [redis](https://github.com/MicrosoftArchive/redis/releases)
* [urlencode](https://www.npmjs.com/package/urlencode) 转换特殊字符，中文、日语等

**VScode、Postman、mlab**



## 参考链接

* [教你如何用node连接redis](https://juejin.im/post/5ad208b451882555894a3ff2)





## 功能完善

* 短信验证
* 七牛云
* 阿里云
* 又拍云
* chrome插件，上传和解析网站的画廊（图流）功能
* Electron客户端



## 接口

*  user
* msm



## 收获

* node连接Redis

```
npm install redis --save

```

