import axios from 'axios'
import {Base64} from 'js-base64'
import sha1 from 'js-sha1'
import Vue from 'vue'
let vue =new Vue({})
// 随机生成n位随机数
function getRandStr(n) {
	let str = '';
	for (let i = 0; i < n; i++) {
		str += Math.floor(Math.random() * 10).toString();
	}
	return str;
}

// 获取当前时间
function getCurTime() {
	let date = new Date(),
		y = date.getFullYear().toString().substr(2),
		m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
		d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString(),
		h = date.getHours() % 12 < 10 ? '0' + date.getHours() % 12 : (date.getHours() % 12).toString(),
		i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString(),
		s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString();
	return (y + m + d + h + i + s);
}

let appId = 'shop',
    projectName = 'yaosu',
    // projectName = 'shop',
	randStr = getRandStr(5),
	timestamp = getCurTime(),
	signature = sha1(sha1(timestamp + randStr) + appId),
	load = null;

const http = {};
http.post = (url,params = {},isLoad=true)=>{
	let obj={
        "header":{
            "signature":signature,
            "timestamp":timestamp,
            "nonce":randStr,
            "project":projectName
        },
        "cmd":params.cmd,
        "data":params.data||{}
    }
    console.log(obj)
    let data = JSON.stringify(obj)
    data = Base64.encode(data)
    let arr = []
	arr.push(data)
	arr.push(appId)
	let srt = JSON.stringify(arr)
	let baseData = Base64.encode(srt)
	if(isLoad) {
		load = vue.$toast.loading({
            duration: 0,
            forbidClick: true,
            loadingType: 'spinner',
            message:'加载中'
        })
  
	}
	return new Promise((reslove,reject)=>{
        axios.post(url,baseData).then(res=>{
            let firstBase64 = Base64.decode(res.data)
            let base64Parse =JSON.parse(firstBase64)
            let resultData =JSON.parse(Base64.decode(base64Parse[0]))
            reslove(resultData)
            if(isLoad){
                setTimeout(res=>{
                    load.clear()
                },1000)
                
            }

        }).catch(err=>{
            load.clear()
            reject(err)
        })
    })

}

axios.interceptors.response.use(
    res => {
        if (res.status === 500) {
        	vue.$toast.error('网络错误');
            return;
        }
        if (res.status === 302) {
            console.log('重定向');
        }
        if (res.data && res.data.type === 'err') {
            return Promise.reject(res);
        }
        return res;
    },
    err => {
    	vue.$toast.error('网络错误');
        return Promise.reject(err);
    }
);

export default http