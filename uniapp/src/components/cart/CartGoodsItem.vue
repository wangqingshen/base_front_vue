<template>
	<view class="goods-info" @tap="goDetail">
		<view class="pic lazy-img">
			<image :src="$mUtils.addImgUrl(goodsItem.goods_img)" alt="" />
		</view>
		<view class="info">
			<view class="desc" :class="type===2?'bad-desc':''">{{goodsItem.goods_name}}</view>
			<view class="type" v-if="goodsItem.sku_name">商品规格：{{goodsItem.sku_name}}</view>
			<view class="total">
				<view class="price" :class="type===2?'bad-price':''">￥{{goodsItem.goods_price}}</view>
				<view class="input-number" v-if="type===1">
					<!-- <van-stepper :integer="true" v-model="goodsItem.goods_num" :max="goodsItem.goods_stock" min="1" /> -->
					<number-box
						class="number-box"
						:value="goodsItem.goods_num"
						:min="1"
						:max="goodsItem.goods_stock"
						@change="numChange"
					></number-box>
				</view>
				<text class="bad-cause" v-if="type===2">{{badCause}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import NumberBox from '@/components/tui/numberbox/numberbox';
	export default {
		name: "cartGoodsItem",
		data() {
			return {
				// key: value
			}
		},
		components: {
			NumberBox
		},
		props: {
			goodsItem: {	//商品数据
				type: Object,
			},
			type: {		//商品类型：  1 有效商品  2 失效商品
				type: Number,
				default: 1
			}
		},
		computed: {
			badCause(){
				if(this.goodsItem.sku_bad_reason == 1203){
					return '商品库存不足'
				}else if(this.goodsItem.sku_bad_reason == 1204){
					return '商品已下架'
				}else if(this.goodsItem.sku_bad_reason == 1212){
					return '商品不存在'
				}else{
					return '商品无法购买'
				}
			}
		},
		methods: {
			// 数量改变事件
			numChange(props) {
				console.log(props);
				this.goodsItem.goods_num = props.value;
				// this.goodsItem.goods_num++;
			},
			// 跳转详情
			goDetail(){
				console.log('前往详情',this.goodsItem.sku_id);
				this.$mRouter.push({
					route: this.$mRoutesConfig.goodsDetail,
					query: {
						spuId: this.goodsItem.spu_id,
						skuId: this.goodsItem.sku_id
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.goods-info{
	    flex: 1;
	    padding: 20upx 0;
		.pic{
		    height: 180upx;
		    width: 180upx;
		    flex-shrink: 0;
			background: #ccc;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.info{
		    margin-left:20upx;
		    flex-direction: column;
		    flex: 1;
			.desc{
			    font-size: 28upx;
			    color: #000;
			    display: -webkit-box;
			    white-space: normal;
			    word-break: break-all;
			    -webkit-box-orient: vertical;
			    -webkit-line-clamp:2;
			    overflow: hidden;
			    text-overflow:ellipsis;
			    height: 80upx;
			    text-align:left;
			}
			.bad-desc{
				color: #999999;
			}
			.type{
				margin-top: 20upx;
			    font-size: 28upx;
				line-height: 40upx;
			    color: #999999;
			    text-align:left;
			}
			.total{
				min-height: 48upx;
				margin-top: 50upx;
				width: 100%;
			    align-items: flex-end;
			    justify-content: space-between;
				.price{
				    color: #DF1222;
				    font-size: 28upx;
				    line-height: 1;
				}
				.bad-price{
					color: #999999;
				}
				.bad-cause{
					color: #DF1222;
					font-size: 28upx;
				}
			}
		}
	}
</style>
