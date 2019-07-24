//获取客户账户信息
export const getBaccount = {
	url: '/pmanager/bankroll/getBaccount',
	method: "GET"
}
//手工调整返利
export const grantBalance = {
	url: '/pmanager/bankroll/grantBalance',
	method: "POST"
}
//获取客户返利明细
export const getBaccountHistory = {
	url: '/pmanager/bankroll/getBaccountHistory',
	method: "GET"
}
//获取返利中商品列表
export const getRebateGoods = {
	url: '/pmanager/batch/rebate/getRebateGoods',
	method: "GET"
}
//获取返利中商品明细
export const getRebateGoodsDetail = {
	url: '/pmanager/batch/order/getGoodsRebate',
	method: "GET"
}
//获取收支类型列表
export const getBaccountBapatypeList = {
	url: '/pmanager/bankroll/getBaccountBapatype',
	method: "GET"
}
//新增收支类型
export const addBaccountBapatype = {
	url: '/pmanager/bankroll/addBaccountBapatype',
	method: "POST"
}
//编辑收支类型
export const editBaccountBapatype = {
	url: '/pmanager/bankroll/updateBaccountBapatype',
	method: "POST"
}
//获取返利规则
export const getRebateUseRule = {
	url: '/pmanager/batch/rebate/getRebateUseRule',
	method: "GET"
}
//设置返利规则
export const rebateUseSet = {
	url: '/pmanager/batch/rebate/rebateUseSet',
	method: "POST"
}
//新增返利商品（设置商品返利规则）
export const addOrSetRebateGoods = {
	url: '/pmanager/batch/rebate/rebateSet',
	method: "POST"
}
//获取商品返利详情
export const getRebateDetailByGoodsId = {
	url: '/pmanager/batch/rebate/getRebate',
	method: "GET"
}
// 获取推荐返利列表
export const getRecommendedAuditList = {
	url: '/pmanager/bankroll/recommendedAuditList',
	method: "GET"
}
// 修改推荐返利列表状态
export const upRecommendedAudit = {
	url: '/pmanager/bankroll/upRecommendedAudit',
	method: "GET"
}
// 通过客户名称获取该客户的信息
export const getUserInfoByLogin = {
	url: '/pmanager/account/getUserInfoByLogin',
	method: "GET"
}
// 添加推荐返利资格
export const addRecommendedAudit = {
	url: '/pmanager/bankroll/addRecommendedAudit',
	method: "GET"
}

// 删除申请推荐返利资格信息
export const delRecommendedAudit = {
	url: '/pmanager/bankroll/delRecommendedAudit',
	method: "GET"
}

// 删除申请推荐返利资格信息
export const recommendRebate = {
	url: '/pmanager/bankroll/recommendRebate',
	method: "GET"
}

// 获取推荐返利协议条款
export const getRebateProtocol = {
	url: '/pmanager/registerprotocol/rebateProtocol',
	method: "GET"
}
// 保存推荐返利协议条款
export const saveRebateProtocol = {
	url: '/pmanager/registerprotocol/saveRebateProtocol',
	method: "POST"
}