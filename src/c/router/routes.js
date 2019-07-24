// 路由采用分块加载
// require.ensure([], () => r(require('模块地址')), '模块名(模块名相同的所有模块会打包成一个文件)')

export default [
    {
        path: '/',
        component: require('@v/pages'),
        children: [
            {
                path: '/nosite', //没有网站
                component: (r) => require.ensure([], () => r(require('@v/pages/home/noSite')), 'home')
            }, {
                path: '/iframe', //iframe页面
                component: (r) => require.ensure([], () => r(require('@v/pages/iframe/iframe')), 'iframe')
            }, {
                path: '/', //订单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/home/home')), 'home')
            }, {
                path: '/order/list', //订单列表
                name: 'order_list',
                component: (r) => require.ensure([], () => r(require('@v/pages/order/list')), 'order')
            }, {
                path: '/order/delivery', //发货单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/order/deliveryList')), 'order')
            }, {
                path: '/order/pay', //支付单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/order/payList')), 'order')
            }, {
                path: '/order/refund', //退款单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/order/refundList')), 'order')
            }, {
                path: '/order/return', //退货单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/order/returnList')), 'order')
            }, {
                path: '/order/service', //售后单列表
                component: (r) => require.ensure([], () => r(require('@v/pages/order/serviceList')), 'order')
            }, {
                path: '/order/list/add', //添加/编辑订单
                name: 'order_add',
                component: (r) => require.ensure([], () => r(require('@v/pages/order/addOrder')), 'order')
            }, {
                path: '/stationM/list', //站内信息列表
                name: 'stationM_list',
                component: (r) => require.ensure([], () => r(require('@v/pages/stationMessage/messageList')), 'stationMessage')
            }, {
                path: '/stationM/send', //发消息
                name: 'stationM_send',
                component: (r) => require.ensure([], () => r(require('@v/pages/stationMessage/sendMessage')), 'stationMessage')
            }, {
                path: '/member/list', //客户列表
                name: 'member_list',
                component: (r) => require.ensure([], () => r(require('@v/pages/member/memberList')), 'member')
            }, {
                path: '/member/level', //客户分组
                name: 'member_level',
                component: (r) => require.ensure([], () => r(require('@v/pages/member/levelList')), 'member')
            }, {
                path: '/member/tag', //客户标签
                name: 'member_tag',
                component: (r) => require.ensure([], () => r(require('@v/pages/member/tagList')), 'member')
            }, {
                path: '/member/list/add', //新增客户
                name: 'member_add',
                component: (r) => require.ensure([], () => r(require('@v/pages/member/addMember')), 'member')
            }, {
                path: '/member/cusrebate', //客户返利
                name: 'cus_rebate',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/cusRebate')), 'rebate')
            }, {
                path: '/member/goodsrebate', //返利商品
                name: 'goods_rebate',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/goodsRebate')), 'rebate')
            }, {
                path: '/logistics/deliverMode', //配送方式
                component: (r) => require.ensure([], () => r(require('@v/pages/logistics/deliverMode')), 'logistics')
            }, {
                name:"addOrEditDeliverMode",
                path: '/logistics/deliverMode/add', //添加or编辑配送方式
                component: (r) => require.ensure([], () => r(require('@v/pages/logistics/addOrEditDeliverMode')), 'logistics')
            }, {
                path: '/invoice/invoiceList',//发票内容列表
                component:(r) => require.ensure([], () => r(require('@v/pages/invoice/invoiceList')), 'invoice')
            }, {
                path: '/invoice/invoiceManage',//发票管理列表
                component:(r) => require.ensure([], () => r(require('@v/pages/invoice/invoiceManage')), 'invoice')
            }, {
                name: 'discount',
                path: '/promotion/discount', //商品折扣
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/discount')), 'promotion')
            }, {
                name: 'addDiscount',
                path: '/promotion/discount/add', //增加商品折扣
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/addDiscount')), 'promotion')
            }, {
                name: 'fullcut',
                path: '/promotion/fullcut', //订单满减
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/fullcut')), 'promotion')
            }, {
                name: 'fullGift',
                path: '/promotion/fullGift', //订单满赠
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/fullGift')), 'promotion')
            }, {
                name: 'addFullGift',
                path: '/promotion/addFullGift', //增加满赠
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/addFullGift')), 'promotion')
            }, {
                name: 'couponLibrary',
                path: '/promotion/couponLibrary', //优惠券库
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/couponLibrary')), 'promotion')
            }, {
                name: 'addCoupon',
                path: '/promotion/couponLibrary/add', //增加优惠券
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/addCoupon')), 'promotion')
            }, {
                name: 'giftManagement',
                path: '/promotion/giftManagement', //赠品管理
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/giftManagement')), 'promotion')
            }, {
                name: 'addGift',
                path: '/promotion/addGift', //增加赠品
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/addGift')), 'promotion')
            }, {
                name: 'addFullcut',
                path: '/promotion/fullcut/add', //增加订单满减
                component: (r) => require.ensure([], () => r(require('@v/pages/promotion/addFullcut')), 'promotion')
            }, {
                name: 'roleList',
                path: '/role/roleList', //角色列表
                component: (r) => require.ensure([], () => r(require('@v/pages/role/roleList')), 'role')
            }, {
                name: 'addRole',
                path: '/role/addRole', //增加角色
                component: (r) => require.ensure([], () => r(require('@v/pages/role/addRole')), 'role')
            }, {
                name: 'evaluateList',
                path: '/evaluate/evaluateList', //评价列表
                component: (r) => require.ensure([], () => r(require('@v/pages/evaluate/evaluateList')), 'evaluate')
            }, {
                name: 'evaluateDetail',
                path: '/evaluate/evaluateDetail', //评价设置
                component: (r) => require.ensure([], () => r(require('@v/pages/evaluate/evaluateDetail')), 'evaluate')
            }, {
                path: '/tradeConfigure/tradeSet',//交易配置
                component:(r) => require.ensure([], () => r(require('@v/pages/tradeConfigure/tradeSet')), 'tradeConfigure')
            }, {
                path: '/paymentManagement/paymentMethod',//支付管理
                component:(r) => require.ensure([], () => r(require('@v/pages/paymentManagement/paymentMethod')), 'paymentManagement')
            }, {
                path: '/statistics/manageSummary',//经营概况
                component:(r) => require.ensure([], () => r(require('@v/pages/statistics/manageSummary')), 'manageSummary')
            }, {
                path: '/statistics/memberSummary',//客户概况
                component:(r) => require.ensure([], () => r(require('@v/pages/statistics/memberSummary')), 'memberSummary')
            }, {
                path: '/statistics/orderSummary',//订单统计
                component:(r) => require.ensure([], () => r(require('@v/pages/statistics/orderSummary')), 'orderSummary')
            }, {
                name: 'goodsList',
                path: '/goods/list', //商品列表
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsList')), 'goods')
            }, {
                name: 'goodsPrice',
                path: '/goods/price', //商品价格
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsPrice')), 'goods')
            }, {
                name: 'goodsCategory',
                path: '/goods/category', //商品分类
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsCategory')), 'goods')
            }, {
                name: 'goodsUnit',
                path: '/goods/unit', //计量单位
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsUnit')), 'goods')
            }, {
                name: 'goodsWindow',
                path: '/goods/window', //商品橱窗
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsWindow')), 'goods')
            }, {
                name: 'windowGoods',
                path: '/goods/window/goods', //橱窗商品
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/windowGoods')), 'goods')
            }, {
                name: 'pagePermission',
                path: '/permission/pagePermission', //热门词
                component: (r) => require.ensure([], () => r(require('@v/pages/permission/pagePermission')), 'pagePermission')
            }, {
                name: 'hotWords',
                path: '/goods/hotwords', //页面权限
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/hotWords')), 'goods')
            }, {
                name: 'goodsType',
                path: '/goods/type', //商品类型
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsType')), 'goods')
            }, {
                name: 'goodsLabel',
                path: '/goods/label', //商品标签
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/goodsLabel')), 'goods')
            }, {
                name: 'addGoods',
                path: '/goods/list/add', //新增商品
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/addGoods')), 'goods')
            }, {
                name: 'addGoodsCategory',
                path: '/goods/category/add', //新增商品分类
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/addGoodsCategory')), 'goods')
            }, {
                name: 'addGoodsType',
                path: '/goods/type/add', //新增商品类型
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/addGoodsType')), 'goods')
            }, {
                name: 'brandManage',
                path: '/goods/brandManage', //品牌管理
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/brandManage')), 'goods')
            }, {
                name: 'addBrand',
                path: '/goods/addBrand', //新增品牌
                component: (r) => require.ensure([], () => r(require('@v/pages/goods/addBrand')), 'goods')
            }, 
            {
                name: 'baseSetup',
                path: '/setup/baseSetup', //基本设置
                component: (r) => require.ensure([], () => r(require('@v/pages/systemSetup/baseSetup')), 'systemSetup')
            }, {
                name: 'emailSetup',
                path: '/setup/emailSetup', //企业邮箱设置
                component: (r) => require.ensure([], () => r(require('@v/pages/systemSetup/emailSetup')), 'systemSetup')
            }, {
                name: 'thirdPartyCodeSetup',
                path: '/setup/thirdPartyCodeSetup', //企业邮箱设置
                component: (r) => require.ensure([], () => r(require('@v/pages/systemSetup/thirdPartyCodeSetup')), 'systemSetup')
            }, {
                name: 'urlRulesSetup',
                path: '/setup/urlRulesSetup', //企业邮箱设置
                component: (r) => require.ensure([], () => r(require('@v/pages/systemSetup/urlRulesSetup')), 'systemSetup')
            }, {
                name: 'webStatusSetup',
                path: '/setup/webStatusSetup', //企业邮箱设置
                component: (r) => require.ensure([], () => r(require('@v/pages/systemSetup/webStatusSetup')), 'systemSetup')
            }, {
                name: 'authority_accountList',
                path: '/authority/accountList', //权限配置账号列表
                component: (r) => require.ensure([], () => r(require('@v/pages/authority/accountList')), 'authority')
            }, {
                name: 'authority_set',
                path: '/authority/set', //权限配置子账号授权
                component: (r) => require.ensure([], () => r(require('@v/pages/authority/set')), 'authority')
            }, {
                path: '/pictureLib/pics', //图片库
                name: 'pics',
                component: (r) => require.ensure([], () => r(require('@v/pages/pictureLib/pics')), 'pictureLib')
            }, {
                path: '/pictureLib/watermark', //图片库
                name: 'watermark',
                component: (r) => require.ensure([], () => r(require('@v/pages/pictureLib/watermark')), 'pictureLib')
            }, {
                path: '/menu/menuList', //一级导航列表
                name: 'menuList',
                component: (r) => require.ensure([], () => r(require('@v/pages/menu/menuList')), 'menu')
            }, {
                path: '/menu/childList', //下级导航列表
                name: 'childList',
                component: (r) => require.ensure([], () => r(require('@v/pages/menu/childList')), 'menu')
            }, {
                path: '/menu/addNavList', //添加导航
                name: 'addNavList',
                component: (r) => require.ensure([], () => r(require('@v/pages/menu/addNavList')), 'menu')
            }, {
                path: '/renovation/list', //装修列表
                name: 'renovationList',
                component: (r) => require.ensure([], () => r(require('@v/pages/renovation/list')), 'renovation')
            }, {
                path: '/renovation/add', //添加装修
                name: 'addRenovation',
                component: (r) => require.ensure([], () => r(require('@v/pages/renovation/add')), 'renovation')
            }, {
                path: '/imgLib/select', //图片库弹窗
                name: 'imgLib',
                component: (r) => require.ensure([], () => r(require('@v/pages/imgLib/select')), 'imgLib')
            }, {
                path: '/memberSet/provisionSet', //注册条款设置
                name: 'provisionSet',
                component: (r) => require.ensure([], () => r(require('@v/pages/memberSet/provisionSet')), 'memberSet')
            }, {
                path: '/advert/advertList', //广告管理
                name: 'advertList',
                component: (r) => require.ensure([], () => r(require('@v/pages/advert/advertList')), 'advert')
            }, {
                path: '/advert/adColumnList', //广告内容管理
                name: 'adColumnList',
                component: (r) => require.ensure([], () => r(require('@v/pages/advert/adColumnList')), 'advert')
            }, {
                path: '/advert/editColumn', //编辑内容管理
                name: 'editColumn',
                component: (r) => require.ensure([], () => r(require('@v/pages/advert/editColumn')), 'advert')
            }, {
                path: '/messageSet/msgSet', //短信设置
                name: 'msgSet',
                component: (r) => require.ensure([], () => r(require('@v/pages/messageSet/msgSet')), 'messageSet')
            },{
                path: '/member/balanceType', //收支类型
                name: 'balanceType',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/balanceType')), 'rebate')
            },{
                path: '/member/rebateRule', //返利规则
                name: 'rebateRule',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/rebateRule')), 'rebate')
            },{
                path: '/member/recommendedAudit', //推荐审核
                name: 'recommendedAudit',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/recommendedAudit')), 'rebate')
            }, {
                path: '/rebate/rebateProvision', //推荐返利协议条款
                name: 'rebateProvision',
                component: (r) => require.ensure([], () => r(require('@v/pages/rebate/rebateProvision')), 'rebate')
            }, {
                path: '/dataDocking/oauthSet', //oauth设置
                name: 'oauthSet',
                component: (r) => require.ensure([], () => r(require('@v/pages/dataDocking/oauthSet')), 'dataDocking')
            }, {
                path: '/dataDocking/dockingSet', //数据对接设置
                name: 'dockingSet',
                component: (r) => require.ensure([], () => r(require('@v/pages/dataDocking/dockingSet')), 'dataDocking')
            }, {
                path: '/contractManagement/contractManage', //合同管理
                name: 'contractManage',
                component: (r) => require.ensure([], () => r(require('@v/pages/contractManagement/contractManage')), 'contractManagement')
            }, {
                path: '/contractManagement/contractTemplate', //模板管理
                name: 'contractTemplate',
                component: (r) => require.ensure([], () => r(require('@v/pages/contractManagement/contractTemplate')), 'contractManagement')
            }, {
                path: '/order/afterSalesManagement', //售后管理
                name: 'afterSalesManagement',
                component: (r) => require.ensure([], () => r(require('@v/pages/order/afterSalesManagement')), 'order')
            }
        ]
    }, {
        path: '*',
        component: require('@v/pages/404')
    }, {
        name:"page404",
        path: '/407',
        component: require('@v/pages/404')
    }
]
