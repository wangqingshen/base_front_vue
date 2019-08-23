<template>
<!--左抽屉弹层 筛选 -->
	<tui-drawer mode="right" :visible="drawer" @close="closeDrawer">
		<view class="tui-drawer-box" :style="{paddingTop:height+'px'}">
			<scroll-view class="tui-drawer-scroll" scroll-y :style="{height:drawerH+'px'}">
				<view class="tui-drawer-title">
						<text class="tui-title-bold">价格区间(元)</text>
				</view>
				<view class="tui-drawer-content">
						<input placeholder-class="tui-phcolor" class="tui-input" v-model.trim="minPrice" placeholder="最低价" maxlength="10" type='number' />
						<tui-icon name="reduce" color="#333" :size="iconSize"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" v-model.trim="maxPrice" placeholder="最高价" maxlength="10" type='number' />
				</view>

				<view class="tui-drawer-title">
						<text class="tui-title-bold">商品标签</text>
				</view>
				<view class="tui-drawer-content tui-flex-attr">
						<view class="tui-attr-item" v-for="(item, index) in filterLabel" :data-id="index" :class="[item.checked ? 'active' : '']" :key="index" @tap="labelCheck">
							<view class="tui-attr-ellipsis">{{item.gl_name}}</view>
						</view>
				</view>

				<view class="tui-safearea-bottom"></view>
			</scroll-view>
			<view class="tui-attr-btnbox">
				<view class="tui-attr-safearea">
					<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="hoverStayTime" @tap="reset">重置</view>
					<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150" @tap="confirm">确认</view>
				</view>
			</view>
		</view>
	</tui-drawer>
<!--左抽屉弹层 筛选-->
</template>
<script>
import tuiDrawer from "@/components/tui/drawer/drawer"
import tuiIcon from "@/components/tui/icon/icon"
export default {
    name: 'filterDrawer',
    components: {tuiDrawer,tuiIcon},
    props: {
        drawer: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number
        },
        drawerH: {
            type: Number
        }
    },
    data(){
        return {
            iconSize: 16,
            hoverStayTime: 150,
            filterLabel: {},
            minPrice: '',
            maxPrice: ''
        }
    },
    methods: {
        closeDrawer() {
            this.$emit('closeDrawer')
			// this.drawer = false
        },
        goodsLabel(){
            this.$api.goodsLabel({
                cmd:{"goods":"goodsLabel"},
                data:{}
            }).then(res=>{
                if(res.code == 1){
                    if(res.data.length){
                        this.filterLabel = res.data.map((item)=>{
                            return {
                                gl_id: item.gl_id,
                                gl_name: item.gl_name,
                                checked: false
                            }
                        })
                    }
                }
            }).catch(res=>{})
        },
        labelCheck(e){
            let index = e.currentTarget.dataset.id
            this.filterLabel[index].checked = !this.filterLabel[index].checked
        },
        reset(){
            this.minPrice = this.maxPrice = ''
            this.filterLabel.map(v=>{
                return v.checked = false
            })
            // this.$mUtils.toast('重置成功')
        },
        confirm(){
            if(Number(this.minPrice) > Number(this.maxPrice)){
                this.$mUtils.toast('最低价不能大于最高价')
                return
            }
            this.mergeData()
        },
        checkedClass(){
            let goodsLabel = this.$store.state.filterSearch.goods_label,
                priceBetween = this.$store.state.filterSearch.price_between
            if(goodsLabel.length) {
                this.filterLabel.map((item)=>{
                    item.checked = false
                    goodsLabel.map((_item)=>{
                        if(item.gl_id == _item) {
                            item.checked = true
                        }
                    })  
                })
            }
            if(priceBetween.length) {
                this.minPrice = priceBetween[0] == '' ? '' : Number(priceBetween[0])
                this.maxPrice = priceBetween[1] == '' ? '' : Number(priceBetween[1])
            }
        },
        mergeData(){
            let priceRange = [],
				filterSearch = this.$store.state.filterSearch
            if(this.minPrice || this.maxPrice){
            	priceRange.push(this.minPrice, this.maxPrice)
            }
            let goods_label = this.filterLabel.filter((item)=>{
                return item.checked
            }).map((item)=>{
                return item.gl_id
            })
            filterSearch.goods_label = goods_label
			filterSearch.price_between = priceRange
            this.$store.commit('SET_FILTERSEARCH', filterSearch)
            this.$emit('emitConfirmFilter')
        }
    }
}
</script>

<style lang="scss">
/*顶部下拉选择 综合*/

	.tui-drawer-box {
		display: block;
		width: 686upx;
		font-size: 24upx;
		overflow: hidden;
		position: relative;
		padding-bottom: 100upx;
		box-sizing: border-box;
	}

	.tui-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30upx;
		box-sizing: border-box;
		height: 80upx;
	}

	.tui-title-bold {
		font-size: 26upx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.tui-location {
		margin-right: 6upx;
	}

	.tui-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
	}

	.tui-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tui-drawer-content {
		padding: 16upx 30upx 30upx 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-input {
		border: 0;
        height: 64upx;
        line-height: 64upx;
		border-radius: 32upx;
		width: 45%;
		background: #f7f7f7;
		text-align: center;
		font-size: 24upx;
		color: #333;
	}

	.tui-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24upx;
	}

	.tui-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.tui-attr-item {
		width: 30%;
		height: 64upx;
		background: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4upx;
		box-sizing: border-box;
		border-radius: 32upx;
		margin-right: 5%;
        margin-bottom: 5%;
        &.active{
            background: $site-default-color;
            color: #fff;
        }
	}

	.tui-attr-ellipsis {
        display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 96%;
        text-align: center;
	}

	.tui-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}

	.tui-attr-btnbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30upx;
		background: #f5f5f5;
	}

	.tui-attr-safearea {
        width: 100%;
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1upx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-drawer-btn {
		width: 47%;
		text-align: center;
		height: 60upx;
		border-radius: 30upx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-drawerbtn-black {
		border: 1upx solid #555;
	}

	.tui-drawerbtn-primary {
		background:$site-default-color;
		color: #fff;
	}
</style>

