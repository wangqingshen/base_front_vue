<template>
    <view class="map" v-if="hide"></view>
</template>
<script>
    // #ifdef APP-PLUS || H5
    import MapLoader from '@/common/AMap.js'
    // #endif
    // #ifdef MP-WEIXIN
    import amap from '@/common/amap-wx.js'
    // #endif
    export default{
        name: 'geoMap',
        components: {},
        props: {
            
        },
        data() {
            return {
                hide: false,
                city: '四川省 成都市',
                code: '510100',
                amapPlugin: null,  
                key: 'ae00c622d0c9a59b1f1354e63e737573',  
            }
        },
        methods: {
            // pc端
            jsPcMap(){
                let _this = this
				MapLoader().then(AMap => {	
					AMap.plugin('AMap.CitySearch', function () {
                        var citySearch = new AMap.CitySearch()
						citySearch.getLocalCity(function (status, result) {
							if (status === 'complete' && result.info === 'OK') {
    
								// 查询成功，result即为当前所在城市信息
								_this.city = result.province + ' ' + result.city
								_this.code = result.adcode
                            }
                            _this.$emit('emitMap', {city: _this.city, code: _this.code})
						})
					})
				}, e => {
					_this.$emit('emitMap', {city: _this.city, code: _this.code})
					console.log('地图加载失败')
				})
            },
            jsWapMap(lng, lat){
                let _this = this
                let lnglatXY = [lng, lat]
                MapLoader().then(AMap => {
                    AMap.service('AMap.Geocoder',function() {//回调函数
                        var geocoder = new AMap.Geocoder();
                        geocoder.getAddress(lnglatXY, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                //获得了有效的地址信息:
                                //即，result.regeocode.formattedAddress
                                var address = result.regeocode.addressComponent;
                                _this.city = address.province + ' ' + address.city
                                _this.code = address.adcode
                                _this.$mUtils.toast(_this.city, _this.code)
                            }
                            
                            _this.$emit('emitMap', {city: _this.city, code: _this.code})
                        });
                    })

                }, e => {
					_this.$emit('emitMap', {city: _this.city, code: _this.code})
					console.log('地图加载失败')
				})
            },
            wxMap(lng, lat){
                let _this = this
                // uni.request({
                //     url: 'https://restapi.amap.com/v3/geocode/regeo',
                //     data: {
                //         key: this.key,
                //         location: lng + "," + lat,
                //         extensions: "all",
                //         s: "rsx",
                //         sdkversion: "sdkversion",
                //         logversion: "logversion"
                
                //     },
                //     success: function (res) {
                //         console.log(res, 123456)
                //         // console.log(res.data.regeocode.addressComponent.city);
                //     },
                //     fail: function (res) {
                //         console.log('获取地理位置失败')
                //     }
                // })
                this.amapPlugin = new amap.AMapWX({  
                    key: this.key  
                })
                this.amapPlugin.getRegeo({  
                    success: (data) => {  
                        console.log(data)
                        let address = data[0].regeocodeData.addressComponent
                        _this.city = address.province + ' ' + address.city
                        _this.code = address.adcode
                        _this.$emit('emitMap', {city: _this.city, code: _this.code})
                    },
                    fall: (err) => {
                        _this.$emit('emitMap', {city: _this.city, code: _this.code})
                    }
                })
            },
            async getCityCode(code){
                this.$api.cityRegion({//城市三联
                    cmd:{
                        "region":"getCityRegion"
                    },
                    data:{
                        adcode: code,
                        level: 'district'
                    }
                }).then(res=>{

                }).catch(err=>{})
            },
            init(){
                let _this = this
                uni.getLocation({
                    type: 'wgs84',
                    success: function(res) {
                        let lng = res.longitude,
                            lat = res.latitude
                        // #ifdef APP-PLUS || H5
                        _this.jsWapMap(lng, lat)
                        // #endif
                        // #ifdef MP-WEIXIN
                        _this.wxMap(lng, lat)
                        // #endif 
                    },
                    fail: function(res){
                        _this.jsPcMap()
                    }
                })
                
            }
        },
        mounted() {
            this.init()
        }        
    }
</script>
<style lang="scss">
   
</style>