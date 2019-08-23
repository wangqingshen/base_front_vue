<template>
    <view class="clear-component">
        <tui-icon name="close-fill" :size='size' color='#333'></tui-icon>
    </view>
</template>
<script>
    import tuiIcon from "@/components/tui/icon/icon"
    export default{
        name: 'clearInput',
        components: {tuiIcon},
        props: {
      
        },
        data() {
            return {
                size: 18
            }
        },
        methods: {
          
        },
        created() {
          
        }        
    }
</script>
<style lang="scss">
    .clear-component{
        position: absolute;
        right: 10upx;
        width: 28upx;
        img{
            width: 100%;
        }
    }
</style>