//获取国际区号
export const getCountryCode = {
	url: '/manager/ceshopmenu/account/getTelZone',
	method: "GET"
}
//获取子账号列表
export const getAccountList = {
	url: '/manager/ceshopmenu/account/list',
	method: "GET"
}
//新增子账号
export const addNewAccount = {
	url: '/manager/ceshopmenu/account/create',
	method: "POST"
}
//获取子账号的可授权菜单列表
export const getAuthorityList = {
	url: '/manager/ceshopmenu/permission/menus',
	method: "GET"
}
//保存子账号菜单授权设置
export const saveAnthoritySet = {
	url: '/manager/ceshopmenu/permission/save',
	method: "POST"
}