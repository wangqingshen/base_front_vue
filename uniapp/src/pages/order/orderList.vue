<template>
	<view class="orderlist-wrapper container">
		<view class="orderList-inner">
			<view class="orderStatus-bar">
				<view class="bar-inner">
					<view class="items">
						<view class="item" v-for="(item, index) in orderType" :key="index" :class="[stepIndex == item.state?'active':'']"
						 @tap="changeOrderList(item.state)">
							<view class="txt">{{item.name}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="order-list-inner">
				<view class="order-list-content" v-if="!noData">
					<view class="orderList">
						<view class="orderList-wrapper" v-for="(item,index) in orderListData" :key='index'>
							<order-list-item class="order-list-item" @cancelOrder="cancelOrder" @confirmOrder="confirmOrder" :item="item"></order-list-item>
						</view>
					</view>
					<tui-loadmore :visible="loaddingMore"></tui-loadmore>
					<tui-nomore :visible="finished" bgcolor="#F5F5F5"></tui-nomore>
				</view>
				<view class="no-data" v-else>
					<NoData class="no-data-item" :imgPath="require('@/static/imgs/default/default_message.png')" msg="您还没有订单信息" />
				</view>
			</view>

		</view>
	</view>
</template>
<script>
	import OrderListItem from '@/components/order/OrderListItem';
	import NoData from '@/components/noData';
	import TuiLoadmore from "@/components/tui/loadmore/loadmore";
	import TuiNomore from "@/components/tui/nomore/nomore";
	export default {
		name: 'orderList',
		data() {
			return {
				isSeller: false,
				pageTitle: '我的订单',
				orderType: [{
						name: '全部',
						state: 0
					},
					{
						name: '待付款',
						state: 1
					},
					{
						name: '待发货',
						state: 2
					},
					{
						name: '待收货',
						state: 3
					},
					{
						name: '已完成',
						state: 4
					},
				],
				finished: false,	//分页是否结束
				stepIndex: 0,	//当前tab
				member_id: '',
				orderListData: [],
				page: 1,
				page_size: 10,
				order_state: '',
				noData: true,
				loaddingMore: false,	//加载更多显示
			}
		},
		components: {
			NoData,
			OrderListItem,
			TuiLoadmore,
			TuiNomore
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh: function() {
			this.page = 1;
			this.finished = false;
			this.getOrderList(1);
		},
		// 页面上拉触底事件的处理函数
		onReachBottom: function() {
			console.log('加载更多');
			if (this.finished) return;
			this.loaddingMore = true;
			this.page += 1;
			this.getOrderList();
		},
		onLoad(option) {
			this.userInfo = uni.getStorageSync('userInfo');
			// if(this.$route.query.isSeller){
			//   this.isSeller = true;
			//   document.title = this.pageTitle = '分销订单';
			//   this.orderType.map(item=>{
			//     if(item.state==3){
			//       item.name = '待提货';
			//     }
			//     return item;
			//   })
			// }
			this.member_id = this.userInfo.member_id;
			if(option.status!==undefined){
				this.stepIndex = option.status;
			}else{
				this.stepIndex = 0;
			}
			this.switchOrderType()
			this.getOrderList()
		},
		computed: {

		},
		watch: {

		},
		methods: {
			// 改变顶部tab
			changeOrderList(order_state) {
				if (order_state == this.stepIndex) return;
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.orderList,
					query: {
						status: order_state
					}
				});
				this.stepIndex = order_state;
				this.switchOrderType();
				this.page = 1;
				this.finished = false;
				this.getOrderList();
				// console.log(123);
				// this.$mRouter.back(1);
			},
			// 获取订单列表数据
			getOrderList(props) { //props为1时为刷新页面
				this.$api.getOrderList({
					cmd: {
						order: 'orderlist'
					},
					data: {
						member_id: this.member_id,
						page: this.page,
						page_size: this.page_size,
						order_state: this.order_state
					},
				}).then(res => {
					console.log(res.data);
					if (res.code === 1) {
						if (this.page == 1) {
							this.orderListData = res.data;
						} else {
							this.orderListData = this.orderListData.concat(res.data);
						}
						if (res.data.length < this.page_size) {
							this.finished = true;
						}else{
							this.finished = false;
						}
						this.loaddingMore = false;
						if (this.orderListData.length !== 0) {
							this.noData = false;
						}
						if (props === 1) {
							setTimeout(() => {
								uni.stopPullDownRefresh()
								if (this.$store.getters.hasLogin) {
									uni.showToast({
										title: '刷新成功',
										icon:'none',
										duration: 1500
									})
								}
							}, 300)
						}
					} else {
						if (props === 1) {
							setTimeout(() => {
								uni.stopPullDownRefresh()
								uni.showToast({
									title: '刷新失败',
									icon:'none',
									duration: 1500
								})
							}, 300)
						}
					}
				}).catch(err => {
					if (props === 1) {
						setTimeout(() => {
							uni.stopPullDownRefresh()
							uni.showToast({
								title: '刷新失败',
								icon:'none',
								duration: 1500
							})
						}, 300)
					}
				})
			},
			// 取消订单成功
			cancelOrder(props) {
				console.log(props);
				this.orderListData = this.orderListData.map((item) => {
					if (item.order_id === props) {
						item.order_state = 400;
					}
					return item;
				})
			},
			// 这是订单列表类型
			switchOrderType() {
				let type = '';
				if (this.stepIndex == 0) {
					type = ''
				} else if (this.stepIndex == 1) {
					type = '0,1'
				} else if (this.stepIndex == 2) {
					type = '100,101,102'
				} else if (this.stepIndex == 3) {
					type = '200,201,202'
				} else if (this.stepIndex == 4) {
					type = '300,301,302'
				}
				this.order_state = type;
			},
			// 确认收货成功
			confirmOrder(props) {
				this.orderListData = this.orderListData.map((item) => {
					if (item.order_id === props) {
						item.order_state = 300;
					}
					return item;
				})
			}
		},
		mounted() {}

	}
</script>
<style lang="scss" scoped>
	.orderList-inner {
		box-sizing: border-box;
		height: 100%;
		flex-direction: column;

		.orderStatus-bar {
			position: fixed;
			width: 100%;
			font-size: 28upx;
			color: #999;
			background: #fff;
			z-index: 99;
			box-shadow: 0px 0px 15px #f2f2f2;

			.bar-inner {
				position: relative;
				width: 100%;
			}

			.items {
				align-items: center;
				width: 100%;

				.item {
					width: 20%;
					flex-grow: 1;
					height: 80upx;
					align-items: center;
					justify-content: center;

					.txt {
						line-height: 80upx;
						height: 100%
					}

					&.active {
						.txt {
							color: #DF1222;
							border-bottom: 4upx solid #DF1222;
						}
					}
				}

			}
		}

		.order-list-inner {
			padding-top: 80upx;
			flex-direction: column;
		}

		.order-list-content {
			width: 100%;
			flex-direction: column;
		}
		.no-data{
			width: 100%;
			height: 800upx;
		}
		.orderList {
			flex-direction: column;
			width: 100%;

			&-wrapper {
				flex-shrink: 0;

				&:first-child {
					margin-top: 20upx;
				}

				.order-list-item {
					width: 100%;
				}
			}

		}
	}
</style>
