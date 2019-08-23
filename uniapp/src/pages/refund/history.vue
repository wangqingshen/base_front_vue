<template>
	<view class="history">
		<view v-if="!dataList.length" class="noData">
			<image class="img" src="../../static/imgs/default/default_message.png"></image>
			<view class="txt">暂无相关信息</view>
		</view>
		<view v-if="dataList.length" class="item">
			<view class="itemList" v-for="(item,index) in dataList" :key='index'>
				<view class="ifaction_type" v-if="item.action_type == 1">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>{{item.action.member_nickname}}于{{item.create_time}}创建了退款申请</view>
						<view class="">退款类型：{{item.action.refund_type}}</view>
						<view class="">退款金额：{{item.action.refund_amount}}</view>
						<view class="info">退款说明：{{item.action.refund_comment}}</view>
						<view class="">凭证上传：</view>
						<view class="imgbox">
							<view v-for="(item1,index1) in item.action.imgs" :key='index1'>
								<image class="img" :src="item1"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 2">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>{{item.action.member_nickname}}于{{item.create_time}}修改了退款申请</view>
						<view class="">退款类型：{{item.action.refund_type}}</view>
						<view class="">退款金额：{{item.action.refund_amount}}</view>
						<view class="info">退款说明：{{item.action.refund_comment}}</view>
						<view class="">凭证上传：</view>
						<view class="imgbox">
							<view v-for="(item1,index1) in item.action.imgs" :key='index1'>
								<image class="img" :src="item1"></image>
							</view>
						</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 3">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>买家主动撤销了本次退款申请</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 4">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>由于商家超时未响应，默认达成了本次退款申请，等待平台审核。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 5">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家同意了退款申请，等待买家退货。</view>
						<view class="">收货人：{{item.action.receiver}}</view>
						<view class="">售后电话：{{item.action.mobile}}</view>
						<view class="">售后地址：{{item.action.adress}}</view>
						<view class="info">售后说明：{{item.action.comment}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 6">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家拒绝了退款申请，退货关闭。</view>
						<view class="">理由：{{item.action.comment}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 7">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
				<!-- <view class="con" v-if="item.order_type == 1">
						<view>由于平台超时未响应，默认达成了本次退款申请，退款完成。</view>
					</view> -->
					<view class="con">
						<view>买家超时未填写发货单，退货关闭。</view>
					</view>
					
				</view>
				<view class="ifaction_type" v-if="item.action_type == 8">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>买家填写了退货发货单，等待卖家确认收货。</view>
						<view class="">物流公司：{{item.action.company_name}}</view>
						<view class="">物流单号：{{item.action.express_code}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 9">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>买家修改了退货发货单，等待卖家确认收货。</view>
						<view class="">物流公司：{{item.action.company_name}}</view>
						<view class="">物流单号：{{item.action.express_code}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 10">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家拒收退货单，退货关闭</view>
						<view class="">理由：{{item.action.comment}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 11">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家确认退货单收货，等待平台审核。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 12">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>由于商家超时未响应，默认达成了本次退款申请，等待平台审核。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 13">
					<view class="top">
						<image class="img" :src="item.action.member_avatar"></image>
						<view class="txt">
							<view class="text1">{{item.action.member_nickname}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>买家对订单进行了确认收货，退款关闭。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 14">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>平台同意了退款申请，退款完成。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 15">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>由于平台超时未响应，默认达成了本次退款申请，退款完成。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 16">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>平台拒绝了退款申请，退款关闭。</view>
						<view>理由：{{item.action.comment}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 17">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家同意了退款申请，等待平台审核。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 18">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>平台已退款。</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 19">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>由于商家超时未响应，默认达成了本次退款申请，等待买家退货。</view>
						<view class="">收货人：{{item.action.receiver}}</view>
						<view class="">售后电话：{{item.action.mobile}}</view>
						<view class="">售后地址：{{item.action.address}}</view>
						<view class="info">售后说明：{{item.action.comment}}</view>
					</view>
				</view>
				<view class="ifaction_type" v-if="item.action_type == 20">
					<view class="top">
						<image class="img" :src="item.action.sysIcon"></image>
						<view class="txt">
							<view class="text1">{{item.action.name}}</view>
							<view class="text2">{{item.create_time}}</view>
						</view>
					</view>
					<view class="con">
						<view>商家已对退款订单进行了发货处理，退款关闭。</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:'history',
		data() {
			return {
				dataList:[
					
				]
			}
		},
		components:{
			
		},
		methods: {
			initData(){
				this.$api.refundlog({
					cmd:{
					    order:"refundlog"
					},
					data: {
					    refund_sn: this.refund_sn//20190730164452525110
					}
				}).then(res=>{
					console.log(res)
					if(res.code == 1){
						this.dataList = res.data
					}
				})
			},
			
		},
		onLoad(option){
			this.refund_sn = option.refund_sn
			this.initData()
		},
		onHide() {
		},
		onUnload(){
		}
	}
</script>

<style lang="scss" type="text/scss">
	.history{
		width: 100%;
		.noData{
			width: 100%;
			flex-direction: column;
			width: 100%;
			align-items: center;
			justify-content: center;
			margin-top: -400upx;
			/deep/.img{
				width: 196upx;
				height: 140upx;
			}
			.txt{
				color: #999999;
				font-size: 24upx;
				margin-top: 30upx;
			}
		}
		.item{
			width: 100%;
			flex-direction: column;
		}
		.itemList{
			.ifaction_type{
				flex-direction: column;
				padding: 24upx 0;
				background: #fff;
				margin-top: 24upx;
			}
			flex-direction: column;
			width: 100%;
			overflow: hidden;
			.top{
				height: 92upx;
				width: 100%;
				padding: 0 24upx;
				/deep/.img{
					width: 64upx;
					height: 64upx;
				}
				image{
					width: 64upx;
					height: 64upx;
				}
				.txt{
					flex-direction: column;
					padding-left:20upx;
					.text1{
						font-size: 28upx;
						color:#333;
					}
					.text2{
						font-size: 24upx;
						color: #999999;
					}
				}
			}
			.con{
				flex-direction: column;
				font-size: 28upx;
				color: #333;
				padding: 0 24upx;
				view{
					margin: 6upx 0;
				}
				.info{
					width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: inline-block;
				}
				.imgbox{
					flex-direction: row;
					/deep/.img{
						width: 128upx;
						height: 128upx;
						margin-right: 20upx;
					}
					image{
						width: 128upx;
						height: 128upx;
						margin-right: 20upx;
					}
				}
			}
		}
	}
</style>
