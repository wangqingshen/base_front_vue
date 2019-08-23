<template>
	<view class="wsy-store-entry-page" :class="{'noPass':status==3 || status==11}">
		<image class="bg-pic" :src="bg"></image>
		<view class="store-entry-hd">
			<text>{{status==-1 ? "诚邀店铺入驻" :(status==1 ? "申请店铺入驻进度" : (status==3 ? "审核不通过原因" : (status==11 ? "审核中" : ""))) }}</text>
		</view>
		<view class="store-entry-bd">
			<view class="icons-box" v-if="status==-1 || status==1">
				<view class="icons-item" v-for="(item,index) in icons" :key="index">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="ads" v-if="status==-1 || status==1">
				<view class="ads-item" v-for="(item,index) in ads" :key="index">		
					<view class="ads-icon"></view>
					<text>{{item.text}}</text>
				</view>
			</view>
			<view class="reason" v-if="status==3 || status==11">
				<text>{{status==3 ? reason : "入驻申请已提交 后台正在审核中"}}</text>
			</view>
			<button class="handle" @tap="changeStatus" v-if="status==-1 || status==1 || status==3">
				{{status==-1 ? "申请入驻" : (status==1 ? "查看申请进度" : "重新申请")}}
			</button>
		</view>
		<view class="store-entry-ft" v-if="status == -1">
			<tui-icon :name="checked ? 'circle-selected' : 'circle'" :size="16" :color="'#FFF'" @tap="checkAgreement" style="margin-right: 10upx;"></tui-icon>
			<view class="para" @tap="agreePopEvt">
				<text>我理解并接受</text>
				<text class="site">{{siteName}}注册协议</text>
			</view>
		</view>
		<!-- 弹出注册协议 -->
		<uni-popup ref="agreePop" type="center" class="agreePop">
		  <view class="header">{{article.article_title}}</view>
		  <view class="content">
		    <rich-text :nodes="article.article_text"></rich-text>
		  </view>
		  <view class="bottom">
		    <tui-button class="knowBtn" @click="closePop">知道了</tui-button>
		  </view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/tui/uni-popup/uni-popup.vue";
	import tuiButton from "@/components/tui/button/button";
	import tuiIcon from "@/components/tui/icon/icon.vue";
	export default {
		name: "storeEntry",
		components: {uniPopup, tuiButton, tuiIcon},
		data(){
			return {
				memberId: Number,
				status: Number,// -1 无申请提交 1待审核 2审核通过 3审核不通过
				reason: "",
				icons: [
					{
						icon: require("../../static/imgs/store/icon_tobe1.png"),
						text: "提交资料"
					},{
						icon: require("../../static/imgs/store/icon_tobe2.png"),
						text: "在线审核"
					},{
						icon: require("../../static/imgs/store/icon_tobe3.png"),
						text: "开店成功"
					},
				],
				ads:[
					{
						text: "采购订单高效匹配"
					},{
						text: "产品线上、线下同步推广"
					},{
						text: "免费发布产品，帮助企业拓宽销售渠道"
					},
				],
				siteName: "XXXX注册协议",
				checked: true,
				bg: "",
				article: {},//协议文章
			}
		},
		onLoad(e){
			console.log(e)
		},
		onShow(){
			let userInfo = uni.getStorageSync("userInfo") || {},
			sc = uni.getStorageSync('siteConfig')
			this.memberId = userInfo.member_id
			this.siteName = sc.site_name
			if(userInfo.member_id){
				this.getLeagueState()
			}
			//背景图
			this.$api.getArticle({
				cmd: {"member" : "getArticle"},
				data:{"article_id": 1}
			}).then(res=>{
				console.log(res,"协议背景")
				if(res.code == 1){
					this.bg = res.data.article_pic
					console.log(this.bg,11111)
				}else{
					this.$mUtils.toast(res.msg);
				}
			}).catch(err=>{console.log(err)})
			//注册协议
			this.$api.getArticle({
				cmd: {"member" : "getArticle"},
				data:{"article_id": 6}
			}).then(res=>{
				console.log(res,"注册协议")
				if(res.code == 1){
					this.article = res.data
				}else{
					this.$mUtils.toast(res.msg);
				}
			}).catch(err=>{console.log(err)})
		},
		methods: {
			getLeagueState(){
				this.$api.getLeagueState({
					cmd: {"member" : "leagueState"},
					data:{"member_id": this.memberId}
				}).then(res=>{
					console.log(res,"加盟状态")
					if(res.code == 1){
						this.status = res.data.audit_status
						if(this.status == 3){
							this.reason = res.data.store_audit_reason
						}
					}else{
						this.$mUtils.toast(res.msg);
					}
				}).catch(err=>{console.log(err)})	
			},
			changeStatus(){
				if(this.status == -1){
					if(!this.checked){
						const _this = this
						uni.showModal({
							title: '是否勾选',
							content: '请勾选商户注册协议',
							confirmColor: "#DF1222",
							success: function (res) {
								if (res.confirm) {
									_this.checked = true
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});
					}else{				
						this.$mRouter.push({route:this.$mRoutesConfig.storeInfo})
					}
				}else if(this.status == 1){
					this.status = 11
				}else if(this.status == 3){
					this.status = -1
				}
			},
			checkAgreement(){
				console.log("勾选协议")
				this.checked = !this.checked
			},
			agreePopEvt(){
			  this.$refs.agreePop.open()
			},
			closePop(){
			  this.$refs.agreePop.close()
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-store-entry-page{
		flex: 1;
		flex-direction: column;
		color: #FFF;
		.bg-pic{
			position: fixed;
			top: 0;
			z-index: 1;
		}
		.store-entry-hd{
			justify-content: center;
			padding-top: 160upx;
			z-index: 99;
			text{
				font-size: 36upx;
				font-weight: 600;
			}
		}
		.store-entry-bd{
			flex-direction: column;	
			z-index: 99;
			.icons-box{
				justify-content: center;
				align-items: center;
				padding: 120upx 0 90upx;
				.icons-item{
					flex-direction: column;
					align-items: center;
					&:nth-of-type(2){
						padding: 0 80upx;
					}
					.icon{
						width: 80upx;
						height: 80upx;
						overflow: hidden;
					}
					text{
						padding-top: 20upx;
						font-size: 28upx;
					}
				}
			}
			.ads{
				flex-direction: column;
				padding-left: 172upx;
				.ads-item{			
					align-items: center;
					padding-top: 20upx;
					.ads-icon{
						width: 8upx;
						height: 8upx;
						border-radius: 50%;
						background-color: #FFF;
					}
					text{
						padding-left: 4upx;
						font-size: 24upx;
					}
				}
			}
			.reason{
				font-size: 28upx;
				min-height: 200upx;
				max-height: 300upx;
				overflow: scroll;
			}
			.handle{
				margin-top: 60upx;
				width: 400upx;
				height: 80upx;
				border-radius: 8upx;
				font-size: 32upx;
				color: #FFF;
				background-color: transparent;
				border: 2upx solid #FFF;
			}
		}
		.store-entry-ft{
			padding-top: 200upx;
			justify-content: center;
			font-size: 24upx;
			z-index: 99;
			.para{
				.site{
					color: #F8E71C;
				}
			}
		}
		&.noPass{
			.store-entry-hd,.store-entry-bd,.store-entry-ft{
				padding: 0 40upx; 		
			}
			.store-entry-hd{
				justify-content: flex-start;
				padding-top: 196upx;
				padding-bottom: 40upx;
			}
			.store-entry-bd{
				font-size: 28upx;
				.handle{
					margin-left: 0;
					margin-right: 0;
				}
			}
		}
		/deep/.uni-popup{
		  .uni-popup__wrapper{
			padding: 0 40upx;
		  }
		  .uni-popup__wrapper-box{
			flex-direction: column;
			width: 100%;
			max-width: 100%!important;
			padding: 0!important;
			.header{
			  width: 100%;
			  height: 80upx;
			  align-items: center;
			  justify-content: center;
			  color: #333;
			  font-size: 32upx;
			  background: #f5f5f5;
			}
			.content{
			  height: 600upx;
			  padding: 30upx;
			  overflow: auto;
			  font-size: 26upx;
			  color: #666;
			}
			.bottom{
			  padding: 40upx 136upx;
			  /deep/.knowBtn{
				background: $site-default-color;
				border-radius: 8px;
				font-size: 32upx;
			  }
			}
		  }
		  
		}
	}
	
</style>
