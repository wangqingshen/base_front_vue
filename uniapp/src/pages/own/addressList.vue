<template>
	<view class="wsy-address-list-page">
		<no-data :imgPath="require('@/static/imgs/default/default_address.png')" :msg="'暂无收货地址'" v-if="noData == true">没数据</no-data>
		<view class="address-box" v-else>
			<view class="address-item" v-for="(item,index) in addrList" :key="index">
				<view class="address-item-inner">			
					<view class="addr-item-info">
						<view class="info-hd">
							<text class="name">{{item.true_name}}</text>
							<text class="tel">{{item.mobile}}</text>
							<text class="default" v-if="item.is_default == 1">默认</text>
						</view>
						<view class="info-bd">
							<text class="addr">{{item.address}}</text>
						</view>
					</view>
					<view class="addr-item-handle">
						<view class="handle-l" @tap="setDefaultAddress(item,index)">
							<tui-icon :name="(pageType=='info'&&item.is_default==1) || (pageType=='order'&&selIndex==index) ? 'circle-fill' : 'circle'" :size="16" :color="(pageType=='info'&&item.is_default==1) || (pageType=='order'&&selIndex==index) ? '#DF1222':''" style="margin: 0;"></tui-icon>
							<text v-if="pageType=='info'">{{item.is_default==1 ? '默认地址' : '设为默认'}}</text>
							<text v-else>选择</text>
						</view>
						<view class="handle-r" @tap="editAddress(item)">
							<tui-icon :name="'feedback'" :size="16" style="margin: 0;"></tui-icon>
							<text>编辑</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<button type="default" @tap="newAddress">新增收货地址</button>
	</view>
</template>

<script>
	import noData from "@/components/noData";
	import tuiIcon from "@/components/tui/icon/icon";
	export default {
		name: "addressList",
		components: {noData, tuiIcon},
		data(){
			return {
				memberId: Number,
				addrList: [],
				noData: Boolean,
				pageType:"info",//从哪个页面过来 1"info"个人信息 2"order"订单确认页
				goodsData: {},//从订单确认页过来时传，个人信息{}
				payway: Number,//从订单确认页过来时传，个人信息传-1
				orderType: Number,//从订单确认页过来时传,个人信息传1
				selIndex: Number,//订单确认页选择的地址=>选择字样前的icon激活
			}
		},
		onLoad(e){
			console.log(e)
            this.pageType = e.pageType
			// if(this.pageType == "order") this.setSelIndex()
            this.goodsData = e.goodsData
            this.payway = Number(e.payway)
            this.orderType = Number(e.orderType)
		},
		onShow(){		
			var userInfo = uni.getStorageSync("userInfo") || {};
			if(userInfo.member_id){		
                this.memberId = Number(userInfo.member_id);
				this.getAddressList()
			}
		},
		methods: {
			getAddressList(){
				this.$api.addressList({
					cmd: {"member" : "addressList"},
					data:{"member_id" : this.memberId}
				}).then(res=>{
					console.log(res,'地址')
					if(res.code == 1){
						if(res.data.length){
							this.noData = false
							this.addrList = res.data
							if(this.pageType == "order"){
								if(this.$store.state.isSelIndex == -1) {
									this.addrList.filter((item,index)=>{
										if(item.is_default == 1){
											this.selIndex = index
										} 
									})
								}else{
									this.selIndex = this.$store.state.isSelIndex
								}
							}
						}else{
							this.noData = true
						}
					}
				}).catch(err=>{console.log(err)})
			},
			//选择地址
			setDefaultAddress(value,index){
				console.log(value,this.pageType)
				// if(this.pageType == "order" || value.is_default) return false
				//订单确认页
				if (this.pageType == "order"){
					this.orderChoose(value,index)
				}else{
					//个人信息页
					if(value.is_default == 0){					
						this.$api.addressDefault({
							cmd:{"member" : "setDefaultAddress"},
							data:{
								"member_id": value.member_id,
								"address_id" : value.address_id,
							}
						}).then(res=>{
							if(res.code ===1){
								this.getAddressList()
							}
						})		
					}
				} 
			},
			orderChoose(value,index){
				// if(this.pageType == "info") return false
				console.log(value,index,this.pageType)
				this.$store.commit('SET_SEL_ADDRESS_INDEX',index)
				uni.setStorageSync('isSelIndex', index)
				this.$store.dispatch('setAddress',value).then(res=>{
					this.selIndex = index 
					var _self = this
					uni.showLoading({
						title: '设置中',
						success: function (res) {
							setTimeout(()=>{
								uni.hideLoading();		
								_self.$mRouter.redirectTo({route:_self.$mRoutesConfig.orderConfirm, query: {goodsData: _self.goodsData, payway:_self.payway, orderType: _self.orderType}})
							},2000)
						}
					});
				})
			},
			editAddress(value){
				this.$mRouter.push({route:this.$mRoutesConfig.addressEdit,query:{pageType: this.pageType, info: JSON.stringify(value), goodsData: this.goodsData, payway:this.payway, orderType: this.orderType}})
			},
			newAddress(){
				this.$mRouter.push({route:this.$mRoutesConfig.addressEdit})
			},
			// setSelIndex(){
   //              if(this.$store.state.isSelIndex == '-1') {
   //                  if(this.itemData.is_default == 1) this.selIndex = this.itemIndex
   //              }else{
   //                  this.selIndex = this.$store.state.isSelIndex
   //              }
   //          },
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-address-list-page{
		flex: 1;
		flex-direction: column;
		.address-box{
			flex: 1;
			flex-direction: column;
			padding-bottom: 88upx;
			.address-item{
				padding:0 30upx;
				margin-bottom: 20upx;
				background-color: #FFF;
				.address-item-inner{
					flex: 1;
					justify-content: space-between;
					flex-direction: column;
					.addr-item-info{
						flex-direction: column;
						overflow: hidden;
						.info-hd{
							padding-top: 28upx;
							text{
								font-size: 28upx;
								color: #333;						
							}
							.name{
								font-weight: 600;
							}
							.tel{
								font-size: 28upx;
								color: #333;
								padding-left: 56upx;
							}
							.default{
								margin-left: 30upx;
								color: $site-default-color;
								border: 2upx solid $site-default-color;
								font-size: 24upx;
								transform: scale(0.8);
								padding: 0 4upx;
							}
						}
						.info-bd{
							padding: 16upx 0 24upx;
							.addr{
								font-size: 28upx;
								color: #666;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: normal;
								word-break: break-all;
							}
						}
					}
					.addr-item-handle{
						justify-content: space-between;
						font-size: 24upx;
						height: 84upx;
						border-top: 2upx solid #EBEBEB;
						.handle-l{
							align-items: center;
						}
						.handle-r{
							align-items: center;
						}
						text{
							padding:0 4upx;
						}
					}
					
				}
			}
		}
		.tui-btn,button{
			width: 100%;
			background: $site-default-color;
			font-size: 32upx;
			position: fixed;
			bottom: 0;
			border-radius: 0;
			color: #FFF;
			border: 0;
		}
	}
</style>
