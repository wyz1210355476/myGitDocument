<template>
	<div>
		<el-button size="small" @click="showDialog" :disabled="disabled">选择商品</el-button>
		<el-dialog title="选择商品" custom-class="dialog-order-choose-goods" :visible.sync="showGoodsDialog">
			<div>
				<el-table ref="goodsList" :data="goodsList" style="width: 100%" @selection-change="handleSelectionChange" size="mini" v-loading="isLoading" class="table-one-line" height="429">
					<el-table-column type="selection" width="35">
	                </el-table-column>
	                <el-table-column label="商品编号" width="100">
	                	<template slot-scope="scope">
	                		<span class="one-line" :title="scope.row.code">{{scope.row.code}}</span>
	                	</template>
	            	</el-table-column>
	                <el-table-column label="商品名">
	                	<template slot-scope="scope">
	                		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
	                	</template>
	            	</el-table-column>
	            	<!-- <el-table-column label="规格">
	            		<template slot-scope="scope">
	            			<div class="one-line">
	            				<span v-for="(item, index) in scope.row.goodsSkuSpecList">
		            				<span>{{item.specValueName}}</span>
		            				<span v-if="index != (scope.row.goodsSkuSpecList.length-1)"> | </span>
		            			</span>
	            			</div>
	            		</template>
	            	</el-table-column> -->
	            	<el-table-column label="销售价" width="100">
	            		<template slot-scope="scope">
	            			{{scope.row.retailPrice | toFixed(2)}}
	            		</template>
	            	</el-table-column>
	            	<el-table-column label="重量" prop="weight" width="70">
	            	</el-table-column>
	            	<el-table-column label="库存" prop="stock" width="70">
	            	</el-table-column>
	            	<el-table-column label="" width="100">
	                    <template slot-scope="scope">
	                    	<el-button v-if="scope.row.specFlag" type="text" @click="showSkuDialog(scope.row.id, scope.row.templateId, scope.$index)" size="small">选择规格</el-button>
	                    	<el-input v-if="!scope.row.specFlag" type="text" v-model="scope.row.num" size="mini" @change="onInputNumChange($event, scope.row.id, scope.$index)"></el-input>
	                    </template>
	                </el-table-column>
				</el-table>
			</div>
			<el-pagination size="small" @current-change="getPageParam" :current-page.sync="pageParam.page" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalCount" class="page-goods"></el-pagination>
			<div class="btn-area right" slot="footer" >
				<el-button @click="showGoodsDialog = false" size="mini">取 消</el-button>
	  			<el-button type="primary" size="mini" @click="chooseSelectGood">提交</el-button>
	  		</div>
		</el-dialog>
		<choose-sku :visibility.sync="skuSelectDialog.show" :id="skuSelectDialog.id" :templateId="skuSelectDialog.templateId" :selection="skuSelectDialog.selection" @select="onSelectSkuChange"></choose-sku>
		<!-- <page-title title="订单列表"></page-title> -->
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import {deepCopy} from '@c/util';
	import chooseSku from './chooseSku';
	export default {
		data() {
			return {
				goodsList: [],
				totalCount: 0,
				pageParam: {
					pageSize: 10,
					page: 1,
					status: 1
				},
				showGoodsDialog: false,
				selection: [],
				selectionSortByPage: {},
				lostGoodsList: [],
				isLoading: false,
				skuSelectDialog: {
					id: '',
					index: '',
					selection: [],
					templateId: '',
					show: false
				}
			}
		},
		props: ['selectList', 'disabled'],
		methods: {
			showDialog() {
				this.showGoodsDialog = true;
				this.selectionSortByPage = {};
				this.lostGoodsList = deepCopy(this.selectList);
				// console.log('start: lostGoodsList', this.lostGoodsList);
				// console.log('start: selectionSortByPage', this.selectionSortByPage)
				this.getGoodList();
			},
			getPageParam(msg) {
				this.pageParam.page = msg;
				this.getGoodList();
			},
			getGoodList() {
				this.isLoading = true;
				this.$api("goods.getGoods", this.pageParam).then((result) => {
					result.list.forEach((v) => {
						v.num = '';
						v.selectSkuList = [];
					});
					this.goodsList = result.list || [];
					
					let productIds = [];
					this.goodsList.forEach((item,index) => {
						productIds.push({"product_id":item.id})
					})
					// 批量获取商品库存
					this.$api("goods.plGetGoodsStock",{map:productIds}).then((result) => {
						result.forEach((item,index) => {
							this.goodsList.find((n) => n.id == item.product_id).stock = item.store;
						})		
					},(error) => {
						this.$message({
			            	type: 'error',
			            	message: '获取商品库存出错'
			          	});
					})
					this.totalCount = result.page.total;
					// this.pageParam.page = result.page.page;
					this.$nextTick(() => {
						// console.log('lostGoodsList.length', this.lostGoodsList.length)
						if (this.selectionSortByPage[this.pageParam.page] && this.selectionSortByPage[this.pageParam.page].length !== 0) {
							// console.log(1)
							this.selectionSortByPage[this.pageParam.page].forEach((v) => {
								let index = this.goodsList.findIndex((n) => n.id === v.id);
								if (index > -1) {
									this.goodsList[index].num = v.num;
									this.goodsList[index].selectSkuList = v.selectSkuList;
									this.goodsList[index].changedPrice = v.changedPrice;
									this.$refs.goodsList.toggleRowSelection(this.goodsList[index], true);
								}
							});
						} else if (this.lostGoodsList.length !== 0) {
							// console.log(2)
							this.selectionSortByPage[this.pageParam.page] = [];
							this.lostGoodsList.forEach((v, i) => {
								let index = this.goodsList.findIndex((n) => n.id === v.id);
								if (index > -1) {
									this.selectionSortByPage[this.pageParam.page].push(v);
									this.goodsList[index].num = v.num;
									this.goodsList[index].selectSkuList = v.selectSkuList;
									this.goodsList[index].changedPrice = v.changedPrice;
									this.$refs.goodsList.toggleRowSelection(this.goodsList[index], true);
									setTimeout(() => {
										let indexin = this.lostGoodsList.findIndex((value) => value.id === v.id);
										if (indexin > -1) {
											this.lostGoodsList.splice(indexin, 1);
										}
									})
								}
							});
							// console.log('update:lostGoodsList', this.lostGoodsList)
						} else {
							// console.log(3)
							this.selectionSortByPage[this.pageParam.page] = [];
						}
						this.isLoading = false;
						// console.log('update: selectionSortByPage', this.selectionSortByPage);
					})
				}, (error) => {
					this.totalCount = 0;
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			handleSelectionChange(selection) {
				// this.selection = selection;
				if (this.isLoading) {
					return;
				}
				this.selectionSortByPage[this.pageParam.page] = deepCopy(selection);
				// console.log('selection:selectionSortByPage', this.selectionSortByPage)
			},
			//选择规格
			showSkuDialog(id, templateId, index) {
				this.skuSelectDialog.show = true;
				this.skuSelectDialog.id = id;
				this.skuSelectDialog.index = index;
				this.skuSelectDialog.templateId = templateId;
				this.skuSelectDialog.selection = this.goodsList[this.skuSelectDialog.index].selectSkuList;
			},
			//选择货品
			onSelectSkuChange(selection) {
				this.goodsList[this.skuSelectDialog.index].selectSkuList = selection.list;
				this.goodsList[this.skuSelectDialog.index].num = selection.total;
				this.$refs.goodsList.toggleRowSelection(this.goodsList[this.skuSelectDialog.index], true);
				this.$nextTick(() => {
					let index = this.selectionSortByPage[this.pageParam.page].findIndex(n => n.id === this.goodsList[this.skuSelectDialog.index].id);
					if (index > -1) {
						this.selectionSortByPage[this.pageParam.page][index].selectSkuList = selection.list;
						this.selectionSortByPage[this.pageParam.page][index].num = selection.total;
					}
				});
			},
			onInputNumChange(value, id, index) {
				if (value !== '' && value !== '0') {
					this.$refs.goodsList.toggleRowSelection(this.goodsList[index], true);
				}
				this.$nextTick(() => {
					let index = this.selectionSortByPage[this.pageParam.page].findIndex(n => n.id === id);
					if (index > -1) {
						this.selectionSortByPage[this.pageParam.page][index].num = value;
					}
				});
			},
			chooseSelectGood() {
				let selection = [];
				let checked = 0;
				for (var i in this.selectionSortByPage) {
					if (this.selectionSortByPage[i].length !== 0) {
						this.selectionSortByPage[i].forEach((v) => {
							if (v.num === '' || parseInt(v.num) <= 0 || !/^\d+$/.test(v.num)) {
								checked = 1;
								return;
							}
							if (parseInt(v.num) > parseInt(v.stock)) {
								checked = 2;
								return;
							}
						});
						if (checked === 1) {
							this.$message({
				            	type: 'error',
				            	message: '第' + i + '页所选商品中有商品输入数量不符合要求，商品数量只能输入正整数'
				          	});
				          	return;
						}
						if (checked === 2) {
							this.$message({
				            	type: 'error',
				            	message: '第' + i + '页所选商品中有商品库存不足'
				          	});
				          	return;
						}
						selection.push(...this.selectionSortByPage[i]);
					}
				}
				if (this.lostGoodsList.length !==0) {
					selection.push(...this.lostGoodsList);
				}
				// console.log('selection', selection)
				this.$emit("select", selection);
				this.showGoodsDialog = false;
			}
		},
		components: {
			pageTitle,
			chooseSku
		}
	}
</script>
<style>
	.dialog-order-choose-goods {
		width: 900px;
	}
</style>
<style scoped>
	.page-goods {text-align: right; margin-top: 10px;}
	.btn-area{margin-top: 0px}
	.btn-area.right {padding-left: 0;}
</style>