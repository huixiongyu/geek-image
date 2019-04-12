import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {}
  },
  getters: {
    isLogin: state => state.isLogin
  },
  mutations: {
    setLogin(state, status) {
      state.isLogin = status
    },
    userInfo(state, payload){
        state.user.id = payload.id;
        state.user.phone = payload.phone;
        state.user.avatar = payload.avatar;
    }
  },
  actions: {
    setUser({commit}, flag) {
      commit("userInfo", flag)
    }
  }
})
