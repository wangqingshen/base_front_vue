/* 
 * 路由表对象：
 * 该文件挂载在Vue原型中 $mRoutesConfig
 * 作用：调用$mRouter对象的方法 传入以下对应的路由对象，详细见common目录下的router.js
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 * 
 * 配置参数项说明： 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */

export default {
    // 权限路由
    evaluate: {
        name: '发表评价',
        path: '/pages/evaluate/refer',
        requiresAuth: true
    },
	myInfo: {
		name: "个人信息",
		path: "/pages/own/myInfo",
		requiresAuth: true
	},
	addressList: {
		name: "收货地址",
		path: "/pages/own/addressList",
		requiresAuth: true
	},
	addressEdit: {
		name: "编辑收货地址",
		path: "/pages/own/addressEdit",
		requiresAuth: true
	},
	storeEntry: {
		name: "店铺入驻",
		path: "/pages/store/storeEntry",
		requiresAuth: true
	},
	storeInfo: {
		name: "店铺入驻",
		path: "/pages/store/storeInfo",
		requiresAuth: true
    },
    changeMob: {
        name: "修改手机号",
        path: "/pages/login/changeMob",
        requiresAuth: true
    },
    login: {
        name: "登录",
        path: "/pages/login/index",
        requireLogin: true
    },
    logisticsIndex: {
        name: "物流详情",
        path: "/pages/logistics/index",
        requiresAuth: true
    },
    // 非权限路由
    index: {
        name: "首页",
        path: "/pages/index/index"
    },
    // register: {
    // 	name: "注册",
    // 	path: "/pages/login/register"
    // },
    // forgetPass: {
    // 	name: "忘记密码",
    // 	path: "/pages/login/forgetPass"
    // },
    // changeMob: {
    // 	name: "修改手机号",
    // 	path: "/pages/login/changeMob"
    // },
	own: {
		name: "个人中心",
		path: "/pages/own/index",
	},
    search: {
        name: "搜索",
        path: "/pages/index/search"
    },
    goodsList: {
        name: "商品列表",
        path: "/pages/goods/list"
    },
    goodsDetail: {
        name: "商品详情",
        path: "/pages/goods/detail"
    },
    category: {
        name: "产品中心",
        path: "/pages/goods/category"
    },
    pay: {
        name: "支付收银台",
        path: "/pages/pay/index"
    },
    payResult: {
        name: "支付收银台",
        path: "/pages/pay/payResult"
    },
    orderConfirm: {
        name: "确认订单页",
        path: "/pages/orderConfirm/index"
    },
    orderList: {
        name: "订单列表",
        path: "/pages/order/orderList",
		requiresAuth: true
    },
    orderDetail: {
        name: "订单详情",
        path: "/pages/order/orderDetail",
		requiresAuth: true
    },
    serveClass: {
        name: "选择服务类型",
        path: "/pages/orderConfirm/serveClass"
    },
    selectgoods: {
        name: "退款选择商品列表",
        path: "/pages/orderConfirm/selectgoods"
    },
    logistics: {
        name: "填写退货物流",
        path: "/pages/orderConfirm/logistics"
    },
    applyRefund: {
        name: "申请退款",
        path: "/pages/refund/applyRefund",
		requiresAuth: true
    },
    myRefund: {
        name: "我的退款",
        path: "/pages/refund/myRefund",
		requiresAuth: true
    },
    shopCar: {
        name: "购物车",
        path: "/pages/cart/index"
    },
    refundHistory: {
        name: "协商历史",
        path: "/pages/refund/history"
    },
    evaluateList: {
        name: '评价列表',
        path: '/pages/evaluate/index'
    },
    refundDetail: {
        name: "退款详情",
        path: "/pages/refund/refundDetail"
    },
	aboutUs: {
		name: "关于我们",
		path: "/pages/own/aboutUs"
	},

}