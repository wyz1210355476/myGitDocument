// 获取合同管理列表
export const getContractList = {
	url: '/pmanager/agreement/agreementList',
	method: "GET"
}


// 获取合同模板信息
export const getSetInfo = {
	url: '/pmanager/agreement/getContractTemplateById',
	method: "GET"
}

// 添加模板
export const addTemplate = {
	url: '/pmanager/agreement/addContractTemplate',
	method: "POST"
}

// 添加模板
export const editTemplate = {
	url: '/pmanager/agreement/upContractTemplate',
	method: "POST"
}

// 下载文件
export const downLoad = {
	url: '/pmanager/agreementDownload/download',
	method: "POST"
}
// 生成合同
export const createAgreement = {
	url: '/pmanager/agreement/createAgreement',
	method: "POST"
}