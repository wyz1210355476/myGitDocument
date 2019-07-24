// 获取商品销售排行
export const getXsph = {
	url: '/pmanager/count/goodsTop5',
	method: "GET"
}
// 获取业务处理数据
export const getYwcl = {
	url: '/pmanager/count/goodsCount',
	method: "GET"
}
// 获取订单趋势
export const getDdqs = {
	url: '/pmanager/count/payDeliveryCount',
	method: "GET"
}
// 获取网站数据
export const getSite = {
	url: '/manager/ceshopconfig/getSiteInfo.do',
	method: "GET"
}
//获取网站周期
export const getCycle = {
	baseURL: __ce.consoleURL,
	url: '/manager/console/getSiteCycle.do',
	method: "GET"
}
//获取网站列表
export const getSiteList = {
	baseURL: __ce.consoleURL,
	url: '/manager/console/getSiteList.do?' + new Date().getTime(),
	method: "GET"
}
//获取menu
export const getMenu = {
	baseURL: __ce.consoleURL,
	url: '/manager/console/menus.do?' + new Date().getTime(),
	method: "GET"
}
//获取menu
export const getSiteMenu = {
	url: 'manager/ceshopmenu/site/menus.do?' + new Date().getTime(),
	method: "GET"
}
//获取网站应用列表
export const getAppList = {
	url: '/manager/ceshopconfig/findAppList.do?' + new Date().getTime(),
	method: "GET"
}
//获取网站访问情况
export const getVisitInfo = {
	url: '/manager/ceshopconfig/getVisitInfo.do',
	method: "GET"
}


export const testLogin = {
    baseURL:__ce.loginURL,
    url: '/CAS/login',
    method: "POST"
}