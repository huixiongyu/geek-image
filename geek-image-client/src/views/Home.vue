<template>
    <div class="home">
        <div class="upload-zone">
            <Upload
                action="/api/upload/"
                ref="upload"
                :format="['jpg','jpeg','png','gif']"
                multiple
                type="drag"
                :max-size="5120"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="beforeUpload"
                :data="uploadForm"
                :on-progress="handleProgress"
                :on-success="handleSuccess"
                >
                <div class="upload-tips" style="padding: 40px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>Click or drag files here to upload</p>
                </div>
            </Upload>
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
            uploadList: [],
            uploadForm: {},
            imgName: ''
        }
    },
    methods: {
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
        beforeUpload () {
            return true;
            // return this.$axios.get('/api/qiniu/')
            //     .then(res => {
            //         console.log(res.data);
            //     })
        },
        handleProgress () {
//                console.log(parseInt(event.percent));
        },
        handleSuccess (res) {
            this.$Message.success('上传成功');
            this.img = res.key;
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
}
</script>

<style lang="less">
    .home{
        position: relative;
        width: 100%;
        min-height: 650px;
        background-color: #EEFFFF;
    }
    .upload-zone{
        position: relative;
        left:50%;
        top:60px;
        width: 1000px;
        min-height: 600px;
        margin-left: -500px;
        padding-bottom: 200px;
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
    .upload-btn{
        float: right;
        margin-top:10px;
    }
</style>

