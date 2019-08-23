<template>
	<view class="order-detail">
		<view class="order-detail-wrapper">
			<!-- 订单状态 -->
			<view class="order-detail-state">
				<view class="text">
					<view class="main-text">{{stateText}}</view>
					<view v-if="!isShare">
						<view class="sub-text" v-if="goodsData.order_state===0">
							<count-down
								class="count-down"
								:timeProps="goodsData.pay_time_limit*1000"
								temp="1"
								@emitCountDownFun="emitCountDownFun"
							></count-down>
						</view>
						<view class="sub-text" v-if="goodsData.order_state===200">
							<count-down
								class="count-down"
								:timeProps="goodsData.confirm_time_limit*1000"
								temp="4"
								@emitCountDownFun="confirmCountDownFun"
							></count-down>
						</view>
						<view class="sub-text" v-if="goodsData.order_state!==200&&goodsData.order_state!==0">{{subText}}</view>
					</view>
				</view>
				<view class="state-icon">
					<image v-if="goodsData.order_state===0" class="state-0" :src="require('@/static/imgs/order/icon_state_0.png')"></image>
					<image v-if="goodsData.order_state===100" class="state-100" :src="require('@/static/imgs/order/icon_state_100.png')"></image>
					<image v-if="goodsData.order_state===200" class="state-200" :src="require('@/static/imgs/order/icon_state_200.png')"></image>
					<image v-if="goodsData.order_state===300" class="state-300" :src="require('@/static/imgs/order/icon_state_300.png')"></image>
					<image v-if="goodsData.order_state===400" class="state-300" :src="require('@/static/imgs/order/icon_state_400.png')"></image>
				</view>
			</view>
			<!-- 收货人信息 -->
			<view class="order-detail-address">
				<!-- 物流方式 -->
				<view class="logistics-mode" v-if="goodsData.order_state===200" @click="goLogistics">
					<view class="mode-l">
						<image class="pic" :src="require('@/static/imgs/order/icon_logistics.png')"></image>
					</view>
					<view class="mode-c">
						<view class="info-top">
							<view class="transaction-mode">
								交易方式：{{goodsData.express_company_name?'快递物流':'无需物流配送'}}
							</view>
							<view class="company" v-if="goodsData.express_company_name">
								物流公司：{{goodsData.express_company_name}}
							</view>
						</view>
						<view class="info-bottom" v-if="goodsData.express_company_name">
							快递单号：{{goodsData.express_code}}
						</view>
					</view>
					<view class="mode-r">
						<image class="pic" :src="require('@/static/imgs/order/icon-jumppage.png')"></image>
					</view>
				</view>
				<!-- 收货人信息 -->
				<view class="info-wrapper">
					<view class="info-icon">
						<image class="pic" :src="require('@/static/imgs/order/icon_position.png')"></image>
					</view>
					<view class="info-user" v-if="goodsData.receiver_info">
						<view class="user-name">
							<text class="receiver-name">{{goodsData.receiver_info.true_name}}</text>
							<text class="receiver-phone">{{goodsData.receiver_info.mobile}}</text>
						</view>
						<text class="user-address">{{goodsData.receiver_info.address}}</text>
					</view>
				</view>
			</view>
			<!-- 订单商品展示 -->
			<view class="order-detail-goods">
				<view class="store-info">
					<view class="store-name">
						<image class="store-icon" :src="require('@/static/imgs/icons/icon_shop.png')" />
						<span class="name">{{goodsData.store_name}}</span>
					</view>
				</view>
				<view class="goods-wrapper">
					<view class="goods-item-wrapper" v-for="(item,index_) in goodsData.order_goods" :key="index_" @tap="goGoodsDetailsPage(item)">
						<order-goods-item class="order-goods-item" :itemData="item" :isDetail="true" :orderState="goodsData.order_state" @handleRefund="handleRefund"></order-goods-item>
					</view>
				</view>
				<view class="goods-price-wrapper">
					<view class="price-model">
						<text class="price-title">商品总价</text>
						<text class="price-data">￥{{(goodsData.goods_amount||0) | toFixedTwo}}</text>
					</view>
					<view class="price-model">
						<text class="price-title">运费</text>
						<text class="price-data">+￥{{(goodsData.shipping_fee||0) | toFixedTwo}}</text>
					</view>
				</view>
				<view class="goods-total">
					<text>实付金额:</text>
					<text class="goods-total-data">￥{{(goodsData.order_amount||0) | toFixedTwo}}</text>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="order-detail-info">
				<view class="detail-info-model" v-if="goodsData.order_state!==0&&goodsData.order_state!==400&&!isShare">
					<text class="model-title">支付方式：</text>
					<text class="model-data">{{goodsData.pay_code}}</text>
				</view>
				<view class="detail-info-model">
					<text class="model-title">订单编号：</text>
					<text class="model-data">{{goodsData.order_sn}}</text>
				</view>
				<view class="detail-info-model" v-if="goodsData.order_state!==0&&goodsData.order_state!==400&&!isShare">
					<text class="model-title">支付单号：</text>
					<text class="model-data">{{goodsData.pay_sn}}</text>
				</view>
				<view class="detail-info-model">
					<text class="model-title">创建时间：</text>
					<text class="model-data">{{goodsData.create_time}}</text>
				</view>
				<view class="detail-info-model" v-if="goodsData.order_state!==0&&goodsData.order_state!==400&&!isShare">
					<text class="model-title">支付时间：</text>
					<text class="model-data">{{goodsData.pay_time}}</text>
				</view>
				<view class="detail-info-model" v-if="(goodsData.order_state===300||goodsData.order_state===200)&&!isShare">
					<text class="model-title">发货时间：</text>
					<text class="model-data">{{goodsData.delivery_time}}</text>
				</view>
			</view>
			<view class="have-problem" v-if="(goodsData.order_state===100||goodsData.order_state===200)&&isAllRefund" @click="handleProblem">
				对订单有疑问?申请退款
			</view>
			<view class="order-detail-btns" v-if="goodsData.order_state!==''&&goodsData.order_state!==400&&goodsData.order_state!==100&&!isShare">
				<order-handle-btns :item="goodsData" @confirmOrder="confirmOrder" @cancelOrder="emitCountDownFun"></order-handle-btns>
			</view>
		</view>
	</view>
