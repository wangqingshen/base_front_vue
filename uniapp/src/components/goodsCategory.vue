<template>
    <view class="goodCategoryWaper">
        <view class="higherClassify">
            <text class="categoryName">{{val.cName || '一级分类名称'}}</text>
            <text class="seeMore" @tap="checkCategory" v-if="val.list.length">查看更多</text>
        </view>
        <view class="lowerClassify" v-if="val.list.length" >
            <view class="lowerClassify_inner" v-for="(item, index) in classPage" :key="index">
                <ul >
                    <li v-for="(_item, _index) in classList" :key="_index" @tap="categoryLevel(_item)" :class="'col-icon-'+val.cols">
                        <view class="lazy-img" v-if="val.iconShow" :style="{height: val.txtShow?'auto':''}">
							<image :src="_item.gc_img"></image>
                        </view>
                        <text v-if="val.txtShow">{{_item.gc_name}}</text>
                    </li>
                </ul>
            </view>
        </view>
        <view v-else  class="no_data">
            <image :src="require('@/static/imgs/default/default_goods.png')"></image>
            <view>暂无相关分类</view>
        </view>
    </view>
</template>
<script>
export default {
    props: ['val', 'type'],
    data(){
        return {
            current: 0,
            imgurl: this.type == 0 ? this.$mConfig.imgUrl : ''
        }
    },
    computed: {
        classPage(){
            let arr = [],
                count = Math.ceil(this.val.list.length/(Number(this.val.cols)*Number(this.val.rows)))
            for(var i=0; i<count; i++) {
                arr.push(i)
            }
            return arr
        },

        classList(){
            let index = this.current
            return this.val.list.slice(index*Number(this.val.cols)*Number(this.val.rows), (index+1)*Number(this.val.cols)*Number(this.val.rows))
        }
    },
    methods:{
        checkCategory(){
            let gc_name = this.val.cName,
                gc_level = this.val.gc_id_s ? 2 : 1,
                gc_id = this.val.gc_id_s ? this.val.gc_id_s : this.val.gc_id_f
            this.pageGoodsList(gc_level, gc_id, gc_name)
        },

        categoryLevel(item){
            let gc_name = item.gc_name,
                gc_level = item.gc_level,
                gc_id = item.gc_id
            this.pageGoodsList(gc_level, gc_id, gc_name)
        },

        pageGoodsList(gc_level, gc_id, gc_name){
            let data = {}
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
        }

    }
}
</script>

<style lang="scss">
    .goodCategoryWaper{
        background-color: #FFF;
		flex-direction: column;
        .higherClassify{
            padding: 40upx 30upx;
            // height: 40px;
            // border-bottom: 1px solid #E7E7E7;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .categoryName{
                border-left: 8upx solid #1FA76E;
                padding-left: 10upx;
                font-weight: 700;
                font-size: 32upx;
                color: #333333;
            }
            .seeMore{
                font-size: 24upx;
                color: #666;
            }
        }
        .lowerClassify{
            padding: 0 30upx;
                // overflow: hidden;
            .lowerClassify_inner{
				width: 100%;
                height: 100%;
                padding-bottom: 20upx;
                &:not(:first-child){
                    display: none;
                }
                ul{
					width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    li{
                        // padding-top: 10px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        position: relative;
                        box-sizing: border-box;
                        margin-bottom: 10upx;
                        .lazy-img{
                            position: relative;
							width: 100%;
                            // width: 80%;
							&:after{
							    display: block;
							    content: '';
							    padding-top: 100%;
							}
                            image{
                                position: absolute;
                                width: 100%;
                                height: 100%;
                            }
                        }
                        uni-text, text{
                            position: absolute;
                            width: 100%;
                            height: 40upx;
                            line-height: 40upx;
                            background: rgba(31,167,110,0.8);
                            left: 0;
                            bottom: 0;
                            color: #fff;
                            font-size: 24upx;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            white-space: normal;
                            word-break: break-all;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            // padding-top: 3px;
                            text-align: center; 
                            border: 1px solid #fff;
                        }
                        &.col-icon-2{
                            width: 48%;
                            margin-left: 4%;
                            &:nth-child(2n+1){
                                margin-left: 0;
                            }       
                        }
                        &.col-icon-3{
                            width: 32%;
                            margin-left: 2%;   
                            &:nth-child(3n+1){
                                margin-left: 0;
                            }               
                        }
                        &.col-icon-4{
                            width: 23.5%;
                            margin-left: 2%;
                            &:nth-child(4n+1){
                                margin-left: 0;
                            }       
                        }
                    }
                }
            }
        }
        .no_data{
            padding-bottom: 60upx;
            img{
                width: 244upx;
                display: block;
                margin: 30upx auto;
            }
            p{
                font-size: 28upx;
                color: #666666;
                text-align: center;
            }
        }
    }
</style>