<template>
    <view class="payCashier-wrapper container">
        <view class="payCashier-inner">
            <!-- <cube-scroll> -->
                <view class="pay-countDown">
					<view>支付剩余时间</view>
                    <view class="timeBox">
                        <countDown :timeProps="time" temp="2"  @emitCountDownFun="countDownEvt" v-if="async_flag"></countDown>
                    </view>
                </view>
				<view class="orderMoney">
					<view class="orderMoney_title">订单金额</view>
					<view class="orderMoney_money">￥{{Number(cashierData.order_amount).toFixed(2)}}</view>
				</view>
                <!-- <view class="payCashier-info">
                    <view class="cell">
                        <view class="">订单时间</view>
                        <view class="r">{{cashierData.create_time || 'xxxx-xx-xx xx:xx:xx'}}</view>
                    </view>
                    <view class="cell">
                        <view class="">订单编号</view>
                        <view class="r">{{cashierData.order_sn || 'xxxxxxxxxxxxx'}}</view>
                    </view>
                </view> -->
                <view class="pay-way">
                    <view class="way-list">
						<view class="way-title">选择支付方式</view>
                        <view class="way-list-item uni-flex uni-column" v-model="radio">
							<!-- #ifdef H5 -->
							<view class="payway-item" v-for="(item,index) in payWayList" :key="index" v-if="(item.code == 'alipay' && !isWxPay) || item.code != 'alipay'" @click="chooisePayWay(item.code)">
								<view class="label">
									<view class="payway-icon" :class="item.code"></view>
									<view class="payway-txt">{{item.name}}</view>
								</view>
                                <tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
							</view>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<view class="payway-item" @click="chooisePayWay('wxpay')">
								<view class="label">
									<view class="payway-icon wxpay"></view>
									<view class="payway-txt">微信支付</view>
								</view>
                                <tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
							</view>
							<!-- #endif -->
                        </view>
                    </view>
                </view>
            <!-- </cube-scroll> -->
            
        </view>
        <!-- <view class="payCashier-ft">
            <view class="l">￥{{cashierData.order_amount}}</view>
            <view class="r" @click="chooisePayWay">支付</view>
        </view> -->
    </view>