</template>

<script>
	import OrderHandleBtns from '@/components/order/OrderHandleBtns';
	import OrderGoodsItem from '@/components/order/OrderGoodsItem';
	import CountDown from '@/components/CountDown';
	export default {
		name: 'orderDetail',
		// onShareAppMessage(res) {
		// 	return {
		// 		title: `老板，我是“${wx.getStorageSync('userInfo').nickName}”，刚在店里买的商品请接单！`,
		// 		path: `/pages/order/orderDetail?order_id=${this.order_id}&store_id=${this.goodsData.store_id}`,
		// 		// imageUrl: require('../../assets/images/img_share_order.png')
		// 	}
		// },
		components: {
			OrderGoodsItem,
			OrderHandleBtns,
			CountDown
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh: function() {
			//延时为了看效果
			this.getOrderDetail(1);
		},
		data() {
			return {
				isShare: false, //是否为分享过来的
				order_id: "",
				store_id: "",
				goodsData: {
					order_goods: [],
					order_state: '',
				},
			}
		},
		computed: {
			stateText() {
				switch (this.goodsData.order_state) {
					case 0:
						return "等待买家付款"
						break;
					case 100:
						return "等待卖家发货"
					case 101:
						return "退款中"
					case 102:
						return "已退款"
					case 200:
						return "卖家已发货"
					case 300:
						return "订单已完成"
					case 400:
						return "订单已取消"
				}
			},
			subText() {
				switch (this.goodsData.order_state) {
					case 101:
						return `退款编号：${this.goodsData.refund_sn}`
					case 102:
						return `退款编号：${this.goodsData.refund_sn}`
					case 300:
						return `您的订单已签收,祝您购物愉快`
					default:
						return ""
				}
			},
			// 是否所有商品都为退款
			isAllRefund() {
				let x = false;
				for (let item of this.goodsData.order_goods) {
					// console.log(item.status,"啦啦啦啦啦");
					if(item.status===10){
						x = true;
					}
				}
				return x;
			}
		},
		onLoad(option) {
			console.log(option);
			console.log(this.goodsData.order_state);
			if (option.order_id) {
				this.order_id = option.order_id;
			}
			// if (this.$route.query.store_id) {
			// 	this.store_id = this.$route.query.store_id;
			// 	this.isShare = true;
			// }
		},
		onShow() {
			this.getOrderDetail();
		},
		methods: {
			// 获取订单详情信息
			getOrderDetail(props) {	//props===1时为刷新
				this.$api.orderDetail({
					cmd: {
						order: "orderDetail"
					},
					data: {
						order_id: this.order_id
					}
				}).then(res => {
					console.log(res.data);
					if (res.code === 1) {
						if(res.data.order_state!==0&&res.data.order_state!==400){
							switch (res.data.pay_code){
								case 'wxpay':
									res.data.pay_code = '微信支付';
								break;
								case 'alipay':
									res.data.pay_code = '支付宝支付';
								break;
							}
						};
						if (this.isShare) {
							// let data = res.data;
							// data.receiver_info.receiver = data.receiver_info.receiver.split("").map((item, index) => {
							// 	if (index > 0) {
							// 		item = "*";
							// 	}
							// 	return item
							// }).join("");
							// data.receiver_info.receiver_mobile = data.receiver_info.receiver_mobile.split("").map((item, index) => {
							// 	if (index > 2) {
							// 		item = "*";
							// 	}
							// 	return item
							// }).join("");
							// console.log(data.receiver_info.receiver, data.receiver_info.receiver_mobile);
							// this.goodsData = data;
						} else {
							this.goodsData = res.data;
							this.store_id = res.data.store_id;
						}
						if (props === 1) {
							setTimeout(() => {
								uni.stopPullDownRefresh()
								uni.showToast({
									title: '刷新成功',
									icon:'none',
									duration: 1500
								})
							}, 300)
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon:'none',
							duration: 2000
						});
						uni.stopPullDownRefresh()
					}
				}).catch(err => {
					console.log(err);
					if (props === 1) {
						setTimeout(() => {
							uni.stopPullDownRefresh()
							uni.showToast({
								title: '刷新失败',
								duration: 1500
							})
						}, 300)
					}
				})
			},
			// 退款事件处理
			handleRefund(sku_id){
				let arr = this.goodsData.order_goods.filter(item=>{
					return item.status == 10;
				})
				let skuArr = [];
				skuArr.push({
					sku_id: sku_id
				})
				uni.setStorageSync('refundGoods',arr);
				uni.setStorageSync('skuData',skuArr);
				uni.setStorageSync('initSku',skuArr);
				uni.setStorageSync('refundOrderId',this.goodsData.order_id);
				
				if(this.goodsData.order_state==100){
					this.$mRouter.push({
						route: this.$mRoutesConfig.applyRefund,
						query:{
							refund_type: 1
						}
					})
				}else{
					this.$mRouter.push({
						route: this.$mRoutesConfig.serveClass,
						query:{
							order_state: this.goodsData.order_state
						}
					})
				}
				
			},
			// 疑问订单处理
			handleProblem(){
				let arr = this.goodsData.order_goods.filter(item=>{
					return item.status == 10;
				})
				uni.setStorageSync('refundGoods',arr);
				uni.setStorageSync('refundOrderId',this.goodsData.order_id);
				uni.removeStorageSync('skuData');
				uni.removeStorageSync('initSku');
				this.$mRouter.push({
					route: this.$mRoutesConfig.selectgoods,
					query:{
						order_state: this.goodsData.order_state
					}
				})
			},
			// 查看物流
			goLogistics() {
				console.log('点击查看物流');
				this.$mRouter.push({
					route: this.$mRoutesConfig.logisticsIndex,
					query: {
						orderid: this.order_id,
					}
				})
			},
			// 跳转商品详情
			goGoodsDetailsPage(item) {
				console.log('跳转到商品详情')
				this.$mRouter.push({
					route: this.$mRoutesConfig.goodsDetail,
					query: {
						spuId: item.spu_id,
						skuId: item.sku_id
					}
				})
			},
			// 定时器结束或取消订单成功
			emitCountDownFun(){
				this.goodsData.order_state = 400;
			},
			// 自动收货定时器完成
			confirmCountDownFun(){
				this.getOrderDetail();
			},
			// 确认收货成功
			confirmOrder(order_id){
				this.goodsData.order_state = 300;
			},
		},
		onUnload() {
			// this.isShare = this.showQrCode = false;
			// this.goodsData = {
			// 	order_goods: [],
			// 	order_state: '',
			// }
		}
	}
