<template>
    <view class="container">
        <!-- #ifdef MP-WEIXIN -->
        <view class="component-view" v-for="(item, index) in componentList" :key="index" :type="type">
            <carousel v-if="item.type == 'carousel'" :val="item" :type="type"></carousel>
            <blank v-if="item.type == 'blank'" :val="item" :type="type"></blank>
            <goodComponent v-if="item.type == 'goodComponent'" :val="item" :type="type" ref="goodComponent"></goodComponent>
            <goodsCategory v-if="item.type == 'goodsCategory'" :val="item" :type="type"></goodsCategory>
            <jigsaw v-if="item.type == 'jigsaw'" :val="item" :type="type"></jigsaw>
            <navComponent v-if="item.type == 'navComponent'" :val="item" :type="type"></navComponent>
            <searchComponent v-if="item.type == 'searchComponent'" :val="item" :type="type"></searchComponent>
        </view>
        <authorizePopup ref="authorize"></authorizePopup>
        <!-- #endif -->
	    <!-- #ifdef APP-PLUS || H5 -->
        <component v-for="(item, index) in componentList" v-if="item.type != 'noticeBarComponent'" :key="index" :is="item.type" :type="type" :val="item" :ref="item.type == 'goodComponent' ? 'goodComponent' : ''"></component>
        <!-- #endif -->
    </view>
</template>
<script>
// #ifdef MP-WEIXIN
import carousel from '@/components/carousel'
import blank from '@/components/blank'
import goodComponent from '@/components/goodComponent'
import goodsCategory from '@/components/goodsCategory'
import jigsaw from '@/components/jigsaw'
import navComponent from '@/components/navComponent'
import searchComponent from '@/components/searchComponent'
// #endif
import {defaultData} from '@/common/theme.js'
export default{
    name: 'index',
    // #ifdef MP-WEIXIN
    components: {carousel, blank, goodComponent, goodsCategory, jigsaw, navComponent, searchComponent},
    // #endif
    data(){
        return {
            id: '',
            componentList: [],
            isUseList: [],
            downOption:{
				auto:false,//是否在初始化完毕之后自动执行下拉回调callback; 默认true
            },
            top: 0, //提示,到顶部的距离
            type: 0,
        }
    },
    methods: {
        downCallback(mescroll){
            mescroll.resetUpScroll()
        },
        // upCallback(mescroll){
        //     this.shopPageList(mescroll)
        // },
        shopPageConfig(type){
            // console.log(mescroll, 888)
            this.$api.shopPageConfig({
                cmd:{
                    shop:"shopPageConfig"
                },
                data:{id: this.id}
            }).then(res=>{
                // mescroll.endErr()
                if(res.code == 1) {
                    // mescroll.endSuccess();
                    if(res.data.length || Object.keys(res.data).length) {
                        let config = JSON.parse(res.data.page_config)
                        uni.setNavigationBarTitle({
                            title: res.data.page_name
                        })
                        this.componentList = config.widgets
                        this.type = 0
                        if(type == 'refresh') {
                            uni.stopPullDownRefresh()
                            uni.showToast({
                                title: '刷新成功',
                                icon:  'none',
                                duration: 1500
                            })
                        }
                    }else{
                       this.initData(type) 
                    }
                    // #ifdef H5
					this.top=uni.upx2px(100+88)+"px"; // H5的高度需加上 88的标题栏
					// #endif
					
					// #ifndef H5
					this.top=uni.upx2px(100)+"px"; // 非H5不必加
					// #endif
					setTimeout(()=> {
						this.top=0;
					},2000);
                }
            }).catch(res=>{

            })
        },

        shopPageList(type){
            this.$api.shopPageList({
                cmd:{
                    shop:"shopPageList"
                },
                data:{}
            }).then(res=>{
                console.log(res)
                if(res.code == 1){
                    this.isUseList = res.data.filter(item=>{
                        if(item.is_use == 1) return item
                    })
                    if(this.isUseList.length){
                        this.id = this.isUseList[0].id
                        this.shopPageConfig(type)
                    }else{
                        this.initData(type) 
                    }
                }
            }).catch(res=>{

            })
        },

        initData(type){
            if(type == 'refresh') {
                uni.stopPullDownRefresh()
                uni.showToast({
                    title: '刷新成功',
                    icon:  'none',
                    duration: 1500
                })
            }
            uni.setNavigationBarTitle({
                title: defaultData.page.title
            })
            this.componentList = defaultData.widgets
            this.type = 1
        },

    },
    
	//页面相关事件处理函数--监听用户下拉动作
	onPullDownRefresh: function() {
		//延时为了看效果
        this.shopPageList('refresh')
        if(this.$refs.goodComponent) this.$refs.goodComponent[0].getList()
        
	},
    async onLoad(options){
        this.id = options.id || ''
        this.shopPageList('first')
    },
    onShow(){
        // #ifdef MP-WEIXIN
        this.$refs.authorize.checkIsAuthorize()
        // #endif
    }
}
</script>

<style lang="scss">
.component-view {
    display: block;
}
</style>

