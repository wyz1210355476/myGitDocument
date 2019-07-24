import {Message} from 'element-ui';
export function validate(rules, value) {
	let flag = true;
	for (let i in rules) {
	// rules.forEach((rule) => {
		if (rules[i].reg && !rules[i].reg.test(value)) {
			flag = false;
		}
		if (rules[i].min && rules[i].min > value) {
			flag = false;
		}
		if (rules[i].max && rules[i].max < value) {
			flag = false;
		}
		if (rules[i].length && rules[i].length < value.length) {
			flag = false;
		}
		if (rules[i].rangeLength && (rules[i].rangeLength[0] > value.length || rules[i].rangeLength[1] < value.length)) {
			flag = false;
		}
		if (!flag) {
			Message({
				type: 'error',
				message: rules[i].message
			});
			break;
		}
	}
	// });
	return flag;
}
//校验规则
// { reg: /^\d$/, message: '1' },   //正则校验
// { min: 6, message: '2'},      //最小值
// { max: 1000, message: '3'},    //最大值
// { length: 24 , message: '4'},   //最大长度
// { rangeLength:[5,24] , message: '5'}    //长度区间
export const modules = {
	'order_list': {
		options: [
			{ label: '订单号', key: 'no' },
			{ label: '收货人姓名', key: 'consignee_name' },
			{ label: '收货人手机', key: 'consignee_mob' },
			{ label: '收货人电话', key: 'consignee_tel' },
			{ label: '收货人地址', key: 'consignee_addr' },
			{ label: '客户名称', key: 'client_name' }
		],
		rules: {
			no: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	order_pay_list: {
		options: [
			{ label: '订单号', key: 'no' },
			{ label: '收款账号', key: 'charged_account' },
			{ label: '收款金额', key: 'charged_sum' },
			{ label: '付款人', key: 'pay_user' }
		],
		rules: {
			no: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	order_refund_list: {
		options: [
			{ label: '订单号', key: 'no' },
			{ label: '收款人', key: 'collector' },
			{ label: '退款类型', key: 'return_type' },
			{ label: '退款平台', key: 'return_plat' },
			{ label: '退款账号', key: 'return_account' }
		],
		rules: {
			no: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	order_delivery_list: {
		options: [
			{ label: '配送方式', key: 'logistics_name' },
			{ label: '订单号', key: 'order_no' },
			{ label: '收货人', key: 'consignee_name' },
			{ label: '物流单号', key: 'tracking_number' },
			{ label: '发货单号', key: 'no' }
		],
		rules: {
			order_no: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	order_return_list: {
		options: [
			{ label: '物流公司', key: 'logistics_name' },
			{ label: '订单号', key: 'order_no' },
			{ label: '收货人', key: 'consigner_name' },
			{ label: '物流单号', key: 'tracking_number' },
			{ label: '退货单号', key: 'no' }
		],
		rules: {
			order_no: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	order_service_list: {
		options: [
			{ label: '售后标题', key: 'reason' },
			{ label: '申请人', key: 'nickname' },
			{ label: '订单号', key: 'order_number' },
			{ label: '售后单流水号', key: 'number' },
			{ label: '售后服务状态', key: 'reply' },
			{ label: '售后服务类型', key: 'type' }
		],
		rules: {
			order_number: [
				{ reg: /^\d{0,24}$/, message: '请输入最多24位数字' },
			]
		}
	},
	iMessage_list: {
		options: [
			{ label: '发件人', key: 'from_uname' },
			{ label: '标题', key: 'title' }
		]
	},
	oMessage_list: {
		options: [
			{ label: '收件人', key: 'to_uname' },
			{ label: '标题', key: 'title' }
		]
	},
	member_list: {
		options: [
			{ label: '客户名称', key: 'loginid' },
			{ label: '联系人姓名', key: 'truename' },
			{ label: '邮箱', key: 'email' },
			{ label: '手机号', key: 'mobile' }
		]
	},
	promotion_list: {
		options: [
			{ label: '活动名称', key: 'name' },
			{ label: '活动标签', key: 'labelName' }
		]
	},
	coupon_list: {
		options: [
			{ label: '优惠券名称', key: '1' },
			{ label: '面值', key: '2' }
		]
	},
	evaluate_list: {
		options: [
			{ label: '发表人', key: 'appraiserName' },
			{ label: '商品编号', key: 'objectCode' },
			{ label: '内容', key: 'content' },
			{ label: '商品名称', key: 'objectName' },
		]
	},
	goods_list: {
		options: [
			{ label: '商品名称', key: 'goodsName' },
			{ label: '商品编号', key: 'goodsCode' },
		]
	},
	cus_rebate: {
		options: [
			{ label: '客户帐号', key: 'loginid' },
			{ label: '姓名', key: 'truename' },
		]
	},
	recommended_audit: {
		options: [
			{ label: '客户名称', key: '1' },
			{ label: '手机号', key: '2' },
			{ label: '推荐码', key: '3' },
		]
	},
	invoice_manage: {
		options: [
			{ label: '订单号', key: '1' },
			{ label: '发票抬头', key: '2' },
			{ label: '发票号码', key: '3' },
		]
	},
	contract_manage: {
		options: [
			// { label: '待支付', key: '1' },
			// { label: '已支付', key: '2' },
			// { label: '货到付款', key: '3' },
			// { label: '待发货', key: '4' },
			// { label: '已发货', key: '5' },
			{ label: '已收货', key: '1' },
			// { label: '未完成', key: '7' },
			// { label: '已作废', key: '8' },
			{ label: '已完成', key: '2' },
		]
	},
	after_sales:{
		options: [
			{ label: '订单号', key: '1' },
			
		]
	}
}