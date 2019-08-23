<template>
    <!-- 商品item -->
    <view class="goods-inner-list">
        <view class="goodsList" :class="isSwitch?'switch': ''">
            <view class="good-item" v-for="(item, index) in goodsList" :key="index" @tap="goGoodDetailsPage(item.spu_id, item.sku_id)" :class="isSwitch?'switch': ''">
                <view class="good-item-inner" :class="!isSeller?'border': ''">
                    <view class="good-pic lazy-img">
                        <image :src="item.goods_img"/>
                    </view>
                    <view class="good-info">
                        <view class="info-t">
                            <!-- <span class="good-label" v-if="item.store_goods_type == 1"><img src="../assets/images/icons/label_ziying@2x.png" /></span> -->
                            {{item.goods_name}}
                        </view>
                        <view class="info-c-switch" v-if="isSwitch">
                            <view class="info-basic">
                                <view class="price">¥ {{item.goods_price}}</view>
                                <view class="info-basic-tags">
                                    <view class="tags" v-for="(labelItem, index) in item.label_info" :key="index" :class="index > 0 ? 'active' : ''">
                                        <img :src="labelItem.label_icon" />
                                    </view>
                                </view>
                                <view class="info-b">
                                    <!-- <view class="seller">{{item.seller}}</view> -->
                                    <p class="num">销量 {{item.sell_num || 0}}</p>
                                </view>
                            </view>
                            <!-- <view class="own-set">
                                    <view class="inner" v-if="isSeller">
                                        <view class="sell-commission">
                                            <p>佣金比例：{{item.commission_rate+'%'}}</p>
                                            <p>佣金：{{'￥'+Number(item.commission_rate)*Number(item.goods_price)/100}}</p>
                                        </view>
                                    </view>
                            </view> -->
                        </view>
                        <view class="info-c" v-else>
                            <view class="info-basic">
                                <view class="tags" v-for="(labelItem, index) in item.label_info" :key="index" :class="index > 0 ? 'active' : ''">
                                    <img :src="labelItem.label_icon" />
                                </view>
                            </view>
                            <view class="info-b">
                                <view class="price">¥ {{item.goods_price}}</view>
                                <p class="num">销量 {{item.sell_num || 0}}</p>
                            </view>
                            <!-- <view class="sell-product" v-if="isSeller">
                                <view class="sell-commission">
                                    <p>佣金比例：{{item.commission_rate+'%'}}</p>
                                    <p>佣金：{{'￥'+Number(item.commission_rate)*Number(item.goods_price)/100}}</p>
                                </view>
                                <view class="own-set" @click.stop="ownSetEvt(item)">
                                    <img src="../assets/images/icons/own_cancel.png" v-if="item.is_private_goods">
                                    <img src="../assets/images/icons/own_set.png" v-else>
                                    <p v-if="!item.is_private_goods">设为自有商品</p>
                                    <p v-else>取消自有商品</p>
                                </view>
                            </view> -->
                        </view>
                    </view>
                </view>  
                <!-- <view class="sell-product" v-if="isSeller && isSwitch">
                    
                    <view class="own-set" @click.stop="ownSetEvt(item)">
                        <img src="../assets/images/icons/own_cancel.png" v-if="item.is_private_goods">
                        <img src="../assets/images/icons/own_set.png" v-else>
                        <p v-if="!item.is_private_goods">设为自有商品</p>
                        <p v-else>取消自有商品</p>
                    </view>
                </view>   -->
            </view>
        </view>
        <!-- <NoMore :finished="finished"></NoMore>   
        <NoData :imgPath="noDataImg" :msg="noDataTxt" v-show="!goodsList.length"></NoData> -->
    </view>    
