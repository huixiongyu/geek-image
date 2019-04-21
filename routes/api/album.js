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
@desc 获取所有相册信息
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
            // console.log(item);
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
@route POST  /api/album/rename
@desc 相册重命名
*/
router.post('/rename', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const newName = ctx.request.body.name;
        const albumID = ctx.request.body.albumId;
        if(newName === ''){
            ctx.status = 400;
            ctx.body = {message: '相册名字不能为空！'};
            return ;            
        }
        const checkName = await Album.find({name: newName});
        if(checkName.length > 0){
            ctx.status = 400;
            ctx.body = {message: '相册名字不能重复！'};
            return ;           
        }
        const findAlbum = await Album.findById(albumID);
        if(!findAlbum){
            ctx.status = 400;
            ctx.body = {message: '该相册不存在！'};
            return ;
        }
        await Album.findOneAndUpdate(
            {_id: albumID},
            {$set: {name: newName}},
            {new: true}
        );
        ctx.body = { message: '相册名字修改成功！'};
        ctx.stale = 200;
    }
);


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

/*
@route POST  /api/album/delete/image
@desc 删除相册中的某些图片
@param 传递的是数组
*/
router.post('/delete/image', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const deleteList = ctx.request.body.deleteList;
        const albumID = ctx.request.body.albumID;
        if(deleteList.length === 0)
        {
            ctx.body = {message: '不存在需要删除的图片！'};
            ctx.status = 400;
            return ;
        }
        const findAlbum = await Album.findById(albumID);
        if(!findAlbum){
            ctx.body = {message: '该相册不存在！'};
            ctx.status = 400;
            return ;           
        }
        let imageList = [];
        for(let item of deleteList){
            for(let imageIndex in findAlbum.images){
                if(item !== findAlbum.images[imageIndex].id){
                    imageList.push(findAlbum.images[imageIndex])
                }
            }
        }
        await Album.findOneAndUpdate(
            { _id: albumID},
            {$set: {images: imageList}},
            {new: true}
        );
        ctx.body = {message: '图片删除成功！'};
        ctx.status = 200;
});

/*
@route GET  /api/album/info
@desc 查看相册具体内容
*/
router.get('/info', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const albumId = ctx.query.albumID;
        const findAlbum = await Album.findById(albumId);
        if(!findAlbum){
            ctx.status = 400;
            ctx.body = {message: '该相册不存在！'};
            return ;
        }
        let cover = ''
        if(findAlbum.images.length !== 0){
            cover = findAlbum.images[findAlbum.images.length -1].originURL;
        }else{
            cover = 'http://qiniu.hackslog.cn/2019-04-19/786412130.jpg'
        }
        const info = {
            name: findAlbum.name,
            selected: findAlbum.selected,
            picNum: findAlbum.images.length,
            albumID: albumId
        }
        ctx.body = info;
        ctx.status = 200;
});


/*
@route GET  /api/album/:id
@desc 查看相册具体内容
*/
router.get('/:id', passport.authenticate('jwt', { session: false }),
    async ctx => {
        const albumId = ctx.params.id;
        const findAlbum = await Album.findById(albumId);
        if(!findAlbum){
            ctx.status = 400;
            ctx.body = {message: '该相册不存在！'};
            return ;
        }
        const imageList = findAlbum.images;
        ctx.body = imageList;
        ctx.status = 200;
});



module.exports = router.routes();