<template>
    <Upload     
        :action="actionAddress"
        ref="upload"
        :format="['jpg','jpeg','png','gif']"
        multiple
        :show-upload-list="false"
        :max-size="5120"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="beforeUpload"
        :data="uploadForm"
        :on-success="handleSuccess">
        <Button type="primary" icon="md-images">上传照片</Button>
    </Upload>
</template>
<script>
    export default {
        data(){
            return {
                actionAddress: 'http://upload-z2.qiniup.com',
                uploadForm: {}
            }
        },
        methods: {
            getAddress(){
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
                let fileName = file.name;
                fileName = this.handleFilename(fileName);
                return this.$axios.post('/api/qiniu/',{filename: fileName, phone: this.$store.state.user.phone})
                        .then(res => {
                            this.uploadForm = {
                                token: res.data.token,
                                key: res.data.key
                            }

                        }, err => {
                            this.$Message.warning('文件类型不允许');
                            console.log(err);
                        })
            },
            handleSuccess (res) {
                this.$Message.success('上传成功');
                this.img = res.key;
            }
        },
        mounted () {
            if(this.$store.state.isLogin){
                this.getAddress();
            }
        }        
        }
</script>