<template>
	<view class="wsy-store-info-page">
		<view class="cell">
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺名称</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="store_name" focus placeholder="店铺名称" maxlength="15" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>联系方式</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="number" v-model.trim="store_mobile" placeholder="手机号码" maxlength="11" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺地址</text>
				</view>
				<view class="cell-item-value" @tap="openMap()">
					<input class="uni-input addr" type="text" v-model.trim="store_address" placeholder="请选择店铺地址" placeholder-style="color:#999;" disabled/>
					<tui-icon name="arrowright" :color="'#C7C7CC'" :size="iconSize"></tui-icon>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>工商注册号</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="business_registration_num" placeholder="工商注册号" maxlength="15" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>企业法人</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="store_legal_entity" placeholder="企业法人" maxlength="10" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>营业执照</text>
				</view>
				<view class="cell-item-value upload-box">
					<text>请拍照上传，最多上传9张</text>
					<view class="upload-pictures">	
							<upload :lists="lists" :index="index" :maxLength="9" @emitUpload="emitUploadLicense" :uploadIconName="'add'" :addTxt="'点击上传'" :size="18"/>
                            <view class="more-pic" v-for="(item, index) in lists" :key="index">
                                <image class="img" :src="item" :data-index="index"></image>
                                <tui-icon color="#333" :size="delSize" name="close-fill" class="tui-upload-del" :index="index" @tap="removeImg(index)"></tui-icon>
                            </view>
					</view>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item">
				<view class="cell-item-title">
					<text>身份证</text>
				</view>
				<view class="cell-item-value upload-box">
					<text>请拍照上传</text>
					<view class="upload-pictures">	
						<view class="single-pic">			
							<upload @emitUpload="emitUploadCardFront" :lists="imgFront" :uploadIconName="'add'" :addTxt="'点击上传国徽面'" :size="15" :class="{'hidden':id_card_front}"></upload>
							<view class="mask" v-if="id_card_front">
								<text>重新上传</text>
							</view>
							<image class="img" :src="imgFront[0]" v-if="id_card_front"></image>
						</view>
						<view class="single-pic">			
							<upload @emitUpload="emitUploadCardBack" :lists="imgBack" :uploadIconName="'add'" :addTxt="'点击上传人像面'" :size="15" :class="{'hidden':id_card_back}"></upload>
							<view class="mask" v-if="id_card_back">
								<text>重新上传</text>
							</view>
							<image class="img" :src="imgBack[0]" v-if="id_card_back"></image>
						</view>
					</view>		
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺开户银行</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="store_bank" placeholder="店铺开户银行" maxlength="20" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>开户行地址</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="bank_address" placeholder="开户行地址" maxlength="60" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺银行账号</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="number" v-model.trim="store_bank_account" placeholder="店铺银行账号" maxlength="20" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>开户人姓名</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="account_holder" placeholder="开户人姓名" maxlength="10" placeholder-style="color:#999;"/>
				</view>
			</view>
		</view>
		<view class="cell">
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺账号</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="store_account" placeholder="用于平台端店铺端登录使用" maxlength="15" placeholder-style="color:#999;"/>
				</view>
			</view>
			<view class="cell-item">
				<view class="cell-item-title">
					<text>店铺密码</text>
				</view>
				<view class="cell-item-value">
					<input class="uni-input" type="text" v-model.trim="store_password" placeholder="6~20个字符" maxlength="20" placeholder-style="color:#999;"/>
				</view>
			</view>
		</view>
		<tui-button @tap="checkFormat">提交申请</tui-button>
	</view>
</template>

