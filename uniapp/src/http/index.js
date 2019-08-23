import { Base64 } from 'js-base64'
import sha1 from 'js-sha1'
import $mUtils from '@/common/utils.js'

const http = {}
http.post = (url, params = {}, hideLoading) => {
    let appId = 'shop',
        projectName = 'shopbase',
		// projectName = 'ximao',
        randStr = $mUtils.getRandStr(5),
        timestamp = $mUtils.getCurTime(),
        signature = sha1(sha1(timestamp + randStr) + appId),
        userAgent = 'wap',
        obj = {
            "header": {
                "signature": signature,
                "timestamp": timestamp,
                "nonce": randStr,
                "project": projectName,
                "user_agent": userAgent,
                "token": ''
            },
            "cmd": params.cmd,
            "data": params.data || {}
        }
    console.log(obj, process.env)
    let data = Base64.encode(JSON.stringify(obj))
    let arr = []
    arr.push(data)
    arr.push(appId)
    let baseData = Base64.encode(JSON.stringify(arr))
    let opt = {
            url: url,
            data: baseData,
            method: "POST",
            header: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "multipart/form-data; charset=UTF-8"
            },
            dataType: "json"
        }
        //接口请求
    if (!hideLoading) {
        uni.showLoading({
            mask: true,
            title: '请稍候...',
        })
    }
    return new Promise((reslove, reject) => {
        uni.request(opt).then(res => {
            !hideLoading && uni.hideLoading()
            let base64Parse = JSON.parse(Base64.decode(res[1].data))
            let resultData = JSON.parse(Base64.decode(base64Parse[0]))
            reslove(resultData)
        }).catch(err => {
            if (!hideLoading) {
                $mUtils.toast("网络不给力，请稍后再试~")
                    //uni.hideLoading()
            }
            reject(err)
        })
    })

}

export default http