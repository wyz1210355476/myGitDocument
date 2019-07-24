//订单列表
export const list = {
	url: '/pmanager/batch/order/get',
	method: "GET"
}
//添加订单
export const addOrder = {
	url: '/pmanager/batch/Order/add',
	method: "POST"
}
//修改订单
export const modifyOrder = {
	url: '/pmanager/batch/order/mod',
	method: "POST"
}
//获取订单详情
export const getOrderDetail = {
	url: '/pmanager/batch/Order/detail',
	method: "GET"
}
// //删除订单
// export const delOrder = {
// 	url: '/pmanager/batch/order/deleteOrder',
// 	method: "GET"
// }
//获取订单商品
export const getGoods = {
	url: '/pmanager/batch/order/getGoods',
	method: "GET"
}
// //添加订单商品
// export const addGoods = {
// 	url: '/pmanager/batch/order/addGoods',
// 	method: "POST"
// }
// //修改订单商品
// export const modifyGoods = {
// 	url: '/pmanager/batch/order/modifyGoods',
// 	method: "POST"
// }
// //删除订单商品
// export const delGoods = {
// 	url: '/pmanager/batch/order/delGoods',
// 	method: "GET"
// }
//获取订单备注
export const getRemark = {
	url: '/pmanager/batch/order/getRemark',
	method: "GET"
}
//添加订单备注
export const addRemark = {
	url: '/pmanager/batch/order/addRemark',
	method: "POST"
}
//获取订单日志
export const getLogs = {
	url: '/pmanager/batch/order/getLogs',
	method: "GET"
}
//添加订单日志
export const addLogs = {
	url: '/pmanager/batch/order/addLogs',
	method: "POST"
}
//获取订单留言
export const getMessage = {
	url: '/pmanager/batch/order/getMessage',
	method: "GET"
}
//添加订单留言
export const addMessage = {
	url: '/pmanager/batch/order/addMessage',
	method: "POST"
}
//获取订单历史
export const getHistory = {
	url: '/pmanager/batch/order/getHistory',
	method: "GET"
}
//导出订单
export const exportOrder = {
	url: '/pmanager/batch/order/export',
	method: "GET"
}
//获取配送方式
export const getShipType = {
	url: '/pmanager/logistics/get',
	method: "GET"
}
//获取物流公司
export const getShipCompany = {
	url: '/pmanager/Company/index',
	method: "GET"
}
//获取配送费用
export const getShipCost = {
	url: '/pmanager/logistics/logisticsPrice',
	method: "GET"
}
//获取支付方式
export const getPayType = {
	url: '/manager/payway/config/findValidPay.do',
	method: "GET"
}
//支付单列表
export const getPayList = {
	url: '/pmanager/collectionrefund/receiptList',
	method: "GET"
}
//支付单详情
export const getPayDetail = {
	url: '/pmanager/collectionrefund/getReceipt',
	method: "GET"
}
//添加支付单
export const addPayOrder = {
	url: '/pmanager/collectionrefund/receipt',
	method: "POST"
}
//退款单列表
export const getRefundList = {
	url: '/pmanager/collectionrefund/refundList',
	method: "GET"
}
//退款单详情(orderid)
export const getRefundDetail = {
	url: '/pmanager/collectionrefund/getRefund',
	method: "GET"
}
//退款单详情(id)
export const getRefundDetailById = {
	url: '/pmanager/collectionrefund/getRefundById',
	method: "GET"
}
//添加退款单
export const addRefundOrder = {
	url: '/pmanager/collectionrefund/refund',
	method: "POST"
}
//售后单列表
export const getServiceList = {
	url: '/pmanager/aftersale/returnList',
	method: "GET"
}
//售后单详情
export const getServiceDetail = {
	url: '/pmanager/aftersale/returnInfo',
	method: "GET"
}
//添加售后单
// export const addServiceOrder = {
// 	url: '/pmanager/aftersale/add',
// 	method: "GET"
// }
//修改售后单
export const modifyServiceOrder = {
	url: '/pmanager/aftersale/update',
	method: "GET"
}
//添加店主反馈
export const addServiceFeedback = {
	url: '/pmanager/aftersale/updateComment',
	method: "POST"
}
//发货单列表
export const getDeliveryList = {
	url: '/pmanager/batch/shipmentreturns/sendGoodsList',
	method: "GET"
}
//发货单详情
export const getDeliveryDetail = {
	url: '/pmanager/batch/shipmentreturns/sendGoodsInfo',
	method: "GET"
}
//添加发货单
export const addDeliveryOrder = {
	url: '/pmanager/batch/shipmentreturns/sendGoods',
	method: "POST"
}
//退货单列表
export const getReturnList = {
	url: '/pmanager/batch/shipmentreturns/returnGoodsList',
	method: "GET"
}
//退货单详情
export const getReturnDetail = {
	url: '/pmanager/batch/shipmentreturns/returnGoodsInfo',
	method: "GET"
}
//添加退货单
export const addReturnOrder = {
	url: '/pmanager/batch/shipmentreturns/returnGoods',
	method: "POST"
}
//订单商品列表
export const getGoodList = {
	url: '/manager/goods/sku/findGoodsSkus.do',
	method: "GET"
}
//获取库存
export const getGoodsStore = {
	url: '/pmanager/stock/getStock',
	method: "GET"
}
//获取发票抬头列表
export const getInvoiceTitleList = {
	url: '/pmanager/invoice/getTitleList',
	method: "GET"
}
//添加发票抬头
export const addInvoiceTitle = {
	url: '/pmanager/invoice/addTitle',
	method: "POST"
}
//编辑发票抬头
export const editInvoiceTitle = {
	url: '/pmanager/invoice/editTitle',
	method: "POST"
}
//删除发票抬头
export const delInvoiceTitle = {
	url: '/pmanager/invoice/delTitle',
	method: "GET"
}
//获取发票内容列表
export const getInvoiceContentList = {
	url: '/pmanager/invoice/index',
	method: "GET"
}
//获取发票是否启用
export const checkInvoiceTurn = {
	url: '/pmanager/invoice/invoiceConfig',
	method: "GET"
}
//获取客户价格
export const getMemberPrice = {
	url: '/pmanager/batch/order/memberPrice',
	method: "GET"
}
//获取促销价格
export const getPromotionPrice = {
	url: '/pmanager/promotion/getByGoodsIds',
	method: "GET"
}
//获取订单满减金额
export const calculatePrice = {
	url: '/pmanager/batch/order/calculatePrice',
	method: "GET"
}
//获取订单满减金额
export const getDeratePrice = {
	url: '/pmanager/promotion/getByOrder',
	method: "GET"
}
//获取管理员名称
export const getLoginInfo = {
	url: '/pmanager/batch/order/getLoginInfo',
	method: "GET"
}
//获取已退货数量
export const getReturnNum = {
	url: '/pmanager/shipmentreturns/getReturnedNum',
	method: "GET"
}
//获取支付二维码
export const getOnceQRCode = {
	url: '/manager/unionpay/qrCode/getOnceQRCode.do',
	method: "GET"
}
//获取返利金额
export const getRebateMoney = {
	url: '/pmanager/batch/rebate/rebateMoney',
	method: "GET"
}
//获取规格和货品列表
export const getSkuList = {
	url: '/manager/batchGoods/sku/findGoodsSkusByGoodsId',
	method: "GET"
}
//获取阶梯定价
export const getBatchPrice = {
	url: '/pmanager/batch/order/batchPrice',
	method: "GET"
}
//获取订单消费的返利金额
export const getUsedRebate = {
	url: 'pmanager/bankroll/getHistoryById',
	method: "GET"
}

// 获取商品下全部货品的库存
export const getAllGoodsStock = {
	url: '/pmanager/stock/getAllGoodsStock',
	method: "GET"
}
