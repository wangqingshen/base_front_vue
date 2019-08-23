import Vue from 'vue'
import App from './App'
import store from './store'
import $AppEntryController from './AppEntryController.js'
import $mRouter from './common/router.js'
import $mUtils from './common/utils.js'
import $mReg from './common/reg.js'
import $mConfig from './config/index.config.js'
import $mRoutesConfig from './config/routes.config.js'
import * as filters from '@/filters/index'
import Api from './api/index'
// #ifdef H5
import './components/index'
// #endif
import { pathToBase64 } from './common/image-tools/index.js'
// #ifdef MP-WEIXIN
import authorizePopup from '@/components/authorize/index.vue'
// #endif

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$AppEntryController = $AppEntryController
Vue.prototype.$mRouter = $mRouter
Vue.prototype.$mUtils = $mUtils
Vue.prototype.$regs = $mReg
Vue.prototype.$mConfig = $mConfig
Vue.prototype.$mRoutesConfig = $mRoutesConfig
Vue.prototype.$api = Api
Vue.prototype.$toBase64 = pathToBase64
// #ifdef MP-WEIXIN
Vue.component('authorizePopup', authorizePopup)
// #endif

Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key])
})

$mRouter.beforeEach((navType, to) => {
	console.log(navType, to)
	if (to.route === undefined) throw ("路由钩子函数中没有找到to.route对象，路由信息:" + JSON.stringify(to));
	if (to.route.path === $mRoutesConfig.login.path && store.getters.hasLogin) {
		uni.redirectTo({
			url: $mUtils.objParseUrlAndParam($mRoutesConfig.index.path, to.query)
		})
		return;
	}

	// 过滤需要权限的页面
	if (to.route.requiresAuth) {

		if (store.getters.hasLogin) {
			// 已经登录
			uni[navType]({
				url: $mUtils.objParseUrlAndParam(to.route.path, to.query)
			})
		} else {
			// 登录成功后的重定向地址和参数
			let query = {
				redirectUrl: to.route.path,
				...to.query
			}
			// 没有登录 是否强制登录?
			if (store.state.forcedLogin) {
				uni.redirectTo({
					url: $mUtils.objParseUrlAndParam($mRoutesConfig.login.path, query)
				})
			} else {
				uni.navigateTo({
					url: $mUtils.objParseUrlAndParam($mRoutesConfig.login.path, query)
				})
			}
		}
	} else {
		uni[navType]({
			url: $mUtils.objParseUrlAndParam(to.route.path, to.query)
		})
	}
})

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
