<template>
	<view class="serveClass">
		<view class="top" v-if="showBtn">
			<view>退款商品</view>
			<button class="btn" @click="selectGoods">添加和编辑</button >
		</view>
		<view class="con">
			<good-single style="width:100%" :goodSingle='goodSingle'></good-single>
		</view>
		<view class="bottom1" @click="refundFun('1')">
			<!-- <view class="imgbox">
				<image class="img" src="../../static/imgs/icons/Group 3@2x(1).png"></image>
			</view> -->
			<view class="txtBox">
				<view class="txt1">我要退款(无需退货)</view>
				<view class="txt2">没收到货，或与卖家协商同意不用退货只退款</view>
			</view>
			<tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
			<!-- <view class="iconbox">
				<image class="img" src="../../static/imgs/icons/Group 2@2x(1).png"></image>
			</view> -->
		</view>
		<view class="bottom1" @click="refundFun('2')">
			<view class="imgbox">
				<image class="img" src="../../static/imgs/icons/Group 4@2x.png"></image>
			</view>
			<view class="txtBox">
				<view class="txt1">我要退货退款</view>
				<view class="txt2">已收到货，需要退换收到的货物</view>
			</view>
			<tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
			<view class="iconbox">
				<image class="img" src="../../static/imgs/icons/Group 2@2x(1).png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import goodSingle from '../../components/orderConfirm/goodSingle.vue'
	import tuiIcon from "@/components/tui/icon/icon"
	export default{
		name:'serveClass',
		data() {
			return {
				goodSingle:[],
				tempData:[],
				selectData:[],
				skuId:'',
				spuId:'',
				skuSpuData:[],
				showBtn:false,
				order_state:"",
				dataList:[
					
				],
				iconSize: 20
			}
		},
		components:{
			goodSingle,
			tuiIcon
		},
		methods: {
			selectGoods() {
				uni.setStorageSync('skuData',this.skuSpuData)
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.selectgoods,
					query: {
						order_state:this.order_state
					}
				})
			},
			refundFun(val){
				console.log(val)
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.applyRefund,
					query: {
						order_state:this.order_state,
						refund_type:val
					}
				})
			}
		},
		onLoad(option){
			this.order_state = option.order_state
			this.tempData = uni.getStorageSync('refundGoods')
			// if(uni.getStorageSync('skuData')!=''){
				this.skuSpuData = uni.getStorageSync('skuData')
				this.tempData.map(item=>{
					item.checked=false;
					this.skuSpuData.map(item1=>{
						if(item.order_goods_id == item1.sku_id){
							this.goodSingle.push(item);
						}
					})
					// if(item.status == 10){
					// 	this.selectData.push(item)
					// }
				})
			// }
			if(this.tempData.length>=2){
				this.showBtn = true
			}
			uni.setStorageSync('refundGoods', this.tempData);
		},
		onHide() {
			console.log('onhide')
			// uni.removeStorageSync('refundGoods');
		},
		onUnload(){
			console.log('onUnload')
			// uni.removeStorageSync('refundGoods');
			// uni.removeStorageSync('skuData');
			// uni.removeStorageSync('initSku');
		}
	}
</script>

<style lang="scss" type="text/scss">
	.serveClass{
		background: #F5F5F5;
		flex-direction: column;
		font-size: 28upx;
		flex: 1;
		.top{
			height: 100upx;
			justify-content: space-between;
			line-height: 100upx;
			background: #fff;
			border-bottom: 2upx solid #e7e7e7;
			width: 100%;
			padding: 0 24upx;
			font-size: 30upx;
			align-items: center;
			.btn{
				width:200upx;
				height: 60upx;
				line-height: 60upx;
				font-size: 28upx;
				margin-right: 0;
			}
		}
		.con{
			margin-bottom: 20upx;
		}
		.bottom1{
			height: 140upx;
			background: #fff;
			padding: 0 24upx;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #E7E7E7;
			// .imgbox{
			// 	/deep/.img{
			// 		height:40upx;
			// 		img{
			// 			opacity: 1
			// 		}
			// 	}
			// }
			.txtBox{
				flex-direction: column;
				margin-left: 40upx;
				justify-content: space-around;
				height: 104upx;
				flex-grow: 1;
				.txt1{
					font-size: 28upx;
					color: #333;
				}
				.txt2{
					font-size: 24upx;
					color: #999999;
				}
			}
			.iconbox{
				/deep/.img{
					width: 16upx;
					height: 32upx;
					.img{
						opacity: 1
					}
				}
			}
		}
	}
</style>
