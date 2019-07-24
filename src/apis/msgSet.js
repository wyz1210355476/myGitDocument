//获取所有短信模板
export const getAllMsgTemplate = {
	url: '/manager/ceshoptemplate/config/find.do',
	method: "GET"
}
// 获取单个短信模板
export const getMsgTemplate = {
	url: '/manager/ceshoptemplate/config/get.do',
	method: "GET"
}
// 编辑短信模板
export const editMsgTemplate = {
	url: '/manager/ceshoptemplate/config/update.do',
	method: "GET"
}