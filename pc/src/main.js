import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible'
import Api from './api/index'
import Regs from './reg/index'
import Vant from 'vant'
import 'vant/lib/index.css'
import './assets/scss/reset.scss'
import {Toast} from 'vant'
import { Lazyload } from 'vant'
import { Dialog } from 'vant'
import * as filters from './filters/index'
import defaultPic from '@/assets/images/icons/default-pic@2x.png'
import './components/index'

Vue.config.productionTip = false
Vue.use(Vant)
Vue.prototype.$regs = Regs
Vue.prototype.$api = Api
Vue.prototype.$toast = Toast
Vue.prototype.$dialog = Dialog
Vue.use(Lazyload,{
    error: defaultPic,
    loading: defaultPic
})
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key])
})
router.beforeEach(async(to, from, next) => {
	/* 路由发生变化修改页面title */
  	if (to.meta.title) {
    	document.title = to.meta.title
  	}
  	next()
})

router.onError((error) => {
    const pattern = /Loading chunk chunk-[a-zA-Z0-9]+ failed/g
    const pattern1 = /Loading CSS chunk chunk-[a-zA-Z0-9]+ failed/g
    const isChunkLoadFailed = error.message.match(pattern)
    const targetPath = router.history.pending.fullPath
    console.log(targetPath, error.message, 'js error')
    if (isChunkLoadFailed || error.message.match(pattern1)) {
        location.reload()
    }
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
