// 获取支付方式列表
export const getPaymentList = {
	url: '/manager/payway/config/findAll.do',
	method: "GET"
	// baseURL: "http://1711010009.dev-pool1-ceshop.make.yun300.cn"

}
// 启用停用支付方式
export const enableOrStopPayment = {
	url: '/manager/payway/config/updateStatus.do',
	method: "GET"
	// baseURL: "http://1711010009.dev-pool1-ceshop.make.yun300.cn"
}
// 获取在线聚合支付方式配置信息
export const getMerchantConfig = {
	url: '/manager/unionpay/config/getMerchantConfig',
	method: "GET"
	// baseURL: "http://1711010009.dev-pool1-ceshop.make.yun300.cn"
}
//保存新增付方式配置信息
export const addPayWay = {
	url: '/manager/payway/config/save.do',
	method: "POST"
	// baseURL: "http://1711010009.dev-pool1-ceshop.make.yun300.cn"
}
// 获取新增支付方式配置信息
export const getPayWay = {
	url: '/manager/payway/config/findPayType.do',
	method: "GET"
}
//修改支付方式保存
export const editPayWay = {
	url: '/manager/payway/config/update.do',
	method: "POST"
}
// 根据id获取支付方式信息
export const getPayWayById = {
	url: '/manager/payway/config/getById.do',
	method: "POST"
}
// 删除银行转账配置信息
export const delBankConfig = {
	url: '/manager/payway/config/deleteMerchantCofigById.do',
	method: "get"
}