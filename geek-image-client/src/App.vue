<template>
  <div id="app">
    <geek-header></geek-header>
    <router-view/>
  </div>
</template>
<script>
import GeekHeader from './components/GeekHeader.vue'
export default {
  components: {
    GeekHeader
  }
}
</script>

<style lang="less">

</style>
