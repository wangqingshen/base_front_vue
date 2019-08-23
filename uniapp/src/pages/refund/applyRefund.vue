<template>
	<view class="apply-refund">
		<view class="apply-refund-header">
			<view class="refund-header-title">
				退款商品
			</view>
			<view class="refund-header-btn" v-if="showAdd"  @click="addEdit">
				添加和编辑
			</view>
		</view>
		<!-- 退款商品 -->
		<view class="apply-refund-goods">
			<view class="apply-refund-goods-item" v-for="(item,index) in refundData.refund_goods" :key="index">
				<order-goods-item :itemData="item" :isRefund="true"></order-goods-item>
			</view>
		</view>
		<!-- 退款相关信息 -->
		<view class="apply-refund-info">
			<picker
				class="show-picker"
				mode='selector'
				@change="changeReason"
				:value="pickerIndex"
				:range="refundData.refund_reason"
			>
				<click-list
					class="refund-reasons"
					listTitle="退款原因"
					:desText="curReason"
				></click-list>
			</picker>
			<view class="info-default">
				<text class="info-text">退款金额:</text>
				<view class="info-price">
					<text class="info-price-symbol">￥</text>
					<input
						class="price-input"
						type="digit"
						v-model="curPrice"
						placeholder-style="color:#DF1222"
						maxlength="10"
						@blur="changePrice"
						placeholder="请输入退款金额"
					/>
				</view>
			</view>
			<view class="info-default">
				<text class="info-text">退款说明:</text>
				<view class="info-content">
					<textarea v-model="curComment" class="info-content-input" auto-height placeholder="请填写退款申请说明" />
				</view>
			</view>
		</view>
		<!-- 退款凭证 -->
		<view class="apply-refund-voucher">
			<view class="voucher-title">
				<text class="title-main">退款凭证</text>
				<text class="title-sub">（最多上传3张）</text>
			</view>
			<view class="voucher-img">
				<view class="voucher-img-wrapper" v-if="imgs.length<3">
					<image
						class="icon-upload"
						:src="require('@/static/imgs/icons/icon_upload.png')"
						@tap="handleUpload"
					></image>
				</view>
				<view class="voucher-img-wrapper" v-for="(item,index) in imgs" :key="index">
					<view class="img-choose-wrapper" @tap="previewImg(index)">
						<image class="img-choose" :src="item" mode="aspectFit"></image>
					</view>
					<image
						class="icon-delete"
						:src="require('@/static/imgs/icons/icon_close@2x.png')"
						@tap.stop="handleDel(index)"
					></image>
				</view>
			</view>
		</view>
		<view class="apply-refund-btn">
			<button class="sub-btn"  @tap="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script>
	import OrderGoodsItem from '@/components/order/OrderGoodsItem';
	import ClickList from '@/components/refund/ClickList';
	export default {
		name:'applyRefund',
		components: {
			OrderGoodsItem,
			ClickList
		},
		data() {
			return {
				refundData: {},
				curReason: '请选择',
				curPrice: 0.00,	//当前价格
				curComment: '',  //当前退款说明
				showAdd: false,  //是否显示添加和编辑按钮
				imgs: [],	//上传凭证图片数组
				refund_type: '',  //退款类型
				order_id: '',  //订单id
				goods_ids: [],  //退款商品id数组
				member_id: '',	//用户id
				refund_id: '',  //退款id
				refund_sn: '',  //修改退款时使用
				isEdit: false,  //是否为修改申请
				maxLength: 3
			}
		},
		onLoad(options) {
			console.log(options.refund_type);
			this.refund_type = Number(options.refund_type);
			this.order_id = uni.getStorageSync('refundOrderId');
			this.member_id = uni.getStorageSync('userInfo').member_id;
			if(options.refund_sn){
				this.refund_sn = options.refund_sn;
				this.isEdit = true;
				this.getCurrentData();
			}else{
				this.isEdit = false;
				this.refund_sn = '';
			}
			let goods = uni.getStorageSync('refundGoods');
			let init = uni.getStorageSync('initSku');
			console.log(goods.length,init.length,this.showAdd,"ggggggggggggggg");
			if(goods.length>1 && goods.length>init.length){
				this.showAdd = true;
			}else{
				this.showAdd = false;
			}
		},
		onShow() {
			this.goods_ids = uni.getStorageSync('skuData');
			this.goods_ids = this.goods_ids.map(item=>{
				return item.sku_id;
			})
			this.$api.applyRefund({
				cmd: {order:'refundsku'},
				data:{
					order_id: this.order_id,
					order_goods_ids: this.goods_ids,
					refund_type: this.refund_type,
					refund_sn: this.refund_sn
				}
			}).then(res=>{
				console.log(res,"退款数据");
				if(res.code===1){
					this.refundData = res.data;
					if(!this.isEdit){
						this.curPrice = Number(res.data.refund_limit).toFixed(2);
					}
				}
			})
		},
		computed: {
			//当前原因选择器下标
			pickerIndex(){
				let index = 0;
				if(this.refundData.refund_reason){
					this.refundData.refund_reason.map((item,_index)=>{
						if(item===this.curReason){
							index = _index;
						}
						return item;
					})
				}
				return index;
			}
		},
		methods: {
			// 添加和编辑
			addEdit() {
				this.$mRouter.push({
					route: this.$mRoutesConfig.selectgoods,
					query:{
						order_state: this.refundData.order_state,
						isApply: 1,
						refund_type: this.refund_type
					}
				})
			},
			// 选择退款原因
			changeReason(e){
				console.log('hhh',e);
				this.curReason = this.refundData.refund_reason[e.detail.value];
			},
			// 修改金额
			changePrice(e){
				console.log(this.refundData.refund_limit,e);
				let oldPrice = Number(this.refundData.refund_limit);
				let price = Number(e.detail.value);
				if(price>oldPrice){
					price = oldPrice;
				}
				this.curPrice = price.toFixed(2);
				console.log(this.curPrice);
			},
			// 删除凭证
			handleDel(index){
				console.log('删除此凭证');
				this.imgs.splice(index,1);
			},
			// 上传凭证
			handleUpload(){
				console.log('上传凭证');
				if (this.imgs.length > this.maxLength) {
					this.$mUtils.toast('最多上传'+this.maxLength+'张图片');
					return
				}
				uni.chooseImage({
					count: this.maxLength - this.imgs.length, //默认3
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					// sourceType: ['album'], //从相册选择
					success: (res)=>{
						if(this.imgs.length + res.tempFilePaths.length > this.maxLength) {
                            this.$mUtils.toast('最多上传'+this.maxLength+'张图片');
					        return
                        }
						let files = res.tempFilePaths;
						let imgs = this.imgs;
						files.map(item=>{
							imgs.unshift(item);
							return item;
						})
						this.imgs = imgs;
						console.log(imgs);
					}
				});
			},
			// 预览图片
			previewImg(props){
				uni.previewImage({
					current: props,
					urls: this.imgs,
				});
			},
			// 提交按钮
			async handleSubmit(){
				uni.showLoading({
					title: '退款申请提交中'
				});

				console.log(`退款价格：${this.curPrice}`,`退款原因：${this.curReason}`);
				if(Number(this.curPrice)<=0){
					this.showToast('退款金额不能为0')
					return;
				}
				if(this.curReason==='请选择'){
					this.showToast('请选择退款原因')
					return;
				}
				if(this.curComment===''){
					this.showToast('请填写退款说明')
					return;
				}
				let imgArr = [];
				let regStr = '-1257062727';
				if(this.imgs.length){
					for (let val of this.imgs) {
						// 判断图片是否为已保存图片进行修改操作
						if(val.indexOf(regStr)!==-1){
							//是已存图片
							let str = this.$mUtils.handleImg(val);
							imgArr.push(str);
							if(imgArr.length === this.imgs.length){
								this.subInfo(imgArr);
							}
						}else{
							console.log('发现新图片');
							//新上传图片
							await this.$toBase64(val)
								.then(async (base64) => {
									console.log(base64,'646464')
									await this.$api.uploadImg({
										cmd:{sys:'uploadImg'},
										data:{
											img: base64
										}
									}).then(res=>{
										console.log(res,"hhhhhhh");
										if(res.code===1){
											imgArr.push(res.data);
											if(imgArr.length === this.imgs.length){
												this.subInfo(imgArr);
											}
										}else{
											this.showToast(res.msg)
										}
									}).catch(err=>{
										console.error(err)
										this.showToast('上传图片失败，请稍后再试')
										return false;
									})
								})
								.catch(error => {
									console.error(error)
									this.showToast('上传图片失败，请稍后再试')
									return false;
								})
						}
					}
				}else{
					this.subInfo(imgArr);
				}
			},
			// 提交信息接口
			subInfo(imgArr){
				this.$api.refundPost({
					cmd: {order:'refundskupost'},
					data: {
						order_id: this.order_id,
						order_goods_ids: this.goods_ids,
						refund_reason: this.curReason,
						refund_type: this.refund_type,
						refund_comment: this.curComment,
						refund_amount: this.curPrice,
						imgs: imgArr,
						refund_sn: this.refund_sn,
						member_id: this.member_id
					}
				}).then(res=>{
					console.log(res);
					if(res.code===1){
						uni.hideLoading();
						uni.showToast({
							title: '申请退款成功',
							duration: 1500
						})
						setTimeout(()=>{
							this.$mRouter.redirectTo({
								route: this.$mRoutesConfig.myRefund,
								query:{}
							})
						},1500)
						
					}else{
						this.showToast(res.msg)
					}
				}).catch(err=>{
					setTimeout(()=>{
						this.showToast('申请退款失败，请稍后再试')
					},300)
				})
			},
			// 弹框信息
			showToast(msg){
				uni.hideLoading();
				uni.showToast({
					title: msg,
					icon:'none',
					duration: 1500
				})
			},
			// 获取当前退款信息
			getCurrentData(){
				this.$api.refunddetail({
					cmd:{order:'refundskudetail'},
					data:{
						refund_sn: this.refund_sn
					}
				}).then(res=>{
					console.log(res);
					if(res.code===1){
						this.curReason = res.data.refund_reason;
						this.curPrice =  Number(res.data.refund_amount).toFixed(2);
						this.curComment = res.data.refund_comment;
						this.imgs = res.data.imgs;
					}else{
						setTimeout(()=>{
							uni.showToast({
							    title: res.msg,
							    icon:  'none',
							    duration: 1500
							})
						},300)
					}
				})
			}
			
		},
	}
