// 发票信息列表
export const invoiceList = {
	url: '/pmanager/Invoice/getContent',
	method: "GET"
}
// 新增发票
export const addInvoice = {
	url: '/pmanager/Invoice/addContent',
	method: "GET"

}
// 编辑发票
export const editInvoice = {
	url: '/pmanager/Invoice/updateContent',
	method: "GET"
}
// 删除发票
export const delInvoice = {
	url: '/pmanager/Invoice/deleteContent',
	method: "POST"
}

// 是否启用发票
export const enableInvoice = {
	url: '/pmanager/invoice/invoiceConfig',
	method: "POST"
}
// 获取管理发票列表
export const getInvoiceMamageList = {
	url: '/pmanager/invoice/getHistory',
	method: "POST"
}
// 查看发票信息
export const getInvoiceInfo = {
	url: '/pmanager/invoice/getHistoryById',
	method: "POST"
}
// 开票
export const updateInvoice = {
	url: '/pmanager/invoice/updateHistory',
	method: "POST"
}