<template>
	<view class="wsy-center-page">
		<view class="wsy-center-page-inner">
			<view class="wsy-center-hd">
				<image src="https://wsyjtest-1257062727.cos.ap-chengdu.myqcloud.com/shopbase/image/bg_own.png" mode="" class="bg-pic"></image>
				<view class="personal-box" @tap="goCenterInfoPage">
					<view class="personal-img">
						<image class="portrait" :src="member_avatar" mode=""></image>
					</view>
					<view class="personal-info">
						<view class="text">			
							<text class="name">{{member_nick_name}}</text>
							<text class="level" style="visibility: hidden;">{{uId}}</text>
						</view>
					</view>
					<tui-icon :name="'arrowright'" :color="'#FFF'" :size="20" style="align-self: center;position: absolute;right: 6px;"></tui-icon>
				</view>
			</view>
			<view class="wsy-center-bd">
				<view class="center-bd-item order">
					<view class="order-title">
						<view class="order-title-left">
							<text>我的订单</text>
						</view>
						<view class="order-title-right"  @tap="goLink(null)">
							<text>全部订单</text>
							<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20" style="align-self: center;"></tui-icon>
						</view>
					</view>
					<view class="order-content">
							<view class="order-item" v-for="(order,index) in orders" @tap="goLink(order)" :key="index">
								<image :src="order.icon" mode="aspectFit"></image>
								<text class="name">{{order.text}}</text>
									<tui-badge type="#DF1222" :style="order.num ? '' : 'display:none;'">{{order.num}}</tui-badge>
							</view>
					</view>
				</view>
				<view class="center-bd-item others">
					<view class="others-item" v-for="(other,index) in others" @tap="goLink(other)" :key="index"  v-if="index!==0 || index==0&&other.status!==2">
						<view class="other-left">
							<text>{{other.text}}</text>
						</view>
						<view class="other-right">
							<view v-if="other.name == 'storeEntry'">
								<text :class="{'tips':other.status==1||other.status==3}">{{other.status==1 ? "审核中" : (other.status==3 ? "审核不通过" : "")}}</text>
							</view>
							<view v-if="other.name == 'customer'">
								<rich-text :nodes="other.tel" class="tel"></rich-text>
							</view>
							<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20" style="align-self: center;"></tui-icon>
						</view>
					</view>
				</view>
			</view>		
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<authorizePopup ref="authorize"></authorizePopup>
		<!-- #endif -->
	</view>
</template>

