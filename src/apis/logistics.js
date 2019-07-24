// 物流配送方式列表
export const deliverModeList = {
	url: '/pmanager/logistics/get',
	method: "GET"
}
// 物流公司列表
export const logisticsCompanyList = {
	url: '/pmanager/Company/index',
	method: "GET"
}
// 删除物流配置项
export const deleteLogistics = {
	url: '/pmanager/logistics/del',
	method: "GET"
}
// 添加物流配置信息
export const addDeliverMode = {
	url: '/pmanager/logistics/add',
	method: "POST"
}
// 编辑物流配置信息
export const editDeliverMode = {
	url: '/pmanager/logistics/modify',
	method: "POST"
}
/**
外贸版接口
*/ 
// 获取区域
export const getCountryArea = {
	url: '/pmanager/address/getCountryArea',
	method: "GET"
}
// 获取区下的国家
export const getCountryByAreaId = {
	url: '/pmanager/address/getCountryByAreaId',
	method: "GET"
}