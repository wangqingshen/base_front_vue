<template>
	<view class="order-handle-btns" v-if="isRefund">
		<button class="style-default" @tap="goRefundDetail">退款详情</button>
	</view>
	<view class="order-handle-btns" v-else>
		<button class="style-default" v-if="item.order_state == 0 || item.order_state == 1" @tap="cancelOrderFun()">取消订单</button>
		<button class="style-default red" @tap="payFun()" v-if="item.order_state == 0">立即付款</button>
		<button class="style-default" @tap="gol()" v-if="item.order_state == 200 || item.order_state == 300 && item.order_type!=6">查看物流</button>
		<button class="style-default red" @tap="confirm()" v-if="item.order_state == 200 && item.order_type!=6">确认收货</button>
		<button class="style-default red" @tap="evaluate()" v-if="item.order_state == 300 && item.evaluation == 1">评价</button>
	</view>
</template>

<script>
	export default {
		name: 'OrderHandleBtns',
		props: {
			item: {
				type: Object,
				default: ()=>{
					return {
						oreder_id: 0
					}
				}
			},
			isRefund: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				order_id: this.item.order_id
			}
		},
		methods: {
			// 取消订单
			cancelOrderFun() {
				let _this = this;
				uni.showModal({
					content: '是否确认取消订单',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							_this.$api.cancelOrder({
								cmd: {
									order: 'cancelOrder'
								},
								data: {
									order_id: _this.order_id
								}
							}).then(res => {
								console.log(res, '取消成功')
								if (res.code === 1) {
									_this.$emit('cancelOrder', _this.order_id);
									uni.showToast({
										title: '取消订单成功',
										duration: 2000
									});
								} else {
									uni.showToast({
										title: '取消订单失败，请稍后再试',
										duration: 2000
									});
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})

			},
			// 跳转支付
			payFun() {
				console.log('点击了去支付');
				this.$mRouter.push({
					route: this.$mRoutesConfig.pay,
					query: {
						orderid: this.item.order_sn,
						orderArr: this.item.order_id,
						payway: 1,
						platform: 'other'
					}
				})
			},
			// 查看物流
			gol(item) {
				console.log('点击查看物流');
				this.$mRouter.push({
					route: this.$mRoutesConfig.logisticsIndex,
					query: {
						orderid: this.item.order_id,
					}
				})
			},
			// 确认收货
			confirm() {
				let _this = this;
				uni.showModal({
					content: '是否确认收货？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							_this.$api.confirmOrder({
								cmd: {
									order: 'confirmorder'
								},
								data: {
									order_id: _this.order_id,
									member_id: uni.getStorageSync('userInfo').member_id,
									store_id: _this.item.store_id
								}
							}).then(res => {
								if (res.code === 1) {
									_this.$emit('confirmOrder', this.order_id);
									uni.showToast({
										title: '确认收货成功',
										duration: 2000
									});
							
								} else {
									uni.showToast({
										title: '确认收货失败，请稍后再试',
										duration: 2000
									});
								}
							})
						}else if(res.cancel){
							console.log('用户点击取消');
						}
					}
				})
			},
			// 评价
			evaluate() {
				console.log('点击评价');
				this.$mRouter.push({
					route: this.$mRoutesConfig.evaluate,
					query: {
						orderId: this.order_id,
						storeId: this.item.store_id
					}
				})
			},
			// 查看退款详情
			goRefundDetail(){
				this.$emit('goRefundDetail');
			}

		},
	}
</script>

<style scoped lang="scss">
	.order-handle-btns {
		.style-default {
			min-width: 140upx;
			height: 50upx;
			border-radius: 4upx;
			border: 2upx solid #ccc;
			padding: 0 20upx;
			line-height: normal;
			font-size: 24upx;
			margin-right: 20upx;
			color: #666;
			display: flex;
			align-items: center;
			justify-content: center;

			&:last-child {
				margin-right: 0;
			}

			&.red {
				border-color: #DF1222;
				color: #DF1222;
			}
		}
	}
</style>
