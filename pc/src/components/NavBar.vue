<template>
    <van-nav-bar :title="pageTitle" left-arrow fixed id="navBar" @click-left="goBack" :z-index="1000"/>
</template>
<script>
    export default{
        name: 'NavBar',
        props: {
          pageTitle:{
            type:String,
          }
        },
        data() {
            return {
              
            }
        },
        methods: {
           goBack(){
              let name = this.$route.name
              console.log(this.$route, 1111)
              if( name == 'orderList' || name == 'refundList' || name == 'transferOwn' || name =='demandOwn' || name == 'enquiryList'){
                this.$router.push({name: 'ownIndex'})
              }else if(name == 'evaluateList' || name == 'transferList'){
                this.$router.push({name: 'index'})
              }else if(name == 'enterpriseList'){
                this.$router.push({name: 'enterpriseIndex'})
              }else if(name == 'storeFillIn'){
                this.$router.push({name: 'storeApply'})
              }else if(name == 'storeApply'){
                this.$router.push({name: 'ownIndex'})
              }else{
                this.$router.go(-1)
              }
              
           }
        },
        created() {
          
        }        
    }
</script>
<style lang="scss">
    #navBar {
      height: 40px;
      line-height: 40px;
      box-shadow: 0 1px 3px #f5f5f5;
      &:after{
        border: 0;
      }
      .van-nav-bar__left {
        .van-nav-bar__arrow {
          transform: rotate(0);
          &:before{
            content: '';
            background: url('../assets/images/icons/icon_back.png');
            background-size: cover;
            width: 11px;
            height: 18px;
          }
        }
      }
      .van-nav-bar__title {
        height: 100%;
        font-size: 16px;
        color: #000;
      }
    }
</style>