<script>
	import MapLoader from '../../common/AMap.js';
	import tuiButton from "@/components/tui/button/button";
	import upload from "@/components/upload/index";
	import tuiIcon from "@/components/tui/icon/icon";
	export default {
		name: "storeInfo",
		components: {tuiButton, upload, tuiIcon},
		data(){
			return {
				store_name: "",
				store_mobile: "",
				store_address: "",
				store_longitude: "",//经度
				store_latitude: "",//纬度
				store_adcode: "",//城市代码
				business_registration_num: "",
				store_legal_entity: "",
				store_business_license: [],
				id_card_front: "",//身份证正面国徽
				id_card_back: "",//身份证反面人像
				store_bank: "",
				bank_address: "",
				store_bank_account: "",
				account_holder: "",
				store_account: "",
				store_password: "",
				storeObj: {},
				member_id: "",
				store_id: "", 
				imgFront: [],
				imgBack: [],
				delSize: 20,
				iconSize: 20,
				index: 1,
				lists: [],
			}
		},
		onLoad(){	
			this.storeObj.member_id = this.member_id = uni.getStorageSync("userInfo").member_id
			//加盟状态
			this.$api.getLeagueState({
				cmd:{"member": "leagueState"},
				data:{"member_id": this.member_id}
			}).then(res=>{
				console.log(res,"加盟状态")
				if(res.code == 1 && res.data.store_id){
					this.store_id = res.data.store_id
					this.getLeagueById()	
				}
			}).catch(err=>{console.log(err)})		
		},
		onShow(){
			
		},
		methods: {
			openMap(){
				const _self = this
				uni.chooseLocation({
					success: function (res) {
						console.log(res)
						// #ifdef H5
						console.log('H5')
						MapLoader().then(AMap => {	
							console.log(res.longitude, res.latitude)
							AMap.plugin('AMap.Geocoder', function() {
								var geocoder = new AMap.Geocoder({
									// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
									city: '010'
								})							 
								var lnglat = [res.longitude, res.latitude]
								geocoder.getAddress(lnglat, function(status, result) {
									console.log(status,result)
								if (status === 'complete' && result.info === 'OK' && result.regeocode) {
									// result为对应的地理位置详细信息
									_self.store_longitude = res.longitude
									_self.store_latitude = res.latitude
									_self.store_address = res.address + res.name
									_self.store_adcode = result.regeocode.addressComponent.adcode
									console.log(_self.store_adcode,_self.store_address)
								}else{
									console.log("根据经纬度查询失败")
								}
							})
						})
						}, e => {
							console.log('地图加载失败')
						})
						// #endif
						
						// #ifdef MP-WEIXIN
						console.log('MP-WEIXIN')
						uni.request({
						  url: 'https://restapi.amap.com/v3/geocode/regeo',
						  data: {
							key: 'ae00c622d0c9a59b1f1354e63e737573',//微信小程序端高德key
							location: res.longitude + "," + res.latitude,
							extensions: "all",
							s: "rsx",
							sdkversion: "sdkversion",
							logversion: "logversion"				 
						  },
						  success: function (result) {
							  console.log(result)
							  _self.store_longitude = res.longitude
							  _self.store_latitude = res.latitude
							  _self.store_address = res.address + res.name
							  _self.store_adcode = result.data.regeocode.addressComponent.adcode
							  console.log(_self.store_adcode,_self.store_address)
						  },
						  fail: function (res) {
							console.log('获取地理位置失败')
						  }
						})
						// #endif
					}
				});
			},
			emitUploadLicense(res){
				console.log(res)
				this.lists.push(res.showPath)
				this.store_business_license.push(res.path)
				console.log(this.lists.length,this.store_business_license)
			},
			emitUploadCardFront(res){
				this.imgFront[0] = res.showPath
				this.id_card_front = res.path
			},
			emitUploadCardBack(res){
				this.imgBack[0] = res.showPath
				this.id_card_back = res.path
			},
            removeImg(index){
				this.lists.splice(index,1)
				this.store_business_license.splice(index,1)
				console.log(this.lists,this.store_business_license)
            },
			checkFormat(){
				if(!this.store_name){
					this.$mUtils.toast("请输入店铺名")
					return false;
				}else if(!this.store_mobile){
					this.$mUtils.toast("请输入联系方式")
					return false;
				}else if(!this.$regs.isPhone.test(this.store_mobile)){
					this.$mUtils.toast("请输入正确的手机号码")
					return false;
				}else if(!this.store_address){
					this.openMap()
					return false;
				}else if(!this.business_registration_num){
					this.$mUtils.toast("请输入工商注册号")
					return false;
				}else if(!this.store_legal_entity){
					this.$mUtils.toast("请输入企业法人")
					return false;
				}else if(!this.store_business_license){
					this.$mUtils.toast("请上传营业执照")
					return false;
				}else if(!this.id_card_front){
					this.$mUtils.toast("请上传国徽面")
					return false;
				}else if(!this.id_card_back){
					this.$mUtils.toast("请上传人像面")
					return false;
				}else if(!this.store_bank){
					this.$mUtils.toast("请输入店铺开户银行")
					return false;
				}else if(!this.bank_address){
					this.$mUtils.toast("请输入店铺开户行地址")
					return false;
				}else if(!this.store_bank_account){
					this.$mUtils.toast("请输入店铺银行账号")
					return false;
				}else if(!this.account_holder){
					this.$mUtils.toast("请输入开户人姓名")
					return false;
				}else if(!this.store_account){
					this.$mUtils.toast("请输入店铺账号")
					return false;
				}else if(!this.store_password){
					this.$mUtils.toast("请输入店铺密码")
					return false;
				}else if(this.store_password.length<6 || this.store_password.length>20){
					this.$mUtils.toast("请设置6~20个字符长度的密码")
					return false;
				}
				this.saveData()
			},
			saveData(){
				this.storeObj.store_name = this.store_name
				this.storeObj.store_mobile = this.store_mobile
				this.storeObj.store_address = this.store_address
				this.storeObj.store_longitude = this.store_longitude
				this.storeObj.store_latitude = this.store_latitude
				this.storeObj.store_adcode = this.store_adcode
				this.storeObj.business_registration_num = this.business_registration_num
				this.storeObj.store_legal_entity = this.store_legal_entity
				this.storeObj.store_business_license = this.store_business_license
				this.storeObj.id_card_front = this.id_card_front
				this.storeObj.id_card_back = this.id_card_back
				this.storeObj.store_bank = this.store_bank
				this.storeObj.bank_address = this.bank_address
				this.storeObj.store_bank_account = this.store_bank_account
				this.storeObj.account_holder = this.account_holder
				this.storeObj.store_account = this.store_account
				this.storeObj.store_password = this.store_password		
				if(this.store_id) this.storeObj.store_id = this.store_id
				this.submitInfo()
			},
			//提交合作加盟
			submitInfo(){
				this.$api.submitLeague({
					cmd: {"member" : "submitLeague"},
					data: this.storeObj
				}).then(res=>{
					console.log(res,"提交")
					if(res.code == 1){
						var _self = this
						uni.showToast({
							title: "提交成功",
							duration: 2000,
							success: function(res){
								_self.$mRouter.switchTab({route:_self.$mRoutesConfig.own})
							}
						});

					}else{
						this.$mUtils.toast(res.msg)
					}
				}).catch(err=>{console.log(err)})
			},
			//合作加盟信息
			getLeagueById(){
				this.$api.getLeagueById({
					cmd: {"member" : "getLeagueById"},
					data: {
						"member_id": this.member_id,
						"store_id": this.store_id
					}
				}).then(res=>{
					console.log(res,"加盟信息")
					if(res.code == 1){
						this.store_id = res.data.store_id
						this.store_name = res.data.store_name
						this.store_mobile = res.data.store_mobile
						this.store_address = res.data.store_address
						this.store_longitude = res.data.store_longitude
						this.store_latitude = res.data.store_latitude
						this.store_adcode = res.data.store_adcode
						this.business_registration_num = res.data.business_registration_num
						this.store_legal_entity = res.data.store_legal_entity
						this.lists = res.data.store_business_license
						//截取重新获取的图片格式去掉?参数
						this.store_business_license = res.data.store_business_license.map((item,index)=>{
							item = this.$mUtils.handleImg(item)
							return item
						})
						this.imgFront[0] = res.data.id_card_front
						this.imgBack[0] = res.data.id_card_back
						this.id_card_front = this.$mUtils.handleImg(res.data.id_card_front)
						this.id_card_back = this.$mUtils.handleImg(res.data.id_card_back)
						this.store_bank = res.data.store_bank
						this.bank_address = res.data.bank_address
						this.store_bank_account = res.data.store_bank_account
						this.account_holder = res.data.account_holder
						this.store_account = res.data.store_account
					}
				}).catch(err=>{console.log(err)})
			},
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-store-info-page{
		flex: 1;
		flex-direction: column;
		.cell{
			margin-bottom: 20upx;
			background-color: #FFF;
			padding-left: 24upx;
			font-size: 28upx;
			flex-direction: column;
			.cell-item{
				flex: 1;
				flex-direction: column;
				border-bottom: 2upx solid #E7E7E7;
				padding: 20upx 0;
				justify-content: space-between;
				&:last-of-type{
					border: 0;
				}
				.cell-item-title{
					color: #333;
				}
				.cell-item-value{
					padding-right: 24upx;
					align-items: center;
					input{
						flex: 1;
						font-size: 28upx;
					}
					.addr{
						margin-right: 20upx;
						overflow: hidden;
						.uni-input-wrapper,.uni-input-input{
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
					.right-arrow{
						width: 16upx;
						height: 32upx;
					}
					&.upload-box{
						flex-direction: column;
						align-items: flex-start; 
						text{
							color: #999;
							padding: 20upx 0;
						}
						.upload-pictures{
							padding:0 10upx;
							flex-wrap: wrap;
							.more-pic{
								width: 300upx;
								height: 200upx;
								position: relative;
								margin: 20upx;
								background-color: #f8f8f8;
								image{
									width: 100%;
								}
								tui-icon,.tui-icon{
									position: absolute;
									top: 0;
									right: 0;
								}
							}
							.single-pic{							
								margin: 20upx;
								width: 300upx;
								height: 200upx;
								position: relative;
								/deep/.hidden{
									z-index: 99;			
									opacity: 0;
								}
								.img{
									position: absolute;
									left: 0;
									z-index: 1;
								}
								.mask{
									position: absolute;
									background: rgba(0,0,0,0.6);
									font-size: 24upx;
									width: 100%;
									height: 100%;
									z-index: 9;
									justify-content: center;
									align-items: center;
									text{
										color: #FFF;
									}
								}
							}
							/deep/.upload-item{
								width: 300upx; 
								height: 200upx;
								border: 0;
								background-color: #F8F8F8;
								margin: 20upx;
							}
						}
					}
				}
			}
		}
		/deep/.tui-btn{
			margin-top: 60upx;
			margin-bottom: 96upx;
			/* #ifdef MP-WEIXIN */
			margin-left: 24upx;
			/* #endif */
			width: 702upx;
			background: $site-default-color;
			border-radius: 8upx;
			font-size: 32upx;
		}
	}
</style>
