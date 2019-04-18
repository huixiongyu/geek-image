const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Album = require('../../models/Album')
const User = require('../../models/User')

/*
@route POST  /api/album/new
@desc创建相册
*/
router.post('/new', passport.authenticate('jwt', { session: false }),
    async ctx => {
    const name = ctx.request.body.name ? ctx.request.body.name : '新建相册'
    const phone = ctx.request.body.phone
    const findAlbum =await Album.find({name: name})
    if(findAlbum.length > 0){
        ctx.status = 401;
        ctx.body = {message: '相册名字重复！'}
        return 
    }
    const findUser = await User.find({phone: phone})
    if(findUser.length === 0){
        ctx.status = 401
        ctx.body = {message : '用户不存在'}
        return
    }
    const newAlbum = new Album({
        name,
        user: findUser[0].id
    })
    await newAlbum.save().catch(err => {
        console.log(err)
    });
    ctx.body = { message: '创建成功！' }
    ctx.status = 200
});

module.exports = router.routes();