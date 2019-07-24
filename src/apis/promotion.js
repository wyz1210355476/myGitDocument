// 获取促销列表
export const getPromotion = {
	url: '/pmanager/promotion/get',
	method: "GET"
}
// 获取促销详情
export const getPromotionDetail = {
	url: '/pmanager/promotion/findById',
	method: "GET"
}
// 查询活动标签
export const getPromotionLabel = {
	url: '/pmanager/promotion/getLabels',
	method: "GET"
}
// 创建活动标签
export const addPromotionLabel = {
	url: '/pmanager/promotion/addLabel',
	method: "POST"
}
// 修改活动标签
export const updatePromotionLabel = {
	url: '/pmanager/promotion/update',
	method: "POST"
}
// 创建促销活动
export const addPromotion = {
	url: '/pmanager/promotion/add',
	method: "POST"
}
// 结束促销活动/停止
export const stopPromotion = {
	url: '/pmanager/promotion/stop',
	method: "POST"
}
// 开启促销活动
export const startPromotion = {
	url: '/pmanager/promotion/start',
	method: "POST"
}
// 删除促销活动
export const deletePromotion = {
	url: '/pmanager/promotion/delete',
	method: "POST"
}
// 选择商品
export const selectProductSkus = {
	url: '/manager/batchGoods/info/findGoodsByPage.do',
	method: "GET",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 选择分类
export const findCategoryTree = {
	url: '/manager/batchGoods/category/findAllCategoryTree.do',
	method: "GET",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 选择分类
export const findCategory = {
	url: '/manager/batchGoods/category/findAllCategory.do',
	method: "GET",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}

// 获取优惠券列表
export const getCouponList = {
	url: '/pmanager/batch/coupon/couponList',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 获取优惠明细
export const getCouponDetail = {
	url: 'pmanager/batch/coupon/getUserCouponInfo',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 删除优惠券
export const delCoupon = {
	url: '/pmanager/batch/coupon/delCoupon',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 添加优惠券
export const addCoupon = {
	url: '/pmanager/batch/coupon/addCoupon',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 编辑优惠券
export const upCoupon = {
	url: '/pmanager/batch/coupon/upCoupon',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 获取优惠券详细细信息
export const getDetail = {
	url: '/pmanager/batch/coupon/getDetail',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 获取优惠券统计信息
export const getCouponCount = {
	url: '/pmanager/batch/coupon/getCouponCount',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}
// 添加保存赠品
export const addGift = {
	url: '/manager/batchGoods/giveaway/add.do',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}

// 编辑保存赠品
export const editGift = {
	url: '/manager/batchGoods/giveaway/update.do',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}

// 获取赠品
export const getGiftList = {
	url: '/manager/batchGoods/giveaway/findByPage.do',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}

// 删除赠品
export const delGift = {
	url: '/manager/batchGoods/giveaway/deleteById.do',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}

// 编辑时获取单个赠品信息
export const getGift = {
	url: '/manager/batchGoods/giveaway/getById.do',
	method: "POST",
	//baseURL: 'http://1711010009.dev-pool1-ceshop.yun300.cn'
}