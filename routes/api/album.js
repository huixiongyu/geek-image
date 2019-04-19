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
    let selected = ctx.request.body.selected
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
    if(selected === 'yes'){
        selected = true
    }else{
        selected = false
    }
    const newAlbum = new Album({
        name,
        user: findUser[0].id,
        selected
    })
    await newAlbum.save().catch(err => {
        console.log(err)
    });
    ctx.body = { message: '创建成功！' }
    ctx.status = 200
});

/*
@route GET  /api/album
@desc 获取相册信息
*/
router.get('/', passport.authenticate('jwt', { session: false }),
    async ctx => {
    const findAlbum = await Album.find().sort({date: 1});
    let resultList = [];
    for(let item of findAlbum){
        let cover = ''
        if(item.images.length !== 0){
            cover = item.images[item.images.length -1].originURL;
        }else{
            cover = 'http://qiniu.hackslog.cn/2019-04-19/786412130.jpg'
        }
        const resultItm = {
            name: item.name,
            selected: item.selected,
            cover: cover,
            picNum: item.images.length,
            albumID: item.id
        }
        resultList.push(resultItm);
    }
    ctx.body = resultList;
    ctx.status = 200;
});


/*
@route POST  /api/album/selected
@desc 更改默认相册
*/
router.post('/selected', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const selectList = ctx.request.body.selectedList;
        const albumList = await Album.find();
        for(let item of albumList){
            const itemID = item.id;
            await Album.findOneAndUpdate(
                {_id: itemID},
                {$set: {selected: false}},
                {new: true}
            );
            // console.log(albumUpdate);
        }
        for(let item of selectList){
            console.log(item);
            await Album.findOneAndUpdate(
                {_id: item},
                {$set: {selected: true}},
                {new: true}
            );
            // console.log(albumUpdate);
        }
        ctx.body = {message: '默认相册修改成功！'};
        ctx.status = 200;
});

/*
@route POST  /api/album/delete
@desc 删除相册
*/
router.post('/delete', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const deleteOne = ctx.request.body.deleteOne;
        const findAlbum = await Album.findById(deleteOne);
        if(!findAlbum){
            ctx.status = 400;
            ctx.body = {message: '该相册不存在！'};
            return ;
        }
        await Album.remove({_id: deleteOne}, () =>{
            console.log('相册删除成功！');
        });
        ctx.body = {message: '相册删除成功！'};
        ctx.status = 200;
});


module.exports = router.routes();