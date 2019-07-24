// 获取商品标签列表
export const getGoodsLabel = {
	url: '/manager/batchGoods/mark/findAllMark.do',
	method: "GET"
}
// 删除商品标签
export const delGoodsLabel = {
	url: '/manager/batchGoods/mark/delete.do',
	method: "GET"
}
// 新增或修改商品标签
export const saveGoodsLabel = {
	url: '/manager/batchGoods/mark/saveOrUpdate.do',
	method: "GET"
}
// 获取商品分类列表
export const getGoodsCategory = {
	url: '/manager/batchGoods/category/findAllCategory.do',
	method: "GET"
}
// 获取商品分类列表树
export const getGoodsCategoryTree = {
	url: '/manager/batchGoods/category/findAllCategoryTree.do',
	method: "GET"
}
// 删除商品分类
export const delGoodsCategory = {
	url: '/manager/batchGoods/category/delete.do',
	method: "GET"
}
// 新增/修改商品分类
export const saveGoodsCategory = {
	url: '/manager/batchGoods/category/saveOrUpdate.do',
	method: "POST"
}
// 根据id获取分类信息
export const getCategoryById = {
	url: '/manager/batchGoods/category/getById.do',
	method: "GET"
}
// 编辑分类排序码
export const changeCategorySort = {
	url: '/manager/batchGoods/category/reorder.do',
	method: "POST"
}
// 获取商品类型列表
export const getGoodsTypeByPage = {
	url: '/manager/batchGoods/template/findTemplateByPage.do',
	method: "GET"
}
// 获取商品类型列表
export const getGoodsType = {
	url: '/manager/batchGoods/template/findTemplate.do',
	method: "GET"
}
// 新增商品类型(同时保存模板下的属性和规格)
export const addGoodsType = {
	url: '/manager/batchGoods/template/saveTemplateAll.do',
	method: "POST"
}
// 修改商品类型(同时保存模板下的属性和规格)
export const updateGoodsType = {
	url: '/manager/batchGoods/template/updateTemplateAll.do',
	method: "POST"
}
// 根据id删除商品类型
export const deleteGoodsTypeById = {
	url: '/manager/batchGoods/template/deleteTemplateById.do',
	method: "GET"
}
// 根据id获取商品类型全部
export const getGoodsTypeAllById = {
	url: '/manager/batchGoods/template/getTemplateAllById.do',
	method: "GET"
}


// 获取商品列表
export const getGoods = {
	url: '/manager/batchGoods/info/findGoodsByPage.do',
	method: "GET"
}
// 获取商品列表
export const getGoodsByIds = {
	url: '/manager/batchGoods/info/findGoods.do',
	method: "GET"
}
// 根据id删除商品
export const deleteGoods = {
	url: '/manager/batchGoods/info/deleteGoodsById.do',
	method: "GET"
}
// 新增商品
export const addGoods = {
	url: '/manager/batchGoods/info/save.do',
	method: "POST"
}
// 根据id获取商品详情
export const getGoodsById = {
	url: '/manager/batchGoods/info/getGoodsById.do',
	method: "GET"
}
// 根据id获取商品详情
export const updateGoods = {
	url: '/manager/batchGoods/info/update.do',
	method: "POST"
}
// 获取seo
export const getSeo = {
	url: '/manager/batchGoods/info/getGoodsSeo.do',
	method: "POST"
}
// 检测商品编号是否重复
export const checkCodeExist = {
	url: '/manager/batchGoods/info/codeIsExist.do',
	method: "POST"
}
// 指定标签
export const addLabelToGoods = {
	url: '/manager/batchGoods/info/setMark.do',
	method: "POST"
}

////////////////////计量单位///////////////////////////
// 获取计量单位列表
export const getUnitList = {
	url: '/manager/batchGoods/unit/findUnit.do',
	method: "GET"
}
// 添加计量单位
export const addUnit = {
	url: '/manager/batchGoods/unit/saveUnit.do',
	method: "POST"
}
// 修改计量单位选中状态
export const updateUnit = {
	url: '/manager/batchGoods/unit/updateStatus.do',
	method: "POST"
}


// 获取热门词列表
export const findKeyword = {
	url: '/manager/batchGoods/keyword/findKeyword.do',
	method: "GET"
}
// 新增热门词列表
export const addKeyword = {
	url: '/manager/batchGoods/keyword/save.do',
	method: "POST"
}
// 修改热门词列表
export const editeKeyword = {
	url: '/manager/batchGoods/keyword/update.do',
	method: "POST"
}
// 删除热门词列表
export const deleteKeyword = {
	url: '/manager/batchGoods/keyword/deleteById.do',
	method: "GET"
}
// 交换热门词
export const exchangeKeyword = {
	url: '/manager/batchGoods/keyword/swapOrder.do',
	method: "GET"
}



