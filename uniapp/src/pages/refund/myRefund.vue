<template>
	<view class="refund-list" v-if="!noData">
		<view class="refund-list-wrapper" v-for="(item,index) in refundList" :key="index">
			<order-list-item class="order-list-item" :item="item" :isRefund="true"></order-list-item>
		</view>
		<tui-loadmore :visible="loaddingMore"></tui-loadmore>
		<tui-nomore :visible="finished" bgcolor="#F5F5F5"></tui-nomore>
	</view>
	<view class="no-data" v-else>
		<no-data class="no-data-item" imgPath="/static/imgs/default/default_message.png" msg="您还没有退款信息"></no-data>
	</view>
</template>

<script>
	import OrderListItem from "@/components/order/OrderListItem";
	import TuiLoadmore from "@/components/tui/loadmore/loadmore";
	import TuiNomore from "@/components/tui/nomore/nomore";
	import NoData from '@/components/noData';
	export default {
		name:'myRefund',
		data() {
			return {
				member_id: '',
				page_size: 10,
				page: 1,
				refundList: [],
				loaddingMore: false,
				finished: false,
				noData: true,
			}
		},
		components: {
			OrderListItem,
			TuiNomore,
			TuiLoadmore,
			NoData
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh: function() {
			this.page = 1;
			this.getRefundList(1);
		},
		// 页面上拉触底事件的处理函数
		onReachBottom: function() {
			console.log('加载更多');
			if (this.finished) return;
			this.loaddingMore = true;
			this.page += 1;
			this.getRefundList();
		},
		onLoad() {
			this.member_id = uni.getStorageSync('userInfo').member_id;
			this.getRefundList();
		},
		methods: {
			getRefundList(props) {
				this.$api.refundlist({
					cmd:{order:'refundskulist'},
					data:{
						member_id: this.member_id,
						page: this.page,
						page_size: this.page_size
					}
				}).then(res=>{
					console.log(res.data);
					if(res.code===1){
						if (this.page == 1) {
							this.refundList = res.data.data;
						} else {
							this.refundList = this.refundList.concat(res.data.data);
						}
						if (res.data.data.length < this.page_size) {
							this.finished = true;
						}else{
							this.finished = false;
						}
						this.loaddingMore = false;
						if (res.data.data.length !== 0) {
							this.noData = false;
						}
						if (props === 1) {
							setTimeout(() => {
								uni.stopPullDownRefresh()
								uni.showToast({
									title: '刷新成功',
									icon:'none',
									duration: 1500
								})
							}, 300)
						}
					}else{
						if (props === 1) {
							setTimeout(() => {
								uni.stopPullDownRefresh()
								uni.showToast({
									title: '刷新失败',
									icon:'none',
									duration: 1500
								})
							}, 300)
						}else{
							uni.showToast({
								title: res.msg,
								icon:'none',
								duration: 1500
							})
						}
					}
				}).catch(err=>{
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
			}
		},
	}
</script>

<style scoped lang="scss">
	.refund-list{
		flex-direction: column;
		width: 100%;
		.refund-list-wrapper{
			.order-list-item{
				width: 100%;
			}
		}
	}
	.no-data{
		width: 100%;
		height: 900upx;
		.no-data-item{
			height: 100%;
		}
	}
</style>
