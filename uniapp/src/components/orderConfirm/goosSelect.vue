<template>
    <view class="orderItem-component">
        <view class="orderItem-item vux-1px-b">
            <view class="orderItem-inner">
                <view class="pic lazy-img">
                    <image class="img" :src="orderItemData.goods_img" alt=""></image>
                </view>
                <view class="info">
                    <view class="goods-info">
                        <view class="name">{{orderItemData.goods_name||orderItemData.spu_name}}</view>
                        <view class="standard" v-if="orderItemData.sku_name">规格名称： {{orderItemData.sku_name}}</view>
						<view class="status" v-if="orderItemData.status == 100">等待卖家发货</view>
						<view class="status" v-if="orderItemData.status == 200">等待卖家收货</view>
                    </view>
                    <view class="b">
                        <view class="price">￥{{orderItemData.goods_price}}</view>
                        <view class="num">x{{orderItemData.goods_num}}</view>
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
            orderItemData:{
                type:Object,
                default:function () {
                    return {}
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
	.orderItem-component{
		flex-direction: column;
	}
    .orderItem-item{
        padding: 20upx 24upx 20upx 20upx;
		justify-content: space-around;
		background: #fff !important;
        &:last-child:after{
            content: none;
        }
        .orderItem-inner{
            display: flex;
			flex: 1;
            .pic{
                width: 180upx;
                height: 180upx;
                border-radius: 8upx;
                flex-shrink: 0;
                margin-right: 20upx;
                overflow: hidden;
				background: #F5F5F5;
				
            }
            .info{
                position: relative;
                display: flex;
                flex-grow: 1;
                justify-content: space-between;
				.goods-info{
					flex-direction: column;
				}
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
                    margin-right: 30upx;
                    text-align:left;
                }
                .standard {
                    font-size: 24upx;
                    color: #666;
                    line-height: 34upx;
                    margin-top: 12upx;
                    text-align: left;
                }
				.status{
					color: #DF1222;
					font-size: 24upx;
					margin-top: 20upx;
				}
                .b{
                    display: flex;
                    flex-direction: column;
					align-items: flex-end;
                    .price{
                        font-size: 28upx;
                        color: #333;
                        line-height: 40upx;
                    }
                    .num{
                        margin-top: 10upx;
                        font-size: 28upx;
                        color: #999999;
                        text-align: right;
                        line-height: 36upx;
                    }
                }
                .commission{
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    font-size: 24upx;
                    color: #DF1222;
                }
            }
        }
    }
</style>
