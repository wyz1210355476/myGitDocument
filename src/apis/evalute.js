// 获取评价列表(xin)
export const getEvalute = {
	url: '/pmanager/judgement/datalist',
	method: "POST"
}
// 获取评价详情(xin)
export const getEvaluteDetail = {
	url: '/pmanager/judgement/show',
	method: "GET"
}
// 删除评价(xin)
export const deleteEvalute = {
	url: '/pmanager/judgement/delete',
	method: "GET"
}
// 是否需要开启审核(xin)
export const needAuditing = {
	url: '/pmanager/judgement/auditeSatus',
	method: "POST"
}
// 切换开启/关闭审核(xin)
export const changeAuditing = {
	url: '/pmanager/judgement/auditeSatusSetting',
	method: "POST"
}
// 审核评价(xin)
export const auditing = {
	url: '/pmanager/judgement/audite',
	method: "POST"
}
// 回复评价
export const replay = {
	url: '/pmanager/judgement/reply',
	method: "POST"
}
// 显示/隐藏评价
export const displaying = {
	url: '/pmanager/judgement/toggleShow',
	method: "POST"
}
// 显示/隐藏评价回复
export const replyst = {
	url: '/pmanager/judgement/toggleReplyShow',
	method: "POST"
}
// 删除评价回复
export const delreply = {
	url: '/pmanager/judgement/deleteReply',
	method: "GET"
}