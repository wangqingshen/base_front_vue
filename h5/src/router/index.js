import Vue from 'vue'
import Router from 'vue-router'
import notFound from '@/pages/404'
Vue.use(Router)

export default new Router({
    mode: process.env.VUE_APP_MODE === 'production' ? 'history' : 'hash',
    base: process.env.VUE_APP_MODE === 'production' ? '/vue/yspc/': '/',
	routes: [{
        path:"*",
        redirect:'/index'
    },{
        path: '/index',
        name: 'index',
        component: notFound,
        meta:{
           title: '404页面'
        }
    }],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})