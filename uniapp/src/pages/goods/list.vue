<template>
    <view class="goodsList-wrapper container">
		<!--header-->
			<view class="tui-header-box">
				<view class="tui-header" :style="{width:width+'px',height:height+'px'}">
					<view class="tui-back" :style="{marginTop:arrowTop+'px'}" @tap="back">
						<tui-icon name="arrowleft" color="#000"></tui-icon>
					</view>
					<view class="tui-searchbox tui-search-mr" :style="{marginTop:inputTop+'px'}" @tap="search">
						<tui-icon name="search" :size='iconSearchSize' color='#999'></tui-icon>
						<text class="tui-search-text" v-if="!searchKey">搜索商城商品</text>
						<view class="tui-search-key" v-if="searchKey">
							<view class="tui-key-text">{{searchKey}}</view>
							<tui-icon name="shut" :size='iconDelSize' color='#fff'></tui-icon>
						</view>
					</view>
				</view>
			</view>
		<!--header-->
		<!--screen-->
			<view class="tui-header-screen" :style="{top:height+'px'}">
				<filterBar :isSwitch="isSwitch" @emitLayout="emitLayout" @emitOpen="emitOpen" @emitFilterList="emitFilterList"></filterBar>
			</view>
			<filterDrawer ref="filterDrawer" :height="height" :drawer="drawer" :drawerH="drawerH" @closeDrawer="closeDrawer" @emitConfirmFilter="emitConfirmFilter"></filterDrawer>
		<!--screen-->
		<!--list-->
			<view class="tui-product-list" :style="{marginTop:px(dropScreenH+18)}">
				<goodItem ref="GoodItem" :isSwitch="isSwitch" :queryData="queryData" :isSeller="isSeller" @emitNoData="noData" @emitMore="emitMore"></goodItem>
			</view>
		<!--list-->
		<!--加载loadding-->
			<tui-loadmore :visible="loadding" :index="loadingType" type="red"></tui-loadmore>
			<tui-nomore :visible="!pullUpOn && finished" bgcolor="#f7f7f7"></tui-nomore>
		<!--加载loadding-->
		<!--暂无商品缺省-->
			<noData :imgPath="noDataPic" :msg="'暂无商品'" v-if="noDataState"></noData>
		<!--暂无商品缺省-->
    </view>
