<template>
	<view class="wsy-address-edit-page">
		<view class="addr-edit-info-box">
			<view class="edit-info-item">
				<view class="item-title">
					<text>收货人</text>
				</view>
				<view class="item-value">
					<input class="uni-input" v-model.trim="true_name" focus placeholder="姓名" placeholder-style="color:#999"/>
					<tui-icon :name="'close-fill'" :size="20" @tap="clearInput(1)" color="#dbdbdb" style="margin:0 24upx;"></tui-icon>
				</view>
			</view>
			<view class="edit-info-item">
				<view class="item-title">
					<text>联系方式</text>
				</view>
				<view class="item-value">
					<input class="uni-input" v-model.trim="mobile" type="number" placeholder="手机号" placeholder-style="color:#999" maxlength="11"/>
					<tui-icon :name="'close-fill'" :size="20" @tap="clearInput(2)" color="#dbdbdb" style="margin:0 24upx;"></tui-icon>
				</view>
			</view>
			<view class="edit-info-item">
				<view class="item-title">
					<text>所在地区</text>
				</view>
				<view class="item-value" @tap="areaPopupShow">
					<input class="uni-input" v-model="area" placeholder="请选择所在区域" placeholder-style="color:#999" disabled/>
					<tui-icon :name="'arrowright'" :size="20" color="#dbdbdb" style="margin:0 24upx;"></tui-icon>
				</view>
			</view>
			<view class="edit-info-item">
				<view class="item-title">
					<text>详细地址</text>
				</view>
				<view class="item-value">			
					<input class="uni-input" v-model.trim="address" placeholder="请输入详细地址" placeholder-style="color:#999" maxlength="45"/>
					<tui-icon :name="'close-fill'" :size="20" @tap="clearInput(4)" color="#dbdbdb" style="margin:0 24upx;"></tui-icon>
				</view>
			</view>
		</view>
		<view class="addr-edit-button-box">
			<button type="warn" class="comfrim" @tap="comfrimAddress">确认</button>
			<button type="default" class="del" @tap="delAddress">删除地址</button>
		</view>
		<!-- 省市区三联动 -->
		<uni-popup ref="popup" type="bottom">
			<view class="popup-inner">
				<view class="province">
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
						<view class="area-item"  v-for="(item,index) in provinceData" @click="chooseAreaFun(1,item,index)" :class="provinceIndex===index ? 'active': ''" :key="index">
							<text>{{item.cityName}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="city">
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
						<view class="area-item"  v-for="(item,index) in cityData" @click="chooseAreaFun(2,item,index)" :class="cityIndex===index ? 'active': ''" :key="index">
							<text>{{item.cityName}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="district">
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
						<view class="area-item"  v-for="(item,index) in districtData" @click="chooseAreaFun(3,item,index)" :class="districtIndex===index ? 'active': ''" :key="index">
							<text>{{item.cityName}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		<tui-actionsheet :show="showActionSheet" :tips="'删除该地址'" @cancel="showActionSheet = false" @click="comfirmActionSheet"></tui-actionsheet>
	</view>
</template>

<script>
	import uniPopup from "@/components/tui/uni-popup/uni-popup.vue";
	import tuiIcon from "@/components/tui/icon/icon";
	import tuiActionsheet from "@/components/tui/actionsheet/actionsheet";
	export default {
		name: "addressEdit",
		components: {uniPopup, tuiIcon, tuiActionsheet},
		data(){
			return {
				member_id: Number,
				true_name: "",
				mobile: '',
				area: '',
				areaObj: {},//拼接
				address: '',//街道详细地址
                address_id: '',//新增不填,编辑必填
				show: false,
                cityCode: '',//高德城市编码
                cityLevel: 'province',//数据返回的级别
                provinceData: [],
                cityData: [],
                districtData: [],
                curAreaLevel: 0,//当前地区层级
                provinceIndex: '',
                cityIndex: '',
                districtIndex: '',
                prov_adcode: '',
                city_adcode: '',
                district_adcode: '',
				scrollTop: 0,
				addressData: {},
				showActionSheet: false,
			}
		},
		onLoad(e){
			if(JSON.stringify(e) !== "{}"){
				console.log(e)
				const info = JSON.parse(e.info)
				this.address_id = info.address_id
				this.true_name = info.true_name
				this.mobile = info.mobile
				this.area = info.region
				this.address = info.address.split(this.area)[1]
				this.prov_adcode = info.prov_adcode
				this.city_adcode = info.city_adcode
				this.district_adcode = info.district_adcode
			}
		},
		onShow(){
			var userInfo = uni.getStorageSync("userInfo") || {};
			if(userInfo.member_id){		
			    this.member_id = Number(userInfo.member_id);
				this.areaRegion()
			}
		},
		methods: {
			clearInput(index){
				if(index === 1){
					this.true_name = ""
				}else if(index === 2){
					this.mobile = ""
				}else if(index === 3){
					this.area = ""
					this.areaObj = {}
				}else if(index === 4){
					this.address = ""
				}
			},
			comfrimAddress(){
				if(!this.true_name){
                    this.$mUtils.toast('请填写联系人姓名');
                    return false
                }else if(this.true_name.length > 10){
					this.$mUtils.toast('姓名不超过10个字符');
					return false
				}else if(!this.mobile){
                    this.$mUtils.toast('请输入11位手机号码');
                    return false
                }else if(!this.$regs.isPhone.test(this.mobile)){
                    this.$mUtils.toast('请输入正确的手机号码');
                    return false
                }else if(!this.area){
                    this.$mUtils.toast('请选择所在地区');
                    return false
                }else if(!this.address){
                    this.$mUtils.toast('请填写收货地址');
                    return false
                }else if(this.address.length > 45){
					this.$mUtils.toast('地址不超过45个字符');
					return false
				}
                this.addressData.member_id = this.member_id
                this.addressData.true_name = this.true_name
                this.addressData.mobile = this.mobile
                this.addressData.prov_adcode = this.prov_adcode
                this.addressData.city_adcode = this.city_adcode
                this.addressData.district_adcode = this.district_adcode
                this.addressData.address = this.area.concat(this.address)
                if(this.address_id) this.addressData.address_id = this.address_id
                console.log(this.addressData)
                this.editAddress()
			
			},
			//删除地址
			delAddress(){
				this.showActionSheet = true
				// const _self = this
				// uni.showActionSheet({
				// 	itemList: ['删除该地址'],
				// 	itemColor: '#DF1222',
				// 	success: function (res) {
				// 		_self.$api.addressDel({
				// 			cmd: {"member": "deleteAddress"},
				// 			data:{"address_id": _self.address_id}
				// 			}).then(res => {
				// 				if(res.code === 1){
				// 					uni.showToast({
				// 						title: '删除成功',
				// 						success: function (res) {
				// 							setTimeout(()=>{					
				// 								_self.$mRouter.back(1)
				// 							},2000)
				// 						}
				// 					});
				// 				}
				// 		});
				// 	},
				// 	fail: function (res) {
				// 		console.log('用户点击了取消');
				// 	}
				// });
			},
			comfirmActionSheet(){
				const _self = this
				_self.$api.addressDel({
					cmd: {"member": "deleteAddress"},
					data:{"address_id": _self.address_id}
					}).then(res => {
						if(res.code === 1){
							uni.showToast({
								title: '删除成功',
								success: function (res) {
									setTimeout(()=>{					
										_self.$mRouter.back(1)
									},2000)
								}
							});
						}
				});
			},
			//新增编辑收货地址
			editAddress(){
                this.$api.addressEdit({
                    cmd:{"member":"editAddress"},
                    data:this.addressData
                }).then(res=>{
                    console.log(res)
                    if(res.code ===1){
						let _this = this
						uni.showToast({
							title: '保存成功',
							duration: 2000,
							success: function (res) {
								setTimeout(()=>{						
									_this.$mRouter.back(1)					
								},2000)
							}
						});
                    }else{
                        this.$mUtils.toast(res.msg);
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
			areaPopupShow(){
				this.$refs.popup.open()
				this.cityLevel = 'province'
                this.curAreaLevel = 0
                this.cityData = ''
                this.districtData = ''
                this.areaObj = {}
			},
			//地区三联动
			areaRegion(){
                this.$api.cityRegion({
                    cmd:{"region":"getCityRegion"},
                    data: {
                        "adcode": this.cityCode,
                        "level": this.cityLevel
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code == 1){
						if(res.data.length){					
							if(this.cityLevel = 'province' && this.curAreaLevel===0){
								this.provinceData = res.data
							}else if(this.cityLevel = 'city' && this.curAreaLevel===1){
								this.cityData = res.data
							}else if(this.cityLevel = 'district' && this.curAreaLevel===2){
								this.districtData = res.data
							}
						}else{
							//无返回数据 拼接地区  
                            if(!this.areaObj.city) this.areaObj.city = ''                        
                            if(!this.areaObj.district) this.areaObj.district = ''
                            this.area = this.areaObj.province+' '+this.areaObj.city+' '+this.areaObj.district
							this.$refs.popup.close()
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
			chooseAreaFun(level,item,index){
                // console.log(level,item,index)
                this.curAreaLevel = level
                if(level === 1){
                    this.cityLevel = 'city'
                    this.cityData = ''
                    this.districtData = ''
                    this.areaObj = {}
                    this.areaObj.province = item.cityName
                    this.provinceIndex = index
                    this.cityIndex = ''
                    this.districtIndex = ''
                    this.prov_adcode = item.adcode
                    this.city_adcode = ''
                    this.district_adcode = ''
                }else if(level === 2){
                    this.cityLevel = 'district'
                    this.areaObj.city = item.cityName
                    this.cityIndex = index
                    this.districtIndex = ''
                    this.city_adcode= item.adcode
                    this.district_adcode = ''
                }else if(level === 3){
                    this.areaObj.district = item.cityName                    
                    this.districtIndex = index
                    this.district_adcode = item.adcode
                }
                this.cityCode = item.adcode
                this.areaRegion()
            },
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-address-edit-page{
		flex: 1;
		flex-direction: column;
		background-color: #FFF;
		.addr-edit-info-box{
			padding-left: 24upx;
			flex-direction: column;
			.edit-info-item{
				align-items: center;
				height: 80upx;
				border-bottom:2upx solid #E7E7E7;
				.item-title{
					width: 150upx;
					text{
						font-size: 28upx;
						color: #999;
					}
				}
				.item-value{
					flex: 1;
					align-items: center;
					.uni-input{
						font-size: 28upx;
						color: #333;
						flex: 1;
					}
				}
			}
		}
		.addr-edit-button-box{
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 40upx;
			button{
				width: 702upx;
				height: 88upx;
				border-radius: 8upx;
				margin-top: 40upx;
				font-size: 32upx;
			}
			.comfrim{
				border: 0 none;
				background-color: $site-default-color;
				color: #FFF;
			}
			.del{
				border: 1px solid #E7E7E7;
				background-color: #FFF;
				color: #333;
			}
		}
		/deep/.uni-popup{
			.uni-popup__wrapper{
				.popup-inner{
					flex: 1;
					height: 600upx;
					.province,.city,.district{
						flex: 1;
						overflow: auto;
						-webkit-overflow-scrolling: auto;
						.area-item{
							height: 88upx;
							display: flex;
							justify-content: center;
							align-items: center;
							padding: 0 20upx;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp:2;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-all;
							text{
								color: #333;
								font-size: 24upx;
							}
							&.active{
								background: #EDEDED;
							}
						}
					}
				}
			}
		}
	}
</style>