</template>
<script>
    // import NoMore from '@/components/NoMore.vue'
    // import NoData from '@/components/NoData.vue'
    export default{
        name:"good-component",
        components: {},
        props:{
            isSwitch: {
                type: Boolean
            },
            queryData: {
                type: Object
            },
            isSeller: {
                type: Boolean
            }
        },
        data(){
            return{
                noDataImg: require('@/static/imgs/default/default_goods.png'),
                noDataTxt: '暂未发现相关商品',
                finished: false,
                page: 1,
                pageNum: 10,
                goodsList: [],
                imgurl: this.$mConfig.imgUrl
            }
        },
        computed: {
            
        },
        methods: {
            getList({page = 1, finished=false, refresh=false}={}){
                this.page = page
                this.finished = finished
                this.queryData.page = page
                this.queryData.goods_lable = this.$store.state.filterSearch.goods_label
                this.queryData.price_between = this.$store.state.filterSearch.price_between
                let index = this.$store.state.filterSearch.sort_type,
					sort = this.$store.state.filterSearch.sort_val ? 1 : 2
				this.queryData.pv = this.queryData.sold = this.queryData.price = ''
				if(index == 0) {// 人气
					this.queryData.pv = sort
				}else if(index == 1) {//销量
					this.queryData.sold = sort
				}else if(index == 2) {//价格
					this.queryData.price = sort
				}
                //向后台发数据
                this.$api.goodList({
                    cmd: {
                        goods: 'lists'
                    },
                    data: this.queryData
                }).then(res => {
                    console.log(res)
                    //响应成功
                    if(res.code === 1){
                        //返回数据和现有数据合并
                        this.goodsList = page == 1 ? res.data : [...this.goodsList,...res.data]
                        //返回空数据
                        if(res.data.length < this.pageNum ){
                            this.finished = true
                        }
                        if(this.goodsList.length) {
                            this.$emit('emitMore', {page: page, finished: this.finished})
                        }else{
                            this.$emit('emitNoData')
                        }
                        if(refresh) {
                            setTimeout(() => {
                                uni.stopPullDownRefresh()
                                this.$mUtils.toast('刷新成功')
							}, 300)
                        }
                    }else{
                        this.$mUtils.toast(res.msg)
                        if(refresh) uni.stopPullDownRefresh()
                    }
                    
                });
            },

            goGoodDetailsPage(spuId, skuId){
				this.$mRouter.push({
                    route: this.$mRoutesConfig.goodsDetail,
					query: {spuId: spuId, skuId: skuId}
                })
            }

        },

        watch: {
            queryData(){
                // this.getList({page: 1, finished: false})
            },
        },

        created(){
            // this.getList({page: 1, finished: false})
        }
    }
