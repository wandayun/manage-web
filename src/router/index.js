import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import home from '@/views/home'
import login from '@/views/login'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children: [{
        path: '/',
        name: 'page1',
        component: function () {
          return import( /* webpackChunkName: "about" */ '@/views/Page1.vue')
        },
      },
      {
        path: '/page1',
        name: 'page1',
        component: function () {
          return import( /* webpackChunkName: "about" */ '@/views/Page1.vue')
        },
      },
      {
        path: '/page2',
        name: 'page2',
        component: function () {
          return import( /* webpackChunkName: "about" */ '@/views/Page2.vue')
        },
      },
      {
        path: '/page3',
        name: 'page3',
        component: function () {
          return import( /* webpackChunkName: "about" */ '@/views/Page3.vue')
        },
      },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      
    },
  ]
})