</script>

<style scoped lang="scss">
	// @import "../../assets/style/common.less";
	.order-detail {
		width: 100%;
		&-wrapper {
			width: 100%;
			padding-bottom: 112upx;
			flex-direction: column;
		}

		&-state {
			position: relative;
			padding: 0 60upx;
			height: 180upx;
			background: linear-gradient(319deg,rgba(246,108,112,1) 0%,rgba(233,60,62,1) 100%);
			align-items: center;
			justify-content: space-between;

			.text {
				width: 460upx;
				flex-shrink: 0;
				flex-direction: column;
				.main-text {
					font-size: 32upx;
					line-height: 48upx;
					color: white;
					letter-spacing: 2upx;
				}

				.sub-text {
					width: 100%;
					font-size: 24upx;
					line-height: 36upx;
					color: white;
					letter-spacing: 2upx;
					.count-down{
						width: 100%;
					}
				}
			}
			.state-icon{
				flex: 1;
				height: 100%;
				justify-content: flex-end;
				align-items: center;
				.state-0{
					width: 90upx;
					height: 84upx;
				}
				.state-100{
					width: 116upx;
					height: 92upx;
				}
				.state-200{
					width: 122upx;
					height: 84upx;
				}
				.state-300{
					width: 100upx;
					height: 98upx;
				}
			}
		}

		&-address {
			background: white;
			flex-direction: column;
			
			.logistics-mode{
				min-height: 132upx;
				border-bottom: 2upx solid #E7E7E7;
				.mode-l{
					width: 72upx;
					flex-shrink: 0;
					align-items: center;
					justify-content: center;
					.pic{
						width: 34upx;
						height: 26upx;
					}
				}
				.mode-c{
					flex: 1;
					flex-direction: column;
					justify-content: center;
					font-size: 28upx;
					.info-top{
						justify-content: space-between;
						.transaction-mode{
							
						}
						.company{
							
						}
					}
					.info-bottom{
						margin-top: 16upx;
					}
				}
				.mode-r{
					flex-shrink: 0;
					align-items: center;
					justify-content: center;
					width: 72upx;
					.pic{
						width: 16upx;
						height: 26upx;
					}
				}
			}

			.info-wrapper {
				min-height: 132upx;
				.info-icon{
					width: 72upx;
					justify-content: center;
					align-items: center;
					flex-shrink: 0;
					.pic{
						width: 22upx;
						height: 28upx;
					}
				}
				.info-user {
					flex-direction: column;
					font-size: 28upx;
					padding: 10upx 72upx 20upx 0;

					.user-name {
						line-height: 60upx;
						.receiver-phone{
							margin-left: 10upx;
						}
					}

					.user-address{
						color: #999999;
						font-size: 24upx;
					}
				}
			}

		}

		&-goods {
			margin-top: 20upx;
			background: white;
			flex-direction: column;

			.store-info {
				justify-content: space-between;
				align-items: center;
				height: 80upx;
				padding: 0 24upx;
				border-bottom: 2upx solid #E7E7E7;

				.store-name {
					display: flex;
					align-items: center;

					.store-icon{
						width: 40upx;
						height: 40upx;
					}

					.name {
						margin-left: 10upx;
						font-size: 28upx;
						color: #333333;
					}
				}

			}

			.goods-wrapper {
				flex-direction: column;
				.goods-item-wrapper {
					padding: 0 24upx;
					margin-top: 24upx;
					width: 100%;
					.order-goods-item {
						width: 100%;
					}

					&:last-child {
						margin-bottom: 0px;
					}
				}
			}
			
			.goods-price-wrapper{
				padding: 26rpx 24upx 16upx;
				font-size: 24upx;
				flex-direction: column;
				justify-content: space-between;
				.price-model{
					justify-content: space-between;
					margin-bottom: 20upx;
					.price-data{
						align-items: center;
						color: #DF1222;
					}
				}
			}
			.goods-total {
				padding: 0 24upx;
				justify-content: flex-end;
				align-items: center;
				height: 100upx;
				font-size: 32upx;
				border-top: 2upx solid #E7E7E7;
				&-data{
					color: #DF1222;
				}
			}
		}

		&-info {
			margin-top: 20upx;
			padding: 20upx 24upx 0;
			background: white;
			flex-direction: column;

			.detail-info-model{
				font-size: 28upx;
				line-height: 30upx;
				margin-bottom: 20upx;
				.model-title{
					color: #999999;
				}
				.model-data{
					
				}
			}
		}
		.have-problem{
			justify-content: center;
			color: #107EFF;
			font-size: 28upx;
			width: 100%;
			line-height: 80upx;
		}
		&-btns {
			width: 100%;
			height: 90upx;
			position: fixed;
			bottom: 0;
			background: white;
			align-items: center;
			justify-content: flex-end;
			padding: 0 12px;
		}
	}
</style>
