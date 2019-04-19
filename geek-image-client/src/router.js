import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('./views/Album.vue'),
      meta:  {
        requiresAuth: true
      }
    },
    {
      path: '/album/:path',
      name: 'images',
      component: () => import('./views/TheAlbum.vue'),
      meta:  {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./views/CloudAdmin.vue'),
      meta:  {
        requiresAuth: true
      }
    }
  ]
})
