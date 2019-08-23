<template>
    <view class="publish-wrapper container">
        <view class="rate-items">
            <view class="rate-item" v-for="(item, index) in rateList" :key="index">
                <view class="rate-header">
                    <view class="good-img lazy-img">
                        <image :src="goods_img[index]" ></image>
                    </view>
                    <view class="rate-info">
                        <text class="label">描述相符</text>
                        <tui-rate class="evaluate-rate" :current="item.score" :curIndex="index" :size="starSize" :hollow="true" normal="#ccc" active="#F5A623" :disabled="type == 2" @change="rateChange"></tui-rate>
                        <text class="star-desc">
                            {{$mUtils.rateInfo(item.score)}}
                        </text> 
                    </view>
                </view>
                <view class="rate-center">
                    <!-- <view class="rate-date" v-if="type == 2">
                        {{$mUtils.formatMsgDate(0, item.create_time)}}
                    </view> -->
                    <view class="rate-msg">
                        <textarea v-model="item.evaluation" placeholder-class="phcolor" placeholder="宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧" maxlength="150" :disabled="type == 2"></textarea>
                    </view>
                    <!-- 上传图片 -->
                    <view class="upload-pic" v-if="!(type == 2 && !item.show_imgs.length)">
                        <view class="upload-inner">
                            <upload :lists="item.show_imgs" :index="index" @emitUpload="emitUpload"/>
                            <view class="img-item" v-for="(_item, _index) in item.show_imgs" :key="_index">
                                <image :src="_item" :data-index="_index" :data-parent="index" @tap="previewImage"></image>
                                <tui-icon color="#333" :size="delSize" name="close-fill" class="tui-upload-del" :index="index" v-if="type==1" @tap="removeImg(index, _index)"></tui-icon>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            
            <view class="rate-footer" v-if="type == 1">
                <view class="refer-btn" @click="publishEvt" hover-class="opcity" :hover-stay-time="hoverStayTime">发布</view>
            </view>
        </view>
    </view>
</template>

<script>
    import upload from "@/components/upload/index"
    import tuiRate from "@/components/tui/rate/rate"
    import tuiIcon from "@/components/tui/icon/icon"
    export default {
        name: 'publish',
        components: {tuiRate, tuiIcon, upload},
        data(){
            return {
                order_id: '',
                store_id: 0,
                type: 1,
                queryData: {
                    member_id: '',
                    order_id: '',
                    store_id: 0,
                    evaluation: []
                },
                rateList: [],
                goods_img: [],
                starSize: 28,
                delSize: 16,
                hoverStayTime: 150
            }
        },
        computed: {
            
        },
        methods: {
            showcommentlists(){
                this.$api.evaluation({
                    cmd: {
                        order: 'evaluation'
                    },
                    data: {order_id: this.order_id}
                }).then(res => {
                    console.log(res)
                    if(res.code == 1){
                        let list = res.data
                        list.map(item=>{
                            let o = {
                                score: 5,
                                evaluation: '',
                                imgs: [],
                                show_imgs: [],
                                id: item.id
                            }
                            this.goods_img.push(item.goods_img)
                            this.rateList.push(o)
                        })
                    }
                }).catch(res=>{

                })
            },
            getEvaluationdetail(){
                this.$api.evaluationdetail({
                    cmd: {
                        order: 'evaluationdetail'
                    },
                    data: {order_id: this.order_id}
                }).then(res => {
                    if(res.code == 1) {
                        console.log(res)
                        this.rateList = res.data
                        this.rateList.map(item=>{
                            this.goods_img.push(item.goods_img)
                            item.show_imgs = item.imgs
                            item.evaluation = item.evaluation || '此用户没有填写评价'
                        })
                    }
                }).catch(res => {

                })
            },
			previewImage(e) {
                let index = e.currentTarget.dataset.index,
                    _index = e.currentTarget.dataset.parent,
					urls = JSON.parse(JSON.stringify(this.rateList[_index].show_imgs))
				uni.previewImage({
					current: index, // 当前显示图片的http链接
					urls: urls // 需要预览的图片http链接列表
				})
			},
            removeImg(index, _index){
                this.rateList[index].show_imgs.splice(_index,1)
                this.rateList[index].imgs.splice(_index,1)
            },

            rateChange(curRate){
                 this.rateList[curRate.curIndex].score = curRate.index
            },

            emitUpload(res){
                this.rateList[res.index].show_imgs.push(res.showPath)
                this.rateList[res.index].imgs.push(res.path)
            },
            
            publishEvt(){
                uni.showLoading({
                    mask: true,
                    title: '发表中'
                })
                this.queryData.member_id = this.$store.state.userInfo.member_id
                this.queryData.store_id = this.store_id
                this.queryData.order_id = this.order_id
                this.queryData.evaluation = this.rateList.map((item, index)=>{
                    return {
                        id: item.id,
                        score: item.score,
                        evaluation: item.evaluation,
                        imgs: item.imgs
                    }
                })
                this.$api.evaluationpost({
                    cmd: {
                        order: 'evaluationpost'
                    },
                    data: this.queryData
                }).then(res => {
                    console.log(res)
                    uni.hideLoading()
                    if(res.code == 1){
                        this.$mUtils.toast('发表成功')
                        this.$mRouter.push({route:this.$mRoutesConfig.orderList,query:{status:0}})
                    }else{
                        this.$mUtils.toast(res.msg)
                    }
                }).catch(res=>{

                })
            }
        },
        onLoad(options){
            this.type = options.type || 1
            this.order_id = options.orderId || 0
            this.store_id = options.storeId
            this.type == 1 ? this.showcommentlists() : this.getEvaluationdetail()
            if(this.type == 2) {
                uni.setNavigationBarTitle({
                    title: '评论详情'
                })
            }
        },
        created(){
        //    this.order_id = this.$route.params.order_id
        //    this.type = this.$route.params.type
        //    this.$share.api()
        //    this.showcommentlists() 
        },
        destroyed(){
            
        }
    }
