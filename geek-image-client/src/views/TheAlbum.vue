<template>
    <div class="album">
        <div class="control-area">
            <image-uploader :post-id="albumPath" class="uploader"></image-uploader>
             <Button type="text" size="large">{{albumInfo.name}}</Button>
            <Button type="error">删除图片</Button>
        </div>
        <div class="albums">
            <div class="box" v-for="item in imageList" :key="item.originURL">
                <div class="pic">
                    <img :src="item.originURL"/>
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
            albumPath: '',
            albumInfo: {},
            imageURL: ''
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
                padding: 10px;
                border:1px solid #ccc;
                box-shadow: 0 0 6px #ccc;
                border-radius: 5px;
                img{
                    width:260px;
                    height:260px;
                    background-color: antiquewhite;
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
        width: 400px;
        img{
            width: 100%;
            height: auto;
        }
    }
</style>
