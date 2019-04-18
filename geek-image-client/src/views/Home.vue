<template>
    <div class="home">
        <div class="upload-zone">
            <Upload
                :action="actionAddress"
                ref="upload"
                :format="['jpg','jpeg','png','gif']"
                multiple
                type="drag"
                :max-size="5120"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="beforeUpload"
                :data="uploadForm"
                :on-success="handleSuccess"
                >
                <div class="upload-tips" style="padding: 40px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p class="tips-word">点击或者拖拽文件进行上传</p>
                </div>
            </Upload>
        </div>
        <div class="load-files">
            <div class="files-item" v-for="item in imageList" :key='item.realURL'>
                <div class="image" :style="{'background-image': 'url(' + item.localURL +')'}"></div>
                <div class="url">
                    <a :href="item.realURL" target="_blank">{{item.realURL}}</a>
                </div>
                <div class="clipbord">
                    <Spin fix v-if="item.pushing">
                        <div class="loader">
                            <svg class="circular" viewBox="25 25 50 50">
                            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                            </svg>
                        </div>
                    </Spin>
                    <Icon type="md-copy" size="32" @click="copyMarkdown(item.markdownURL)" v-else/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'home',
    components: {
    },
     data: function () {
        return {
            uploadForm: {},
            imageList: [],
            actionAddress: 'http://upload-z2.qiniup.com'
        }
    },
    methods: {
        getAddress(){
            // console.log(this.$store.state.user.phone);
            this.$axios.get(`/api/qiniu/config?phone=${this.$store.state.user.phone}`)
                .then(res => {
                   this.actionAddress = res.data.address;
                })
                .catch(error => {
                    console.log(error);
                })
        },
        addZero(m) {
          return m < 10 ? '0' + m : m;
        },
        handleFilename(filename) {
            const filenameArr = filename.split('.');
            const fileType = filenameArr[filenameArr.length-1];
            const time = new Date()
            const year = time.getFullYear();
            let month = time.getMonth() + 1;
            month = this.addZero(month);
            let day = time.getDate();
            day = this.addZero(day);
            const randomNum = Math.floor(Math.random() * 1000000000);
            return `${year}-${month}-${day}/${randomNum}.${fileType}`;
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '您上传的问件' + file.name + '格式不符合要求',
                duration: 6
            })
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件过大',
                desc: '您上传的问件' + file.name + '体积过大，请上传不超过5M的文件',
                duration: 6
            })
        },
        beforeUpload (file) {
            if(!this.$store.state.isLogin) {
                this.$Message.warning('请先登录！');
                return ;
            }
            //生成当前的文件名
            // console.log(file.name);
            let fileName = file.name;
            fileName = this.handleFilename(fileName);
            //将本地文件提前显示在页面上
            const realURL =`http://qiniu.hackslog.cn/${fileName}`;
            const img = {
                localURL: null,
                realURL,
                pushing: true, 
                markdownURL: ''
            };
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                img.localURL = reader.result;
            }
            this.imageList.push(img);
            // console.log(this.imageList);
            return this.$axios.post('/api/qiniu/',{filename: fileName})
                    .then(res => {
                        this.uploadForm = {
                            token: res.data.token,
                            key: res.data.key
                        }
                        for(let item of this.imageList){
                            if(realURL === item.realURL){
                                item.markdownURL = res.data.markdownURL;
                                item.pushing = false;
                            }
                        }
                        console.log(res.data.markdownURL);
                        console.log(res.data.orginURL);
                    }, err => {
                        this.$Message.warning('文件类型不允许');
                        console.log(err);
                    })
        },
        handleSuccess (res) {
            this.$Message.success('上传成功');
            this.img = res.key;
        },
        copyMarkdown(link){
            this.$Notice.success({
                title: 'Markdown链接复制成功！',
                desc: link
            });
            this.$copyText(link).then((e) => {
                console.log(e)
            }, function (e) {
                alert('Can not copy')
                console.log(e)
            })
        }
    },
    mounted () {
        if(this.$store.state.isLogin){
            this.getAddress();
        }
    }
}
</script>

<style lang="less">
    .home{
        position: relative;
        width: 100%;
        min-height: 600px;
        background-color: #EEFFFF;
    }
    .upload-zone{
        position: relative;
        left:50%;
        top:60px;
        width: 1000px;
        min-height: 600px;
        margin-left: -500px;
        padding-bottom: 50px;
        .ivu-upload{
            position: relative;
            width: 100%;
            height: 400px;
            .upload-tips{
                position: absolute;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 200px;
                margin-top: -100px;
                margin-left: -150px;
            }
        }
    }
    .tips-word{
        color: #8A2BE2;
        font-size: 16px;
    }
    .load-files{  
        position: relative;
        width: 100%;
        padding: 0 0px 100px 200px;
        padding-bottom: 100px;
        .files-item{
            width: 1000px;
            height: 200px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            .image{
                width: 400px;
                height: 200px;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .url{
                width: 500px;
                height: 200px;
                display: flex;
                justify-content: center;
                align-content: center;
                align-items: center;
                a{
                    display: block;
                    font-size: 16px;
                }
            }
            .clipbord{
                display: flex;
                height: 200px;
                width: 200px;
                justify-content: flex-end;
                align-content: center;
                align-items: center;
            }
        }
    }
</style>

