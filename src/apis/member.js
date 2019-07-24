//客户列表
export const getMemberList = {
	url: '/pmanager/account/selectVagueCheckSysUserPage',
	method: "GET"
}
// 模糊查询客户列表
export const searchMemberList = {
	url: 'pmanager/account/getSysUserInfo',
	method: "GET"
}

//新增客户
export const addMember = {
	url: '/pmanager/account/addUserWithTag',
	method: "POST"
}
//编辑客户
export const editMember = {
	url: '/pmanager/account/updateSysUserWithTag',
	method: "POST"
}
//查看客户
export const viewMember = {
	url: '/pmanager/account/findUser',
	method: "GET"
}
//删除客户
export const delMember = {
	url: '/pmanager/account/deleteSysUserWithCheck',
	method: "GET"
}
//启用/停用客户
export const turnMember = {
	url: '/pmanager/account/updateSysUserStatBatch',
	method: "GET"
}
//等级列表
export const getLevelList = {
	url: '/pmanager/userlevel/fetchAll',
	method: "GET"
}
//新增等级
export const addLevel = {
	url: '/pmanager/userlevel/add',
	method: "POST"
}
//编辑等级
export const editLevel = {
	url: '/pmanager/userlevel/update',
	method: "POST"
}
//删除等级
export const delLevel = {
	url: '/pmanager/userlevel/destroy',
	method: "GET"
}
//标签列表
export const getTagList = {
	url: '/pmanager/tag/fetchAll',
	method: "GET"
}
//新增标签
export const addTag = {
	url: '/pmanager/tag/add',
	method: "POST"
}
//编辑标签
export const editTag = {
	url: '/pmanager/tag/update',
	method: "POST"
}
//删除标签
export const delTag = {
	url: '/pmanager/tag/delete',
	method: "GET"
}
//设置客户标签
export const setMemberTag = {
	url: '/pmanager/tag/changeUserTag',
	method: "GET"
}
//设置客户分组
export const setMemberLevel = {
	url: '/pmanager/account/updateSysUserLevelBatch',
	method: "GET"
}
//获取客户消费金额以及购物次数
export const getTimesAndMoney = {
	url: '/pmanager/order/getShoppingTimesAndMoney',
	method: "GET"
}
