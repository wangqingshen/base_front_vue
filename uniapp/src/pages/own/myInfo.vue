<template>
	<view class="wsy-myInfo-page">
		<view class="cell">
			<view class="cell-item">
				<view class="cell-item-left">
					<text>头像</text>
				</view>
				<view class="cell-item-right">
					<view class="portrait-box">
						<upload @emitUpload="emitUpload" :lists="showImg" :txtShow="false" class="upload-handle" style="border:0;"></upload>
						<image class="upload-img" :src="member_avatar" ></image>
					</view>
					<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20"></tui-icon>
				</view>
			</view>
			<view class="cell-item" @tap="tapInfoEvt(1)">
				<view class="cell-item-left">
					<text>昵称</text>
				</view>
				<view class="cell-item-right">
					<text>{{userInfo.member_nick_name}}</text>
					<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20"></tui-icon>
				</view>
			</view>
			<view class="cell-item" @tap="tapInfoEvt(2)">
				<view class="cell-item-left">
					<text>联系人姓名</text>
				</view>
				<view class="cell-item-right">
					<text>{{userInfo.true_name}}</text>
					<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20"></tui-icon>
				</view>
			</view>
			<view class="cell-item" @tap="tapInfoEvt(3)">
				<view class="cell-item-left">
					<text>手机号码</text>
				</view>
				<view class="cell-item-right">
					<text>{{userInfo.member_mobile}}</text>
					<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20"></tui-icon>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item" @tap="tapInfoEvt(4)">
				<view class="cell-item-left">
					<text>收货地址</text>
				</view>
				<view class="cell-item-right">
					<tui-icon :name="'arrowright'" :color="'#C7C7CC'" :size="20"></tui-icon>
				</view>
			</view>
		</view>
		<!-- 弹出昵称 -->
		<uni-popup ref="popup1" type="center">
			<text class="popup-title">请输入昵称</text>
			<input v-model.trim="member_nick_name" class="uni-input" focus placeholder="请输入昵称" placeholder-style="color:#999" maxlength="8"/>
			<button type="button" @tap="bind(1)">绑定</button>		
		</uni-popup>
		<!-- 弹出联系人姓名 -->
		<uni-popup ref="popup2" type="center">
			<text class="popup-title">请输入联系人姓名</text>
			<input v-model.trim="true_name" class="uni-input" focus placeholder="请输入联系人姓名" placeholder-style="color:#999" maxlength="20"/>
			<button type="button" @tap="bind(2)">绑定</button>		
		</uni-popup>
		<button type="default" class="log-out" @tap="logOut">退出登录</button>
		<tui-actionsheet :show="showActionSheet" :tips="'确认是否退出登录'" @cancel="showActionSheet = false" @click="comfirmActionSheet"></tui-actionsheet>
	</view>
</template>

