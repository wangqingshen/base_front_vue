<template>
    <view class="goodWrap">
        <view class="goodNormalList" :class="val.sizeType == 0 ? 'big' : val.sizeType == 1 ? 'normal':'small'" v-if="val.layoutType != 1">
            <view class="good-item" v-for="(item, index) in list" :key="index" @click="goDetail(item.spu_id, item.sku_id)" :class="val.sizeType == 0 ? 'big' : val.sizeType == 1 ? 'normal':'small'">
                <view class="good-item-inner">
                    <view class="good-img lazy-img">
                        <image :src="item.goods_img"></image>
                    </view>
                    <view class="good-info">
                        <text class="good-name" v-if="val.titleRadio">{{item.goods_name}}</text>
                        <view class="good-price">
                            <text class="price">￥{{item.spu_min_cost_price}}</text>
                            <!-- <text class="market-price">市场价：<em>￥{{item.spu_min_market_price}}</em></text> -->
                        </view>
                        <view class="good-basic">
                            <text v-if="val.stockRadio">库存：{{item.spu_goods_stock}}</text>
                            <text v-if="val.sellRadio">销量：{{item.spu_sell_num}}</text>
                        </view>
                    </view>
                </view>
            </view> 
        </view>
        <view class="goodSliderList" v-else>
            <swiper :touchable=true :show-indicators=false :loop=false >
                <swiper-item v-for="(item,index) in list" :key="index">
                    <view class="good-img lazy-img">
                        <image :src="item.goods_img" ></image>
                    </view>
                    <text class="good-name" v-if="val.titleRadio">{{item.goods_name}}</text>
                    <view class="good-price">
                        <text class="price">￥{{item.spu_min_cost_price}}</text>
                        <text v-show="false" class="market-price"><em>￥{{item.spu_min_market_price}}</em></text>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
export default {
    props: ['val', 'type'],
    data () {
        return {
            list: [],
            imgurl: this.type == 0 ? this.$mConfig.imgUrl : ''
        }
    },
    methods: {
        goDetail(id, sku_id){
            this.$mRouter.push({
                route: this.$mRoutesConfig.goodsDetail,
				query: {spuId: id, skuId: sku_id}
            })
        },
        getList(){
            console.log(this.val, 456)
            this.$api.getgoodsbypage({
                cmd:{
                    shop:"getgoodsbypage"
                },
                data:{
                    'memeber_id': 0,
                    'is_platform_recommend': this.val.moduleType,
                    limit: this.val.goodsNum,
                    page: 1
                }
            }).then(res=>{
                if(res.code == 1){
                    console.log(res)
                    this.list = res.data.data
                }
            }).catch(res=>{})
        }
        
    },
    created(){
        this.getList()
    }
}
</script>


<style lang="scss">
.goodWrap{
    position: relative;
    .goodNormalList{
		display: block;
        clear: both;
        overflow: hidden;
        width: 100%;
        .good-item{
			display: block;
            box-sizing: border-box;
			.good-img{
                position: relative;
                image{
                    position: absolute;
                }
			    &:after{
			        padding-top: 100%;
			        display: block;
			        content: '';
			    }   
			}
            .good-item-inner{
				flex-direction: column;
                background: #fff;
            }
            &.big{
                width: 100%;
            }
            &.normal{
                width: 50%;  
                float: left;
                padding-right: 5upx;
                margin-top: 10upx;
                &:nth-child(2n){
                    padding-left: 5upx;
                    padding-right: 0;
                }
                .good-item-inner{
                    border-right: 2upx solid #eee;
                    border-bottom: 2upx solid #eee;
                    // .good-img{
                    //     height: 170px;
                    //     overflow: hidden;
                    // }
                }  
            }
            &.small{
                width: 100%;
                .good-item-inner{
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 2upx solid #eee;
                    // align-items: center;
                    .good-img, .good-info{
                        width: 50%;
                    }
                    .good-info{
                        padding: 40upx 20upx;
                    }
                }   
            }

            .good-info{
				flex-direction: column;
                padding: 20upx;
                box-sizing: border-box;
                text-align: left;
                .good-name{
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 28upx;
                    height: 80upx;
                    line-height: 40upx;
                    color: #666;
                    margin-bottom: 10upx;
                }
                .good-basic{
                    justify-content: space-between;
                    color: #999;
                    font-size: 24upx;
                    >span{
                        display: inline-block;
                        transform: scale(0.9);
                        &:nth-child(1){
                            transform-origin: left;
                        }
                        &:nth-child(2){
                            transform-origin: right;
                        }
                    }
                }
                .good-price{
                    margin-bottom: 10upx;
                    .price {
                        display: block;
                        margin-bottom: 0;
                        font-size: 34upx;
                        color: #F32D16;
                    }
                    .market-price{
                        display: inline-block;
                        transform: scale(0.9);
                        transform-origin: left;
                        font-size: 24upx;
                        color: #999;
                        em{
                            display: inline-block;
                            text-decoration: line-through;
                        }
                    }
                }
            }
        }
        &.normal{
            padding: 0 20upx;
        }
    }
    .goodSliderList{
        .van-swipe{
            padding: 0 10upx;
            background-color: #fff;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            overflow: hidden;
        }
        .van-swipe-item{
            width: 180upx!important;
            padding: 20upx 10upx;
            text-align: center;
            .good-img{
                margin-bottom: 20upx;
                &:after{
	        		padding-top: 100%;
				    display: block;
				    content: '';
	        	}
            }
            .good-name{
                display: -webkit-box;
                white-space: normal;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 14upx;
                height: 80upx;
                line-height: 40upx;
                color: #666;
                margin-bottom: 10upx;
            }
            .good-price{
                margin-bottom: 10upx;
                .price {
                    margin-bottom: -10upx;
                    font-size: 28upx;
                    color: #F32D16;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .market-price{
                    display: inline-block;
                    transform: scale(0.9);
                    transform-origin: center;
                    font-size: 24upx;
                    color: #999;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    em{
                        display: inline-block;
                        text-decoration: line-through;
                    }
                }
            }
        }
        
    }
}
</style>

