import http from "@/http/index"
import config from "@/config/index.config.js"
const api = {}

// 获取可视化装修页面配置详情
api.shopPageConfig = (parmas) => http.post(`${config.baseUrl}/shop/shopPageConfig`, parmas, true)

// 获取可视化装修页面配置列表
api.shopPageList = (parmas) => http.post(`${config.baseUrl}/shop/shopPageList`, parmas, true)

// 微信端获取openid
api.getWxOpenId = (parmas) => http.post(`${config.baseUrl}/member/getWxOpenId`, parmas, false)

// 小程序获取openid
api.getOpenid = (parmas) => http.post(`${config.baseUrl}/user/getOpenid`, parmas, false)

//配置wx.config
api.getWeChatSignature = (params) => http.post(`${config.baseUrl}/sys/getwechatsignature`, params, false)

// 获取站点配置项
api.siteconfig = (parmas) => http.post(`${config.baseUrl}/member/siteconfig`, parmas, true)

//获取后台公共配置项
api.getCommonSet = (params) => http.post(`${config.baseUrl}/sys/getCommonSet`, params, false)

// 获取手机验证码
api.mobileVerifyCode = (parmas) => http.post(`${config.baseUrl}/member/basemobileVerifyCode`, parmas, true)

// 用户登录
api.login = (parmas) => http.post(`${config.baseUrl}/member/baselogin`, parmas)

// 用户注册
api.register = (parmas) => http.post(`${config.baseUrl}/member/register`, parmas)

// 检测用户是否注册
api.checkMobile = (parmas) => http.post(`${config.baseUrl}/member/checkMobile`, parmas)

// 检测用户验证码是否正确
api.checkverifycode = (parmas) => http.post(`${config.baseUrl}/member/checkverifycode`, parmas)

// 忘记密码
api.forgetpassword = (parmas) => http.post(`${config.baseUrl}/member/forgetpassword`, parmas)

// 修改手机号
api.changemobile = (parmas) => http.post(`${config.baseUrl}/member/changemobile`, parmas)

//协议文章
api.getArticle = (params) => http.post(`${config.baseUrl}/member/getArticle`, params, true)

// 商品分类
api.classInfo = (parmas) => http.post(`${config.baseUrl}/goods/classInfo`, parmas)

// 获取商品标签
api.goodsLabel = (params) => http.post(`${config.baseUrl}/goods/goodsLabel`, params, false)

// 商品列表
api.goodList = (parmas) => http.post(`${config.baseUrl}/goods/lists`, parmas)
    // 获取商品列表
api.getgoodsbypage = (parmas) => http.post(`${config.baseUrl}/shop/getgoodsbypage`, parmas, true)
    //商品详情基础信息
api.combinationBasisDetail = (parmas) => http.post(`${config.baseUrl}/goods/combinationBasisDetail`, parmas, false)
    //商品详情SKU信息
api.combinationSku = (parmas) => http.post(`${config.baseUrl}/goods/combinationSku`, parmas, false)
    // 获取商品运费
api.goodsLogisticsBilling = (params) => http.post(`${config.baseUrl}/logistics/goodsLogisticsBilling`, params, false)
    //地图三级联动
api.cityRegion = (params) => http.post(`${config.baseUrl}/region/getCityRegion`, params, false)

//地址列表
api.addressList = (params) => http.post(`${config.baseUrl}/member/addressList`, params)
    //新增编辑地址
api.addressEdit = (params) => http.post(`${config.baseUrl}/member/editAddress`, params)
    //删除地址
api.addressDel = (params) => http.post(`${config.baseUrl}/member/deleteAddress`, params)
    //设置默认收货地址
api.addressDefault = (params) => http.post(`${config.baseUrl}/member/setDefaultAddress`, params)

//加入购物车
api.addCart = (parmas) => http.post(`${config.baseUrl}/cart/addcart`, parmas)
    //购物车列表
api.cartList = (parmas) => http.post(`${config.baseUrl}/cart/cartlist`, parmas, false)
    //购物车填减
api.changeCarGoodsNum = (parmas) => http.post(`${config.baseUrl}/cart/changegoodsnum`, parmas, false)
    //删除购物车
api.removeShopItem = (params) => http.post(`${config.baseUrl}/cart/delcart`, params)
    //结算购物车
api.goPay = (params) => http.post(`${config.baseUrl}/cart/orderconfirm`, params)

//订单列表
api.getOrderList = (params) => http.post(`${config.baseUrl}/order/orderlist`, params)
    //取消订单
api.cancelOrder = (params) => http.post(`${config.baseUrl}/order/cancelOrder`, params)
    //订单详情
