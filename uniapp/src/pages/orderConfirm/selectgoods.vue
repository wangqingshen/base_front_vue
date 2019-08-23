<template>
	<view class="serveClass">
		<view class="con" v-for="(item,index) in goodSingle" :key='index' @click="changeGoodsitem(item,index)">
			<view class="defaultIcon checkedBox" v-if="item.defaultColor"></view>
			<view class="defaultIcon" :class="item.checked?'checkedBox':''" v-else></view>
			<good-single class='goodSingle' :orderItemData='item' :key='index'></good-single>
		</view>
		<view class="bottom1">
			<view class="defaultIcon" :class="checkAll?'checkedBox':''" @click="checkAllFun"></view>
			<view class="tex" @click="checkAllFun">全选</view>
			<button class="sureBtn" :disabled="!surered" :class="surered?'sureBtnred':''" @click="sureFun">确定</button>
		</view>
	</view>
</template>

<script>
	import goodSingle from '../../components/orderConfirm/goosSelect.vue'
	export default{
		name:'serveClass',
		data() {
			return {
				selectData:[],
				goodSingle: [],
				skuSpuData:[],
				skuId:'',
				spuId:'',
				defaultColor:false,
				checkAll:false,
				surered:false,
				order_state:''//100待发货 200待收货
			}
		},
		components:{
			goodSingle,
		},
		methods: {
			changeGoodsitem(val) {
				console.log(val)
				val.checked = !val.checked;
				if(val.defaultColor == true){
					val.checked = true
				}
				this.allCheckTestFun()
				this.checkRed()
			},
			checkAllFun(){
				this.checkAll = !this.checkAll;
				this.goodSingle.map(res=>{
					res.checked = this.checkAll
					this.surered = this.checkAll
					if(res.defaultColor == true){
						res.checked = true
						this.surered = true
					}
				})
			},
			sureFun(){
				console.log(this.order_state)
				let data=[]
				this.selectData.map(item=>{
					if(item.checked == true){
						let obj={
							sku_id:item.order_goods_id
						}
						data.push(obj)
					}
				})
				uni.setStorageSync('skuData',data)
				if(this.isApply == 1){
					this.$mRouter.redirectTo({
						route: this.$mRoutesConfig.applyRefund,
						query: {
							order_state:this.order_state,
							refund_type:this.refund_type
						}
					})
				}
				if(this.order_state == 100&&this.isApply != 1){
					this.$mRouter.redirectTo({
						route: this.$mRoutesConfig.applyRefund,
						query: {
							order_state:this.order_state,
							refund_type:1
						}
					})
				}else if(this.order_state == 200&&this.isApply != 1){
					this.$mRouter.redirectTo({
						route: this.$mRoutesConfig.serveClass,
						query: {
							order_state:this.order_state,
						}
					})
				}else if(this.isApply == 1){
					this.$mRouter.redirectTo({
						route: this.$mRoutesConfig.applyRefund,
						query: {
							order_state:this.order_state,
							refund_type:this.refund_type
						}
					})
				}
				
			},
			checkRed(){
				let i = false;
				this.goodSingle.map(item=>{
					if(item.checked){
						i = true;
					}
				})
				this.surered = i;
			},
			allCheckTestFun(){
				let checkAllTemp = true;
				this.goodSingle.map(item=>{
					if(!item.checked){
						checkAllTemp = false;
					}else{
						
					}
				})
				this.checkAll = checkAllTemp
			}
		},
		onLoad(option){
			this.goodSingle = uni.getStorageSync('refundGoods')
			this.initSkuData = uni.getStorageSync('initSku');
			this.skuSpuData = uni.getStorageSync('skuData')
			this.skuId = option.sku_id;
			this.order_state = option.order_state
			this.isApply = option.isApply
			this.refund_type = option.refund_type
			this.goodSingle.map((item,index)=>{
				this.$set(this.goodSingle[index],'checked',false)
				this.$set(this.goodSingle[index],'status',this.order_state)
				// item.checked =false;
				if(this.skuSpuData.length){
					this.skuSpuData.map(item1=>{
						if(item.order_goods_id == item1.sku_id){
							item.checked = true
						}
					})
				}
				if(this.initSkuData.length){
					this.initSkuData.map(item2=>{
						if(item.order_goods_id == item2.sku_id){
							item.checked = true
							item.defaultColor = true
							this.surered = true
						}
					})
				}
				
			})
			this.selectData = this.goodSingle
			console.log(this.selectData)
			this.allCheckTestFun()
			this.checkRed()
		}
	}
</script>

<style lang="scss" type="text/scss">
	.serveClass{
		background: #F5F5F5;
		flex-direction: column;
		font-size: 28upx;
		flex: 1;
		.con{
			margin-bottom: 20upx;
			background: #fff;
			align-items: center;
			padding-left: 24upx;
			.defaultIcon{
				width: 40upx;
				height: 40upx;
				background-size: cover;
				background: url('../../static/imgs/icons/icon_check.png') no-repeat center;
				background-size: 100% 100%;
				border-radius: 100%;
			}
			.checkedBox{
				background: url('../../static/imgs/icons/icon_select_red.png') no-repeat center;
				background-size: 100% 100%;
			}
			.goodSingle{
				flex: 1
			}
		}
		.bottom1{
			height: 100upx;
			position: fixed;
			bottom: 0;
			background: #fff;
			width: 100%;
			align-items: center;
			padding-left: 24upx;
			justify-content: space-between;
			.defaultIcon{
				width: 40upx;
				height: 40upx;
				background-size: cover;
				background: url('../../static/imgs/icons/icon_check.png') no-repeat center right;
				background-size: 100% 100%;
				border-radius: 100%;
				padding-left:40upx;
			}
			.checkedBox{
				background: url('../../static/imgs/icons/icon_select_red.png') no-repeat center;
				background-size: 100% 100%;
			}
			.tex{
				color: #999;
				padding-left: 20upx;
				flex-grow: 1;
			}
			.sureBtn{
				width:300upx;
				height:100upx;
				background: #ccc;
				opacity:0.99;
				align-items: center;
				justify-content: center;
				font-size: 32upx;
				color: #666;
				border-radius: 0;
				border: 0;
				line-height: 100upx;
			}
			.sureBtnred{
				background:rgba(223,18,34,1);
				color: #fff;
			}
		}
	}
</style>

