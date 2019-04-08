<template>
    <div class="home">
        <div class="upload-zone">
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions">
            </vue-dropzone>
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
          maxFilesize: 0.5,
          headers: { "My-Awesome-Header": "header value" },
          dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>点击或者拖拽图片上传"
      }
    }
  }
}
</script>

<style lang="less">
    .home{
        width: 100%;
        height: 820px;
    }
    .upload-zone{
        width: 600px;
        height: 400px;
        margin: 80px auto 30px auto;
    }
</style>

