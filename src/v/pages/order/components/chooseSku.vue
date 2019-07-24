<template>
	<div>
		<el-dialog
		  	title="选择规格"
		  	:visible.sync="visible"
		  	append-to-body>
		  	<div style="height: 350px; overflow: auto;">
		  		<el-table :data="skuList" size="mini" v-loading="isLoading">
	  				<!-- <el-table-column label="货品编号" width="130">
	  					<template slot-scope="scope">
	  						<el-input placeholder="请输入" size="mini" :disabled="scope.row.id!='' && scope.row.id!=null && scope.row.id!=undefined" class="xsmallInput" v-model="scope.row.code"></el-input>
	  					</template>
	  				</el-table-column> -->
	  				<el-table-column v-for="(item,index) in specData" :key="item.id" :label="item.name" v-if="!isEditing">
						<template slot-scope="scope">
	  						{{getSkuSpecValueName(item.id,scope.row.goodsSkuSpecList)}}
	  					</template>
	  				</el-table-column>
	  				<el-table-column v-for="(item,index) in specData" :key="item.id" :label="item.name" v-if="isEditing">
						<template slot-scope="scope">
	  						{{scope.row.specList[index].specValue}}
	  					</template>
	  				</el-table-column>
	  				<el-table-column label="库存" prop="stock" v-if="!isEditing">
	  				</el-table-column>
	  				<el-table-column label="重量" :prop="isEditing ? 'sku_weight' : 'weight'">
	  				</el-table-column>
	  				<el-table-column label="数量">
	  					<template slot-scope="scope">
	  						<el-input size="mini" class="miniInput" v-model="scope.row.num" :readonly="isEditing"></el-input>
	  					</template>
	  				</el-table-column>
	  			</el-table>
		  	</div>
		  	<div slot="footer">
			  	<el-button plain size="small" @click="cancel">关闭</el-button>
		  		<el-button type="primary" size="mini" @click="confirm" v-if="!isEditing">确定</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import orderApi from '@c/mixins/orderApi';
	export default {
		data() {
			return {
				skuList: [],
				specData: [],
				isLoading: false
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			},
			templateId: {
				type: [String, Number]
			},
			selection: {
				type: [Array],
				required: true
			},
			isEditing: {
				type: [Boolean],
				default: false
			}
		},
		mixins: [dialogVisibility, orderApi],
		// mounted() {
		// 	this.getSkuList();
		// },
		watch: {
			visible: {
				handler(v) {
					if (v) {
						this.getSkuList();
					}
				},
				deep: true
			}
		},
		methods: {
			//获取货品列表和规格列表
			getSkuList() {
				this.isLoading = true;
				if (this.isEditing) {
					let specData = [];
					this.selection[0].specList.forEach((v) => {
						specData.push({
							name: v.specName
						});
					});
					this.specData = specData;
					this.skuList = this.selection;
					this.isLoading = false;
				} else {
					this.$api(this.orderApi[this.$version] + ".getSkuList", {goodsId: this.id, templateId: this.templateId}).then((result) => {
						// 请求库存
						this.$api(this.orderApi[this.$version]+".getAllGoodsStock",{map:JSON.stringify([{product_id:this.id}])}).then((result) => {
							this.skuList.forEach(function(item,index){
								console.log(result[0].skuStock.find(n => n.goods_id == item.id));
								item.stock = result[0].skuStock.find(n => n.goods_id == item.id).store;
							})
						},(error) => {
							if(error.data.status != 102){
								this.$message({
		                            type: 'error',
		                            message: '请求库存出错'
		                        });
							}
						})
						this.specData = result.specList;
						result.list.forEach((v) => {
							v.num = '';
						});
						this.skuList = [];
						result.list.forEach((item,index) => {
							if(item.status == 1){
								this.skuList.push(item);
							}
						})
						this.selection.forEach((v) => {
							let index = this.skuList.findIndex(n => n.id === v.sku_id);
							if (index > -1) {
								this.skuList[index].num = v.num;
							}
						});
						this.isLoading = false;
					}, (error) => {
						this.isLoading = false;
	                    if (error && error.data && error.data.status == 102) {
	                        this.orderList = [];
	                        this.totalCount = 0;
	                    } else {
	                        this.$message({
	                            type: 'error',
	                            message: '加载数据出错'
	                        });
	                    }
					});
				}
			},
			//获取规格值
			getSkuSpecValueName(specId,goodsSkuSpecList){
				let specValue = goodsSkuSpecList.find((n)=>n.specId == specId)
				return this.getSpecValueName(specId, specValue.specValueId);
			},
			getSpecValueName(specId,specValueId){
				let valueList = this.specData.find((n)=> n.id == specId).specValueList
				let valueItem = valueList.find((n)=> n.id == specValueId)
				return valueItem.name
			},
			//确定
			confirm() {
				let selectedList = [];
				let total = 0;
				let checked = 0;
				this.skuList.forEach((v) => {
					if (!/^\d+$/.test(v.num) && v.num !== '') {
						checked = 1;
			          	return;
					}
					if (parseInt(v.num) > parseInt(v.stock)) {
						checked = 2;
			          	return;
					}
					if (v.num !== '' && v.num !== '0') {
						selectedList.push({
							goods_id: this.id,
							sku_id: v.id,
							sku_weight: v.weight,
							num: v.num
						});
						total += parseInt(v.num);
					}
				});
				if (checked === 1) {
					this.$message({
		            	type: 'error',
		            	message: '请输入正整数'
		          	});
		          	return;
				}
				if (checked === 2) {
					this.$message({
		            	type: 'error',
		            	message: '库存不足'
		          	});
		          	return;
				}
				if (selectedList.length === 0) {
					this.$message({
		            	type: 'error',
		            	message: '所选货品总数不能为0'
		          	});
		          	return;
				}
				this.$emit("select", {
					list: selectedList,
					total: total
				});
				this.visible = false;
			},
			//关闭
			cancel() {
				this.visible = false;
			}
		},
		components: {

		}
	}
</script>
<style>

</style>