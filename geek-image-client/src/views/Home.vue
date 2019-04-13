<template>
    <div class="home">
        <div class="upload-zone">
            <Upload
                ref="upload"
                multiple
                type="drag"
                :show-upload-list="true"
                :format="['jpg','jpeg','png','gif']"
                :max-size="5120"
                :on-success="handleSuccess"
                action="/api/upload/">
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
            imgName: ''
        }
    },
    methods: {
        handleSuccess(){
            
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

