import http from '../axios/index'
const api={}

// 获取站点配置项
api.siteconfig = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/siteconfig',parmas)

//获取后台公共配置项
api.getCommonSet = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/getCommonSet',params,false)

// 获取手机验证码
api.mobileVerifyCode = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/mobileVerifyCode',parmas,false)
// 用户登录
api.login = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/login',parmas)
// 用户注册
api.register = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/register',parmas)
// 检测用户是否注册
api.checkMobile = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/checkMobile',parmas)
// 检测用户验证码是否正确
api.checkverifycode = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/checkverifycode',parmas)
// 忘记密码
api.forgetpassword = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/forgetpassword',parmas)
// 修改手机号
api.changemobile = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/changemobile',parmas)

// 获取广告图
api.getADinfo = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/getADinfo',parmas)

// 获取用户信息
api.userInfo = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/getUserInfo',parmas)
// 编辑用户信息
api.edituserinfo = (parmas)=>http.post(process.env.VUE_APP_APIHOST+'/member/edituserinfo',parmas)

// 首页精品分类
api.platrecommendclass = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/platrecommendclass',parmas,false)
// 商品列表
api.goodList = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/lists',parmas,false)
// 商品分类
api.classInfo = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/classinfo',parmas)
//获取商品详情type
api.goodsDetailsType = (params)=>http.post(process.env.VUE_APP_APIHOST+'/goods/GoodsActivity',params)
//商品详情
api.goodsDetails = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/detail',parmas,false)
//商品单级分类
api.goodsClass = (parmas)=> http.post(process.env.VUE_APP_APIHOST+'/goods/singleclass',parmas,false)

//订单列表
api.getOrderList = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/orderlist',params)
//取消订单
api.cancelOrder=(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/cancelOrder',params)
//订单详情
api.orderDetail=(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/orderdetail',params)
//确认收货
api.confirmOrder = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/confirmorder',params)
//生成订单
api.createOrder =(params)=>http.post(process.env.VUE_APP_APIHOST+'/order/createorder',params)
//支付收银台
api.cashier = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/cashier',params)
//支付
api.payMoney = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/pay',params)
// 查询支付结果
api.queryPayStatus = (params)=>http.post(process.env.VUE_APP_APIHOST+'/order/queryPayStatus',params,false)

// 合作加盟状态
api.leagueState = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/leagueState',params,false)
// 提交合作加盟状态
api.submitLeague = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/enterpriseJoin',params)
// 获取加盟信息
api.getLeagueById = (params)=>http.post(process.env.VUE_APP_APIHOST+'/member/getLeagueById',params)

export default api
