<template>
   <view class="searchComponent" :style="{position: val.isFixed?'absolute':'relative'}">
        <view class="search-inner" :style="{backgroundColor:val.bgColor, opacity: val.opacity}" @tap="search">
            <tui-icon type="search" name="search" :size='size' color='#999'></tui-icon>
            <text :style="{color: val.color}" class="search-txt">{{val.placeholder}}</text>
        </view>
    </view>
</template>

<script>
import tuiIcon from "@/components/tui/icon/icon"
export default {
    props: ['val'],
    components: {tuiIcon},
    data(){
        return {
            size: 18
        }
    },
    methods:{
        search(){
            this.$mRouter.push({
                route: this.$mRoutesConfig.search,
				query: {}
            })
        }
    }
}
</script>


<style lang="scss">
.searchComponent{
    width: 100%;
    height: 96upx;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: transparent;
    padding: 0 30upx;
    z-index: 100;
    box-sizing: border-box;
    .search-inner{
        width: 100%;
        height: 60upx;
        border-radius: 36upx;
        display: flex;
        align-items: center;
        font-size: 28upx;
        padding-left: 20upx;
        .search-txt{
            margin-left: 10upx;
        }
    }
}
</style>

