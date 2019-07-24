<template>
	<div class="contents">
		<page-title :title="'商品价格'"></page-title>
		<div class="topOp">
			<el-radio-group v-model="select" size="small" class="noRadio" @change="getSelect">
				<el-radio label="1">全部</el-radio>
				<el-radio label="2">无订货价商品</el-radio>
				<el-radio label="3">下架商品</el-radio>
			</el-radio-group>
			<operation ref="operation" class="floatR" module="goods_list" @search="getSearchParam"></operation>
		</div>
		<el-table :data="goodsData" size="mini" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" class="table-one-line">
			<el-table-column type="selection" width="35"></el-table-column>
	      	<el-table-column label="商品名称" >
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
		    	</template>
	      	</el-table-column>
	      	<el-table-column prop="code" label="商品编号" width="100"> </el-table-column>
	      	<el-table-column prop="date" label="是否上架" width="100">
				<template slot-scope="scope">
					{{scope.row.status == 1 ? '是' : '否'}}
				</template>
	      	</el-table-column>
	      	<el-table-column prop="unit" label="单位" width="100"> </el-table-column>
			<el-table-column label="库存" width="100">
				<template slot-scope="scope">
					<span v-if="goodsStock[scope.row.id]==''"><i class="el-icon-loading"></i></span>
					<span v-if="goodsStock[scope.row.id]!=='' && goodsStock[scope.row.id]!='fail'">{{goodsStock[scope.row.id]}}</span>
					<span v-if="goodsStock[scope.row.id]=='fail'">获取失败</span>
				</template>
			</el-table-column>
			<el-table-column label="市场价" width="100">
				<template slot-scope="scope">
					<span v-if="goodsMarketPriceData[scope.row.id]==''"><i class="el-icon-loading"></i></span>
					<span v-if="goodsMarketPriceData[scope.row.id]!=='' && goodsMarketPriceData[scope.row.id]!='fail'">{{goodsMarketPriceData[scope.row.id] | toFixed(2)}}</span>
					<span v-if="goodsMarketPriceData[scope.row.id]=='fail'">获取失败</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="最低订货价" width="100">
				<template slot-scope="scope" >
					<span v-if="goodsLowerPriceData[scope.row.id]==''"><i class="el-icon-loading"></i></span>
					<span v-if="goodsLowerPriceData[scope.row.id]!=='' && goodsLowerPriceData[scope.row.id]!='fail'">{{goodsLowerPriceData[scope.row.id] | toFixed(2)}}</span>
					<span v-if="goodsLowerPriceData[scope.row.id]=='fail'">获取失败</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="分组最低折扣" width="100">
				<template slot-scope="scope">
					<span v-if="goodsMinDiscount[scope.row.id]==''"><i class="el-icon-loading"></i></span>
					<span v-if="goodsMinDiscount[scope.row.id]!=='' && goodsMinDiscount[scope.row.id]!='fail'">{{goodsMinDiscount[scope.row.id]}}%</span>
					<span v-if="goodsMinDiscount[scope.row.id]=='fail'">获取失败</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" width="220">
				<template slot-scope="scope">
					<span v-if="goodsStock[scope.row.id] == 0 || (goodsLowerPriceData[scope.row.id]=='' || goodsLowerPriceData[scope.row.id]== 0) && scope.row.status==0">
						<el-button type="text" size="small" @click="checkPrice(goodsStock[scope.row.id])">上架</el-button>
					</span>
					<span v-else>
						<set-onsale :goodsid='scope.row.id' @change="getOnsale">
							<el-button type="text" size="small">{{scope.row.status == 1 ? '下架' : '上架'}}</el-button>
						</set-onsale>
					</span>
					<set-stock :goodsid='scope.row.id' @change="getStock">
						<el-button type="text" size="small" >库存</el-button>
					</set-stock>
					<set-retail-price :goodsid='scope.row.id' @change="getRetailPrice">
						<el-button type="text" size="small">编辑价格</el-button>
					</set-retail-price>
					<set-member-discount :goodsid='scope.row.id' @change="getMemberDiscount">
						<el-button type="text" size="small">客户折扣</el-button>
					</set-member-discount>
				</template>
	      	</el-table-column>
	    </el-table>
	    <pages :total="totalCount" @change="getParams('page')">
			<div slot="leftop">
				<el-checkbox @change="seleceAll" size="small" v-model="selectStatus">全选</el-checkbox>
				<!-- <span class="op_project"><el-button type="text" size="small" :disabled="false" @click="batchOnsale('1')">上架</el-button></span> -->
				<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length==0" @click="batchOnsale('0')">下架</el-button></span>
			</div>
		</pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'
	import setRetailPrice from './setRetailPrice'
	import setMemberDiscount from './setMemberDiscount'
	import setOnsale from './setOnsale'
	import setStock from './setStock'

	export default {
		data() {
			return {
				select:'1',
				selectStatus:false,
				multipleSelection:[],
				loading1:true,
				loading:false,
				totalCount:0,
				goodsData:[],
				page:1,
				pagesize:10,
				key:'',
				key_value:'',

				retailPrice:[],
				ssprice:'',
				memberDiscount:[],

				goodsids:'',
				goodsMarketPriceData:{},
				goodsLowerPriceData:{},
				goodsMinDiscount:{},
				goodsStock:{},
				tag:"1"//记录切换的状态 “1” ：全部 “2”：无订货价商品 “3”：下架商品
			}
		},
		mounted() {
			this.getGoods()
		},
		methods: {
			// 批量设置上下架
			batchOnsale(status){
				/**
				 * status 上下架状态
				 * 0 下架
				 * 1 上架
				 */
				let obj = [];
				this.multipleSelection.forEach((item,index) => {
					obj.push({
						id:item.id,
						status:status,
						productSkuList:[]
					})
				})
				this.$api("goods.updateStatusBatch",{statusStr:JSON.stringify(obj)}).then((result) => {
					this.$message({ message: '批量下架成功', type: 'success' });
					if(this.tag == '1'){
						this.getGoods()
					}else if(this.tag == '2'){
						this.getGoods({
							retailPrice:-1
						})
					}else if(this.tag == '3'){
						this.getGoods({
							status: 0
						})
					}
				},(error) => {
					this.$message({ message: '批量下架失败，请重试', type: 'error' });
				})
				console.log(this.multipleSelection)
			},
			seleceAll(val){
				if(val && this.goodsData.length > 0){
					this.goodsData.forEach(row => {
			            this.$refs.multipleTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        if(val.length == this.goodsData.length){
		        	this.selectStatus = true
		        }else{
		        	this.selectStatus = false
		        }
		    },
			checkPrice(store){
				let msg = store == 0 ? "请先设置库存" : "请先设置商品价格";
				this.$message({ message: msg, type: 'warning' });
			},
			//切换条件选项
			getSelect(val){
				this.tag = val;
				this.$router.push({query:{
					currentPage:1,
					pageSize:10
				}})
				this.$refs.operation.clear();
				if(val == '1'){
					this.getGoods()
				}else if(val == '2'){
					this.getGoods({
						retailPrice:-1
					})
				}else if(val == '3'){
					this.getGoods({
						status: 0
					})
				}
			},
			//设置上下架成功回调
			getOnsale(val){
				if(val){this.getGoods()}
			},
			//设置库存成功回调
			getStock(val){
				if(val){this.getGoodsStock(this.goodsids)}
			},
			//设置会员折扣成功回调
			getMemberDiscount(val){
				if(val){this.getGoodsMinDiscount(this.goodsids)}
			},
			//设置价格成功回调
			getRetailPrice(val){
				if(val){this.getGoodsPrice(this.goodsids)}
			},
			//获取商品列表
			getGoods(obj){
				this.loading = true
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize,
					discountFlag:false
				}
				
				if(obj){Object.assign(params, obj)}
				this.$api("goods.getGoods",params).then((result) => {
					this.totalCount = result.page.total
					this.goodsData = result.list
					this.loading = false

					let goodsids = ''
					this.goodsData.forEach((e,i) => {
						if(i!=0){goodsids+=','}
						goodsids+=e.id

						this.$set(this.goodsMarketPriceData,e.id,'')
						this.$set(this.goodsLowerPriceData,e.id,'')
						this.$set(this.goodsMinDiscount,e.id,'')
						this.$set(this.goodsStock,e.id,'')
		
					});

					this.goodsids = goodsids

					console.log(goodsids)
					this.getGoodsPrice(goodsids)
					this.getGoodsMinDiscount(goodsids)
					this.getGoodsStock(goodsids)

				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品列表出错', type: 'error' });
					}else{
						this.totalCount = 0
						this.goodsData = []
					}
				});
			},
			//批量获取商品库存
			getGoodsStock(goodsids){
				let goodsidArr = goodsids.split(',')
				let params = []
				goodsidArr.forEach(e=>{
					params.push({
						product_id:e
					})
				})
				this.$api("goods.plGetGoodsStock",{map:params}).then((result) => {
					result.forEach((e)=>{
						this.$set(this.goodsStock,e.product_id,e.store)
					})
					for(let i in this.goodsStock){
						if(this.goodsStock[i]==''){
							this.goodsStock[i]='0'
						}
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '获取商品库存出错', type: 'error' });
						for(let i in this.goodsStock){
							this.goodsStock[i]='fail'
						}
					}else{
						for(let i in this.goodsStock){
							this.goodsStock[i]='0'
						}
					}
				});
			},
			//批量获取商品价格
			getGoodsPrice(goodsids){
				let params = {
					product_id:goodsids,
					minPrice:1
				}
				this.$api("goods.getRetailGoodsPrice",params).then((result) => {
					result.forEach((e)=>{
						let wholesaleprice = JSON.parse(e.wholesale_price || '[]')
						let priceArr = []
						wholesaleprice.forEach((e) => {
							priceArr.push(Number(e.price))
						})
						priceArr = priceArr.sort()
						this.$set(this.goodsMarketPriceData,e.product_id,e.market_price)
						if(wholesaleprice.length>0){
							this.$set(this.goodsLowerPriceData,e.product_id,priceArr[0])
						}
					})
					for(let i in this.goodsMarketPriceData){
						if(this.goodsMarketPriceData[i]==''){
							this.goodsMarketPriceData[i]='0'
						}
					}
					for(let i in this.goodsLowerPriceData){
						if(this.goodsLowerPriceData[i]==''){
							this.goodsLowerPriceData[i]='0'
						}
					}
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '获取商品价格出错', type: 'error' });
						for(let i in this.goodsMarketPriceData){
							this.goodsMarketPriceData[i]='fail'
						}
						for(let i in this.goodsLowerPriceData){
							this.goodsLowerPriceData[i]='fail'
						}
					}else{
						for(let i in this.goodsMarketPriceData){
							this.goodsMarketPriceData[i]='0'
						}
						for(let i in this.goodsLowerPriceData){
							this.goodsLowerPriceData[i]='0'
						}
					}
				});
			},
			//批量获取商品最低折扣
			getGoodsMinDiscount(goodsids){
				let params = {
					goods_id:goodsids
				}
				this.$api("goods.getGoodsMinDiscount",params).then((result) => {
					result.forEach((e)=>{
						this.$set(this.goodsMinDiscount,e.goods_id,e.minDiscount)
					})
					for(let i in this.goodsMinDiscount){
						if(this.goodsMinDiscount[i]==''){
							this.goodsMinDiscount[i]='100'
						}
					}
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '获取商品最低折扣出错', type: 'error' });
						for(let i in this.goodsMinDiscount){
							this.goodsMinDiscount[i]='fail'
						}
					}else{
						for(let i in this.goodsMinDiscount){
							this.goodsMinDiscount[i]='100'
						}
					}
					
				});
			},
			//获取搜索关键词
			getSearchParam(val){
				this.key = val.search_select
				this.key_value = val.search_value
				this.getParams('search')
			},
			//带关键词检索商品
			getParams(key){
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				params[this.key] = this.key_value
				if(this.select  == '2'){
					params.retailPrice = -1
				}else if(this.select == '3'){
					params.status = 0
				}
				if(key == 'search'){
					this.$router.push({query:{currentPage:this.page,pageSize:this.pagesize}})
					params.page = this.page
					params.pageSize = this.pagesize
				}
				this.getGoods(params)
			},
		},
		components: {
			pageTitle,
			pages,
			operation,
			setRetailPrice,
			setMemberDiscount,
			setOnsale,
			setStock
		}
	}
</script>
<style>
.noRadio  .el-radio__input{display:none}
.noRadio  .el-radio__label{padding-left:0}
</style>
