// 压缩打包组件信息配置
var pcNames = ['portalResGoods_detail'];
// var pcNames = ['portalResMembers_info']
var moNames = ['xibmallorder_checkout'];

// 新建组件配置信息
// ,'portalResMembers_login'
var createPcNames = ['portalResMembers_test'];
// var createPcNames = ['portalResOrdercart_checkout']
var createMoNames = [];
// 组件根路径配置
var rootDirectory = "D:\\shop\\批零组件\\design_upgrade";//组件的git本地仓库根路径
var outRoute = "D:\\shop\\dir\\";//组件压缩打包和生成组件代码的根路径

var pcParam = {
	names:pcNames,
	createNames:createPcNames,
	jsRoute:rootDirectory + "\\public\\js\\",
	htmlRoute:rootDirectory + "\\private\\views\\pc\\",
	jsonRoute:rootDirectory + "\\designlib\\product\\pc\\panelConfig\\c\\",
	xmlRoute:rootDirectory + "\\private\\comp_config_meta\\pc\\",
	staticRoute:rootDirectory + "\\designlib\\product\\pc\\c\\",
	outRoute:outRoute + "pc\\",
	equipment:'pc',
	rootDirectory:rootDirectory
}

// mo
var moParam = {
	names:moNames,
	createNames:createMoNames,
	jsRoute:rootDirectory + "\\public\\m\\js\\",
	htmlRoute:rootDirectory + "\\private\\views\\mobile\\",
	jsonRoute:rootDirectory + "\\designlib\\product\\mobile\\panelConfig\\c\\",
	xmlRoute:rootDirectory + "\\private\\comp_config_meta\\mobile\\",
	staticRoute:rootDirectory + "\\designlib\\product\\mobile\\c\\",
	outRoute:outRoute + "mo\\",
	equipment:'mo',
	rootDirectory:rootDirectory
}

// 创建组件文件配置


exports.pcParam = pcParam;
exports.moParam = moParam;