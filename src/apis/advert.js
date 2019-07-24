// 广告管理接口
// 获取全部广告位
export const adsList = {
	url: '/manager/ceshopadvert/position/findAll.do',
	method: "POST"
}
// 获取广告位
export const getAdvert = {
	url: '/manager/ceshopadvert/position/get.do',
	method: "POST"
}
// 广告管理分页查询
export const getAdvertPage = {
	url: '/manager/ceshopadvert/position/page.do',
	method: "POST"
}
// 更新广告位
export const update = {
	url: '/manager/ceshopadvert/position/update.do',
	method: "POST"
}
// 搜索广告位
export const search = {
	url: '/manager/ceshopadvert/position/search.do',
	method: "POST"
}
//栏目设置接口
// 广告管理栏目内容分页查询
export const getAdColumnPage = {
	url: '/manager/ceshopadvert/content/page.do',
	method: "POST"
}
//删除广告栏目内容
export const delColumn = {
	url: '/manager/ceshopadvert/content/delete.do',
	method: "POST"
}
//终端设置显示隐藏（pc、移动）
export const updateState = {
	url: '/manager/ceshopadvert/content/updateState.do',
	method: "POST"
}
//获取广告栏目信息
export const getColumnInfo = {
	url: '/manager/ceshopadvert/content/get.do',
	method: "POST"
}
//编辑广告位内容
export const updateAdInfo = {
	url: '/manager/ceshopadvert/content/update.do',
	method: "POST"
}
//添加广告位内容
export const addAdInfo = {
	url: '/manager/ceshopadvert/content/add.do',
	method: "POST"
}
//广告排序
export const sort = {
	url: '/manager/ceshopadvert/content/sort.do',
	method: "POST"
}