</script>

<style lang="scss" type="text/scss">
    .publish-wrapper{
        .rate-items{
            flex-direction: column;
            width: 100%;
            height: 100%;
            .rate-item{
                flex-direction: column;
                margin-bottom: 30upx;
            }
            .rate-header{
                align-items: center;
                width: 100%;
                height: 100upx;
                padding: 0 24upx;
                background: #fff;
                border-bottom: 1px solid #EDEDED;
                .good-img{
                    width: 72upx;
                    height: 72upx;
                    margin-right: 20upx;
                    background: #f0f0f0;
                }
                .rate-info{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex: 1;
                    font-size: 28upx;
                    .label{
                        color: #333;
                    }
                    .star-desc{
                        width: 90upx;
                        color: #999;
                        text-align: right;
                    }
                }
            }
            .rate-center{
                width: 100%;
                padding: 0 24upx;
                background: #fff;
                flex-direction: column;
                .rate-date{
                    padding: 20upx 20upx 10upx;
                    font-size: 28upx;
                }
                .rate-msg{
                    textarea{
                        padding: 20upx 20upx 60upx;
                        line-height: 40upx;
                        width:100%;
                        min-height: 240upx;
                    }
                    &:after{
                        border: 0;
                    }
                }
                .upload-pic{
                display: flex;
                background: #FFF;
                width: 100%;
                padding-bottom: 60upx;
                .upload-inner{
                    display: -webkit-box;
                    align-items: center;
                    // justify-content: space-between;
                    width: 100%;
                    .img-item {
                        width:128upx;
                        height: 128upx;
                        background-color: #d8d8d8;
                        margin-left: 20upx;
                        position: relative;
                        .tui-upload-del {
                            position: absolute;
                            top: 0;
                            right: 0;
                        }
                    }
                }
            }
            
            }
            .rate-footer{
                width: 100%;
                padding: 80upx 24upx 60upx;
                .refer-btn{
                    height: 88upx;
                    width: 100%;
                    background: $site-default-color;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #FFF;
                    font-size: 38upx;
                    border-radius: 10upx;
                } 
            }   
        }
    }
</style>
