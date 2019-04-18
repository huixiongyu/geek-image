import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import './assets/iconfont/iconfont.css'
import VueClipboard from 'vue-clipboard2'
 

axios.interceptors.request.use(
  config => {
    if (localStorage.geekToken) { //判断token是否存在
      config.headers.Authorization = localStorage.geekToken;  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

Vue.use(iView)
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

router.beforeEach((to, from, next) => {
  if(localStorage.getItem("geekToken")){
    store.commit("setLogin", true);
    const token = localStorage.getItem("geekToken");
    const decode = jwt_decode(token);
    store.commit("userInfo", decode);
  }
  if(to.meta.requiresAuth){
    if(store.state.isLogin){
      next();
    }else{
      iView.Message.info({
        content: '请先登录o( =•ω•= )m',
        duration: 3
      });
      next('/');
    }
  }else{
    next();
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
