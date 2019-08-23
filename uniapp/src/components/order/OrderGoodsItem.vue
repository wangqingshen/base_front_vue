<template>
	<view class="order-goods-item">
		<image class="order-goods-item-img" :src="$mUtils.addImgUrl(itemData.goods_img)" />
		<view class="order-goods-item-wrapper">
			<view class="order-goods-item-item">
				<view class="header-wrapper">
					<view class="goods-name" :class="isRefund?'refund-name':''">{{itemData.spu_name}}</view>
					<view v-if="!isRefund" class="goods-info">
						<text class="price">￥{{itemData.goods_price}}</text>
						<text class="goods-num">x{{itemData.goods_num}}</text>
					</view>
				</view>
				<view class="goods-sku" v-if="itemData.sku_name">
					规格名称：{{itemData.sku_name}}
				</view>
				<view class="goods-state">{{isDetail?'':refundState}}</view>
			</view>
			<view class="refund-btns" v-if="(orderState===100||orderState===200)&&isDetail">
				<view class="btn" v-if="itemData.status==10" @click.stop="handleRefund">退款</view>
				<view class="btn" v-if="itemData.status==21 || itemData.status==22" @click.stop="handleRefund">退款中</view>
				<view class="btn" v-if="itemData.status==31 || itemData.status==32" @click.stop="handleRefund">待平台退款</view>
				<view class="btn" v-if="itemData.status==41 || itemData.status==42" @click.stop="handleRefund">退款成功</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name: 'OrderGoodsItem',
		props: {
			itemData: {
				type: Object
			},
			isDetail: {	//是否为详情页使用
				type: Boolean,
				default: false
			},
			isRefund: { //是否为申请退款或我的退款页面使用
				type: Boolean,
				default: false
			},
			orderState: {
				type: Number
			}
		},
		data() {
			return {
				imgPath: ""
			}
		},
		onLoad() {

		},
		computed: {
			refundState(){
				if(this.isDetail || this.isRefund){
					return ''
				}else{
					switch (this.itemData.status){
						case 21:
							return '退款中'
						case 22:
							return '退款中'
						case 31:
							return '待平台退款'
						case 32:
							return '待平台退款'
						case 41:
							return '退款成功'
						case 42:
							return '退款成功'
						default:
							return ''
					}
				}
				
			}
		},
		methods: {
			//申请退款
			handleRefund(){
				if(this.itemData.status!==10){
					this.$mRouter.push({
						route: this.$mRoutesConfig.refundDetail,
						query: {
							refund_sn: this.itemData.refund_sn
						}
					})
				}else{
					this.$emit('handleRefund',this.itemData.order_goods_id)
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.order-goods-item {
		justify-content: space-between;
		align-items: flex-start;
		flex: 1;
		min-height: 180upx;

		&-img {
			width: 180upx;
			height: 180upx;
			flex-shrink: 0;
			background: #F5F5F5;
		}
		.order-goods-item-wrapper{
			flex-direction: column;
			flex: 1;
			margin-left: 20upx;
			.refund-btns{
				height: 76upx;
				align-items: flex-end;
				justify-content: flex-end;
				margin-bottom: 20upx;
				.btn{
					margin-left: 20upx;
					width: 138upx;
					height: 56upx;
					background: rgba(255,255,255,1);
					border-radius: 4upx;
					border: 2upx solid rgba(231,231,231,1);
					justify-content: center;
					align-items: center;
					color: #666666;
					font-size: 26upx;
				}
			}
		}
		&-item {
			min-height: 180upx;
			flex-direction: column;
			justify-content: space-between;

			.header-wrapper {
				justify-content: space-between;

				.goods-name {
					width: 340upx;
					height: 74upx;
					font-size: 28upx;
					color: #333;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					line-height: 36upx;
					text-align: left;
					flex-shrink: 0;
				}
				.refund-name{
					width: 100%;
				}
				
				.goods-info{
					flex-direction: column;
					.price {
						color: #333;
						font-size: 28upx;
						word-break: break-all;
					}
					.goods-num{
						text-align: right;
						color: #999999;
						font-size: 24upx;
					}
				}
				
			}
			
			.goods-sku{
				color: #666666;
				font-size: 24upx;
			}
			
			.goods-state{
				justify-content: flex-end;
				min-height: 24upx;
				color: #FF6900;
				font-size: 24upx;
			}

		}
	}
</style>
