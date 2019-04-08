<template>
    <div class="header">
        <div class="header-left">
            <router-link tag="div" to="/" class="logo">极客图床</router-link>
            <div class="upload nav-word">
                <Icon type="md-cloud-upload"  />上传
            </div>
            <div class="album nav-word">
                <Icon type="md-image" />相册
            </div>
            <div class="manage nav-word">
                <Icon type="md-speedometer" />控制台
            </div>
        </div>
        <div class="header-right">
            <div class="signin" v-if="!login">
                登录
            </div>
            <div class="sprit">
                /
            </div>
            <div class="signup" v-if="!login">
                注册
            </div>
            <div class="cloud" v-if="login">
                <Icon type="md-cloud-outline" />七牛云
            </div>
            <div class="logout" v-if="login">
                <img src="../assets/221.jpg" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Header',
    data(){
        return {
            login: false
        }
    }
}
</script>


<style lang="less">
    .header{
        width: 100%;
        height: 68px;
        background-color: white;
        border-bottom: 1px solid #D3D3D3;
        display: flex;
        justify-content: space-between; 
    }
    .header-left{
        width: 500px;
        height: 100%;
        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
        align-items: center;
        .logo{
            font-size: 32px;
            font-weight: 600px;
            color: black;
            cursor: pointer;
        }
        .nav-word{
            font-size: 18px;
            cursor: pointer;
        }
    }
    .header-right{
        width: 200px;
        height: 100%;
        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
        align-items: center;
        font-size: 16px;
        div{
            cursor: pointer;
        }
    }
    .logout{
        width: 36px;
        height: 36px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .signin, .signup{
        &:hover{
            color: red;
        }
    }
    .sprit{
        font-size: 18px;
    }
</style>
