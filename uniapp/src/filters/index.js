// import moment from 'moment'
const orderStatus =(value,type)=>{
    switch (value){
        case 0:
            return '待付款'
        case 1:
            return '待平台确认收款'
        case 100:
            return '待发货'
        case 101:
            return '退款中'
        case 102:
            return '已退款'
        case 200:
            if(type==6){
              return '待提货'
            }else{
              return '待收货'
            }
        case 201:
            return '退款中'
        case 202:
            return '已退款'
        case 300:
            return '已完成'
        case 301:
            return '退款中'
        case 302:
            return '已退款'
        case 400:
            return '已取消'
    }
}
const badStatus = (value) => {
    switch(value){
        case 1203: 
            return '商品库存不足'
        case 1204: 
            return '商品已下架'
        case 1223: 
            return '超过拼团购买数量限制'
        case 1212: 
            return '商品不存在'
        case 1239: 
            return '订单商品超出配送范围'
        case 1232: 
            return '购买批发商品的数量必须超过起批量'
        case 1242: 
            return '不在销售时间内'
        case 1244: 
            return '已超过最大购买数量'
        case 1228: 
            return '不存在此秒杀商品'
        case 1901: 
            return '分销商信息不存在'
        case 1903: 
            return '分销商信息不完整'
    }
}

const groupStatus =(value)=>{
    switch (value){
        case 0:
            return '拼团中'
        case 1:
            return '拼团成功'
        case 2:
            return '拼团失败'
    }
}
const couponStatus = (value)=>{
    switch (value){
        case 0:
            return '已被领取'
        case 1:
            return '立刻领取'
        case 2:
            return '已抢空'
    }
}

const payState=(value)=>{
    switch (value){
        case 'wxpay':
            return '微信支付'
        case 'alipay':
            return '支付宝支付'
        case 'offlinepay':
            return '线下支付'
    }
}
// 退款类型
const refundType=(value)=>{
	switch (value){
	    case 1:
	        return '仅退款'
	    case 2:
			return '退货退款'
	}
}
// 退款状态
const refundStatus =(value,type)=>{  //type为1 仅退款，  type为2 退货退款  ,type为3 退款详情状态  ,type为4  退款详情状态描述
    switch (value){
        case 0:
			if(type===3){
				return '请等待商家处理'
			}else if(type===4){
				return '您已成功发起退款申请，请耐心等待商家处理。'
			}else{
				return '商家待处理'
			}
        case 1:
			return '平台审核中'
        case 2:
			if(type===4){
				return '商家拒绝退款申请，您可再次申请或联系平台处理。'
			}else{
				return '退款关闭'
			}
        case 3:
			if(type===4){
				return '平台正在处理您的退款，请耐心等待'
			}else{
				return '退款中'
			}
        case 4:
            return '退款成功'
        case 5:
			if(type===4){
				return '平台拒绝退款申请，您可联系平台处理。'
			}else{
				return '退款关闭'
			}
		case 6:
			if(type===3){
				return '请退货并填写物流信息'
			}else if(type===4){
				return '商家已同意退货申请，请尽早退货'
			}else{
				return '待买家发货'
			}
		case 7:
			if(type===3){
				return '等待商家确认退货单'
			}else if(type===4){
				return '买家已将退货单寄出，等待卖家确认收货'
			}else{
				return '商家确认中'
			}
		case 8:
			if(type===4){
				return '因您超时未处理，本次退款申请关闭'
			}else{
				return '退款关闭'
			}
		case 9:
		    return '平台审核中'
		case 10:
			if(type===4){
				return '商家拒收退货退款物流，您可再次申请或联系平台处理。'
			}else{
				return '退款关闭'
			}
		case 11:
			if(type===4){
				return '您已撤销本次退款申请'
			}else{
				return '退款关闭'
			}
		case 12:
		    return '待买家发货'
		case 13:
			if(type===3){
				return '等待平台审核退款单'
			}else if(type===4){
				return '平台正在审核您的退款单，请耐心等待'
			}else{
				return '平台审核中'
			}
		case 14:
		    return '退款中'
		case 15:
			if(type===4){
				return '因您已确认收货，退款单自动关闭。'
			}else{
				return '退款关闭'
			}
		case 16:
			if(type===4){
				return '因商家已发货，退款单自动关闭，您可再次申请退款。'
			}else{
				return '退款关闭'
			}
    }
}


const toFixedTwo = (value)=>{
    return parseFloat(value).toFixed(2)
}

// const unixdate = (value) => {
//     return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
// }
// const YYMMDD = (value) => {
//     return moment(value * 1000).format('YYYY-MM-DD')
// }

const filterGoodsName = (value)=>{
    return value.length > 4 ? value.slice(0,4) : value;
}

const filterCellNum = (value)=>{
    return value.slice(0,3) + '*****' +value.slice(8,11);
}

const filterUnit = (value)=>{
    return value.split('|')[1]
}

const formatMsgDate = (value1,value2)=>{
    var now = new Date(value1*1000);
    var date = new Date(value2*1000);
    //计算时间间隔，单位为分钟
    var inter = parseInt((now.getTime() - date.getTime())/1000/60);
    if(inter == 0){
        return "刚刚";
    }
    //多少分钟前
    else if(inter < 60){
        return inter.toString() + "分钟前";
    }
    //多少小时前
    else if(inter < 60*24){
        return parseInt(inter/60).toString() + "小时前";
    }
    else if(now.getFullYear() == date.getFullYear()){
        return (date.getMonth()+1).toString() + "-" +
            date.getDate().toString() + " " + 
            date.getHours() + ":" +
            date.getMinutes();
    }
    else{
        return date.getFullYear().toString().substring(2, 3) + "-" +
        (date.getMonth()+1).toString() + "-" + 
        date.getDate().toString() + " " + 
        date.getHours() + ":" +
        date.getMinutes();
    }
}

const formatChatDate = (vale)=>{

}
export {orderStatus,refundStatus,refundType,toFixedTwo,filterGoodsName,filterCellNum,formatMsgDate,formatChatDate,payState,filterUnit,groupStatus,couponStatus, badStatus}
