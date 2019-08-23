<template>
    <view class="goodSingle-component">
        <view class="goodSingle-item vux-1px-b" v-for="(item,index) in goodSingle" :key="index">
            <view class="goodSingle-inner">
                <view class="pic lazy-img">
                    <image class="img" :src="item.goods_img" alt=""></image>
                </view>
                <view class="info">
                    <view class="goods-info">
                        <view class="name">{{item.spu_name}}</view>
                        <view class="standard" v-if="item.sku_name">规格名称：{{item.sku_name}} </view>
                    </view>
                </view>
            </view>
        </view>
    </view>

</template>
<script>
    export default{
        name:"orderItem-component",
        props:{
            goodSingle:{
                type:Array,
                default:function () {
                    return []
                }
            },
        },
        data(){
            return{
            }
        }
    }
</script>
<style lang="scss" type="text/scss">
	.goodSingle-component{
		background: #fff;
		flex: 1;
		flex-direction: column;
		.goodSingle-item{
			height: 228upx;
			padding: 24upx;
			.goodSingle-inner{
				.pic{
					flex-grow: 1;
					image{
						width: 180upx;
						height: 180upx;
						border: none;
						background: #F5F5F5;
					}
					/deep/.img{
						width: 180upx;
						height: 180upx;
						border: none;
						background: #F5F5F5;
						
					}
				}
				.info{
					margin-left: 20upx;
					.goods-info{
						flex-direction: column;
						.name{
							font-size: 28upx;
							color: #333;
							display: -webkit-box;
							white-space: normal;
							word-break: break-all;
							overflow: hidden;
							text-overflow:ellipsis;
							-webkit-box-orient: vertical;
							-webkit-line-clamp:2;
							max-height: 80upx;
							margin-right: 44upx;
						}
						.standard{
							font-size: 24upx;
							color: #666666;
							margin-top:20upx; 
						}
						
					}
				}
			}
		}
	}
</style>