<script>
	import uniPopup from "@/components/tui/uni-popup/uni-popup";
	import upload from "@/components/upload/index";
	import tuiIcon from "@/components/tui/icon/icon";
	import tuiActionsheet from "@/components/tui/actionsheet/actionsheet";
	export default {
		name: "myInfo",
		components: {uniPopup, upload, tuiIcon, tuiActionsheet},
		data(){
			return {
				userInfo: {},
				queryData: {
					member_id: "",
					user_info: {}
				},
				member_avatar: "",
				member_nick_name: "",
				true_name: "",
				editEvtIndex: Number,//编辑项
				percent:0,
				loading:false,
				disabled:false,
				showImg: [],
				showActionSheet: false,
			}
		},
		onShow(){
			this.userInfo = uni.getStorageSync("userInfo") || {}
			console.log(this.userInfo)
			if(this.userInfo.member_id){
				var memberId = this.userInfo.member_id;
				var siteConfig = uni.getStorageSync("siteConfig") || {}
				let avatar = "";
				if(JSON.stringify(siteConfig) == "{}"){
					avatar = "../../static/imgs/own/default_portrait.png";
				}else{
					avatar = siteConfig.member_avatar;
				}
				this.member_avatar = this.userInfo.member_avatar ? this.userInfo.member_avatar : avatar
				this.queryData.member_id = this.userInfo.member_id
				this.member_nick_name = this.userInfo.member_nick_name
				this.true_name = this.userInfo.true_name
				this.member_mobile = this.userInfo.member_mobile
			}
		},
		methods:{
			emitUpload(res){
				console.log(res)
				this.member_avatar = res.showPath
				this.queryData.user_info = {};
				this.$set(this.queryData.user_info,"member_avatar",res.path)
				this.editUserInfo()
			},
			tapInfoEvt(index){
				if(index < 3){
					this.editEvtIndex = index
					if(index === 1){
						this.member_nick_name = this.userInfo.member_nick_name
						this.$refs.popup1.open()
					}else if(index === 2){
						this.true_name = this.userInfo.true_name
						this.$refs.popup2.open()
					}
				}else if(index === 3){		
					this.$mRouter.push({route:this.$mRoutesConfig.changeMob})
				}else if(index === 4){
					this.$mRouter.push({route:this.$mRoutesConfig.addressList,query:{pageType: "info", goodsData: JSON.stringify({}), payway: -1, orderType: 1}})
				}
			},
			bind(index){
				this.queryData.user_info = {};
				if(index === 1){
					if(!this.member_nick_name){
						this.$mUtils.toast("昵称不能为空")
						return false
					}
					this.$set(this.queryData.user_info,"member_nick_name",this.member_nick_name)
				}else if(index === 2){
					if(!this.true_name){
						this.$mUtils.toast("联系人姓名不能为空")
						return false
					}
					this.$set(this.queryData.user_info,"true_name",this.true_name)
				}
				this.editUserInfo()
			},
			editUserInfo(){
				this.$api.editUserInfo({
					cmd:{"member" : "editUserInfo"},
					data:this.queryData
				}).then(res=>{
					console.log(res,"修改")
					if(res.code == 1){
                        this.$mUtils.toast("保存成功",2000,true);
                        let key = Object.keys(this.queryData.user_info)[0],
                            value = this.queryData.user_info[key]
                        if(key == 'member_avatar'){
							this.userInfo.member_avatar = this.member_avatar
                        }else if(key == 'member_nick_name'){
                            this.userInfo.member_nick_name = value
							this.$refs.popup1.close()
                        }else if(key == 'true_name'){
                            this.userInfo.true_name = value
                            this.$refs.popup2.close()
                        }
                        uni.setStorageSync('userInfo', this.userInfo)
                    }else{
                        this.$mUtils.toast(res.msg)
                    }
				}).catch(err=>{console.log(err)})
			},
			logOut(){
				this.showActionSheet = true
				// const _self = this
				// uni.showActionSheet({
				// 	itemList: ["确认是否退出登录"],
				// 	itemColor: "#DF1222",
				// 	success: function (res) {
				// 		console.log(res)
				// 		_self.$store.commit("logout")
				// 		uni.showToast({
				// 			title: "退出成功",
				// 			success: function (res) {
				// 				setTimeout(()=>{	
				// 					_self.$mRouter.push({route:_self.$mRoutesConfig.login, query:{}})
				// 				},2000)
				// 			}
				// 		});
				// 	},
				// 	fail: function (res) {
				// 		console.log("取消");
				// 	}
				// });
			},
			comfirmActionSheet(){
				var _self = this
				_self.$store.commit("logout")
				uni.showToast({
					title: "退出成功",
					success: function (res) {
						setTimeout(()=>{	
							_self.$mRouter.push({route:_self.$mRoutesConfig.login, query:{}})
						},2000)
					},
					fail: function (res) {
						console.log("取消");
					}
				});
			}
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-myInfo-page{
		flex: 1;
		flex-direction: column;
		.cell{
			flex-direction: column;
			padding: 0 12upx 0 24upx;
			background-color: #FFF;
			&:not(:nth-child(1)){
				margin-top: 20upx;
			}
			.cell-item{
				justify-content: space-between;
				min-height: 80upx;
				align-items: center;
				font-size: 28upx;
				&:not(:last-child){				
					border-bottom: 2upx solid #E7E7E7;
				}
				.cell-item-left{
					text{
						color: #333;
					}
				}
				.cell-item-right{
					align-items: center;
					text{
						color: #999;
					}
					.portrait-box{
						width: 100upx;
						height: 100upx;		
						margin: 14upx 0;
						border-radius: 50%;
						overflow: hidden;
						background-color: #F7F7F7;
						position: relative;
						/deep/.upload-handle{
							width: 100upx;
							height: 100upx;
							z-index: 99;
							.upload-item{				
								border: 0 none;
							}
							tui-icon,.tui-icon{
								opacity: 0;
							}
						}
						.upload-img{
							width: 100%;
							height: 100%;
							position: absolute;
							left: 0;
							z-index: 1;
						}
					}
				}
			}
		}
		/deep/.uni-popup{
			.uni-popup__wrapper{			
				.uni-popup__wrapper-box{			
					padding: 0;
					width: 600upx;
					border-radius: 12upx;
					flex-direction: column;
					flex: 1;
					.popup-title{
						color: #333;
						text-align: center;
						padding: 52upx 0 ; 
						text{
							font-size: 36upx;	
						}
					}
					.uni-input{
						margin: 0 24upx;
						background-color: #F7F7F7;
						padding-left: 20upx;
						height: 88upx;
						border-radius: 8upx;
						font-size: 28upx;
						.uni-input-placeholder{
							line-height: 88upx;
						}
					}
					>button{
						margin: 60upx 0 0 0;
						padding: 0;
						border: 0 none;
						border-top: 2upx solid #D7D7D7;
						color: #D0021B;
						background-color: transparent;
						border-radius: 0;
						font-size: 32upx;
					}
				}
			}
		}
		.log-out{
			margin: 80upx 24upx 0;
			background-color: #FFF;
			border: 1px solid #E7E7E7;
			border-radius: 8upx;
			font-size: 36upx;
			color: #333;
			height: 88upx;
			line-height: 88upx;
		}
	}
	// /deep/.uni-actionsheet{
	// 	.uni-actionsheet__menu>.uni-actionsheet__cell{
	// 		color: #D0021B;
	// 	}
	// 	.uni-actionsheet__action>.uni-actionsheet__cell{
	// 		color: #333;
	// 	}
	// }
</style>