<script>
	import tuiBadge from "@/components/tui/badge/badge";
	import tuiIcon from "@/components/tui/icon/icon";
	export default {
		name: "center",
		components:{tuiBadge, tuiIcon},
		data(){
			return {
				member_nick_name: "",
				member_avatar: "",
				uId: "yanwenzi",
				orders:[
					{
						text: "待付款",
						icon: require("../../static/imgs/own/icon_center_order1.png"),
						name: "order",
						query : {
							status : 1
						},
						num: 0
					},
					{
						text: "待发货",
						icon: require("../../static/imgs/own/icon_center_order2.png"),
						name: "order",
						query : {
							status : 2
						},
						num: 0
					},
					{
						text: "待收货",
						icon: require("../../static/imgs/own/icon_center_order3.png"),
						name: "order",
						query : {
							status : 3
						},
						num: 0
					},
					{
						text: "退款/售后",
						icon: require("../../static/imgs/own/icon_center_order4.png"),
						name: "refund",
						query : {
						},
						num: 0
					},
				],
				others:[
					{
						text: "店铺入驻",
						name: "storeEntry",
						status: Number,// -1 无申请提交 1待审核 2审核通过 3审核不通过
					},
					{
						text: "联系客服",
						name: "customer",
						tel: ""
					},
					{
						text: "关于我们",
						name: "aboutUs"
					}
				]
			}
		},
		onLoad(){
			//协议文章
			this.$api.getArticle({
			    cmd:{"member":"getArticle"},
			    data:{ "article_id":4}
			    }).then(res=>{
					console.log(res,"客服")
			        if(res.code===1){
			            this.others[1].tel = res.data.article_text
			    }
			})
		},
		onShow(){		
			var userInfo = uni.getStorageSync("userInfo") || {};
			var siteConfig = uni.getStorageSync("siteConfig") || {};
			console.log(userInfo)
			let avatar = JSON.stringify(siteConfig) == "{}" ? "../../static/imgs/own/default_portrait.png" : siteConfig.member_avatar;
			this.member_avatar = userInfo.member_avatar ? userInfo.member_avatar : avatar
			if(userInfo.member_id){
				this.member_nick_name = userInfo.member_nick_name
				var memberId = userInfo.member_id;
				// 订单数额
				 this.$api.userCenterOrderCount({
					cmd:{"member": "userCenterOrderCount"},
					data:{"member_id": memberId}
				}).then(res=>{
					console.log(res,"订单")
					if(res.code == 1){
						this.orders[0].num = res.data.no_pay_order
						this.orders[1].num = res.data.no_deliver_order
						this.orders[2].num = res.data.no_receiving_order
						this.orders[3].num = res.data.refund_order
						console.log(this.orders)
					}
				 }).catch(err=>{console.log(err)})	
				//加盟状态
				this.$api.getLeagueState({
					cmd:{"member": "leagueState"},
					data:{"member_id": memberId}
				}).then(res=>{
					console.log(res,"加盟状态")
					if(res.code == 1){
						this.others[0].status = Number(res.data.audit_status)
						this.others[0].query = {status: this.others[0].status},
						console.log(this.others[0])
					}
				}).catch(err=>{console.log(err)})		
			}
			// #ifdef MP-WEIXIN
			this.$refs.authorize.checkIsAuthorize()
			// #endif
		},
		methods: {
			goCenterInfoPage(){
				this.$mRouter.push({route:this.$mRoutesConfig.myInfo})
			},
			goLink(value){
				console.log(value)
				if(value == null){
					this.$mRouter.push({route:this.$mRoutesConfig.orderList,query:{status:0}})
				}else if(value.name == "order"){
					this.$mRouter.push({route:this.$mRoutesConfig.orderList,query:value.query})
				}else if(value.name == "refund"){
					this.$mRouter.push({route:this.$mRoutesConfig.myRefund,query:value.query})
				}else if(value.name == "storeEntry"){
					this.$mRouter.push({route:this.$mRoutesConfig.storeEntry,query:value.query})
				}else if(value.name == "customer"){
					uni.makePhoneCall({
						phoneNumber: value.tel,
						success: function (res){
							console.log(res,"拨打电话成功")
						},
						fail: function (err){
							console.log(err,"拨打电话失败")
						}
					});
				}else if(value.name == "aboutUs"){
					this.$mRouter.push({route:this.$mRoutesConfig.aboutUs})
				}
				
				// let rName=value.name
				// console.log(rName)
				// if(value.query == undefined){
				// 	console.log("无参数")
				// 	this.$mRouter.push({route:this.$mRoutesConfig.rName})
				// }else{
				// 	console.log("有参数")
				// 	this.$mRouter.push({route:this.$mRoutesConfig.rName,query:value.query})
				// }
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-center-page{
		flex: 1;
		.wsy-center-page-inner{
			flex-direction: column;
			width: 100%;
			.wsy-center-hd{
				height: 240upx;
				align-items: center;
				position: relative;
				.bg-pic{
					position: absolute;
					top: 0;
					left: 0;
					z-index: 1;
					height: 100%;
					width: 100%;
				}
				.personal-box{
					padding-left: 24upx;
					z-index: 99;
					position: relative;
					width: 100%;
					.personal-img{
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
						overflow: hidden;
					}
					.personal-info{
						align-items: center;
						padding-left: 20upx;
						.text{						
							flex-direction: column;
							.name{
								color: #FFF;
								font-size: 28upx;
								letter-spacing: 2upx;
							}
							.level{
								color: #FFF;
								font-size: 24upx;
							}
						}
					}
				}
			}
			.wsy-center-bd{
				flex-direction: column;
				.center-bd-item{
					background-color: #FFF;
					margin-top: 20upx;
					flex-direction: column;
					text{
						font-size: 28upx;
						color: #333;
					}
					&.order{
						.order-title{
							justify-content: space-between;
							align-items: center;
							height: 80upx;
							padding: 0 12upx 0 24upx;
							letter-spacing: 2upx;
							.order-title-right{
								align-items: center;
								text,image{
									flex-shrink: 0;
								}
								text{
									font-size: 24upx;
									color: #999;
								}
							}
						}
						.order-content{
							flex-wrap: wrap;
							.order-item{
								flex-basis: 25%;
								height: 160upx;
								flex-direction: column;
								justify-content: center;
								align-items: center;
								position: relative;
								image{
									max-width: 48upx;
									max-height: 48upx;
								}
								.name{
									padding-top: 14upx;
									font-size: 24upx;
									letter-spacing: 2upx;
								}
								tui-badge,.tui-badge{
									position: absolute;
									top: 16upx;
									left: 55%;
									border: 2upx solid $site-default-color;
									color: $site-default-color;
									background: #FFF;
									border-radius: 100upx;
								}
							}
						}					
					}
					&.others{
						padding-left: 16upx;
						.others-item{
							height: 80upx;
							align-items: center;
							justify-content: space-between;
							&:not(:last-child){
								border-bottom: 2upx solid #E7E7E7;	
							}
							.other-left{
								letter-spacing: 2upx;
							}
							.other-right{					
								padding-right: 12upx;
								align-items: center;
								.tips{
									font-size: 20upx;
									transform: scale(0.8);
									-webkit-transform: scale(0.8);
									color: #FFF;
									padding: 4upx 12upx;
									background-color: $site-default-color;
									border-radius: 18upx;
									letter-spacing: 2upx;
								}
								.tel{
									font-size: 28rpx;
									color: #333;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
