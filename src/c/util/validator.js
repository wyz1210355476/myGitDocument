import {Regexs} from './index.js';

//调用校验
export function submitForm(form, callback) { //form参数为form表单对象，即this.$refs[formname]
	form.validate((valid) => {
	  	if (valid) {
	    	callback();
	  	} else {
	    	console.log('error submit!!');
	    	return false;
	  	}
	});
}

/*********  校验规则  **********/
//邮箱
export function checkEmai(rule, value, callback) {
	if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('邮箱格式不正确'));
	}
};
//中英文、数字、"_"、"-"，且必须含有中英文、数字
export function cnOrEnOrNumOrLine(rule, value, callback) {
	if ((/^[\u4e00-\u9fa5a-zA-Z0-9\-_]+$/.test(value)  && /[\u4e00-\u9fa5a-zA-Z0-9]/.test(value)) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('支持中英文、数字、"_"、"-"，必须有中英文或数字'));
	}
};
//中英文、数字、"_"、"-"、空格，且必须含有中英文、数字
export function cnOrEnOrNumOrLineOrSpace(rule, value, callback) {
	if ((/^[\u4e00-\u9fa5a-zA-Z0-9\-_\s]+$/.test(value)  && /[\u4e00-\u9fa5a-zA-Z0-9]/.test(value)) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('支持中英文、数字、-、_、空格，必须有中英文或数字'));
	}
};
//中文
export function chinese(rule, value, callback) {
	if (/^[\u4e00-\u9fa5]/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('请输入中文'));
	}
};
//英文、数字(英文必须有)
export function enOrNum(rule, value, callback) {
	if ((/^[a-zA-Z0-9\-_]+$/.test(value) && /^[A-Za-z]/.test(value)) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('支持输入英文、数字，且必须有英文'));
	}
};
//英文、数字、"_"
export function enOrNumOrUnderline(rule, value, callback) {
	if ((/^[a-zA-Z0-9_]+$/.test(value)  && /[a-zA-Z0-9]/.test(value)) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//英文、数字、空格
export function enOrNumOrSpace(rule, value, callback) {
	if (/^[a-zA-Z0-9\s]+$/.test(value) && /^[A-Za-z0-9]/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//英文字母、数字、“@”、“.”、“_”及“-”(密码)
export function pwdOfEnOrNum (rule, value, callback) {
	if ((/^[a-zA-Z0-9\-_@.]+$/.test(value)  && /[a-zA-Z0-9]/.test(value)) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//英文字母、数字、特殊字符(密码)
export function pwdOfEnOrNumOrOther (rule, value, callback) {
	console.log(value)
	if (/^[a-zA-Z0-9#@!~%^&*￥……\(\)\-=+_\[\]\\\|'";:,./\?><]+$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('支持输入英文、数字以及特殊字符'));
	}
};
//英文
export function english(rule, value, callback) {
	if (/^[A-Za-z]/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('只能输入英文'));
	}
};
//手机号码
export function phone(rule, value, callback) {
	if (/^1[0-9]{10}$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('手机号码格式不正确'));
	}
};
//电话区号
export function areacode(rule, value, callback) {
	if (/^[01][0-9]{2,3}$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('电话区号格式不正确'));
	}
};
//电话号码(不含区号)
export function tel(rule, value, callback) {
	if (/^[0-9]{7,8}$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('电话号码格式不正确'));
	}
};
//电话号码(含区号及分机号)
export function telAll(rule, value, callback) {
	if (Regexs.ChinaTel.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('电话号码格式不正确'));
	}
};
//手机或电话号码(含区号及分机号)
export function phoneOrTel(rule, value, callback) {
	if (Regexs.ChinaTel.test(value) || /^[1][3|4|5|7|8][0-9]{9}$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('手机号码或电话号码格式不正确'));
	}
};
//邮编
export function ChinaPostCode(rule, value, callback) {
	if (Regexs.ChinaPostCode.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('请输入正确的邮编'));
	}
};
//省市区三级联动 (对港澳台可能校验出错)
export function region(rule, value, callback) {
	if (!value || value === '' || value == null) {
	  	callback(new Error(''));
	} else {
	  	callback();
	}
};
//非负数
export function NotNegativeNum(rule, value, callback) {
	if (Regexs.NotNegativeNum.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//正整数
export function Int(rule, value, callback) {
	if (Regexs.Int.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//正整数
export function PositiveInt(rule, value, callback) {
	if (Regexs.PositiveInt.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//非正整数
export function NotPositiveInt(rule, value, callback) {
	if (Regexs.NotPositiveInt.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//非负整数
export function NotNegativeInt(rule, value, callback) {
	if (Regexs.NotNegativeInt.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//浮点
export function Float(rule, value, callback) {
	if (Regexs.Float.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//正浮点
export function PositiveFloat(rule, value, callback) {
	if (Regexs.PositiveFloat.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//非负浮点
export function NotNegativeFloat(rule, value, callback) {
	if (Regexs.NotNegativeFloat.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//国内身份证号
export function ChinaIDCard(rule, value, callback) {
	if (Regexs.ChinaIDCard.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('请输入正确的身份证号'));
	}
};
//6位整数
export function Int6(rule, value, callback) {
	if (/^-?[0-9]{1,6}$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('请输入6位以内整数'));
	}
};
//小数点前11位，小数点后两位(正数)
export function PositiveDecimal(rule, value, callback) {
	if (/^[0-9]{1,11}([.]{1}[0-9]{1,2})?$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//小数点前11位，小数点后两位
export function Decimal(rule, value, callback) {
	if (/^-?[0-9]{1,11}([.]{1}[0-9]{1,2})?$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('小数点前11位，小数点后两位'));
	}
};
//小数点前11位，小数点后两位
export function Decimal6(rule, value, callback) {
	if (/^-?[0-9]{1,6}([.]{1}[0-9]{1,2})?$/.test(value) || value == '' || value == null) {
	  	callback();
	} else {
	  	callback(new Error('小数点前6位，小数点后两位'));
	}
};
//数字范围
export function range(rule, value, callback) {
	if (value <= rule.range[1] && value >= rule.range[0]) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};
//日期校验
export function dateCheck(rule, value, callback) {
	if (/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/.test(value) || value == ''  || value == null) {
	  	callback();
	} else {
	  	callback(new Error(''));
	}
};

export function checkZhekou(rule, value, callback) {
	let zhekou = /^\d\.\d+$|^([1-9]||10)$/
  	if(zhekou.test(value)){
  		callback();
  	}else{
  		callback(new Error('请填写正确的折扣'));
  	}
};
export function checkJianqian(rule, value, callback) {
      	let jianqian = /^\d*\.\d+$|^\d*$/
      	if(jianqian.test(value)){
      		callback();
      	}else{
      		callback(new Error('请填写正确的减价'));
      	}
};