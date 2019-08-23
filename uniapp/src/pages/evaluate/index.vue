<template>
    <view class="rate-wrapper container">
        <view class="content">
            <view class="evaluate-bar">
				<view class="items">
					<view class="item" v-for="(item, index) in tabs" :key="index" :class="[tabIndex == index?'active':'']"
					@tap="changeTab" :data-index="index" :data-id="item.id">
						<view class="txt">{{item.name}}</view>
					</view>
				</view>
			</view>
            <view class="evaluate-list"  v-if="!noData">
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
                <!--加载loadding-->
                <tui-loadmore :visible="loadding" :index="loadingType" type="red"></tui-loadmore>
                <tui-nomore :visible="finished" bgcolor="#f7f7f7"></tui-nomore>
                <!--加载loadding-->
            </view>
            <noData v-else :imgPath="imgPath" :msg="'暂无相关评论'" ></noData>
        </view>
    </view>
</template>

<script>
    import tuiIcon from "@/components/tui/icon/icon"
    import tuiRate from "@/components/tui/rate/rate"
    import noData from '@/components/noData'
    import tuiLoadmore from "@/components/tui/loadmore/loadmore"
	import tuiNomore from "@/components/tui/nomore/nomore"
    export default {
        name: 'rate',
        data(){
            return {
                tabIndex: 0,
                tabs: [{id: '', name: '全部'},{id: '4,5', name: '好评'},{id: '2,3', name: '中评'},{id: '1', name: '差评'}],
                finished: false,
				loadding: false,
				pullUpOn: true,
				loadingType: 3,
                page:1,
                noData:true,
                queryData: {
                    page: 1,
                    limit: 10,
                    spu_id: '',
                    score: ''
                },
                evaluateList: [],
                iconSize: 20,
                starSize: 16,
                imgPath: require('@/static/imgs/default/default_message.png')
            }
        },
        computed: {
            
        },
        components: {tuiIcon, tuiRate, noData, tuiLoadmore, tuiNomore},
        methods: {
            imagePreviewEvt(item, index){
                let imgs = item.imgs
                uni.previewImage({
					current: imgs[index],
					urls: imgs
				})
            },

            changeTab(e){
                let index = e.currentTarget.dataset.index,
                    id = e.currentTarget.dataset.id
				if(this.tabIndex == index) return
				this.tabIndex = index
                this.queryData.score = id
                this.getList()
            },

            getList(page){
                //向后台发数据
                this.$api.goodsEvaluateList({
                    cmd: {
                        goods: 'goodsEvaluateList'
                    },
                    data: this.queryData
                }).then(res => {
                    console.log(res)
                    //响应成功
                    if(res.code === 1){
                        let {total, data} = res.data
                        //返回数据和现有数据合并
                        this.evaluateList = this.page == 1 ? data : [...this.evaluateList,...data]
                        if(data.length < 10 ){
                            this.finished = true
                        }
                        if(this.evaluateList.length == 0){
                            this.noData = true
                            this.pullUpOn = this.loadding = false
                        }else{
                            this.noData = false
                        }
                        if (page === 1) {
							setTimeout(() => {
                                uni.stopPullDownRefresh()
                                this.$mUtils.toast('刷新成功')
							}, 300)
						}
                    }else{
                        this.$mUtils.toast(res.msg)
                        if(page === 1)  uni.stopPullDownRefresh()    
                    }
                    
                })
            }
        },
        onPullDownRefresh() {
            this.page = 1;
			this.pullUpOn = true;
            this.loadding = false;
            this.getList(1);
		},
		onReachBottom() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.finished) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				this.getList({page: this.page+1, finished: false})
			}
		},
        onLoad(options){
            this.queryData.spu_id = options.spuId || 0
            this.getList()
        },
        // created(){
        //     this.queryData.spu_id = this.$route.params.spu_id
        //     this.getList(1)
        // },
        // destroyed(){
        //     if(this.imagePreview != '') this.imagePreview.close()   
        // }
    }
</script>

<style lang="scss" type="text/scss">
    .rate-wrapper{
        .content{
            flex-direction: column;
            flex: 1;
            .evaluate-bar{
                width: 100%;
				height: 80upx;
				justify-content: center;
				.items{
					width: 100%;
					height: 100%;
                    background: #fff;
					.item{
						flex: 1;
						height: 100%;
						justify-content: center;
						.txt{
							height: 100%;
							align-items: center;
							font-size: 26upx;
							color: #333;
						}
						&.active{
							.txt{
								color: $site-default-color;
								border-bottom: 4upx solid $site-default-color;
							}
							
						}
					}
				}
            }
            .evaluate-list{
                width: 100%;
                // padding-top: 20upx;
                flex-direction: column;
                // margin-top: 80upx;
                .evaluate-item{
                    background: #fff;
                    padding: 30upx 24upx 40upx;
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
            no-data{
                height: calc(100% - 80upx);
            }
            // .no-data{
            //     height: calc(100% - 80upx);
            // }
        }
    }
</style>
