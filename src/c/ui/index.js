import Vue from 'vue';
import Element from 'element-ui';
import {Message} from 'element-ui';
// import Pagination from '@c/util/pagination.js'
Element.Dialog.props.modalAppendToBody.default=false
// Vue.component('ce-pagination', Pagination(Element))
Vue.use(Element);
let ExtendUI = {};
ExtendUI.install = function(Vue, options) {
	Vue.errorMessage = Vue.prototype.$errorMessage = function(msg) {
		Message({
			message: msg,
			iconClass: 'el-icon-information',
			customClass: 'ce-custom-class-error'
		})
	}
	Vue.successMessage = Vue.prototype.$successMessage = function(msg){
		Message({
			message: msg,
			type: 'success'
		})
	}
}

Vue.use(ExtendUI);
