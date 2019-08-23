<template>
    <view class="container category">
        <!-- 搜索 -->
        <view class="searchbox">
            <view class="search-input" @tap="search">
                <tui-icon type="search" name="search" :size='size' color='#999'></tui-icon>
                <text class="search-txt">搜索商城商品</text>
            </view>
        </view>
        <!-- 分类 -->
        <scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop" :style="{height:height+'px'}">
			<view v-for="(item,index) in tabbar" :key="index" class="tab-bar-item" :class="[currentTab==index ? 'active' : '']"
			 :data-current="index" @tap.stop="swichNav">
				<text>{{item.gc_name}}</text>
			</view>
		</scroll-view>
        <scroll-view scroll-y class="right-box" :style="{height:height+'px'}">
            <view class="page-view">
                <view class="class-box">
                    <view class="class-item" v-for="(item, index) in categoryLevel" :key="index">
                        <view class="class-name">
                            <text>{{item.gc_name}}</text>
                            <view class="class-all" :data-id="item.gc_id" :data-name="item.gc_name" :data-level="item.gc_level" @tap.stop="productList">查看所有<tui-icon name="arrowright" :size='size' color='#999'></tui-icon></view>
                        </view>
                        <view class="g-container">
                            <view class="g-box" v-for="(child_item, index) in item.next_level" :data-id="child_item.gc_id" :data-name="child_item.gc_name" :data-level="child_item.gc_level" :key="index" @tap.stop="productList">
                                <image :src="child_item.gc_img" class="g-image" />
								<view class="g-title">{{child_item.gc_name}}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- #ifdef MP-WEIXIN -->
		<authorizePopup ref="authorize"></authorizePopup>
		<!-- #endif -->
        <!-- <sellIcon v-if="isSeller" :type="1" :distributionCode="distributionCode"/> -->
    </view>
</template>

<script>
    import tuiIcon from "@/components/tui/icon/icon"
    // import sellIcon from '@/components/sellIcon'
    export default {
        name: 'category',
        data(){
            return {
                tabbar: [],
                size: 18,
                height: 0, //scroll-view高度
				currentTab: 0, //预设当前项的值
				scrollTop: 0, //tab标题的滚动条位置
                categoryLevel: [],
                isSeller: false,
                distributionCode: '',
                userInfo: {}
            }
        },
        components:{
            tuiIcon
            // TabBar,
            // sellIcon
        },
        methods:{
            swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				if (this.currentTab == cur) {
					return false;
				} else {
                    this.currentTab = cur;
                    this.categoryLevel = this.tabbar[cur].next_level;
                    console.log(this.categoryLevel)
                    // this.$store.commit('SET_CLASSIFY_TYPE',index)
					this.checkCor();
				}
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				let that = this;
				//这里计算按照实际情况进行修改，动态数据要进行动态分析
				//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
				//数据很多可以多次if判断然后进行滚动距离计算即可
				if (that.currentTab > 7) {
					that.scrollTop = 500
				} else {
					that.scrollTop = 0
				}
			},
            checkIsSeller(){
				if(this.userInfo.member_id) {
					this.$api.sellerInfoApi({
						cmd:{seller:'sellerInfo'},
						data:{
							member_id: this.userInfo.member_id
						}
					}).then(res=>{
						console.log(res, 'seller')
						if(res.code == 1){
							if(res.data.length || Object.keys(res.data).length){
								this.isSeller = res.data.status == 1 ? true : false
								this.distributionCode = res.data.distribution_code
							}else{
								this.isSeller = false
                            }
                            if(this.$parent.isWx) this.shareInfo()
						}
					}).catch(res=>{})
				}else if(this.$parent.isWx){
                    this.shareInfo()
                }
            },
            shareInfo(){
                let shareData = {}
                if(this.distributionCode){
                    shareData.linkName = `/category?distribution_code=${this.distributionCode}`
                }else{
                    shareData.linkName = `/category`
                }
                shareData.desc = '掐指一算，这里有很多商品值得购买，进来看一看'
                shareData.title = '我在中华园林机械网上发现许多好东西，赶紧来看看'
                shareData.imgUrl = ''
                this.$share.api(shareData)
            },
            search(){
                this.$mRouter.push({
                    route: this.$mRoutesConfig.search,
					query: {}
                })
            },
            productList(e) {
                let data = {},
                    gc_name = e.currentTarget.dataset.name,
                    gc_level = e.currentTarget.dataset.level,
                    gc_id = e.currentTarget.dataset.id
                this.$set(data, 'sort_type', 0)
                this.$set(data, 'sort_val', false)
                this.$set(data, 'price_between', [])
                this.$set(data, 'goods_label', [])
                this.$set(data, 'gc_id_type', gc_level)
                this.$set(data, 'gc_id_value', gc_id)
                this.$set(data, 'search_gc_name', gc_name)
                this.$store.commit('SET_FILTERSEARCH',data)
                this.$mRouter.push({
                    route: this.$mRoutesConfig.goodsList,
					query: {}
                })
			},
            categoryInfo(){
                //分类信息接口
                this.$api.classInfo({
                    cmd:{"goods":"classInfo"},
                    data:{type: 1}
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
                        this.tabbar = res.data;
                        this.categoryLevel = this.tabbar[this.currentTab].next_level
                    }
                }).catch(err=>{

                })
            }
        },
        //页面相关事件处理函数--监听用户下拉动作
        onPullDownRefresh: function() {
            //延时为了看效果
            this.categoryInfo()
            setTimeout(() => {
                uni.stopPullDownRefresh()
                uni.showToast({
                    title: '刷新成功',
                    icon:  'none',
                    duration: 1500
                })
            }, 1000)
        },
        onLoad: function(options) {
			uni.getSystemInfo({
				success: (res) => {
					this.height = res.windowHeight - uni.upx2px(92)
				}
            });
            this.userInfo = this.$store.state.userInfo
            // this.checkIsSeller()
            this.categoryInfo()

        },
        onShow(){
            // #ifdef MP-WEIXIN
			this.$refs.authorize.checkIsAuthorize()
			// #endif
        }
    }
