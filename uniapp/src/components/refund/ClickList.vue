<template>
	<!-- list组件 -->
	<view class="click-list" :class="isDown?'down-class':''" @tap="handleClick" @touchstart="isDown=true" @touchend="isDown=false">
		<text class="click-list-title">{{listTitle}}</text>
		<view class="click-list-right">
			<text class="des-text" v-if="desText">{{desText}}</text>
			<image class="icon-right" :src="require('@/static/imgs/order/icon_right.png')"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name:"ClickList",
		props: {
			listTitle: {
				type: String,
			},
			desText: {
				type: String,
			},
		},
		data() {
			return {
				isDown: false
			}
		},
		methods: {
			// 点击事件处理
			handleClick() {
				this.$emit('handleClick')
			},
		},
	}
</script>

<style scoped lang="scss">
	.click-list{
		width: 100%;
		height: 80upx;
		padding: 0 24upx;
		align-items: center;
		justify-content: space-between;
		background: white;
		font-size: 28upx;
		.click-list-right{
			color: #999999;
			.icon-right{
				margin-left: 12upx;
				width: 16upx;
				height: 32upx;
			}
		}
	}
	.down-class{
		background: #eee;
	}
</style>