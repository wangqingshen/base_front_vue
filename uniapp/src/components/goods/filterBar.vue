<template>
  <view class="tui-screen-top">
    <view class="tui-top-item" v-for="(item, index) in filterNav" :key="index" :class="[index == filterIndex?'actived':'']" :data-index="index"  @tap="filterList">
      <view v-if="index != 3">{{item}}</view>
      <view class="item-icon" v-if="index < 3">
        <tui-icon name="turningup" class="item-icon-tui" :size='iconSize' :color='index == filterIndex && sort?iconSelColor:iconColor'></tui-icon>
        <tui-icon name="turningdown" class="item-icon-tui" :size='iconSize' :color='index == filterIndex && !sort?iconSelColor:iconColor'></tui-icon>
      </view>
      <view class="item-icon" v-else-if="index == 3">
        <tui-icon :name="isSwitch?'manage':'listview'" :size="isSwitch?22:18" :bold="isSwitch?false:true" color="#333"></tui-icon>
      </view>
      <view class="item-icon" v-else>
        <tui-icon name="screen" :size="iconSize" color="#333" tui-icon-class="tui-ml" :bold="true"></tui-icon>
      </view>
    </view>
  </view>
</template>
<script>
    import tuiIcon from "@/components/tui/icon/icon"
    export default{
        name: 'filter-bar',
        props: {
            isSwitch: {
              type: Boolean,
              default: false
            }
        },
        components: {tuiIcon},
        data() {
            return {
              iconColor: '#333',
              iconSelColor: '#DF1222',
              iconSize: 16,
              filterNav: ['人气','销量','价格','排列','筛选'],
              currentIndex: 0,
              currentType: false
            }
        },
        computed:{
          sort(){
            this.currentType = this.$store.state.filterSearch.sort_val
            return this.currentType
          },
          filterIndex(){
            this.currentIndex = this.$store.state.filterSearch.sort_type
            return this.currentIndex
          }
        },
        methods: {
            filterList(e){
              let index = e.currentTarget.dataset.index,
                  filterSearch = this.$store.state.filterSearch
              if(index < 3) {
                filterSearch.sort_type = index
                filterSearch.sort_val = index == this.currentIndex ? !this.currentType : false
                this.$store.commit('SET_FILTERSEARCH', filterSearch)
                this.$emit('emitFilterList')
              }else if(index == 3) {
                let state = this.isSwitch ? false : true
                this.$emit('emitLayout', state)
              }else{
                this.$emit('emitOpen')
              }
            }
        },
        watch:{
          
        }
    }
</script>
<style lang="scss">
  .tui-screen-top{
    display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28upx;
    color: #333;
    width: 100%;
    height: 78upx;
		position: relative;
    background: #fff;
    .tui-top-item {
      height: 28upx;
      line-height: 28upx;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      &.actived{
        color:$site-default-color;
      }
      .item-icon{
        flex-direction: column;
        .item-icon-tui{
          line-height: 12upx;
          .tui-icon{
            line-height: 12upx;
          }
        }
      }
    }

  }
</style>