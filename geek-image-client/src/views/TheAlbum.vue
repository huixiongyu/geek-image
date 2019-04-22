<template>
    <div class="album">
        <div class="control-area">
            <image-uploader :post-id="albumPath" class="uploader"></image-uploader>
             <Button type="text" size="large" @click="hanldeRename">{{albumInfo.name}}</Button>
             <div class="delete-btn">
                 <Button type="primary" @click="confirmDelete" v-if="showPicBtn">确认删除</Button>
                <Button type="error" @click="handleDelete">{{deleteBtn}}</Button>
             </div>
        </div>
        <div class="albums">
            <div class="box" v-for="item in imageList" :key="item.originURL" @click="handleSelect(item)">
                <div class="pic">
                    <img :src="item.originURL"/>
                     <i class="iconfont select-pic" v-if="(!item.beSelected) && showPicBtn">&#xe72e;</i>
                     <i class="iconfont select-pic be-selected" v-if="item.beSelected && showPicBtn">&#xe62d;</i>
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
            imageModal: false,
            renameModal: false,
            albumPath: '',
            albumInfo: {},
            imageURL: '',
            newName: '',
            showPicBtn: false,
            deleteList: [],
            deleteBtn: '删除图片'
        }
    },
    methods: {
        getData(){
            this.$axios.get(`/api/album/${this.albumPath}`)
                .then(res => {
                    let resultList = res.data;
                    resultList.sort((a,b) => {
                        return a.date < b.date ? 1: -1;
                    })
                    this.imageList = resultList;
                    // console.log(this.imageList);
                    // for(let item of this.imageList){
                    //     item.beSelected = false
                    // }
                    // console.log(this.imageList);
                })
                .then(() => {
                    this.$axios.get(`/api/album/info?albumID=${this.albumPath}`)
                        .then(res => {
                            this.albumInfo = res.data;
                        })
                })
                .catch(error  => {
                    console.log(error);
                })
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
        handleDelete(){
            this.showPicBtn =!this.showPicBtn;
            if(this.showPicBtn){
                this.deleteBtn = '取消选择';
                this.deleteList = [];
                for(let item of this.imageList){
                    this.$set(item, "beSelected", false);
                }
            }else{
                this.deleteBtn = '删除图片';
            }
            
            console.log(this.showPicBtn);
        },
        handleSelect(item){
            if(item.beSelected){
                this.$set(item, "beSelected", false);
                const removeIndex = this.deleteList.indexOf(item.originURL);
                console.log(removeIndex);
                if(removeIndex !== -1){
                     this.deleteList.splice(removeIndex, 1);
                }
            }else{
                this.$set(item, "beSelected", true);
                this.deleteList.push(item.originURL);
            }
            
            console.log(this.deleteList);
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
        }
        
    },
    created(){
        this.albumPath = this.$route.params.path;
        console.log(this.albumPath);
        this.getData();  
    }
}
</script>
<style lang="less">
    .album{
        position: relative;
        width: 100%;
        min-height: 650px;
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
