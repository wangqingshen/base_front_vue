import Vue from 'vue'
import Vuex from 'vuex'
import $mConfig from '@/config/index.config.js'
import $mRoutesConfig from '@/config/routes.config.js'
import $mRouter from '@/common/router.js'

Vue.use(Vuex)

// uni.setStorageSync("token", "oVG1b1Bgrb");
// uni.setStorageSync("openId", "oVG1b1Bgrb-l6jNYCUr6sYpQ5F-U");

const TOKEN = uni.getStorageSync("token") || "";
const OPENID = uni.getStorageSync("openId") || "";
const USER_INFO = uni.getStorageSync("userInfo") || {};
const FILTER_SEARCH = uni.getStorageSync("filterSearch") || {};
const SEARCH_HISTORY = uni.getStorageSync("searchHistory") || [] 
const SITE_CONFIG = uni.getStorageSync("siteConfig") || {}
const SET_IS_SEL_ADDRESS = uni.getStorageSync("setSelAddress") || "";
const CODE = uni.getStorageSync("code") || ""
const AUTHORIZE = uni.getStorageSync("authorize") || false
console.log(process.env.VUE_APP_MODE, 123)
const store = new Vuex.Store({
	state: {
		// 是否強制登录
		forcedLogin:$mConfig.forcedLogin,
		// 前端token
		token: TOKEN,
		// 用户openid
		openId: OPENID,
		// 用户信息 头像 昵称
		userInfo: USER_INFO,
		// 商品筛选条件
		filterSearch: FILTER_SEARCH,
		// 搜索历史记录
		searchHistory: SEARCH_HISTORY,
		// 收货地址
		address:'',
		isSel: '',
		// 订单页跳地址列表选择的地址索引
		isSelIndex: -1,
		// 站点配置
		siteConfig: SITE_CONFIG,
		code: CODE,
		authorize: AUTHORIZE
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			if (Object.keys(state.userInfo).length) {
				return true;
			} else {
				return false;
			}
		}
	},
	mutations: {
		login(state, provider){
			state.userInfo = provider;
			uni.setStorageSync('userInfo', provider) //缓存用户登陆状态
		},
		logout(state) {
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			uni.setStorageSync('userInfo', userInfo) //缓存用户登陆状态
		},
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync("token", token);
		},
		SET_OPENID(state, openId) {
			state.openId = openId;
			uni.setStorageSync("openId", openId);
		},
		SET_LOGOUT(state) {
			state.token = "";
			uni.setStorageSync("token", "");
		},
		SET_FILTERSEARCH(state, filterSearch) {
			state.filterSearch = filterSearch;
			uni.setStorageSync("filterSearch", filterSearch)
		},
		SET_SEARCHHISTORY(state, history){
			state.searchHistory = history;
			uni.setStorageSync("searchHistory", history)
		},
		SET_ADDRESS(state,address){
			state.address = address
			uni.setStorageSync("address", address);
		},
		SET_IS_SEL_ADDRESS(state,isSel){
			state.isSel = isSel
			uni.setStorageSync("setSelAddress", isSel);
		},
		SET_SEL_ADDRESS_INDEX(state,isSelIndex){//收货地址列表里地址项排序，列表页传index，商品详情传和购物车都传-1并移除本地缓存removeItem('isSelIndex')
			state.isSelIndex = isSelIndex
			uni.setStorageSync("isSelIndex", isSelIndex);
		},
		SITE_CONFIG(state, config) {
			state.siteConfig = config
			uni.setStorageSync("siteConfig", config)
		},
		SET_CODE(state, code) {
			state.code = code
			uni.setStorageSync("code", code)
		},
		SET_AUTHORIZE(state, authorize){
			state.authorize = authorize
			uni.setStorageSync("authorize", authorize)
		}
	},
	actions: {
		// 登录过期 重新登录
		reLogin({
			commit
		}, info) {
			commit("SET_TOKEN","");
			$mRouter.redirectTo({
				route:$mRoutesConfig.login
			});
		},
		setAddress({commit},address){//收货地址页设置默认地址
            return new Promise((resolve, reject)=>{
                resolve(commit('SET_ADDRESS',address))
            })
        },
	}
})

export default store