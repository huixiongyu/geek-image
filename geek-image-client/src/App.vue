<template>
  <div id="app">
    <geek-header></geek-header>
    <router-view/>
    <geek-footer></geek-footer>
  </div>
</template>
<script>
import GeekHeader from './components/GeekHeader.vue'
import GeekFooter from './components/GeekFooter.vue'
export default {
  components: {
    GeekHeader,
    GeekFooter
  }
}
</script>

<style lang="less">

</style>
