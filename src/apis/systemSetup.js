//获取基本设置信息
export const getBasicSet = {
	url: '/manager/ceshopconfig/config/get',
	method: "GET"
}
//保存基本设置信息
export const saveBasicSet = {
	url: '/manager/ceshopconfig/config/save',
	method: "POST"
}
//获取邮箱设置信息
export const getMailSet = {
	url: '/manager/ceshopconfig/mail/get',
	method: "GET"
}
//保存邮箱设置信息
export const saveMailSet = {
	url: '/manager/ceshopconfig/mail/save',
	method: "POST"
}
//邮件测试
export const saveMailTest = {
	url: '/manager/ceshopconfig/mail/test',
	method: "POST"
}
// 获取第三方代码
export const getThirdPartyCode = {
	url: '/manager/ceshopconfig/codeset/get',
	method: "GET"
}
// 保存第三方代码
export const saveThirdPartyCode = {
	url: '/manager/ceshopconfig/codeset/save',
	method: "GET"
}
// 获取网址规则
export const getUrlRules = {
	url: '/manager/ceshopconfig/siterule/get',
	method: "GET"
}
// 保存网址规则
export const saveUrlRules = {
	url: '/manager/ceshopconfig/siterule/save',
	method: "GET"
}
// 获取网站状态
export const getWebStatus = {
	url: '/manager/ceshopconfig/status/get',
	method: "GET"
}
// 保存网站状态
export const saveWebStatus = {
	url: '/manager/ceshopconfig/status/save',
	method: "GET"
}

////////////////////////页面设置///////////////////////////
// 获取设置列表
export const getReNovationList = {
	baseURL: __ce.designImgURL,
	url: '/sso/getPageList',
	method: "GET"
}
// 设为首页
export const seReNovationHome = {
	baseURL: __ce.designImgURL,
	url: '/sso/updateHomePage',
	method: "POST"
}
// 获取模板列表
export const getContentList = {
	baseURL: __ce.designImgURL,
	url: '/sso/getContentList',
	method: "GET"
}
// 重命名
export const updateName = {
	baseURL: __ce.designImgURL,
	url: '/sso/updatePage',
	method: "POST"
}
// 新建页面
export const createPage = {
	baseURL: __ce.designImgURL,
	url: '/sso/createPage',
	method: "POST"
}
// 删除页面
export const deletePage = {
	baseURL: __ce.designImgURL,
	url: '/sso/deletePage',
	method: "POST"
}
// 复制页面
export const copyPage = {
	baseURL: __ce.designImgURL,
	url: '/sso/copyPage',
	method: "POST"
}
// 发步页面
export const releasePage = {
	baseURL: __ce.designImgURL,
	url: '/sso/publishPage',
	method: "POST"
}