// AMap.js
// 高德map   https://webapi.amap.com/maps?v=1.4.11&key=你的高德地图的key
export default function MapLoader () {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
			// #ifdef H5
			script.src ='https://webapi.amap.com/maps?v=1.4.10&callback=initAMap&key=d992aadc9e3a10b484ca91b5f4f8d947'
			// #endif
			// #ifdef MP-WEIXIN
			script.src ='https://webapi.amap.com/maps?v=1.4.10&callback=initAMap&key=ae00c622d0c9a59b1f1354e63e737573'
			// #endif
            script.onerror = reject
            document.head.appendChild(script)
        }
        window.initAMap = () => {
            resolve(window.AMap)
        }
    })
}
  