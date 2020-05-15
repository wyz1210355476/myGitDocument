$define(["wgt_util", "wgt_readyload", "md5", "jquery.message", "bootstrap"], function ($, $1, $2, $3, $4, $5) {

	var init = function (glp) {
		//页面参数
		glp = this._params;
		var scp = $compCl.getScope(glp.id);
		glp = this._params;
		// 封装的ajax
		function ajxaQueryFun(url, params, method, callback) {
		var flag = glp._params.extends_flag;
		var param = {};
		param.extends_flag = flag;
		param.request_url = url;
		param.url_param = params;
		param.requst_type = method;
		param.session_user = true;
		param.session_user_key = "makeUserId";

		var paramStr = encodeURIComponent(encodeURIComponent(JSON.stringify(param)));
		var sign = $.md5Sign(JSON.stringify(param));
		$.ajax({
			type: method || "GET",
			url: "/comp/thirdrouter",
			data: {
			sign: sign,
			param: paramStr
			},
			success: function (obj) {
			callback(obj);
			},
			error: function () { }
		})
		};


		//图片懒加载
		$2.lazyImg({
		defObj: "#" + scp.attr("id")
		});
		//图片加载错误时加载默认图片
		scp.find("img").onErrorImg();

		if($.mediaQuery({node:true})==768){//移动端
			/**
			 * mo端代码
			*/ 
		}else if($.mediaQuery({node:true})==7681024 || $.mediaQuery({node:true})==1024){//pc端
			/**
			 * pc端代码
			 */
		}	

	}

	return {
		//公有 初始化方法
		init: init
	};
});