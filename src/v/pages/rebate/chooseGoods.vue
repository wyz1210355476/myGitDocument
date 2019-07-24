<template>
	<span>
        <span @click="showDialog"><slot></slot></span>
		<el-dialog title="选择商品" custom-class="dialog-order-choose-goods" :visible.sync="showGoodsDialog">
			<div>
				<el-table ref="goodsList" :data="goodsList" style="width: 100%" @selection-change="handleSelectionChange" size="mini" v-loading="isLoading" class="table-one-line" height="440">
					<el-table-column type="selection" width="40">
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
	            	<el-table-column label="销售价" width="100">
	            		<template slot-scope="scope">
	            			{{scope.row.retailPrice | toFixed(2)}}
	            		</template>
	            	</el-table-column>
	            	<el-table-column label="重量" prop="weight" width="70">
	            	</el-table-column>
	            	<el-table-column label="库存" prop="stock" width="70">
	            	</el-table-column>
				</el-table>
			</div>
			<el-pagination size="small" @current-change="getPageParam" :current-page.sync="pageParam.page" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalCount" class="page-goods"></el-pagination>
			<div class="btn-area right" slot="footer" >
				<el-button @click="showGoodsDialog = false" size="mini">取 消</el-button>
	  			<el-button type="primary" size="mini" @click="chooseSelectGood">提交</el-button>
	  		</div>
		</el-dialog>
	</span>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	export default {
		data() {
			return {
				goodsList: [],
				totalCount: 0,
				pageParam: {
					pageSize: 10,
					page: 1
				},
				showGoodsDialog: false,
				selection: [],
				isLoading: false
			}
		},
		methods: {
			showDialog() {
				this.showGoodsDialog = true;
				this.getGoodList();
			},
			getPageParam(msg) {
				this.pageParam.page = msg;
				this.getGoodList();
			},
			getGoodList() {
				this.isLoading = true;
				this.$api("goods.getGoods", this.pageParam).then((result) => {
					this.goodsList = result.list;
                    this.totalCount = result.page.total;
                    this.isLoading = false;
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
				if (this.isLoading) {
					return;
                }
				this.selection = selection;
			},
			chooseSelectGood() {
                if (this.selection.length === 0) {
                   	this.$message({
                        type: 'error',
                        message: '请选择商品'
                    }); 
                }
                let selection = [];
                this.selection.forEach((v) => {
                    selection.push({
						rebate_condition: 3,
						goods_id: v.id
					});
				});
				console.log(111111)
                this.$api('rebate.addOrSetRebateGoods', {data: selection}).then((result) => {
					this.$message({
                        type: 'success',
                        message: '保存成功'
                    }); 
					this.$emit("select", selection);
					this.showGoodsDialog = false;
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '保存失败'
                    }); 
				});
			}
		},
		components: {
			pageTitle
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