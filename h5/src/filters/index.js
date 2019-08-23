import moment from 'moment'
const orderStatus =(value)=>{
    switch (value){
        case 0:
            return '待付款'
            break;
        case 1:
            return '待平台确认收款'
            break;
        case 100:
            return '待发货'
            break;
        case 101:
            return '退款中'
            break;
        case 102:
            return '已退款'
            break;
        case 200:
            return '待收货'
            break;
        case 201:
            return '退款中'
            break;
        case 202:
            return '已退款'
            break;
        case 300:
            return '已完成'
            break;
        case 301:
            return '退款中'
            break;
        case 302:
            return '已退款'
            break;
        case 400:
            return '已取消'
            break;
    }
}
const payState=(value)=>{
    switch (value){
        case 'wxpay':
            return '微信支付'
            break;
        case 'alipay':
            return '支付宝支付'
            break;
        case 'offlinepay':
            return '线下支付'
            break;
    }
}
const refundStatus =(value)=>{
    switch (value){
        case 0:
            return '商家待处理'
            break;
        case 1:
            return '商家审核通过'
            break;
        case 2:
            return '商家审核不通过'
            break;
        case 3:
            return '平台审核通过'
            break;
        case 4:
            return '平台已退款'
            break;
        case 5:
            return '平台不通过'
            break;
    }
}
const toFixedTwo = (value)=>{
    return parseFloat(value).toFixed(2)
}

const unixdate = (value) => {
    return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
}
const YYMMDD = (value) => {
    return moment(value * 1000).format('YYYY-MM-DD')
}

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
export {orderStatus,refundStatus,unixdate,toFixedTwo,filterGoodsName,filterCellNum,YYMMDD,formatMsgDate,formatChatDate,payState,filterUnit}