</script>

<style scoped lang="scss">
	.apply-refund{
		width: 100%;
		flex-direction: column;
		.apply-refund-header{
			height: 80upx;
			background: white;
			justify-content: space-between;
			align-items: center;
			padding: 0 24upx;
			font-size: 28upx;
			border-bottom: 2upx solid #E7E7E7;
			.refund-header-btn{
				height: 100%;
				align-items: center;
				color: #DF1222;
			}
		}
		.apply-refund-goods{
			padding: 24upx 24upx 0;
			background: white;
			&-item{
				margin-bottom: 24upx;
				width: 100%;
			}
		}
		.apply-refund-info{
			margin-top: 20upx;
			background: white;
			flex-direction: column;
			.refund-reasons{
				width: 100%;
			}
			.show-picker{
				width: 100%;
				height: 80upx;
			}
			.info-default{
				min-height: 80upx;
				font-size: 28upx;
				padding: 0 24upx;
				.info-text{
					line-height: 80upx;
					margin-right: 20upx;
					flex-shrink: 0;
					color: #535353;
				}
				.info-price{
					align-items: center;
					flex: 1;
					line-height: 80upx;
					color: #DF1222;
					&-symbol{
						line-height: 40upx;
					}
					.price-input{
						flex: 1;
						font-size: 28upx;
					}
				}
				.info-content{
					flex: 1;
					padding: 20upx 0;
					align-items: center;
					.info-content-input{
						flex-shrink: 0;
						color: #535353;
						width: 100%;
						font-size: 28upx;
					}
				}
			}
		}
		.apply-refund-voucher{
			flex-direction: column;
			.voucher-title{
				margin-top: 20upx;
				padding: 0 24upx;
				align-items: center;
				height: 88upx;
				font-size: 28upx;
				background: white;
				width: 100%;
				.title-sub{
					color: #999999;
					margin-left: 30upx;
				}
			}
			.voucher-img{
				background: white;
				padding: 6upx 24upx 38upx;
				&-wrapper{
					position: relative;
					margin-right: 20upx;
					width: 128upx;
					height: 128upx;
					.img-choose-wrapper{
						background: #E7E7E7;
						width: 100%;
						height: 100%;
						.img-choose{
							width: 100%;
							height: 100%;
						}
					}
					
					.icon-upload{
						width: 100%;
						height: 100%;
					}
					.icon-delete{
						position: absolute;
						right: 0;
						top: 0;
						width: 30upx;
						height: 30upx;
					}
				}
			}
		}
		.apply-refund-btn{
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 88upx;
			.sub-btn{
				width: 100%;
				border: 0;
				height: 100%;
				background-color: #DF1222;
				color: white;
				border-radius: 0;
				font-size: 32upx;
			}
			.button-hover{
				background-color: #df4446;
			}
		}
	}
</style>