</template>
<script>
    import countDown from '@/components/CountDown'
    import tuiIcon from "@/components/tui/icon/icon"
    export default{
        name:'payCashier',
        data(){
            return{
                pageTitle:'支付收银台',
                radio:'',
                order_num:'',
                openid:'',
                resultFrom: '',
                cashierData:{},
                userInfo:'',
                time: 0,
                async_flag: false,
				payWay:'',
                payWayList: [
					// {
					// 	code: "wxpay",
					// 	id: 1,
					// 	name: "微信支付",
					// },{
					// 	code: "alipay",
					// 	id: 2,
					// 	name: "支付宝支付",
					// },{
					// 	code: "offlinepay",
					// 	id: 3,
					// 	name: "线下付款",
					// }
				],
                payData: {
                    pay_type: '',
                    platform: 'wap',
                    // redirect_url: ''
                },
                cashierQuery: {},
                payType: {
                    wxpay: 1,
                    alipay: 2,
                    offlinepay: 3
                },
                isWxPay: false,
                loopTimer: null,
                order_ids: '',
				urls:'',
                wxData:'',
                iconSize: 20
            }
        },
        components:{
            countDown,
            tuiIcon
        },
        computed:{

        },
        watch:{

        },
        methods:{
            getPayTime(){
                this.$api.getCommonSet({//用户支付时长
                    cmd:{
                        "sys":"getCommonSet"
                    },
                    data:{
                        'param_type': 3
                    }
                }).then(res=>{
                    console.log(res,555)
                    if(res.code === 1){
                        this.async_flag = true
                        var time = res.data.time - new Date(this.cashierData.create_time.replace(/-/g,'/')).getTime()/1000
                        if(time > res.data.pay_time) {
                            // this.$toast({message: '支付超时，返回订单列表页'})
                            // this.$router.replace({name: 'orderList', params: {ordertype: ''}})
                        }else{
                            this.time = (res.data.pay_time - time)*1000
							console.log(this.time)
                        }
                    }
                }).catch(err=>{

                })
            },
            paywayChange(val){
                this.payData.pay_type = this.payType[val]
                if(this.payType[val] == 1 && this.isWxPay) {
                    // this.payData.openid = localStorage.getItem('openid')
					this.payData.openid = this.$store.state.openId
                }
            },
			
			chooisePayWay(item){
				//#ifdef MP-WEIXIN
				this.payWayFun() 
				this.payData.pay_type = 1;
				//#endif
				//#ifdef H5
				if(item == 'wxpay'){
					if(this.isWxPay){
						this.payData.openid = this.$store.state.openId
						// this.payData.openid = this.payData.openid.replace("\"","").replace("\"","")
					}
					this.payData.pay_type = 1
				}else if(item == 'alipay'){
					this.payData.pay_type = 2
				}else{
					this.payData.pay_type = 3
				}
				let type = this.payData.pay_type
				// // this.payData.redirect_url = ''
				if(type == 3) {
					let that = this
					uni.showModal({
						title: '确认是否线下付款',
						content: '确认线下付款',
						cancelText:'再想想',
						confirmColor:'#333',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
								that.payWayFun()
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}else{
				    if(type == 1) {
				        this.payData.redirect_url = window.location.href.replace('other', 'weixin')
				    }
				   this.payWayFun() 
				}
				//#endif
			},
            wxH5Pay(){
				var that = this;
				uni.showModal({
					title: '信息',
					content: '请确认微信支付是否已完成？',
					cancelText:'重新支付',
					confirmText:'已完成支付',
					confirmColor:'#333',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.getPayStatus('confirm')
						} else if (res.cancel) {
							console.log('用户点击取消');
							that.getPayStatus('cancel')
						}
					}
				});  
            },
            getPayStatus(type){
				console.log(this.payData)
                this.$api.queryPayStatus({
                    cmd:{
                        order:"queryPayStatus"
                    },
                    data:{
                        order_sn: this.cashierData.order_sn,
                        pay_type: 1
                    }
                }).then(res=>{
                    if(res.code==1){
						this.$mRouter.redirectTo({
							route: this.$mRoutesConfig.payResult,
							query: {
								payway:1
							}
						})
                    }else{
                       if(type == 'confirm') {
						   this.$mRouter.redirectTo({
								route: this.$mRoutesConfig.orderList,
								query: {
									status:0
								}
						   })
                        }
                    }
                })
            },
            loopPayStatus(){
                this.loopTimer = setInterval(res=>{
                    this.getPayStatus('loop')
                },2000)
            },
            payWayFun(){
				//#ifdef H5
				this.$api.payMoney({
				    cmd:{
				        order:"pay"
				    },
				    data:this.payData
				}).then(res=>{
				    console.log(this.payData.openid)
				    if(res.code == 1) {
				        let data = res.data
						uni.setStorageSync('pay_order_sn', this.cashierData.order_sn);         
				        if(this.payData.pay_type == 2) {
							console.log(data)
				            window.location.href = data
				        }else if(this.payData.pay_type == 1) {
				            if(this.payData.openid == undefined) {
				                window.location.href = data
								console.log(data)
				            }else{
				                console.log(data, '微信浏览器支付')
				                if(typeof WeixinJSBridge == "undefined"){
				            　　　　　　　if( document.addEventListener ){
				            　　　　　　　　　document.addEventListener('WeixinJSBridgeReady', this.wxPayFun(data), false);
				            　　　　　　　}else if (document.attachEvent){
				            　　　　　　　　　document.attachEvent('WeixinJSBridgeReady', this.wxPayFun(data)); 
				            　　　　　　　　　document.attachEvent('onWeixinJSBridgeReady', this.wxPayFun(data));
				            　　　　　　　}
				            　　　}else{
				            　　　　　this.wxPayFun(data)
				            　　　}
				            }
				            
				        }else if(this.payData.pay_type == 3){
				            setTimeout(res=>{
				                // this.$router.replace({name:'payResult',params:{payway: this.payData.pay_type}})
				            }, 500)
				            
				        }
				    }else{
				        console.log(res)
				    }
				})
				//#endif
				//#ifdef MP-WEIXIN
				this.$api.payMoney({
				    cmd:{
				        order:"pay"
				    },
				    data:{
						'pay_type':1,
						'platform':'wap',
						'order_ids':this.order_ids,
						'openid':this.$store.state.openId
					}
				}).then(res=>{
				    console.log(res)
					uni.setStorageSync('pay_order_sn', this.cashierData.order_sn);  
					let payway = this.payData.pay_type
				    if(res.code == 1) {
				       uni.requestPayment({
				       	'provider': 'wxpay',
				       	'timeStamp':res.data.timeStamp,
				       	'nonceStr': res.data.nonceStr,
				       	'package': res.data.package,
				       	'signType':res.data.signType,
				       	'paySign': res.data.paySign,
				       	success: function (res) {
							uni.redirectTo({
								url: '/pages/pay/payResult?payway='+payway
							});
				       	},
				       	fail: function (err) {
							uni.redirectTo({
								url: '/pages/order/orderList?status=0'
							});
				       	}
				       });
				    }else{
				        console.log(res)
				    }
				})
				//#endif
            },
            getCashier(){
                this.$api.cashier({
                    cmd:{
                        order:"cashier"
                    },
                    data:this.cashierQuery,
                }).then(res=>{
					console.log(res)
                    if(res.code===1){
                        console.log(res.data)
                        this.cashierData = res.data
                        this.payWayList = res.data.pay_type
                        this.radio = res.data.pay_type[0].code
                        this.getPayTime()
                    }
                })

            },

            wxPayFun(data){
                let _this = this
                WeixinJSBridge.invoke(
	　　　　　　　　　　'getBrandWCPayRequest', {
		　　　　　　　　　　"appId":data.appId, //公众号名称，由商户传入 
		　　　　　　　　　　"timeStamp":data.timeStamp, //时间戳，自1970年以来的秒数 
		　　　　　　　　　　"nonceStr":data.nonceStr, //随机串 
		　　　　　　　　　　"package":data.package,   //订单详情扩展字符串
		　　　　　　　　　　"signType":data.signType, //微信签名方式： 
		　　　　　　　　　　"paySign":data.paySign //微信签名 
		　　　　　　　},
                    function(res){
                        if(res.err_msg == "get_brand_wcpay_request:ok"){
							uni.redirectTo({
								url: '/pages/pay/payResult?payway='+_this.payData.pay_type
							});
                        }else{
							uni.redirectTo({
								url: '/pages/order/orderList?ordertype=0'
							});  
                        }
                    }
                )
            },

            countDownEvt(){
				uni.showToast({
                    title: '支付超时，返回订单列表页',
                    icon: 'none'
                });
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.orderList,
					query: {
						
					}
				})
                // this.$toast({message: '支付超时，返回订单列表页'})
                // this.$router.replace({name:'orderList', params: {ordertype: 0}})
            },

            clearTimer(){
                clearInterval(this.loopTimer);
                this.loopTimer = ''
            },
			isWeixin () {
				let wx = navigator.userAgent.toLowerCase()
				if (wx.match(/MicroMessenger/i)) {
				  return true
				} else {
				  return false
				}
			}
        },
        onLoad(option){
			const res = uni.getSystemInfoSync();
			console.log(res,'什么什么');
			// #ifdef H5
			console.log(this.isWeixin(),'option')
			this.isWxPay = this.isWeixin()
			// #endif
            this.userInfo = this.$store.state.userInfo
            this.payWay = option.payway
            this.resultFrom = option.resultFrom
            this.order_num = option.orderid
            this.order_ids = option.orderArr
            this.$set(this.payData, 'order_ids', this.order_ids)
            if(this.payWay == 1) {
                // this.$set(this.payData, 'order_ids', this.order_ids)
                this.$set(this.cashierQuery, 'order_sn', this.order_num)
            }else if(this.payWay == 2){
                // this.$set(this.payData, 'order_sn', this.order_num)
                this.$set(this.cashierQuery, 'order_sn', this.order_num)
            }
            if(this.resultFrom == 'weixin') {
                this.wxH5Pay()
            }
            this.getCashier()
        },
        onShow(){

        },
        beforeRouteLeave (to, from , next) {
            this.$dialog.close()
            // this.clearTimer()
            next();
        },
        onUnload(){

        }
    }
