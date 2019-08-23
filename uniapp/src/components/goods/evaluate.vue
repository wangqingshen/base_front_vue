<template>
    <!-- 评论组件 -->
    <view class="evaluate-wrap">
        <view class="header">
            <text class="l">评价({{totalNum}})</text>
            <view class="r" @tap="goRatePage">
                查看全部
                <tui-icon name="arrowright" :color="'#999'" :size="iconSize"></tui-icon>
            </view>
        </view>
        <view class="evaluate-content" v-if="!noData">
            <!-- <view class="evaluate-range">
                <view class="evaluate-range-item" v-for="(item, index) in evaluateRange" :key="index">
                    <view class="range-inner">
                        {{item.label}}({{item.num}})
                    </view>
                </view>
            </view> -->
            <view class="evaluate-list">
                <view class="evaluate-item" v-for="(item, index) in evaluateList" :key="index">
                    <view class="item-content">
                        <view class="item-logo">
                            <image :src="item.member_avatar"/>
                        </view>
                        <view class="item-info">
                            <view class="item-base">
                                <view class="item-star">
                                    <text class="nickName">{{item.member_nick_name}}</text>
                                    <tui-rate :current="item.score" :size="starSize" :hollow="true" normal="#ccc" active="#F5A623" :disabled="true"></tui-rate>
                                </view>
                                <view class="item-date">
                                    {{$mUtils.formatMsgDate(item.current_time, item.create_time)}}
                                </view>
                            </view>
                            <view class="item-desc">
                                {{item.evaluation||'此用户没有填写评价'}}
                            </view>
                        </view>
                    </view>
                    <view class="item-imgs" v-if="item.imgs.length">
                        <view class="item-img" v-for="(img, _index) in item.imgs" :key="_index">
                            <view class="item-img-inner lazy-img" @tap="imagePreviewEvt(item,_index)">
                                <image :src="img" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <noData v-else :imgPath="imgPath" :msg="'暂无相关评论'" ></noData>
    </view>
    
</template>
<script>
    import tuiIcon from "@/components/tui/icon/icon"
    import tuiRate from "@/components/tui/rate/rate"
    import noData from '@/components/noData'
    export default{
        name:'evaluate-item',
        components: {tuiIcon, tuiRate, noData},
        props:{
            spu_id: {
                type: Number
            }
        },
        data(){
            return{
                totalNum: 0,
                evaluateList: [],
                noData: false,
                iconSize: 20,
                starSize: 16,
                imgPath: require('@/static/imgs/default/default_message.png'),
                imgurl: this.$mConfig.imgUrl
            }
        },
        methods:{
            goRatePage(){
                this.$mRouter.push({
					route: this.$mRoutesConfig.evaluateList,
					query: {
						spuId: this.spu_id
					}
				})
            },
            imagePreviewEvt(item, index){
                let imgs = item.imgs
                uni.previewImage({
					current: imgs[index],
					urls: imgs
				})
            },
            getcommentlist(){
                this.$api.goodsEvaluateList({
                    cmd:{goods:"goodsEvaluateList"},
                    data:{
                        spu_id: this.spu_id,
                        page: 1,
                        limit: 2
                    }
                }).then(res=>{
                    if(res.code == 1){
                        console.log(res, 999)
                        let {total, data} = res.data
                        this.totalNum = total || 0
                        this.evaluateList = data || []
                        this.noData = this.totalNum ? false : true
                    }
                }).catch(err=>{
                   
                })
            },
            changeNum(num){
                if(num > 999) return '999+'
                return num
            }
        },
        mounted(){
            this.getcommentlist()
        },
        
        destroyed(){
            
        }
    }
</script>
<style lang="scss" type="text/scss">
.evaluate-wrap{
    width: 100%;
    margin-top: 20upx;
    background: #fff;
    padding: 0 24upx;
    box-sizing: border-box;
    flex-direction: column;
    .header{
        width: 100%;
        height: 80upx;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #EBEBEB;
        .l{
            color: #333;
            font-size: 28upx;
        }
        .r{
            font-size: 24upx;
            align-items: center;
            color: #999;
        }
    }
    .evaluate-content{
        width: 100%; 
        .evaluate-range{
            display: flex;
            padding: 12px 15px;
            align-items: center;
            .evaluate-range-item{
                height: 26px;
                line-height: 26px;
                padding: 0 10px;
                background: #FEEFEF;
                margin-right: 10px;
                .range-inner{
                    font-size: 12px;
                    color: #999;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .evaluate-list{
            width: 100%;
            padding-top: 20upx;
            flex-direction: column;
            .evaluate-item{
                padding: 30upx 0 40upx;
                flex-direction: column;
                &:not(:last-child){
                    border-bottom: 1px solid #EBEBEB;
                }
                .item-content{
                    .item-logo{
                        width: 60upx;
                        height: 60upx;
                        margin-right: 10px;
                        border-radius: 50%;
                        background: #f5f5f5;
                        img{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .item-info{
                        flex-direction: column;
                        flex: 1;
                        .item-base{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 20upx;
                            .item-star{
                                align-items: center;
                                flex: 1;
                                .nickName{
                                    display: -webkit-box;
                                    white-space: normal;
                                    word-break: break-all;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 1;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    font-size: 24upx;
                                    color: #333;
                                    margin-right: 10upx;
                                }
                            }
                            .item-date{
                                font-size: 24upx;
                                color: #ccc;
                            }
                        }
                        .item-desc{
                            padding-right: 100upx;
                            font-size: 24upx;
                            color: #666;
                            line-height: 35upx;
                        }
                    }
                }
                .item-imgs{
                    align-items: center;
                    padding-top: 30upx;
                    .item-img{
                        width: 160upx;
                        height: 160upx;
                        margin-right: 10upx;
                        background: #ccc;
                        .item-img-inner{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
    .no-data, no-data{
        padding: 40upx 0;
    }
}
</style>