</script>
<style lang="scss" type="text/scss">
    .goods-inner-list{
        width: 100%;
        height: 100%;
    }
    .goodsList{
        width: 100%;
        padding: 0 20upx;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .good-item {
            width: 50%;
            margin-top: 20upx;
            padding-right: 10upx;
            box-sizing: border-box;
            .good-item-inner{
                width: 100%;
                flex-direction: column;
                background: #fff;
                // border-radius: 6px;
                .good-pic{
                    // width: 100%;
                    height: 340upx;
                    overflow: hidden;
                    // border-top-right-radius: 6px; 
                    // border-top-left-radius: 6px; 
                    background: #999;
                }
                .good-info {
                    display: block;
                    padding: 20upx;
                    box-sizing: border-box;
                    text-align: left;
                    .info-t {
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
                        color: #333;
                        .good-label {
                            display: inline-block;
                            width: 52upx;
                            height: 100%;
                            margin-right: 8upx;
                            img{
                                width: 100%;
                                height: 24upx;
                                vertical-align: baseline;
                            }
                        }
                    }
                    .info-c {
                        display: block;
                        .info-basic{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            height: 24upx;
                            margin: 20upx 0 6upx;
                            .tags{
                                margin-right: 10upx;
                                img{
                                    width: 40upx;
                                    // height: 10px;
                                }
                            }
                        }
                        .info-b {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .price {
                                font-size: 32upx;
                                color:$site-default-color;
                            }
                            .num{
                                font-size: 24upx;
                                color: #999;
                                transform: scale(0.9);
                                transform-origin: right;
                            }
                        }
                        // .sell-product{
                        //     .sell-commission{
                        //         padding: 20upx 0 10upx 0;
                        //         p{
                        //             font-size: 24upx;
                        //             line-height: 32upx;
                        //             color: #999;
                        //             &:first-child{
                        //                 color: $site-default-color;
                        //             }
                        //         }
                        //     }
                        //     .own-set{
                        //         padding-top: 10px;
                        //         border-top: 1px solid #EBEBEB;
                        //         display: flex;
                        //         justify-content: center;
                        //         align-items: center;
                        //         user-select: none;
                        //         img{
                        //             width: 15px;
                        //             height: 15px;
                        //         }
                        //         p{
                        //             margin-left: 5px;
                        //             font-size: 14px;
                        //             line-height: 14px;
                        //             color: #333;
                        //         }
                        //     }
                        // }
                    }
                }
            }
            &:nth-child(2n){
                padding-right: 0;
                padding-left: 10upx;
            }
            &.switch{
                width: 100%;
                padding: 0;
                margin: 0;
                .good-item-inner{
                    display: flex;
                    flex-direction: inherit;
                    justify-content: center;
                    width: 100%;
                    padding: 20upx 30upx;
                    box-sizing: border-box;
                    border-radius: 0;
                    &.border{
                        border-bottom: 1px solid #f5f5f5;
                    }
                    .good-pic{
                        width: 280upx;
                        height: 280upx;
                        border-radius: 12upx;
                    }
                    .good-info{
                        width: calc(100% - 280upx);
                        padding: 0;
                        margin-left: 20upx;
                        display: flex;
                        flex-direction: column;
                        .info-t {
                            // flex: 1;
                            -webkit-line-clamp: 2;
                            
                        }
                        .info-c-switch {
                            display: flex;
                            flex-direction: column;
                            flex: 1;
                            // flex: 4;
                            .info-basic {
                                flex: 1;
                                display: flex;
                                align-items: flex-end;
                                justify-content: space-between;
                                .price{
                                    font-size: 36upx;
                                    line-height: 32upx;
                                    letter-spacing: -1px;
                                    color: $site-default-color;
                                }
                                .info-basic-tags{
                                    display: flex;
                                    justify-content: flex-start;
                                    align-items: center;
                                    height: 24upx;
                                    margin: 16upx 0 36upx;
                                    .tags{
                                        margin-right: 10upx;
                                        img{
                                            width: 40upx;
                                            // height: 10px;
                                        }
                                    }
                                }
                            }
                            .info-b {
                                // margin-top: 40px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                .seller, .num {
                                    display: -webkit-box;
                                    white-space: normal;
                                    word-break: break-all;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 1;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    font-size: 24upx;
                                    transform: scale(0.9);
                                    transform-origin: right;
                                    color: #999;
                                }
                            }
                            // .own-set{
                            //     width: 100%;
                            //     height: 20px;
                            //     .inner{
                            //         width: 100%;
                            //         height: 100%;
                            //         .sell-commission{
                            //             display: flex;
                            //             height: 100%;
                            //             justify-content: space-between;
                            //             align-items: flex-end;
                            //             font-size: 12px;
                            //             color: #999;
                            //             p:first-child{
                            //                 color:#DF1222;
                            //             }
                            //         }
                            //     }
                            // }
                        }
                    }
                }
                // .sell-product{
                //     background: #fff;
                //     .own-set{
                //         width: 100%;
                //         height: 45px;
                //         border-top: 1px solid #EBEBEB;
                //         border-bottom: 1px solid #EBEBEB;
                //         display: flex;
                //         justify-content: center;
                //         align-items: center;
                //         user-select: none;
                //         img{
                //             width: 15px;
                //             height: 15px;
                //         }
                //         p{
                //             margin-left: 5px;
                //             font-size: 14px;
                //             line-height: 14px;
                //             color: #333;
                //         }
                //     }
                // }
            }
        }
        &.switch{
            padding: 0;
        }
    }

</style>
