<template>
    <div class="album">
        <div class="control-area">
            <image-uploader :post-id="albumPath" class="uploader"></image-uploader>
             <Button type="text" size="large" @click="hanldeRename">{{albumInfo.name}}-{{albumInfo.picNum}}</Button>
             <div class="delete-btn">
                 <Button type="primary" @click="handleLeftClick">{{moveImagesBtn}}</Button>
                <Button type="error" @click="handleRightClick">{{deleteBtn}}</Button>
             </div>
        </div>
        <div class="albums">
            <div class="box" v-for="item in imageList" :key="item.originURL" @click="handleSelect(item)">
                <div class="pic">
                    <img :src="item.originURL"/>
                     <i class="iconfont select-pic" v-show="(!item.beSelected) && showPicBtn">&#xe72e;</i>
                     <i class="iconfont select-pic be-selected" v-show="item.beSelected && showPicBtn">&#xe62d;</i>
                </div>
                <div class="tools">
                    <Icon size="24" type="md-copy" @click="handleCopy(item.originURL)" />
                    <Icon size="24" type="ios-link" @click="handleToLink(item.originURL)"/>
                    <Icon size="24" type="md-expand" @click="handleExpand(item.originURL)" />
                    <Icon size="24" type="logo-markdown" @click="handleMarkdown(item.markdownURL)" />
                </div>
            </div>                                                                                                                            
        </div>
        <Modal
            class-name="vertical-center-modal"
            v-model="renameModal"
            title="相册重命名">
            <Input prefix="md-aperture" 
                class="rename" 
                placeholder="Enter name"
                autofocus
                clearable
                v-model="newName" 
                style="width: 300px; height: 50px;" />
            <Button class="album-modal-btn" @click="toRename" type="primary" slot="footer">确认</Button>
        </Modal>           
        <Modal
            v-model="imageModal"
            title="图片">
            <div class="image-expand">
                <img :src="imageURL" alt="">
            </div>
        </Modal>   
        <!-- 移动图片的选择框，这里要出现列表 -->
        <Modal
            class-name="vertical-center-modal"
            v-model="moveModal"
            title="移动图片到其他相册">
            <Select v-model="albumMoveTo" style="width:200px">
                <Option v-for="item in albumSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button class="album-modal-btn" @click="confirmMove" type="primary" slot="footer">确认</Button>
        </Modal>             
        <BackTop :bottom="100"></BackTop>             
    </div>