api.orderDetail = (params) => http.post(`${config.baseUrl}/order/orderdetail`, params, false)
    //确认收货 提货
api.confirmOrder = (params) => http.post(`${config.baseUrl}/order/confirmorder`, params, false)
    //生成订单
api.createOrder = (params) => http.post(`${config.baseUrl}/order/createorder`, params, false)
    // 轮训订单id
api.orderResult = (parmas) => http.post(`${config.baseUrl}/order/createOrderResult`, parmas, true)
    //支付收银台
api.cashier = (params) => http.post(`${config.baseUrl}/order/cashier`, params)
    //支付
api.payMoney = (params) => http.post(`${config.baseUrl}/order/pay`, params)
    // 查询支付结果
api.queryPayStatus = (params) => http.post(`${config.baseUrl}/order/queryPayStatus`, params, false)
    //物流详情
api.logistics = (params) => http.post(`${config.baseUrl}/logistics/searchlogistics`, params, false)

//店铺优惠券
api.storeCoupon = (params) => http.post(`${config.baseUrl}/discount/storealldiscount`, params, false)
    //领取优惠券
api.getCoupon = (params) => http.post(`${config.baseUrl}/discount/usergetdiscount`, params)
    //订单确认优惠券
api.getOrderCoupon = (params) => http.post(`${config.baseUrl}/discount/getorderdiscount`, params, false)
    //我的优惠券
api.getOwnCoupon = (params) => http.post(`${config.baseUrl}/discount/mydiscountlist`, params)

//获取发票信息
api.getinvoice = (params) => http.post(`${config.baseUrl}/member/getinvoice`, params, false)

//编辑新增发票
api.editInvoice = (params) => http.post(`${config.baseUrl}/member/editInvoice`, params, false)

//获取店铺可开发票类型
api.getStoreInvoice = (params) => http.post(`${config.baseUrl}/store/getStoreInvoice`, params)

// 提交退款申请
api.refundPost = (params) => http.post(`${config.baseUrl}/order/refundskupost`, params, true)
    // 申请退款页面
api.applyRefund = (params) => http.post(`${config.baseUrl}/order/refundsku`, params)
    // 我的退款列表
api.refundlist = (params) => http.post(`${config.baseUrl}/order/refundskulist`, params)
    //退款详情
api.refunddetail = (params) => http.post(`${config.baseUrl}/order/refundskudetail`, params, false)
    //撤销退款申请
api.cancelRefund = (params) => http.post(`${config.baseUrl}/order/cancelrefund`, params, false)


// 用户系统信息列表
api.membermsglist = (params) => http.post(`${config.baseUrl}/im/membermsglist`, params)
    // 用户系统消息详情
api.membermsgdetail = (params) => http.post(`${config.baseUrl}/im/membermsgdetail`, params)

//拼团商品详情
api.getGroupGoodsDetails = (params) => http.post(`${config.baseUrl}/group/GroupGoodsDetail`, params, false)
    //拼团频道
api.getChannelLists = (params) => http.post(`${config.baseUrl}/group/ChannelLists`, params)
    //拼团列表
api.getGroupGoodsList = (params) => http.post(`${config.baseUrl}/group/GroupBuyLists`, params, false)
    //拼团团队详情
api.getGroupTeamInfo = (params) => http.post(`${config.baseUrl}/group/GroupTeamDetail`, params, false)
    //我的拼团列表
api.getOwnGroupList = (params) => http.post(`${config.baseUrl}/group/mygroupteam`, params)
    //拼团商品详情相关拼团信息
api.groupGoodsTeamInfo = (params) => http.post(`${config.baseUrl}/group/GroupGoodsTeamInfo`, params)
    //获取拼团team列表
api.getGroupUser = (params) => http.post(`${config.baseUrl}/group/getGroupUser`, params, false)

//秒杀频道
api.getSecKillChannel = (params) => http.post(`${config.baseUrl}/seckill/getseckillphaselist`, params)
    //秒杀列表
api.getSecKillList = (params) => http.post(`${config.baseUrl}/seckill/seckillgoodslists`, params, false)
    //秒杀详情
api.getSecKillGoodsDetails = (params) => http.post(`${config.baseUrl}/seckill/getseckillgoodsdetail`, params, false)
    //秒杀数量判断
api.getSecKillGoodsNum = (params) => http.post(`${config.baseUrl}/seckill/getseckillpurchasenumber`, params, false)
    //拼团数量判断
api.getGroupGoodsNum = (params) => http.post(`${config.baseUrl}/group/CheckGroup`, params, false)

