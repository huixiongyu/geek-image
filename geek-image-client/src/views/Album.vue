<template>
    <div class="album">
        我是Album
    </div>
</template>
<script>
export default {
    name: 'album',
    data(){
        return {

        }
    },
    created(){
        console.log('album!!');
    }
}
</script>
<style lang="less">
    .album{
        width: 100%;
        min-height: 650px;
    }
</style>