</script>

<style lang="scss">
    page {
		background: #fcfcfc;
    }
    /* 隐藏scroll-view滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
    .category{
        .searchbox{
            height: 92upx;
            width: 100%;
            background: #f2f2f2;
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
            padding: 0 20upx;
            box-sizing: border-box;
            &:after{
                // content: '';
                // position: absolute;
                // border-bottom: 1upx solid #d2d2d2;
                // -webkit-transform: scaleY(0.5);
                // transform: scaleY(0.5);
                // bottom: 0;
                // right: 0;
                // left: 0;
            }
            .search-input{
                width: 100%;
                height: 60upx;
                padding: 0 30upx;
                background: #FFF;
                border-radius: 30upx;
                display: flex;
                align-items: center;
                color: #999;
                font-size: 26upx;
                box-sizing: border-box;
                .search-txt{
                    margin-left: 20upx;
                }
            }
        }
        .tab-view {
            /* height: 100%; */
            width: 200upx;
            position: fixed;
            left: 0;
            top: 92upx;
            z-index: 10;
            background: #f4f4f4;
            .tab-bar-item {
                width: 200upx;
                min-height: 110upx;                
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 26upx;
                color: #353535;
                font-weight: 400;
                padding: 0 20upx;
                &.active {
                    position: relative;
                    color: #000;
                    font-size: 30upx;
                    font-weight: 600;
                    background: #fff;
                    &:before {
                        content: "";
                        position: absolute;
                        border-left: 8upx solid $site-default-color;
                        height: 30upx;
                        left: 0;
                    }
                }
            }
        }
        /* 左侧导航布局 end*/

        .right-box {
            width: 100%;
            position: fixed;
            padding-left: 200upx;
            box-sizing: border-box;
            left: 0;
            top: 92upx;
            background: #f8f8f8;
            .page-view {
                width: 100%;
                overflow: hidden;
                // padding-top: 20upx;
                // padding-right: 20upx;
                box-sizing: border-box;
                padding-bottom: env(safe-area-inset-bottom);
                .class-box {
                    // padding-top: 30upx;
                    display: block;
                    width: 100%;
                    .class-item {
                        display: block;
                        // background: #fff;
                        width: 100%;
                        box-sizing: border-box;
                        // padding: 20upx;
                        padding: 0 30upx;
                        padding-bottom: 30upx;
                        // border-radius: 12upx;
                        &:not(:last-child){
                            border-bottom: 2upx solid #EBEBEB;
                        }
                        
                        .class-name {
                            justify-content: space-between;
                            align-items: center;
                            font-size: 28upx;
                            padding: 22upx 0;
                            color: #333;
                            .class-all{
                                font-size: 22upx;
                                color: #888;
                            }
                        }
                    }
                    .g-container {
                        /* padding-top: 20upx; */
                        display: flex;
                        display: -webkit-flex;
                        justify-content: flex-start;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                    .g-box {
                        display: block;
                        width: 33.3333%;
                        text-align: center;
                        padding-top: 12upx;
                    }

                    .g-image {
                        width: 145upx;
                        height: 145upx;
                        background: #fff;
                    }

                    .g-title {
                        display: block;
                        font-size: 22upx;
                    }
                }
            }
        }
    }
</style>

