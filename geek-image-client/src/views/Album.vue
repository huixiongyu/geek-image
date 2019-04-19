<template>
    <div class="album">
        <div class="control-area">
            <div class="control-btn">
                <image-uploader post-id="none" class="uploader"></image-uploader>
                <Button @click="handleNew">创建相册</Button>
                <Button @click="handleSetting">上传设置</Button>
            </div>
            <div class="conctrol-del">
                <Button type="error" @click="handleDelete">删除相册</Button>
            </div>
        </div>
        <div class="albums">
            <router-link tag="div" class="box" v-for="item in albumList" :key="item.albumID" :to="'/album/' + item.albumID">
                <Icon class="float-tag" size="32" type="ios-bookmark" v-if="item.selected" />
                <div class="pic" :style="{background: 'url(' + item.cover +')'}">
                    <div class="nums">
                        <span>{{item.picNum}}</span>
                    </div>
                </div>
                <div class="title">
                    <span>{{item.name}}</span> 
                </div>
            </router-link>
            <div class="clear"></div>                                                                                                                              
        </div>

        <Modal
            class-name="vertical-center-modal"
            v-model="newModal"
            title="创建相册">
            <Form class="album-form" :model="albumForm" label-position="left" :label-width="120">
                <FormItem label="相册名称">
                    <Input v-model="albumForm.name" />
                </FormItem>
                <FormItem label="默认上传空间">
                    <RadioGroup v-model="albumForm.selected">
                        <Radio label="yes">
                            <span>是</span>
                        </Radio>
                        <Radio label="no">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
            <Button class="album-modal-btn" @click="handleCreate" type="primary" slot="footer">创建</Button>
        </Modal>
        <Modal
            class-name="vertical-center-modal"
            v-model="settingModal"
            title="上传设置">
            <Form class="album-form"  label-position="left" :label-width="120">
                <FormItem label="当前上传空间">
                    <CheckboxGroup v-model="selectedList">
                        <Checkbox 
                            v-for="item in uploadSelect" 
                            :key="item.albumID" 
                            :label="item.albumID" 
                            :disabled="item.ban">
                            <span>{{item.name}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <Button class="album-modal-btn" @click="ensureSetting" type="primary" slot="footer">确认更改</Button>
        </Modal>        
        <Modal
            class-name="vertical-center-modal"
            v-model="deleteModal"
            title="删除相册">
            <div class="todelete-title">请选择需要删除的相册</div>
            <Select v-model="deleteOne" style="width:200px">
                <Option v-for="item in candeleteAlbum" :value="item.albumID" :key="item.albumID">{{ item.name }}</Option>
            </Select>
            <div class="todelete-tip">删除了不可恢复，请谨慎操作！</div>
            <Button class="album-modal-btn" @click="toDelete" type="primary" slot="footer">确认删除</Button>
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
            albumList: [],
            newModal: false,
            settingModal: false,
            deleteModal: false,
            albumForm: {
                name: '',
                selected: 'no',
            },
            uploadSelect: [],
            selectedList: [],
            candeleteAlbum: [],
            deleteOne: ''
        }
    },
    methods: {
        getData(){
            this.$axios.get('/api/album/')
                .then(res => {
                    for(let item of res.data){
                        this.albumList.push(item);
                    }
                    for(let item in res.data){
                        // console.log(item);
                        const selectItem = {
                            albumID: res.data[item].albumID,
                            name: res.data[item].name,
                            ban: false
                        }
                        if(item == 0){
                            selectItem.ban = true;
                            this.selectedList.push(res.data[item].albumID);
                        }
                        this.uploadSelect.push(selectItem);
                    }
                    this.candeleteAlbum = this.uploadSelect;
                    this.candeleteAlbum.splice(0, 1);
                    console.log(this.candeleteAlbum)
                    // console.log(res);
                })
                .catch(error  => {
                    console.log(error);
                })
        },
        handleNew(){
            this.newModal = true;
        },
        handleCreate(){
            if(this.albumForm.name === ''){
                this.$Message.warning('名字不能为空！');
                return ;
            }
            const postData = {
                name: this.albumForm.name,
                selected: this.albumForm.selected,
                phone: this.$store.state.user.phone
            }
            this.$axios.post('/api/album/new', postData)
                .then( () => {
                    this.newModal = false;
                    this.$Message.success('创建成功！');
                    location.reload();
                }, () => {
                    this.newModal = false;
                    this.$Message.warning('名字重复，请重新创建！');
                })
                .catch(error => {
                    console.log(error);
                })
        },
        handleSetting(){
            this.settingModal = true;
        },
        ensureSetting(){
            this.$axios.post('/api/album/selected',{selectedList: this.selectedList})
                .then(() => {
                   this.$Message.success('上传设置更改成功！');
                   this.settingModal = false;
                   setTimeout( () => {
                       location.reload();
                   }, 2000);
                })
                .catch(error => {
                    console.log(error);
                });   
        },
        handleDelete(){
            this.deleteModal = true;
        },
        toDelete(){
            this.$axios.post('/api/album/delete', {deleteOne:this.deleteOne})
                .then(() => {
                    this.$Message.success('删除成功！');
                   this.deleteModal = false;
                   setTimeout( () => {
                       location.reload();
                   }, 2000);                    
                })
                .catch(error => {
                    console.log(error);
                })
        }
    },
    created(){
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
        padding-right: 220px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .control-btn{
            width: 300px;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            // .uploader{
            //     margin-top: 8px; 
            // }
        }
    }
    .albums{
        position: relative;
        padding-bottom: 50px; 
        padding-left: 150px;
        width: 100%;
        min-height: 550px;
        .box{
            position: relative;
            width: 200px;
            height: 230px;
            box-sizing: border-box;
            background-color: #00BFFF;
            border:1px solid #ccc;
            box-shadow: 0 0 6px #ccc;
            border-radius: 5px;
            padding: 10px;
            margin-right: 20px;
            margin-bottom: 20px;
            float: left;
            .pic{
                position: relative;
                width: 180px;
                height: 180px;
               background-size: contain;
                .nums{
                    position: absolute;
                    bottom: 0;
                    right: 5px;
                    font-size: 36px;
                    font-weight: 600;
                    background-color: transparent;
                    color: white;
                }
            }
            .title{
                width: 178px;
                height: 28px;
                font-size: 20px;
                font-weight: 600;
                color: white;
                display: inline-flex;
                justify-content: center;
                align-content: center;
                align-items: center;
            }
            .float-tag{
                position: absolute;
                top: 0;
                left: 10px;
                z-index: 99;
                color: red;
            }
        }
    }
    .clear{
        clear: both;
    }
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
        .ivu-modal-footer{
            display: flex;
            justify-content: center;
            .album-modal-btn{
                width: 150px;
                height: 40px;
                font-size: 14px;
            }
        }
    }
    .album-form{
        .ivu-form-item{
            .ivu-form-item-label{
                font-size: 15px;
            }
        }
    }
    .todelete-title{
        font-size: 16px;
        font-weight: 600;
    }
    .todelete-tip{
        font-size: 12px;
        color: red;
        margin-top: 10px;
    }
</style>
