<template>
	<view class="orderList-item">
		<view class="hd">
			<view class="store-top">
				<view class="store-name">
					<view class="shop-icon">
						<image :src="require('@/static/imgs/icons/icon_shop.png')"></image>
					</view>
					<view class="txt">{{item.store_name}}</view>
				</view>
				<!-- <view class="order-num">订单编号：{{item.order_sn}}</view> -->
			</view>
			<!-- <view class="status-txt" v-if="item.order_type == 2 && item.order_state == 100 && !item.group_team_state">拼团中</view> -->
			<view class="status-txt" v-if="isRefund">
				<text class="refund-type">{{item.refund_type | refundType}}</text>
				<text class="refund-state">{{item.status | refundStatus(item.refund_type)}}</text>
			</view>
			<view class="status-txt" v-else>{{item.order_state | orderStatus(item.order_type)}}</view>
		</view>
		<view class="bd" v-if="isRefund">
			<view class="goods-list" v-for="(val,index2) in item.refund_sku" :key="index2" @tap="goRefundDetailsPage">
				<order-goods-item class="order-goods-item" :itemData="val" :isRefund="true"></order-goods-item>
			</view>
		</view>
		<view class="bd" v-else>
			<view class="goods-list" v-for="(val,index2) in item.order_goods" :key="index2" @tap="goOrderDetailsPage(item)">
				<order-goods-item class="order-goods-item" :itemData="val"></order-goods-item>
			</view>
		</view>
		<view class="ft">
			<view class="total">
				<!-- 退款总计 -->
				<view class="refund-acount" v-if="isRefund">
					<text class="apply-refund-time">申请时间：{{item.create_time}}</text>
					<text class="apply-refund-price">退款金额：￥{{item.refund_amount || 0.00}}</text>
				</view>
				<!-- 订单总计 -->
				<view class="order-acount" v-else>
					<text>共{{item.goods_total_num}}件商品</text> <text>小计：￥{{item.order_amount | toFixedTwo}}</text>
					<text>（含运费￥{{item.shipping_fee}}）</text>
				</view>
			</view>
			<view class="btns" v-if="item.order_state != 400 && item.order_state != 100 &&!isRefund">
				<view class="pick-up-code"></view>
				<view class="handle-btn" v-if="!(item.order_type == 2 && item.order_state == 100 && !item.group_team_state)">
					<order-handle-btns :item="item" @cancelOrder="cancelOrder" @confirmOrder="confirmOrder"></order-handle-btns>
				</view>
			</view>
			<view class="btns state-refund" v-if="isRefund">
				<view class="refund-btn">
					<order-handle-btns :isRefund="true" @goRefundDetail="goRefundDetailsPage"></order-handle-btns>
				</view>
			</view>
			<!-- 分销商订单按钮 -->
		</view>
	</view>
</template>

<script>
	import OrderGoodsItem from '@/components/order/OrderGoodsItem';
	import OrderHandleBtns from '@/components/order/OrderHandleBtns';
	export default {
		name: 'OrderListItem',
		data() {
			return {
				
			}
		},
		props: {
			item: {
				type: Object,
			},
			isRefund: {		//是否为退款页面使用
				type: Boolean,
				default: false,
			}
		},
		components: {
			OrderGoodsItem,
			OrderHandleBtns
		},
		methods: {
			// 跳转订单详情
			goOrderDetailsPage(item) {
				console.log(item)
				this.$mRouter.push({
					route: this.$mRoutesConfig.orderDetail,
					query:{
						order_id: item.order_id
					}
				});
			},
			// 跳转到退款详情页
			goRefundDetailsPage(){
				console.log('跳转到退款详情');
				this.$mRouter.push({
					route: this.$mRoutesConfig.refundDetail,
					query: {
						refund_sn: this.item.refund_sn
					}
				})
			},
			// 取消订单
			cancelOrder(order_id){
				this.$emit('cancelOrder',order_id);
			},
			// 确认收货
			confirmOrder(order_id){
				this.$emit('confirmOrder',order_id);
			}
		},
	}
</script>

<style scoped lang="scss">
	.orderList-item {
		width: 100%;
		flex-direction: column;
		background: #fff;
		margin-bottom: 20upx;

		.hd {
			height: 80upx;
			padding: 0 24upx;
			align-items: center;
			justify-content: space-between;
			font-size: 28upx;
			border-bottom: 2upx solid #E7E7E7;

			.store-top {
				flex-direction: column;

				.store-name {
					align-items: center;

					.shop-icon {
						width: 40upx;
						height: 40upx;
					}

					.txt {
						margin-left: 10upx;
						font-size: 24upx;
						color: #333333;
					}
				}

				.order-num {
					margin-top: 6px;
					color: #888;
					font-size: 12px;
				}
			}

			.status-txt {
				color: #DF1222;
				display: -webkit-box;
				white-space: normal;
				word-break: break-all;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				text-align: right;
				.refund-type{
					margin-right: 10upx;
				}
			}
		}

		.bd {
			padding: 24upx 24upx 0;
			flex-direction: column;
			.goods-list{
				margin-bottom: 24upx;
				.order-goods-item{
					width: 100%;
				}
			}
		}

		.ft {
			flex-direction: column;

			.total {
				height: 62upx;
				padding: 0 24upx;
				align-items: center;
				justify-content: flex-end;
				width: 100%;
				font-size: 24upx;
				color: #333;
				line-height: 34upx;
				.refund-acount{
					width: 100%;
					height: 100%;
					justify-content: space-between;
					align-items: center;
					.apply-refund-time{
						color: #666666;
					}
				}
			}

			.btns {
				height: 90upx;
				padding: 0 24upx;
				justify-content: space-between;
				align-items: center;
				border-top: 2upx solid #EBEBEB;

				.pick-up-code {
					font-size: 24upx;
					color: #333333;

					span {
						color: #DF1222;
					}
				}
			}
			.state-refund{
				justify-content: flex-end;
				.refun-btn{
					
				}
			}
		}
	}
</style>