</script>
<style lang="scss" type="text/scss">
    .payCashier-wrapper{
        padding-bottom: 90upx;
    }
    .payCashier-inner{
        height: 100%;
        color: #333;
		flex-direction: column;
        .pay-countDown{
			height: 126upx;
			background: #fff;
            display: flex;
			flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 28upx;
            text-align: center;
			justify-content: space-around;
            .timeBox{
                display: flex;
                justify-content: center;
                align-items: center;
                .box{
                    color: #F52F17;
                }
            }
        }
		.orderMoney{
			font-size: 28upx;
			display: flex;
			height: 100upx;
			padding: 0 24upx;
			line-height: 100upx;
			background: #fff;
			justify-content: space-between;
			&_title{
				color: #999999;
			}
			&_money{
				color: #DF1222;
			}
		}
   //      .payCashier-info{
   //          margin: 0 15px;
   //          background: #fff;
   //          font-size: 15px;
   //          padding: 20px 15px;
   //          border-radius: 6px;
			// flex-direction: column;
   //          .cell{
   //              display: flex;
   //              justify-content: space-between;
   //              font-size: 14px;
   //              color: #333;
   //              line-height: 20px;
   //              &:first-child{
   //                  margin-bottom: 10px;
   //              }
   //          }
   //      }
        .pay-way{
            margin: 24upx 0;
            background: #fff;
            font-size: 28upx;
            // border-radius: 6px;
			.way-list{
				width: 100%;
				flex-direction: column;
				.way-title{
					height: 80upx;
					line-height: 80upx;
					padding: 0 24upx;
					color: #333;
					border-bottom: 2upx solid #f2f2f2;
				}
			}
			.way-list-item{
				flex-direction: column;
				width: 100%;
			}
            .payway-item{
                display: flex;
                justify-content: space-between;
                height: 100upx;
                align-items: center;
                padding: 0 24upx;
                box-sizing: border-box;
                font-size: 28upx;
                &:not(:last-child){
                    border-bottom: 2upx solid #f2f2f2;
                }
                &:last-child{
                    &:after{
                        content: normal;
                    }
                }
                .label{
                    display: flex;
                    align-items: center;
                }
                .payway-icon{
                    background-repeat: no-repeat;
                    background-size: cover;
                    margin-right: 10upx;
                    &.wxpay{
                        width: 64upx;
                        height: 56upx;
                        background-image: url('../../static/imgs/icons/icon_wxpay.png');
                    }
                    &.offlinepay{
                        width: 64upx;
                        height: 64upx;
                        // background-image: url('../../static/imgs/icon_outline_pay.png');
                    }
                    &.alipay{
                        width: 64upx;
                        height: 64upx;
                        background-image: url('../../static/imgs/icons/icon_alipay.png');
                    }
                }
                
            }
            .van-radio{
                height: 40upx;
                overflow: inherit;
                display: flex;
            }
        }

    }
    .payCashier-ft{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 90upx;
        display: flex;
        z-index: 99;
        font-size: 32upx;
        .l{
            background: #fff;
            color: #1FA76E;
            height: 100%;
            line-height: 90upx;
            text-align: left;
            flex-grow: 1;
            width: 50%;
            padding: 0 30upx;
        }
        .r{
            background: #1FA76E;
            color: #fff;
            height: 100%;
            line-height: 90upx;
            text-align: center;
            flex-grow: 1;
            width: 50%;
        }
    }
</style>
