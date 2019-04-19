const Router = require('koa-router')
const router = new Router()
var request = require('request')
var querystring = require('querystring')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const secretOrKey = require('../../config/keys').secretOrKey
const tools = require('../../config/tools')
const MSM = require('../../config/keys').msm

// 引入User模型
const User = require('../../models/User')
const Code = require('../../models/Code')
const Album = require('../../models/Album')
// 引入字段验证
const validateRegisterInput = require('../../validation/register')
const validateSigninInput = require('../../validation/login')
const validatePasswordInput = require('../../validation/change-password')
const validatePhoneInput = require('../../validation/code')


function getRandom(){
    return Math.floor(Math.random()*10000);
}


//测试路由
router.get('/test', async ctx => {
    ctx.status = 200
    ctx.body = { msg: 'users works...' }
})
//获取验证码
router.post('/code', async ctx => {
    const { errors, isValid } = validatePhoneInput(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }
    const phone = ctx.request.body.phone
    const numCode = getRandom().toString()
    const queryData = querystring.stringify({
        "mobile": phone,  // 接受短信的用户手机号码
        "tpl_id": MSM.signUpID,  // 您申请的短信模板ID，根据实际情况修改
        "tpl_value": `#app#=geekImage&#code#=${numCode}`,  // 您设置的模板变量，根据实际情况修改
        "key": MSM.appKey,  // 应用APPKEY(应用详细页查询)
    });
    console.log(queryData);
    const queryUrl = 'http://v.juhe.cn/sms/send?'+queryData;
    const findResult = await Code.find({phone: phone})
    if(findResult.length > 0){
        const codeUpdate = findResult[0];
        codeUpdate.codeNum = numCode;
        await Code.findOneAndUpdate(
            { phone: phone},
            { $set: codeUpdate },
            { overwrite: true, new: true }
        );
    }else{
        const newCode = new Code({
            phone: ctx.request.body.phone,
            codeNum: numCode
        })
        // 存储到数据库
        await newCode
            .save()
            .catch(err => {
                console.log(err)
            });        
    }
    console.log("存储完毕！！准备发送短信")
    request(queryUrl,function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log(body) // 打印接口返回内容
            
            var jsonObj = JSON.parse(body); // 解析接口返回的JSON内容
            // console.log(jsonObj);
            ctx.status = 200
            ctx.body = { msg: 'code set success...' }
        } else {
            // console.log('请求异常');
            ctx.status = 403;
            ctx.body = { msg: '短信发送失败！' }
            return 
        }
    }); 
})

/*
@router  POST api/users/register
@desc 公开接口
 */
router.post('/register', async ctx => {
    const { errors, isValid } = validateRegisterInput(ctx.request.body)
    // console.log(errors);
    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }
    // 存储到数据库
    const findUser = await User.find({ phone: ctx.request.body.phone })
    const findCode = await Code.find({ phone: ctx.request.body.phone})
    if (findUser.length > 0) {
        ctx.status = 400
        ctx.body = { phone: '电话号码已被占用' }
    } else if(findCode.length > 0 && findCode[0].codeNum === ctx.request.body.code){
        const avatar_string = ctx.request.body.phone + 'gmail.com'
        const avatar = gravatar.url(avatar_string, {
            s: '200',
            r: 'pg',
            d: 'identicon'
        });
        const newUser = new User({
            phone: ctx.request.body.phone,
            avatar,
            password: tools.enbcrypt(ctx.request.body.password)
        })

        // 存储到数据库
        await newUser
            .save()
            .catch(err => {
                console.log(err)
            });
        console.log(`账户：${newUser.phone}创建成功！`)
        const findUser = await User.find({phone: ctx.request.body.phone})
        const newAlbum = new Album({
            name: '所有图片',
            user: findUser[0].id,
            selected: true
        })
        await newAlbum.save().catch(err => {
            console.log(err)
        });        
        const newAlbum2 = new Album({
            name: '默认相册',
            user: findUser[0].id,
            selected: true
        })
        await newAlbum2.save().catch(err => {
            console.log(err)
        });
        // 返回json数据
        ctx.body = { message: '注册成功！' }
    }else{
        ctx.status = 400
        ctx.body = {message: '无法通过验证，请重新尝试！'}
        return
    }
});

/*
@router POST  api/users/login
@desc 返回Token
 */
router.post('/login', async ctx => {
    const { errors, isValid } = validateSigninInput(ctx.request.body);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 查询
    const findResult = await User.find({ phone: ctx.request.body.phone });
    const user = findResult[0];
    const password = ctx.request.body.password;
    // console.log(password);
    // console.log(ctx.request.body.phone);
    // 判断查没查到
    if (findResult.length === 0) {
        ctx.status = 404;
        ctx.body = { email: '用户不存在!' };
    } else {
        // 查到后 验证密码
        let result = await bcrypt.compareSync(password, user.password);
        // 验证通过
        if (result) {
            // 返回token
            const payload = {
                id: user.id,
                avatar: user.avatar,
                phone: user.phone
            };
            const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600*24 });
            // console.log('Token设置成功')
            // console.log('验证完！')
            // console.log(token);
            ctx.body = { success: true, token: 'Bearer ' + token };
            ctx.status = 200;
        } else {
            ctx.status = 400;
            ctx.body = { password: '密码错误!' };
        }
    }
});

/*
@router POST  api/users/changepassword
@desc 返回Token
 */
router.post('/changepassword', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const {errors, isValid} = validatePasswordInput(ctx.request.body);
        console.log(ctx.request.body);
        console.log('我进来profile路由了')
        // 判断是否验证通过
        if (!isValid) {
            ctx.status = 400;
            ctx.body = errors;
            return;
        }
        //查询账户，修改密码
        const findResult = await User.find({id: ctx.request.body.id });
        const user = findResult[0];
        const password = ctx.request.body.old;
        //开始验证跟原始密码是否一致
        let result = await bcrypt.compareSync(password, user.password);
        // 验证通过
        if (result) {
            //开始修改
            const userUpdate ={
                phone: user.phone,
                avatar: user.avatar,
                password: tools.enbcrypt(ctx.request.body.newPass),
                banned: user.banned,
                date: user.date
            };
             await User.findOneAndUpdate(
                { username: ctx.request.body.username},
                { $set: userUpdate },
                { overwrite: true, new: true }
            );
            ctx.status = 200;
            ctx.body = { message: '密码已经修改了'};
        } else {
            ctx.status = 400;
            ctx.body = { password: '原始输入密码错误!' };
        }
    }
);




module.exports = router.routes();