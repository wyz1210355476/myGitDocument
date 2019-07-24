//获取配送地址
export const getShipAddress = {
	url: '/pmanager/address/get',
	method: "GET"
}
//添加配送地址
export const addShipAddress = {
	url: '/pmanager/address/add',
	method: "POST"
}
//编辑配送地址
export const editShipAddress = {
	url: '/pmanager/address/edit',
	method: "POST"
}
//删除配送地址
export const delShipAddress = {
	url: '/pmanager/address/del',
	method: "GET"
}
//设为默认地址
export const setDefaultShipAddress = {
	url: '/pmanager/address/setDefault',
	method: "GET"
}
//获取国家列表
export const getCountryList = {
	url: '/pmanager/address/getCountry',
	method: "GET"
}