</template>
<script>
import ImageUploader from '../components/ImageUploader'
export default {
    name: 'album',
    components: {
        ImageUploader
    },
    data(){
        return {
            imageList: [],
            albumsInfo: [],
            albumSelect: [],
            imageModal: false,
            renameModal: false,
            moveModal: false,
            albumPath: '',
            albumInfo: {},
            imageURL: '',
            newName: '',
            showPicBtn: false,
            deleteList: [],  //删除和移动都是
            moveImagesBtn: '移动图片',
            deleteBtn: '删除图片',
            albumMoveTo: ''
        }
    },
    methods: {
        getData(){
            this.$axios.get('/api/album')
                .then(res => {
                    this.albumsInfo = res.data;
                    for(let item of this.albumsInfo){
                        if((this.albumPath !== item.albumID) && (item.name !== '所有图片')){
                            const albumItem = {
                                value: item.albumID,
                                label: item.name
                            }
                            this.albumSelect.push(albumItem);
                        }
                    }
                    // console.log(`这是筛选后的数组：${this.albumSelect}`);                    
                })
                .catch(error => {
                    console.log(error);
                });
            this.$axios.get(`/api/album/${this.albumPath}`)
                .then(res => {
                    let resultList = res.data;
                    resultList.sort((a,b) => {
                        return a.date < b.date ? 1: -1;
                    })
                    this.imageList = resultList;
                })
                .then(() => {
                    this.$axios.get(`/api/album/info?albumID=${this.albumPath}`)
                        .then(res => {
                            this.albumInfo = res.data;
                        })
                })
                .catch(error  => {
                    console.log(error);
                });
        },
        handleCopy(url){
            this.$Notice.success({
                title: '链接复制成功',
                desc: url
            });
            this.$copyText(url).then(function () {
                console.log('链接复制成功');
            }, function (e) {
                console.log(e);
            })
        },
        handleToLink(url){
            window.open(url, '_blank');
        },
        handleExpand(url){
            this.imageURL = url;
            this.imageModal = true;
        },
        handleMarkdown(url){
            this.$Notice.success({
                title: 'Markdown链接复制成功',
                desc: url
            });
            this.$copyText(url).then(function () {
                console.log('Markdown链接复制成功');
            }, function (e) {
                console.log(e);
            })            
        },
        hanldeRename(){
            this.renameModal = true;
        },
        toRename(){
            if(this.newName === ''){
                this.$Message.warning('相册名字不能为空');
                return ;
            }
            this.$axios.post('/api/album/rename', {name: this.newName, albumId: this.albumPath})
                .then(() => {
                    this.$Message.success('相册名字修改成功！');
                    this.newName = '';
                    this.renameModal = false;
                    location.reload();
                }, () => {
                    this.$Message.error('名字重复，创建失败！');
                    this.newName = '';
                })
                .catch(error => {
                    console.log(error);
                })
        },
        handleSelect(item){
            if(item.beSelected){
                this.$set(item, "beSelected", false);
                const removeIndex = this.deleteList.indexOf(item.originURL);
                // console.log(removeIndex);
                if(removeIndex !== -1){
                     this.deleteList.splice(removeIndex, 1);
                }
            }else{
                this.$set(item, "beSelected", true);
                this.deleteList.push(item.originURL);
            }
            
            console.log(this.deleteList);
        },
        handleLeftClick(){
            if(this.moveImagesBtn === '移动图片'){  
                //进入选择状态
                this.moveImagesBtn = '确认移动';
                this.deleteBtn = '取消选择';
                this.showPicBtn = true;
            }else if(this.moveImagesBtn === '确认移动'){
                if(this.deleteList.length === 0){
                    this.$Message.warning('你还没选择任何图片呢！');
                    return;
                }
                this.moveModal = true;
            }else{ 
                // 确认删除
                if(this.deleteList.length === 0){
                    this.$Message.warning('你还没选择任何图片呢！');
                    return;
                }                
                this.confirmDelete();
            }
        },
        handleRightClick(){
            if(this.deleteBtn === '删除图片'){ 
                //进入选择状态
                console.log('删除！！！！！！！！！！！！！！！')
                this.deleteBtn = '取消选择';
                this.moveImagesBtn = '确认删除'
                this.showPicBtn = true;
            }else{ 
                //取消选择
                this.showPicBtn = false;
                this.moveImagesBtn = '移动图片';
                this.deleteBtn = '删除图片';
                this.deleteList = [];
                for(let item of this.imageList){
                    this.$set(item, "beSelected", false);
                } 
            }
        },
        confirmDelete(){
            if(this.deleteList.length === 0){
                this.$Message.warning('没有需要删除的图片！');
                return ;
            }
            this.$axios.post('/api/album/delete/image',{
                deleteList: this.deleteList,
                albumID: this.albumPath
            })
            .then(() => {
                this.$Message.success('删除成功！');
                location.reload();
            }, () => {
                this.$Message.warning('删除失败！');
            });
        },
        confirmMove(){
            const postData = {
                fromAlbum: this.albumPath,
                toAlbum: this.albumMoveTo,
                moveList: this.deleteList
            }
            this.$axios.post('/api/album/move', postData)
                .then(() =>{
                    this.$Message.success('移动成功！');
                    this.moveModal = false;
                    location.reload();
                    
                }, () => {
                    this.$Message.error('转移失败！');
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    created(){
        this.albumPath = this.$route.params.path;
        this.getData();  
    }
}
</script>
<style lang="less">
    .album{
        position: relative;
        width: 100%;
        min-height: 1010px;
        background-color: #EEFFFF;
    }
    .control-area{
        width: 100%;
        height: 100px;
        padding-left: 150px;
        padding-right: 150px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        .ivu-btn-text{
            font-size: 26px;
            font-weight: 600;
        }
        .delete-btn{
            width: 200px;
            display: flex;
            justify-content: space-between;
        }
    }
    .albums{
        position: relative;
        width: 100%;
        min-height: 550px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .box{
            width: 282px;
            height: 320px;
            box-sizing: border-box;
            margin: 30px;
            .pic{
                position: relative;
                padding: 10px;
                border:1px solid #ccc;
                box-shadow: 0 0 6px #ccc;
                border-radius: 5px;
                width:260px;
                height:260px;
                img{
                    width:100%;
                    height:100%;
                    background-color: antiquewhite;
                }
                .select-pic{
                    position: absolute;
                    right: 12px;
                    top: 6px;
                    z-index: 99;
                    font-size: 28px;
                    color: black;
                    cursor: pointer;
                }
                .be-selected{
                    color: #7FFF00;
                }
            }
            .tools{
                width: 100%;
                height: 38px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .ivu-icon{
                    &:hover{
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .image-expand{
        width: 500px;
        img{
            width: 100%;
            height: auto;
        }
    }
    .rename{
        .ivu-input{
            height: 35px;

        }
    }
</style>
