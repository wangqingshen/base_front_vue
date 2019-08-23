<template>
    <view class="blank" :style="{height: $mUtils.px(val.blankHeight)}"></view>
</template>

<script>
export default {
    props: ['val']
}
</script>


<style lang="scss">
.blank{
    width: 100%;
    position: relative;
    background: transparent;
}
</style>