// 获取商品橱窗列表
export const findWindow = {
	url: '/manager/batchGoods/showcase/findShowcase.do',
	method: "GET"
}
// 新增商品橱窗
export const addWindow = {
	url: '/manager/batchGoods/showcase/save.do',
	method: "GET"
}
// 删除商品橱窗
export const deleteWindow = {
	url: '/manager/batchGoods/showcase/deleteById.do',
	method: "GET"
}
// 查询商品橱窗详情
export const getWindow = {
	url: '/manager/batchGoods/showcase/getShowcaseAndProductById.do',
	method: "GET"
}
// 给商品橱窗添加商品
export const addWindowGoods = {
	url: '/manager/batchGoods/showcase/saveGoodsRelation.do',
	method: "GET"
}
// 商品橱窗移除商品
export const removeWindowGoods = {
	url: '/manager/batchGoods/showcase/deleteGoodsRelation.do',
	method: "GET"
}
// 交换商品橱窗商品顺序
export const exchangeGoods = {
	url: '/manager/batchGoods/showcase/swapGoodsOrder.do',
	method: "GET"
}



//////////////////商品改版///////////////////////////

//根据商品id获取货品id
export const getSkuids = {
	url: '/manager/batchGoods/info/findSkuIdByGoodsId.do',
	method: "GET"
}

// 根据商品id获取客户折扣
export const getGoodsDiscount = {
	url: '/pmanager/batch/discount/getDiscount',
	method: "GET"
}
// 根据商品id设置客户折扣
export const setGoodsDiscount = {
	url: '/pmanager/batch/discount/discountSet',
	method: "POST"
}
// 根据商品id批量获取最低折扣
export const getGoodsMinDiscount = {
	url: '/pmanager/batch/discount/getMinDiscount',
	method: "GET"
}

// 设置商品库存
export const setGoodsStock = {
	url: '/pmanager/stock/addEditDel',
	method: "POST"
}
// 批量获取商品库存总数
export const plGetGoodsStock = {
	url: '/pmanager/stock/getProductStock',
	method: "POST"
}
// 批量获取货品库存
export const getSkuStock = {
	url: '/pmanager/stock/getStock',
	method: "GET"
}

//根据id查询商品价格
export const getGoodsPrice = {
	url: '/pmanager/batch/price/getByGoodsId',
	method: "GET"
}
//根据商品id货品id设置商品价格
export const setGoodsPrice = {
	url: '/pmanager/batch/price/addEditDel',
	method: "POST"
}

//设置商品货品上下架
export const setGoodsStatus = {
	url: '/manager/batchGoods/info/updateStatus.do',
	method: "POST"
}

// 批量设置商品上下架
export const updateStatusBatch = {
	url: '/manager/batchGoods/info/updateStatusBatch.do',
	method: "POST"
}

// 根据商品id获取商品是批发还是零售的状态
export const getGoodsPriceType = {
	url: '/pmanager/batch/price/getGoodsPriceType',
	method: "GET"
}
// 获取货品价格
export const getRetailGoodsPrice = {
	url: '/pmanager/batch/price/getGoodsPrice',
	method: "GET"
}

// 获取货品编号，用于校验是否重复
export const codeIsExist = {
	url: '/manager/batchGoods/sku/codeIsExist',
	method: "POST"
}
// 获取品牌列表
export const getBrandList = {
	url: '/manager/batchGoods/brand/findAll.do',
	method: "POST"
}
// 编辑排序码
export const changeBrandSort = {
	url: '/manager/batchGoods/brand/sort.do',
	method: "POST"
}
// 删除品牌
export const deleteBrandSort = {
	url: '/manager/batchGoods/brand/delete.do',
	method: "POST"
}
// 添加品牌
export const addBrand = {
	url: '/manager/batchGoods/brand/add.do',
	method: "POST"
}

// 根据品牌id获取品牌信息
export const getBrandInfo = {
	url: '/manager/batchGoods/brand/getById.do',
	method: "POST"
}
// 编辑品牌
export const updateBrand = {
	url: '/manager/batchGoods/brand/update.do',
	method: "POST"
}
// 获取指定品牌的商品列表	
export const getGoodsByBrand = {
	url: '/manager/batchGoods/info/findGoodsByPage.do',
	method: "POST"
}