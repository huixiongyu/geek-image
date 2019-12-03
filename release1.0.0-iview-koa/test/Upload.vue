<template>
    <div class="home">
        <div class="upload-zone">
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot=true>
                <div class="dropzone-custom-content">
                    <p>
                        <Icon type="md-cloud-done" />点击或者拖拽上传图片
                    </p>
                </div>
            </vue-dropzone>
            <Button class="upload-btn" type="success">开始上传</Button>
        </div>
        
    </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    name: 'home',
    components: {
    vueDropzone: vue2Dropzone
    },
     data: function () {
    return {
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        addRemoveLinks: true,
        maxFilesize: 5,  //5M
        maxFiles: 99,  //最多99个文件
        acceptedFiles: ".jpg,.jpeg,.png,.gif",  //支持的格式
        uploadMultiple: true,
        dictMaxFilesExceeded: "您最多只能上传10个文件！",
        dictResponseError: '文件上传失败!',
        dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.jpg,*.gif,*.png",
      }
    }
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
    }
    #dropzone{
        position: relative;
        width: 100%;
        min-height: 400px;
    }
    .dropzone-custom-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-size: 24px;

    }
    .upload-btn{
        float: right;
        margin-top:10px;
    }
</style>