</template>
<script>
	import tuiIcon from "@/components/tui/icon/icon"
	import tuiLoadmore from "@/components/tui/loadmore/loadmore"
	import tuiNomore from "@/components/tui/nomore/nomore"
	import filterBar from '@/components/goods/filterBar'
	import filterDrawer from '@/components/goods/filterDrawer'
	import goodItem from '@/components/goods/goodItem'
	import noData from '@/components/noData'
    export default{
        name:'goodsList',
        components: {tuiIcon,tuiLoadmore,tuiNomore, filterBar, filterDrawer, goodItem, noData},
        data(){
        	return{
        		searchKey: "", //搜索关键词
				width: 200, //header宽度
				height: 64, //header高度
				inputTop: 0, //搜索框距离顶部距离
				arrowTop: 0, //箭头距离顶部距离
				dropScreenH: 0, //下拉筛选框距顶部距离
				drawer: false,
				drawerH: 0, //抽屉内部scrollview高度
				iconSearchSize: 16,
				iconDelSize: 12,
        		isSwitch: false,
				userInfo: {},
				isSeller: false, //是否为分销商
				distributionCode: '', //分销商码
				distribution_code: '',
        		queryData: {
        			// search_type: 1,
        			goods_name: '',
	          		gc_id_1: '',
	          		gc_id_2: '',
					gc_id_3: '',
					goods_lable: '',
	          		page: 1,
	          		pageNum: 10,
	          		pv: 2,
	          		sold: '',
	          		price: '',
	          		price_between: '',
	          		store_attr: '',
	          		discount_id: 0,
	          		newest: '',
	          		goods_adcode: '',
	          		store_name: '',
	          		plat_boutique: '',
	          		store_boutique: '',
	          		store_one_class: '',
	          		store_two_class: '',
					store_id: '',
					member_id: '',
					distribution_code: ''
				},
				finished: false,
				currentPage: 1,
				loadding: false,
				pullUpOn: true,
				loadingType: 3,
				noDataPic: require('@/static/imgs/default/default_goods.png'),
				noDataState: true
        	}
        },
        methods:{
			px(num) {
				return uni.upx2px(num) + "px"
			},
			closeDrawer() {
				this.$mUtils.startScroll()
				this.drawer = false
			},
			back() {
				if (this.drawer) {
					this.closeDrawer()
				} else {
					uni.navigateBack()
				}
			},
			search() {
				this.$mRouter.push({
                    route: this.$mRoutesConfig.search,
					query: {}
                })
			},
			emitLayout(state){
				this.isSwitch = state
			},
			emitOpen(){
				this.$mUtils.stopScroll()
				this.$refs.filterDrawer.checkedClass()
				this.drawer = true
			},
			emitFilterList(){
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.pullUpOn = true
				this.$refs.GoodItem.getList({page: 1, finished: false})
			},

			emitConfirmFilter() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				})
				this.pullUpOn = true
				this.$refs.GoodItem.getList({page: 1, finished: false})
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
                    shareData.linkName = `/goods/list?distribution_code=${this.distributionCode}`
                }else{
                    shareData.linkName = `/goods/list`
                }
                shareData.desc = '掐指一算，这里有很多商品值得购买，进来看一看'
                shareData.title = '我在中华园林机械网上发现许多好东西，赶紧来看看'
                shareData.imgUrl = ''
                this.$share.api(shareData)
            },

        	searchCheck(){
				let filterSearch = this.$store.state.filterSearch
				if(filterSearch.gc_id_type != -1) {
					this.queryData['gc_id_'+filterSearch.gc_id_type] = filterSearch.gc_id_value
				}else{
					this.queryData.goods_name = filterSearch.search_gc_name
				}
				// this.$route.query.discount_id ? this.queryData.discount_id = this.$route.query.discount_id : ''
				setTimeout(()=>{
					this.$refs.GoodItem.getList({page: 1, finished: false})
				},10)	
			},

			noData(){
				this.closeDrawer()
				this.noDataState = true
				this.loadding = false
				this.pullUpOn = false
				this.finished = false
			},
			
			emitMore(msg){
				this.closeDrawer()
				this.noDataState = false
				this.currentPage = msg.page
				this.finished = msg.finished
			}
		},
		onPullDownRefresh() {
			this.currentPage = 1
			this.pullUpOn = true
			this.loadding = false
			this.$refs.GoodItem.getList({page: this.currentPage, finished: false, refresh: true})
			// let loadData = JSON.parse(JSON.stringify(this.productList));
			// loadData = loadData.splice(0, 10);
			// this.productList = loadData;
			// this.pageIndex = 1;
			// this.pullUpOn = true;
			// this.loadding = false;
			// uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if (!this.pullUpOn) return;
			this.loadding = true;
			if (this.finished) {
				this.loadding = false;
				this.pullUpOn = false
			} else {
				this.$refs.GoodItem.getList({page: this.currentPage+1, finished: false})
			}
		},
        onLoad(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
					this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.searchKey = this.$store.state.filterSearch.search_gc_name || "";
					//略小，避免误差带来的影响
					this.dropScreenH = this.height * 750 / res.windowWidth + 60;
					this.drawerH = res.windowHeight - uni.upx2px(100) - this.height
					this.searchCheck()
				}
			})
			setTimeout(()=>{
				this.$refs.filterDrawer.goodsLabel()
			}, 100)	
		},
    }
</script>

<style lang="scss" type="text/scss">
	.goodsList-wrapper{
		.tui-header-box {
			width: 100%;
			background: #fff;
			position: fixed;
			z-index: 10;
			left: 0;
			top: 0;
			.tui-header {
				display: flex;
				align-items: flex-start;
				.tui-back {
					margin-left: 8upx;
					height: 32px !important;
					width: 32px !important;
				}
				.tui-searchbox {
					width: 100%;
					height: 30px;
					margin-right: 30upx;
					border-radius: 15px;
					font-size: 12px;
					background: #f7f7f7;
					padding: 3px 10px;
					box-sizing: border-box;
					color: #999;
					display: flex;
					align-items: center;
					overflow: hidden;
					.tui-search-text {
						padding-left: 16upx;
					}
					.tui-search-key {
						max-width: 80%;
						height: 100%;
						padding: 0 16upx;
						margin-left: 12upx;
						display: flex;
						align-items: center;
						border-radius: 15px;
						background: rgba(0, 0, 0, 0.5);
						color: #fff;
					}

					.tui-key-text {
						box-sizing: border-box;
						padding-right: 12upx;
						font-size: 12px;
						line-height: 12px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
				/* #ifdef MP-WEIXIN */
				.tui-search-mr {
					margin-right: 20upx !important;
				}

				/* #endif */
				/* #ifdef MP-BAIDU */
				.tui-search-mr {
					margin-right: 20upx !important;
				}
				/* #endif */
			}
		}
		/*screen*/
		.tui-header-screen {
			width: 100%;
			box-sizing: border-box;
			background: #fff;
			position: fixed;
			z-index: 10;
			.tui-screen-top{
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28upx;
				color: #333;
			}
			filter-bar{
				width: 100%;
			}
		}

		/*list*/ 
		.tui-product-list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			flex-wrap: wrap;
			box-sizing: border-box;
			good-item{
				width: 100%;
			}
		}

		.tui-product-container {
			flex: 1;
			margin-right: 10upx;
		}
	}
</style>
