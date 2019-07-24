// Oauth配置保存
export const setSave = {
	url: '/manager/ceshopconfig/datasynoauth/save',
	method: "POST"
}
// Oauth配置获取
export const getSetInfo = {
	url: '/manager/ceshopconfig/datasynoauth/get.do',
	method: "POST"
}

// 数据对接开关设置
export const switchSet = {
	url: '/manager/ceshopconfig/datasynconfig/save.do',
	method: "POST"
}
// 获取数据对接开关设置
export const getSwitchSet = {
	url: '/manager/ceshopconfig/datasynconfig/get.do',
	method: "POST"
}