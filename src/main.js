// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@v/App'
import elementUi from '@c/ui'
import '@c/filter';
import router from '@c/router'
import resource from '@c/resource'
import { Message } from 'element-ui'
import svgIcon from '@v/common/components/svgIcon.vue'
import 'eventsource-polyfill';
import "babel-polyfill";
Vue.component('svg-icon', svgIcon)
//可购买扩展应用列表，appCode
Vue.prototype.$appList = {
	CESHOP_RETURN:true,//会员返利
	EP_B_001:true,//职位发布管理
	EP_B_002:true,//服务网站管理
	Site_wenjian:true,//文件下载（10G）EP_B_010
	Site_hvideo:true,//视频库（10G）EP_B_004
}
//获取参数中的TOKEN
if(getRequest().TOKEN){
	sessionStorage.setItem('token',getRequest().TOKEN)
}
if(window.top==window){
	initLocalVue(false)
}else{
	document.domain = 'yun300.cn';
	let siteList = parent.window.siteList;
	if(siteList){
		renderSiteList({list:siteList})
	}else{
		//请求网站列表
		getSiteList();
	}
}

//初始化本地静态网站（菜单，网站）
function initLocalVue(key){
	Vue.prototype.$siteList = [1]
	Vue.prototype.$nowSite = {}
	Vue.prototype.$unit = '￥'
	Vue.prototype.$version = 'neimao'
	Vue.prototype.$menu = []
	console.log(key)
	if(!key){
		let tenantId = getRequest().tenantId
		if(!sessionStorage.getItem('token')){
			getSiteList()
		}else{
			getMenu(tenantId)
		}
	}else{
		//初始化vue
		newVue()
	}
}

//处理网站列表数据
function renderSiteList(result){
	//没有网站列表的时候，直接new vue
	if(!result || !result.list || result.list.length == 0){
		initLocalVue(true)
		return
	}
	//赋值网站列表
	Vue.prototype.$siteList = result.list
	
	//获取当前网站
	let site;
	if(getRequest().tenantId){
		//查找当前tenantId对应的网站
		site = Vue.prototype.$siteList.find((n)=>n.tenantId == getRequest().tenantId)
	}
	//赋值当前网站
	Vue.prototype.$nowSite = site ? site : Vue.prototype.$siteList[0]
	console.log(Vue.prototype.$nowSite);
	//判断内贸外贸
	if(Vue.prototype.$nowSite.trade == 'DOMESTIC_TRADE'){
		Vue.prototype.$unit = '￥'
		Vue.prototype.$version = 'neimao'
	}else if(Vue.prototype.$nowSite.trade == 'FOREIGN_TRADE'){
		Vue.prototype.$unit = '$'
		Vue.prototype.$version = 'waimao'
	}else{
		Vue.prototype.$unit = '￥'
		Vue.prototype.$version = 'neimao'
	}

	//请求当前网站菜单
	getMenu(Vue.prototype.$nowSite.tenantId)
	//请求当前网站应用列表
	getAppList(Vue.prototype.$nowSite.tenantId)
	
	// if(window.top!=window){
	// 	let siteMenu = parent.window.siteMenu;
	// 	if(siteMenu){
	// 		//赋值当前网站菜单
	// 		Vue.prototype.$menu = siteMenu
	// 		//初始化vue
	// 		newVue()
	// 	}else{
	// 		//请求当前网站菜单
	// 		getMenu(Vue.prototype.$nowSite.tenantId)
	// 	}
	// 	//请求当前网站应用列表
	// 	getAppList(Vue.prototype.$nowSite.tenantId)
	// }else{
	// 	Vue.prototype.$menu = []
	// 	newVue()
	// }

}

//请求网站列表
function getSiteList(){
	//请求网站列表
	Vue.api("home.getSiteList").then((result) => {
		renderSiteList(result)
	}, (error) => {
		if(error.data.status == '102'){
			initLocalVue(true);return
		}
		Message({ type: 'error', message: '查询网站列表出错' })
	})
}

//请求网站菜单
function getMenu(){
	Vue.api("home.getSiteMenu").then((result) => {
		// begin
		// result.push({
		// 	action: null,
		// 	app: null,
		// 	appId: null,
		// 	check: true,
		// 	childrens: null,
		// 	frame: null,
		// 	icon: "icon-dingdan",
		// 	id: 400,
		// 	leaf: 0,
		// 	level: 1,
		// 	locicalParentId: "",
		// 	logicalId: "296_1",
		// 	name: "促销管理",
		// 	ops: null,
		// 	parentId: 0,
		// 	parentType: 1,
		// 	sort_des: 8,
		// 	type: 1,
		// 	unit: null,
		// 	url: ""
		// });
		// result.push({
		// 	action: null,
		// 	app: null,
		// 	appId: null,
		// 	check: true,
		// 	childrens: null,
		// 	frame: null,
		// 	icon: "",
		// 	id: 410,
		// 	leaf: 1,
		// 	level: 2,
		// 	locicalParentId: "",
		// 	logicalId: "306_1",
		// 	name: "页面访问权限",
		// 	ops: null,
		// 	parentId: 359,
		// 	parentType: 1,
		// 	sort_des: 2,
		// 	type: 1,
		// 	unit: null,
		// 	url: "http://1810175010.test-pool1-site.yun300.cn/wholesale/permission/pagePermission"
		// });
		// result.push({
		// 	action: null,
		// 	app: null,
		// 	appId: null,
		// 	check: true,
		// 	childrens: null,
		// 	frame: null,
		// 	icon: "",
		// 	id: 411,
		// 	leaf: 1,
		// 	level: 2,
		// 	locicalParentId: "",
		// 	logicalId: "306_1",
		// 	name: "订单满减",
		// 	ops: null,
		// 	parentId: 400,
		// 	parentType: 1,
		// 	sort_des: 2,
		// 	type: 1,
		// 	unit: null,
		// 	url: "http://1810175010.test-pool1-site.yun300.cn/wholesale/promotion/fullcut"
		// })
		// end
		//赋值当前网站菜单
		Vue.prototype.$menu = result
		//初始化vue
		newVue()
	}, (error) => {
		Message({ type: 'error', message: '查询网站菜单出错' })
	});
}
// function getMenu(tenantId){
// 	Vue.api("home.getMenu",{siteTenantId:tenantId}).then((result) => {
// 		//赋值当前网站菜单
// 		Vue.prototype.$menu = result
// 		//初始化vue
// 		newVue()
// 	}, (error) => {
// 		Message({ type: 'error', message: '查询网站菜单出错' })
// 	});
// }

//请求网站应用列表
function getAppList(tenantId){
	Vue.api("home.getAppList").then((result) => {
		let ceshop_return = result.list.findIndex((n)=>n.appCode == 'CESHOP_RETURN')
		if(ceshop_return == -1){
			Vue.prototype.$appList.CESHOP_RETURN = false
		}
	}, (error) => {
		Message({ type: 'error', message: '查询网站应用出错' })
	});
}

//获取当前url中的参数
function getRequest () {
	let url = location.search;
	let theRequest = new Object();
	let strs;
	if (url.indexOf("?") != -1) {
		let str = url.substr(1);
		strs = str.split("&");
		for(let i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest
}

//初始化vue
function newVue () {
	new Vue({
		el: '#app',
		router,
		template: '<App/>',
		components: { App }
	})
}
