const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const secretOrKey = require('../../config/keys').secretOrKey
const tools = require('../../config/tools')

// 引入User模型
const User = require('../../models/User')

// 引入字段验证
const validateRegisterInput = require('../../validation/register')
const validateSigninInput = require('../../validation/sign-in')
const validatePasswordInput = require('../../validation/change-password')

//测试路由
router.get('/test', async ctx => {
    ctx.status = 200
    ctx.body = { msg: 'users works...' }
})

/*
@router  POST api/users/register
@desc 公开接口
 */
router.post('/register', async ctx => {
    const { errors, isValid } = validateRegisterInput(ctx.request.body)
    // 判断是否验证通过
    if (!isValid) {
        ctx.status = 400
        ctx.body = errors
        return
    }
    // 存储到数据库
    const findResult = await User.find({ email: ctx.request.body.phone });
    if (findResult.length > 0) {
        ctx.status = 400
        ctx.body = { phone: '电话号码已被占用' }
    } else {
        const avatar_string = ctx.request.body.email + 'gmail.com'
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

        // 返回json数据
        ctx.body = { message: '注册成功！' }
    }
});

/*
@router POST  api/users/signin
@desc 返回Token
 */
router.post('/signin', async ctx => {
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
            const token = jwt.sign(payload, secretOrKey, { expiresIn: 3600 });
            // console.log('Token设置成功')
            ctx.status = 200;
            ctx.body = { success: true, token: 'Bearer ' + token };
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