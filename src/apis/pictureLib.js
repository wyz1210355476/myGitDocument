// 获取所有图片列表
export const getAllPics = {
	url: '/manager/ceshopimgrepository/img/findPage',
	method: "POST"
}
// 删除图片
export const delPics = {
	url: '/manager/ceshopimgrepository/img/delete',
	method: "GET"
}
// 编辑
export const editor = {
	url: '/manager/ceshopimgrepository/img/save',
	method: "POST"
}
// 分类接口
export const appList = {
	url: '/manager/ceshopimgrepository/appList/find',
	method: "POST"
}
// 转移应用
export const transfer = {
	url: '/manager/ceshopimgrepository/img/transfer',
	method: "POST"
}

