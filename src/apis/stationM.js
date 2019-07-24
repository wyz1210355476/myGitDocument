//发件箱列表
export const outList = {
	url: '/pmanager/message/outboxList',
	method: "GET"
}
//查看发件箱信息
export const viewOutMessage = {
	url: '/pmanager/message/getOutbox',
	method: "GET"
}
//删除发件箱信息
export const delOutMessage = {
	url: '/pmanager/message/delOutbox',
	method: "POST"
}
//收件箱列表
export const inList = {
	url: '/pmanager/message/inboxList',
	method: "GET"
}
//查看收件箱信息
export const viewInMessage = {
	url: '/pmanager/message/getInbox',
	method: "GET"
}
//删除收件箱信息
export const delInMessage = {
	url: '/pmanager/message/delInbox',
	method: "POST"
}
//发消息
export const addMessage = {
	url: '/pmanager/message/send',
	method: "POST"
}
//回复信息
export const reMessage = {
	url: '/pmanager/message/reply',
	method: "POST"
}
//设置消息为已读
export const seeMessage = {
	url: '/pmanager/message/setIsRead',
	method: "GET"
}