import Vue from 'vue';
// import areaData from 'china-area-data';
import * as countryData from '@c/util/metaTreeCountryData';

/*
    date 可以日期对象或可以转换成日期对象的格式  例如 1481370957935
    fmt  例如：yyyy-MM-dd hh:mm:ss
*/
Vue.filter('formatDate', function (date,fmt,sec) {
    if(!date){return ""}
    if(sec){
        date = date*1000;
    }
    date = new Date(date);
    var o = {
    "M+" : date.getMonth()+1, //月份
    "d+" : date.getDate(), //日
    "h+" : date.getHours(), //小时
    "m+" : date.getMinutes(), //分
    "s+" : date.getSeconds(), //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S" : date.getMilliseconds() //毫秒
    };
    var week = {
    "0" : "/u65e5",
    "1" : "/u4e00",
    "2" : "/u4e8c",
    "3" : "/u4e09",
    "4" : "/u56db",
    "5" : "/u4e94",
    "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;

});
/**
    截取n位小数，例如：
    参数：num   5345.234234     注释：  要截取的数
          n     2               注释：  几位小数
          type  round           注释：  round ceil floor  (默认为round)
    结果        5345.23
*/
Vue.filter('toFixed', function (num,n,type="round") {
    let f = parseFloat(num);
    if (isNaN(f)) {
        f = 0;
    }
    f = Math[type](f*(10**n))/10**n;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + n) {
        s += '0';
    }
    if(Vue.prototype.$unit){
        s = Vue.prototype.$unit + s
    }
    return s;
});

/**
 * 百分比转换
 */
Vue.filter('percent', function(val){
    return val * 100
})

var areaData = countryData.formatData2();

Vue.filter('tranToAddr', function(province, city, district) {
    if (!province) {
        return;
    }
    // if (province == '710000') {
    //     return areaData['86'][province];
    // } else if (province == '810000' || province == '820000') {
    //     return areaData[province] ? (areaData['86'][province] + ' ' + areaData[province][city]) : '';
    // } else {
        
    // }
    return (areaData[province] && areaData[city]) ? (areaData['0_cn'][province] + ' ' + areaData[province][city] + ' ' + areaData[city][district]) : '';
});

Vue.filter('specCharacter',function(value){
    if(value){
        return value.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    }   
})