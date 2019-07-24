 export const Regexs = {
     /**
      * Email
      * @type RegExp
      */
     Email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
     /**
      * Url
      * @type RegExp
      */
     Url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
     /**
      * 图片链接
      * @type RegExp
      */
     imgUrl: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?\.(jpg|gif|png|jpeg)$/,
     /**
      * 中文
      * @type RegExp
      */
     Chinese: /[\u4e00-\u9fa5]/,
     /**
      * 双字节
      * @type RegExp
      */
     DoubleByte: /[^\x00-\xff]/,
     /**
      * 非负数
      * @type RegExp
      */
     NotNegativeNum: /^\d+(\.{0,1}\d+){0,1}$/,
     /**
      * 负整数
      * @type RegExp
      */
     NegativeInt: /^-[0-9]*[1-9][0-9]*$/,
     /**
      * 非负整数
      * @type RegExp
      */
     NotNegativeInt: /^\d+$/,
     /**
      * 正整数
      * @type RegExp
      */
     PositiveInt: /^[0-9]*[1-9][0-9]*$/,
     /**
      * 非正整数
      * @type RegExp
      */
     NotPositiveInt: /^((-\d+)|(0+))$/,
     /**
      * 整数
      * @type RegExp
      */
     Int: /^-?\d+$/,
     /**
      * 浮点数
      * @type RegExp
      */
     Float: /^-?([1-9]\d*\.?\d*|0\.?\d*[1-9]\d*|0?\.0+|0)$/,
     /**
      * 非负浮点
      * @type RegExp
      */
     NotNegativeFloat: /^\d+(.\d+)?$/,
     /**
      * 正浮点
      * @type RegExp
      */
     PositiveFloat: /^((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)$/,
     /**
      * 非正浮点
      * @type RegExp
      */
     NotPositiveFloat: /^((-\d+.\d+)?)|(0+(.0+)?)$/,
     /**
      * 负浮点数
      * @type RegExp
      */
     /**
      * 正两位小数
      * @type {RegExp}
      */
     PosFixedTwoFloat: /^\d{0,8}\.{0,1}(\d{1,2})?$/,
     NegativeFloat: /^(-(((0-9)+.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
     /**
      * 英文字母
      * @type RegExp
      */
     English: /^[A-Za-z]+$/,
     /**
      * 英文大写字母
      * @type RegExp
      */
     EnglishUpper: /^[A-Z]+$/,
     /**
      * 英文小写字母
      * @type RegExp
      */
     EnglishLower: /^[a-z]+$/,
     /**
      * 英文字母+数字组合
      * @type RegExp
      */
     EnglishOrNumber: /^[A-Za-z0-9]+$/,
     /**
      * 英文字母+数字+下划线组合
      * @type RegExp
      */
     EnglishOrNumberOrUnderline: /^w+$/,
     /**
      * html
      * @type RegExp
      */
     Html: /<(.*)>.*<\/\1>|<(.*) \/>/,
     /**
      * 国内电话号码
      * @type RegExp
      */
     ChinaTel: /((\d{3}-\d{8})|(\d{4}-\d{7})|(\d{4}-\d{8}))(-\d+)?$/,
     /**
      * 国内邮编
      * @type RegExp
      */
     ChinaPostCode: /^[1-9][0-9]{5}$/,
     /**
      * 国内身份证号
      * @type RegExp
      */
     ChinaIDCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
     /**
      * 人类年龄(0~120)
      * @type RegExp
      */
     HumanAge: /^(([0-9])|([1-9][0-9])|(1[0-1][0-9])|(120))$/
 }



 // 本地存储
 function storage(type, k, v) {
     return v ? window[type][k] = JSON.stringify(v) : JSON.parse(window[type][k])
 }

 export const store = (k, v) => storage('localStorage', k, v)
 export const cache = (k, v) => storage('sessionStorage', k, v)

 //深层复制
 export function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

/**
 * 浅扩展一个对象
 * @param {object} o 目标对象
 * @param {object} t 扩展源对象
 */
export function publicExtend(o, t){
    if(t == null || typeof t != 'object') return

    Object.keys(t).forEach(function(key){
        o[key] = t[key]
    })
    return o
}

/**
 * 保留2位小数点
 */

export function toFixed(num, n, type="round") {
    let f = parseFloat(num);
    if(!n) n = 2;
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
    return s;
};

/*
    date 可以日期对象或可以转换成日期对象的格式  例如 1481370957935
    fmt  例如：yyyy-MM-dd hh:mm:ss
*/
export function formatDate(date,fmt) {
    if(!date){return ""}
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

};

//字符串前后空格处理
export function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}

export function minOfNums() {
    let nums = [...arguments];
    let min = arguments[0];
    nums.forEach((v) => {
        if (v < min) {
            min = v;
        }
    });
    return min;
}

//转义字符替换为特殊字符
export function specCharacter(str){
    if(str){
        return str.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    }else{
        return "";
    }   
}
// 递归查询某一分类下的所有分类
export function findCategory(category,id) {
    let ids = [].concat(id);
    let temIds = [];
    category.forEach((item,index) => {
        ids.forEach(($id) => {
            if(item.parentId+"" === $id+""){
                temIds.push(item.id+"");
                item.disabled = true;
            }
            if(item.id == $id){
                item.disabled = true;
            }
        })
    })
    if(temIds.length > 0){
        findCategory(category,temIds)
    }
    return category;
}