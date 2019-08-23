<template>
	<view class="refund-detail">
		<!-- 退款状态 -->
		<view class="refund-detail-header">
			<view class="header-state">
				{{refundData.status | refundStatus(3)}}
			</view>
			<view class="header-state-des" v-if="haveBtn">
				<count-down :timeProps="refundData.time_limit*1000" temp="6" @emitCountDownFun="handleTimeOver"></count-down>
			</view>
			<view class="header-state-des" v-if="refundData.status!==3&&refundData.status!==14&&!haveBtn">
				{{refundData.update_time}}
			</view>
		</view>
		<!-- 退货信息 -->
		<view class="refund-detail-return" v-if="refundData.status===6">
			<view class="return-state">
				{{refundData.status | refundStatus(4)}}
			</view>
			<view class="return-address">
				<view class="return-address-icon">
					<image class="address-icon" :src="require('@/static/imgs/order/icon_return_goods.png')"></image>
				</view>
				<view class="return-address-text">
					<view class="text-info">
						<!-- 退货部<text class="phone">123123123213</text> -->
						{{refundData.store_service.refund_holder}}<text class="phone">{{refundData.store_service.refund_mobile}}</text>
					</view>
					<view class="text-address">
						{{refundData.store_service.refund_complete_address}}
					</view>
				</view>
			</view>
		</view>
		<!-- 退款详情描述 -->
		<view class="refund-detail-describe">
			<view class="des-state" v-if="refundData.status===6">
				售后说明：{{refundData.store_service.refund_remark}}
			</view>
			<view class="des-state" v-else>
				{{refundData.status | refundStatus(4)}}
			</view>
			<view class="des-tips" v-if="refundData.status===0">
				<text class="tips-text">商家同意或者超时未处理，系统将退款给您</text>
				<text class="tips-text">如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理</text>
			</view>
			<view class="des-tips" v-if="refundData.status===6">
				<text class="tips-text">未与商家协商一致，请勿使用到付或平邮，以免商家拒签货物</text>
				<text class="tips-text">请填写真实退货物流信息，逾期未填写，退货申请将关闭</text>
			</view>
			<view class="des-tips" v-if="refundData.status===7">
				<text class="tips-text">商家同意或者超时未处理，系统将自动流转到平台进行审核</text>
				<text class="tips-text">如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理</text>
			</view>
			<view class="des-btns" v-if="haveBtn">
				<button class="btn-default" @tap="closeApply">撤销申请</button>
				<button class="btn-default" v-if="refundData.status===0" @tap="changeApply">修改申请</button>
				<button class="btn-default" v-if="refundData.status===7" @tap="writeLogistics">修改退货单信息</button>
				<button class="btn-default red" v-if="refundData.status===6" @tap="writeLogistics">我已寄出(点击填写物流单号)</button>
			</view>
		</view>
		<!-- 协商历史 -->
		<view class="refund-detail-history">
			<click-list class="click-list" listTitle="协商历史" @handleClick="checkHistory"></click-list>
		</view>
		<!-- 退款商品 -->
		<view class="refund-detail-goods">
			<view class="goods-title">
				退款信息
			</view>
			<view class="goods-wrapper">
				<view class="goods-wrapper-item" v-for="(item,index) in refundData.refund_sku" :key="index">
					<order-goods-item class="order-goods-item" :itemData="item"></order-goods-item>
				</view>
			</view>
		</view>
		<!-- 退款上传信息 -->
		<view class="refund-detail-info">
			<view class="info-wrapper">
				<text calss="info-title">退款编号：</text>
				<text class="info-text">{{refundData.refund_sn}}</text>
			</view>
			<view class="info-wrapper">
				<text calss="info-title">退款原因：</text>
				<text class="info-text">{{refundData.refund_reason}}</text>
			</view>
			<view class="info-wrapper">
				<text calss="info-title">退款金额：</text>
				<text class="info-text">￥{{refundData.refund_amount}}</text>
			</view>
			<view class="info-wrapper">
				<text calss="info-title">退款说明：</text>
				<text class="info-text">{{refundData.refund_comment}}</text>
			</view>
			<view class="info-wrapper imgs" v-if="refundData.imgs&&refundData.imgs.length">
				<text>凭证上传：</text>
				<view class="info-imgs-wrapper">
					<image v-for="(item,index) in refundData.imgs" :key="index" @tap="previewImg(index)" class="info-imgs" :src="item"></image>
				</view>
			</view>
			<view class="info-wrapper" v-if="refundData.refund_delivery">
				<text calss="info-title">物流公司：</text>
				<text class="info-text">{{refundData.refund_delivery.company_name}}</text>
			</view>
			<view class="info-wrapper" v-if="refundData.refund_delivery">
				<text calss="info-title">物流单号：</text>
				<text class="info-text">{{refundData.refund_delivery.express_code}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import CountDown from "@/components/CountDown";
	import ClickList from "@/components/refund/ClickList";
	import OrderGoodsItem from "@/components/order/OrderGoodsItem";
	export default {
		name: "refundDetail",
		components: {
			CountDown,
			ClickList,
			OrderGoodsItem
		},
		data() {
			return {
				refund_sn: '',
				member_id: '',
				refundData: {},
				haveBtn: false,		//是否为含有按钮的状态
				
			}
		},
		onPullDownRefresh: function() {
		    //延时为了看效果
		    this.getRefundDetail(1);
			
		    setTimeout(() => {
		        
		        if(this.$store.getters.hasLogin) {
		            
		        }   
		    }, 1000)
		},
		onLoad(options) {
			this.refund_sn = options.refund_sn;
			this.member_id = uni.getStorageSync('userInfo').member_id;
			this.getRefundDetail();
		},
		methods: {
			// 超时
			handleTimeOver() {
				console.log('超时了');
				setTimeout(()=>{
					this.getRefundDetail();
				},500)
			},
			// 查询协商历史
			checkHistory(){
				console.log('查看历史');
				this.$mRouter.push({
					route: this.$mRoutesConfig.refundHistory,
					query: {
						refund_sn: this.refundData.refund_sn
					}
				})
			},
			// 撤销申请
			closeApply(){
				let _this = this;
				uni.showModal({
					content: '是否确认撤销退款申请',
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
							_this.$api.cancelRefund({
								cmd:{
									order:'cancelrefund'
								},
								data:{
									refund_sn: _this.refund_sn,
									member_id: _this.member_id
								}
							}).then(res=>{
								console.log(res);
								if(res.code===1){
									uni.showToast({
									    title: '撤销成功',
									    duration: 1500
									})
									setTimeout(()=>{
										_this.getRefundDetail();
									},1500)
								}else{
									uni.showToast({
									    title: res.msg,
										icon: 'none',
									    duration: 1500
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 预览图片
			previewImg(props){
				console.log(this.refundData.imgs);
				uni.previewImage({
					current: props,
					urls: this.refundData.imgs,
				});
			},
			// 修改申请
			changeApply(){
				let skuArr = [];
				for (let item of this.refundData.refund_sku) {
					skuArr.push({
						sku_id: item.order_goods_id
					})
				}
				uni.setStorageSync('skuData',skuArr);
				uni.setStorageSync('initSku',skuArr);
				uni.setStorageSync('refundOrderId',this.refundData.order_id);
				uni.setStorageSync('refundGoods',this.refundData.refund_sku);
				this.$mRouter.push({
					route: this.$mRoutesConfig.applyRefund,
					query: {
						refund_sn: this.refundData.refund_sn,
						refund_type: this.refundData.refund_type
					}
				})
			},
			// 填写物流单号
			writeLogistics(){
				this.$mRouter.push({
					route: this.$mRoutesConfig.logistics,
					query: {
						refund_sn: this.refundData.refund_sn,
					}
				})
			},
			// 获取退款详情信息
			getRefundDetail(props){
				this.$api.refunddetail({
					cmd:{order:'refundskudetail'},
					data:{
						refund_sn: this.refund_sn
					}
				}).then(res=>{
					console.log(res);
					if(res.code===1){
						this.refundData = res.data;
						if(props===1){
							setTimeout(()=>{
								uni.stopPullDownRefresh();
								uni.showToast({
								    title: '刷新成功',
								    icon:  'none',
								    duration: 1500
								})
							},300)
						}
						if(res.data.status===0||res.data.status===6||res.data.status===7){
							this.haveBtn = true;
						}else{
							this.haveBtn = false;
						}
					}else{
						setTimeout(()=>{
							uni.showToast({
							    title: res.msg,
							    icon:  'none',
							    duration: 1500
							})
						},300)
						if(props===1){
							uni.stopPullDownRefresh();
						}
					}
				}).catch(err=>{
					if(props===1){
						setTimeout(()=>{
							uni.stopPullDownRefresh();
							uni.showToast({
							    title: '刷新失败',
							    icon:  'none',
							    duration: 1500
							})
						},300)
					}
				})
			}
		},
	}
</script>

<style scoped lang="scss">
	.refund-detail{
		flex-direction: column;
		.refund-detail-header{
			width: 750upx;
			height: 180upx;
			background:linear-gradient(319deg,rgba(246,108,112,1) 0%,rgba(233,60,62,1) 100%);
			flex-direction: column;
			padding: 0 60upx;
			justify-content: center;
			color: white;
			.header-state{
				font-size: 32upx;
				line-height: 60upx;
			}
			.header-state-des{
				font-size: 24upx;
			}
		}
		.refund-detail-return{
			margin-bottom: 20upx;
			background: white;
			flex-direction: column;
			.return-state{
				min-height: 80upx;
				font-size: 28upx;
				padding: 24upx;
			}
			.return-address{
				padding: 20upx 24upx 32upx;
				border-top: 2upx solid #E7E7E7;
				.return-address-icon{
					width: 52upx;
					flex-shrink: 0;
					align-items: center;
					.address-icon{
						width: 40upx;
						height: 40upx;
					}
				}
				.return-address-text{
					flex-direction: column;
					.text-info{
						font-size: 14px;
						line-height: 40upx;
						.phone{
							margin-left: 6upx;
						}
					}
					.text-address{
						margin-top: 6upx;
						color: #999999;
						font-size: 24upx;
					}
				}
			}
		}
		.refund-detail-describe{
			background: white;
			flex-direction: column;
			.des-state{
				min-height: 80upx;
				font-size: 28upx;
				padding: 24upx;
			}
			.des-tips{
				min-height: 138upx;
				padding: 10upx 24upx 20upx;
				color: #999999;
				font-size: 24upx;
				flex-direction: column;
				border-top: 2upx solid #E7E7E7;
				border-bottom: 2upx solid #E7E7E7;
				.tips-text{
					line-height: 54upx;
				}
			}
			.des-btns{
				height: 90upx;
				align-items: center;
				justify-content: flex-end;
				padding: 0 24upx;
				.btn-default {
					min-width: 140upx;
					height: 50upx;
					border-radius: 4upx;
					border: 2upx solid #ccc;
					padding: 0 20upx;
					line-height: normal;
					font-size: 24upx;
					margin-left: 20upx;
					margin-right: 0;
					color: #666;
					display: flex;
					align-items: center;
					justify-content: center;
				
					&.red {
						border-color: #DF1222;
						color: #DF1222;
					}
				}
			}
		}
		.refund-detail-history{
			margin-top: 20upx;
			.click-list{
				width: 100%;
			}
		}
		.refund-detail-goods{
			margin-top: 13px;
			flex-direction: column;
			background: white;
			.goods-title{
				padding: 0 24upx;
				height: 80upx;
				border-bottom: 2upx solid #E7E7E7;
				align-items: center;
				font-size: 28upx;
			}
			.goods-wrapper{
				flex-direction: column;
				padding: 24upx 24upx 0;
				.goods-wrapper-item{
					margin-bottom: 24upx;
					width: 100%;
					.order-goods-item{
						width: 100%;
					}
				}
			}
		}
		.refund-detail-info{
			margin-top: 20upx;
			margin-bottom: 80upx;
			padding: 20upx 24upx;
			background: white;
			flex-direction: column;
			color: #999999;
			font-size: 24upx;
			.info-wrapper{
				margin-bottom: 12upx;
				.info-title{
					flex-shrink: 0;
				}
				.info-text{
					flex: 1;
					margin-left: 10upx;
				}
			}
			.imgs{
				margin-top: 8upx;
				flex-direction: column;
				.info-imgs-wrapper{
					margin-top: 20upx;
					.info-imgs{
						width: 128upx;
						height: 128upx;
						margin-right: 20upx;
						background: #E7E7E7;
					}
				}
			}
		}
	}
</style>
