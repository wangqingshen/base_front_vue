<template>
    <div class="search container">
        <!-- 搜索 -->
        <view class="searchbox">
            <view class="search-input">
                <tui-icon type="search" name="search" :size='size' color='#333'></tui-icon>
                <input confirm-type="search" placeholder="大家都在搜：热门商品" :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" maxlength="15"/>
                <view v-show="key">
                    <tui-icon name="shut" :size='delSize' color='#666' @tap="clearInput"></tui-icon>
                </view> 
            </view>
            <view class="search-btn" :class="key ? 'active' : ''" @tap="search">搜索</view>
        </view>
        <!-- 历史面板 -->
        <view class="tui-search-history" v-if="history.length>0">
			<view class="tui-history-header">
				<view class="tui-search-title">搜索历史</view>
				<tui-icon name="delete" :size='delSize' color='#333' @tap="openActionSheet" class="tui-icon-delete"></tui-icon>
			</view>
			<view class="tui-history-content">
				<block v-for="(item,index) in history" :key="index">
					<tui-tag type="gray" shape="circle" @tap="historyItemTap(item)">{{item}}</tui-tag>
				</block>
			</view>
		</view>
        <view class="no-history" v-else>
            暂无搜索记录
        </view>
        <tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
    </div>
</template>

<script>

    import tuiIcon from "@/components/tui/icon/icon"
    import tuiTag from "@/components/tui/tag/tag"
	import tuiActionsheet from "@/components/tui/actionsheet/actionsheet"
    export default {
        name: 'search',
        data(){
            return {
                key: '',
                size: 18,
                delSize: 14,
                history: [],
                showActionSheet: false,
				tips: "确认清空搜索历史吗？"
            }
        },
        components: {tuiIcon, tuiTag, tuiActionsheet},
        methods: {
            closeActionSheet: function() {
				this.showActionSheet= false
			},
			openActionSheet: function() {
				this.showActionSheet= true
			},
			itemClick: function(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
                    this.history = this.$store.state.searchHistory = []
                    uni.setStorageSync('searchHistory', [])
				}
			},
            clearInput(){
                this.key = ''
            },
            uniqueArr(){
                let arr = [],
                oldArr = this.history
                arr.push(this.key)
                if(this.history.length){
                    for(var i in oldArr) {
                        if(oldArr[i] !== this.key) {
                            arr.push(oldArr[i])
                        } 
                    }
                }
                return arr
            },
            historyItemTap(item){
                this.historyItem(item)
            },
            search(){
                if(!this.key) return
                // 去重后重新赋值
                this.history = this.uniqueArr()
                // 长度超过10 弹出
                if(this.history.length > 10) this.history.pop()
                //去重后存储到本地
                this.$store.commit('SET_SEARCHHISTORY', this.history)
                //清空分类
                this.historyItem(this.key)
            },
            historyItem(val){
                let data = {}
                this.$set(data, 'sort_type', 0)
                this.$set(data, 'sort_val', false)
                this.$set(data, 'price_between', [])
                this.$set(data, 'goods_label', [])
                this.$set(data, 'gc_id_type', -1)
                this.$set(data, 'gc_id_value', -1)
                this.$set(data, 'search_gc_name', val)
                this.$store.commit('SET_FILTERSEARCH',data)  
                this.$mRouter.push({
                    route: this.$mRoutesConfig.goodsList,
					query: {}
                }) 
            },
            searchStore(){
                // localStorage.setItem('search_store_name', this.value)
                // this.$router.push({name: 'storeList'})
            }
        },
        async onLoad(options){
            this.history = this.$store.state.searchHistory
        }
    }
</script>

<style lang="scss" type="text/scss">
    page {
		color: #333;
		background: #fff;
	}
    .search{
        padding: 0 30upx 30upx 30upx;
        .searchbox{
            padding: 30upx 0;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            .search-input{
                width: 100%;
                height: 66upx;
                border-radius: 35upx;
                padding: 0 30upx;
                box-sizing: border-box;
                background: #f2f2f2;
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                .tui-input {
                    flex: 1;
                    color: #333;
                    padding: 0 16upx;
                    font-size: 28upx;
					border-bottom: 0;
                }

                .tui-input-plholder {
                    font-size: 28upx;
                    color: #b2b2b2;
                }

            }
            .search-btn{
                font-size: 28upx;
                padding-left: 30upx;
		        flex-shrink: 0;
                &.active{
                    color: $site-default-color;
                }
            }
        }
        .tui-search-history{
            display: block;
            .tui-history-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 30upx 0;
            }

            .tui-icon-delete {
                padding: 10upx;
            }

            .tui-search-title {
                font-size: 28upx;
                font-weight: bold;
            }
            .tui-history-content{
                display: block;
            }

            .tui-tag-class {
                display: inline-block;
                margin-bottom: 20upx;
                margin-right: 20upx;
                font-size: 26upx !important;
            }
        }
        .no-history{
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            font-size: 28upx;
            color: #ccc;
        }
    }
</style>
