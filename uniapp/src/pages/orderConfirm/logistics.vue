<template>
	<view class="serveClass">
		<view class="con">
			<good-single :goodSingle='goodSingle'></good-single>
		</view>
		<view class="bottom1" @click="selectCompany">
			<view class="txtBox">
				<view>物流公司：</view>
				<view class="txt1">{{companyName}}</view>
			</view>
			<tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
			<!-- <view class="iconbox">
				<image class="img" src="../../static/imgs/icons/Group 2@2x(1).png"></image>
			</view> -->
		</view>
		<view class="bottom1">
			<view class="txtBox">
				<view>物流单号：</view>
				<view><input type="text" v-model="expressCode" value="" placeholder="请输入物流单号"/></view>
			</view>
			<tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
			<!-- <view class="iconbox">
				<image class="img" src="../../static/imgs/icons/Group 2@2x(1).png"></image>
			</view> -->
		</view>
		<view class="comFun" @click="SubmitFun">提交</view>
		<!-- 选择物流弹窗 -->
		<popup class="Dialog" type="bottom" ref='popup'>
		    <!-- <view class="fail-reasons">无法购买的原因：{{failReasons}}</view> -->
			<scroll-view scroll-y="true"  class="popupModel">
				<view class="popupModelItem" v-for="(item,index) in express_company" :key='index' @click="clickItem(item)">
					<view>{{item.company_name}}</view>
				</view>
			</scroll-view>
		    <!-- <button class="Dialog_button" @click="showPop=false">确定</button> -->
		</popup>
	</view>
</template>

<script>
	import goodSingle from '../../components/orderConfirm/goodSingle.vue'
	import popup from '@/components/tui/uni-popup/uni-popup.vue'
	import tuiIcon from "@/components/tui/icon/icon"
	export default{
		name:'serveClass',
		data() {
			return {
				goodSingle:[],
				showPop:false,
				express_company:[],
				companyName:'请选择物流公司',
				companyCode:'',
				expressCode:'',
				member_id:uni.getStorageSync('userInfo').member_id,
				refund_sn:'',
				dataList:[],
				iconSize: 20
			}
		},
		components:{
			goodSingle,
			popup,
			tuiIcon
		},
		methods: {
			refundFun(val){
				console.log(val)
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.applyRefund,
					query: {
						order_state:this.order_state,
						refund_type:val
					}
				})
			},
			initData(){
				this.$api.refunddelivery({
					cmd:{
					    order:"refunddelivery"
					},
					data: {
					    refund_sn: this.refund_sn
					}
				}).then(res=>{
					console.log(res)
					if(res.code == 1){
						this.express_company = res.data.express_company;
						this.goodSingle = res.data.refund_sku;
						if(res.data.company_code!=''){
							this.companyName = res.data.company_code;
						}else{
							this.companyName = '请选择物流公司';
						}
						
						this.expressCode = res.data.express_code
					}
				})
			},
			SubmitFun(){
				this.$api.refunddeliverypost({
					cmd:{
					    order:"refunddeliverypost"
					},
					data: {
					    refund_sn: this.refund_sn,
						company_code:this.companyCode,
						company_name:this.companyName,
						express_code:this.expressCode,
						member_id:this.member_id,
					}
				}).then(res=>{
					console.log(res)
					if(res.code == 1){
						this.$mRouter.back(1)
					}
				})
			},
			selectCompany(){
				this.$refs.popup.open()
			},
			clickItem(val){
				this.$refs.popup.close()
				this.companyName = val.company_name
				this.companyCode = val.company_code
			}
		},
		onLoad(option){
			this.refund_sn = option.refund_sn
			// this.goodSingle = this.dataList
			this.initData()
		},
		onHide() {
		},
		onUnload(){
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
			height: 80upx;
			background: #fff;
			padding: 0 24upx;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #E7E7E7;
			.imgbox{
				img{
					height:40upx;
				}
			}
			.txtBox{
				flex-direction: row;
				align-items: center;
				height: 80upx;
				flex-grow: 1;
				input{
					width:400upx;
				}
				.uni-input-placeholder{
					width: 400upx;
					color: #999;
					font-size: 28upx;
				}
				.txt1{
					font-size: 28upx;
					color: #999999;
				}
			}
			// .iconbox{
			// 	/deep/.img{
			// 		width: 16upx;
			// 		height: 32upx;
			// 		.img{
			// 			opacity: 1
			// 		}
			// 	}
			// }
		}
		.comFun{
			width:100%;
			height: 88upx;
			background: #DF1222;
			color: #fff;
			font-size: 32upx;
			align-items: center;
			border: none;
			border-radius: 0;
			justify-content: center;
			position: fixed;
			bottom: 0;
		}
		.Dialog{
			/deep/.uni-popup__wrapper-box{
				flex-direction: column;
			}
			.popupModel{
				height: 536upx;
				flex-direction: column;
				overflow: scroll;
				.popupModelItem{
					height: 80upx;
					align-items: center;
					line-height: 80upx;
					padding: 0 24upx;
					justify-content: center;
					.view{
						
						
					}
				}
				
			}
			&_button{
				width:100%;
				height: 88upx;
				background: #DF1222;
				color: #fff;
				font-size: 32upx;
				align-items: center;
				border: none;
				border-radius: 0;
			}
		}
	}
</style>