// 获取分销商信息
api.sellerInfoApi = (params) => http.post(`${config.baseUrl}/seller/sellerInfo`, params, false)
    //申请成为分销商
api.toBeSeller = (params) => http.post(`${config.baseUrl}/seller/toBeSeller`, params)
    //编辑分销商信息
api.editSeller = (params) => http.post(`${config.baseUrl}/seller/perfectSellerInfo`, params)
    //设置分销商自由商品
api.toGoodsPrivate = (params) => http.post(`${config.baseUrl}/seller/toGoodsPrivate`, params)
    //取消设为自由商品
api.delGoodsPrivate = (params) => http.post(`${config.baseUrl}/seller/delGoodsPrivate`, params)
    //设置分销商品库存
api.privateGoodsStock = (params) => http.post(`${config.baseUrl}/seller/privateGoodsStock`, params)
    //获取分销商品列表
api.getSellerGoods = (params) => http.post(`${config.baseUrl}/seller/privateGoodsLists`, params)
    //获取分销商品列表
api.getSellerOrderList = (params) => http.post(`${config.baseUrl}/seller/orderLists`, params)
    //分享积分
api.shareAddIntegral = (params) => http.post(`${config.baseUrl}/seller/shareAddIntegral`, params, false)

// 上传图片
api.uploadImg = (params) => http.post(`${config.baseUrl}/sys/uploadImg`, params, true)

// 编辑用户信息
api.edituserinfo = (parmas) => http.post(`${config.baseUrl}/member/edituserinfo`, parmas)

// 结算中心
api.settlecenterApi = (parmas) => http.post(`${config.baseUrl}/sellerwallet/settlecenter`, parmas)

// 提现页
api.withdrawpageApi = (parmas) => http.post(`${config.baseUrl}/sellerwallet/withdrawpage`, parmas)

// 提现
api.withdrawApi = (parmas) => http.post(`${config.baseUrl}/sellerwallet/withdraw`, parmas)

// 账户明细
api.walletlistsApi = (parmas) => http.post(`${config.baseUrl}/sellerwallet/walletlists`, parmas)

// 提款记录
api.withdrawlistsApi = (parmas) => http.post(`${config.baseUrl}/sellerwallet/withdrawlists`, parmas)

// 积分明细
api.integralLogsListsApi = (parmas) => http.post(`${config.baseUrl}/seller/integralLogsLists`, parmas)

// 用户系统信息列表
api.membermsglist = (params) => http.post(`${config.baseUrl}/im/membermsglist`, params)
    // 用户系统消息详情
api.membermsgdetail = (params) => http.post(`${config.baseUrl}/im/membermsgdetail`, params, false)
    // 用户系统消息数量
api.membermsgcount = (params) => http.post(`${config.baseUrl}/im/membermsgcount`, params, false)
    // 删除用户系统消息
api.deletemembermsg = (params) => http.post(`${config.baseUrl}/im/deletemembermsg`, params, false)

// 个人中心
api.userCenter = (params) => http.post(`${config.baseUrl}/member/userCenter`, params, false)
    // 个人中心-订单模块
api.userCenterOrderCount = (params) => http.post(`${config.baseUrl}/member/userCenterOrderCount`, params, false)
    // 个人信息
api.editUserInfo = (params) => http.post(`${config.baseUrl}/member/editUserInfo`, params, false)

// 合作加盟状态
api.getLeagueState = (params) => http.post(`${config.baseUrl}/member/leagueState`, params, false)
    // 提交审核的详情
api.getLeagueById = (params) => http.post(`${config.baseUrl}/member/getLeagueById`, params, false)
    // 提交合作加盟信息
api.submitLeague = (params) => http.post(`${config.baseUrl}/member/submitLeague`, params, false)

// 获取评论基础信息
api.evaluation = (params) => http.post(`${config.baseUrl}/order/evaluation`, params, false)
    // 获取评论详情
api.evaluationdetail = (params) => http.post(`${config.baseUrl}/order/evaluationdetail`, params, false)
    // 评论提交
api.evaluationpost = (params) => http.post(`${config.baseUrl}/order/evaluationpost`, params, true)
    // 评论列表
api.goodsEvaluateList = (params) => http.post(`${config.baseUrl}/goods/goodsEvaluateList`, params, false)

// 填写退货页面
api.refunddelivery = (params) => http.post(`${config.baseUrl}/order/refunddelivery`, params, false)
    // 提交退货页面
api.refunddeliverypost = (params) => http.post(`${config.baseUrl}/order/refunddeliverypost`, params, false)
    // 提交退货页面
api.refundlog = (params) => http.post(`${config.baseUrl}/order/refundlog`, params, false)

export default api