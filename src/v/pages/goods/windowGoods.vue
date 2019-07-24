<template>
	<div class="contents">
		<page-title :title="detail.name || '橱窗商品'" goback></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addWindow">添加商品</el-button>
		</div>
		<el-table :data="goodsList" size="mini" v-loading="loading">
		    <el-table-column label="商品名称">
		    	<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
		    	</template>
		    </el-table-column>
		    <el-table-column label="商品编号" width="160">
		    	<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.code">{{scope.row.code}}</span>
		    	</template>
		    </el-table-column>
		    <el-table-column label="销售价" width="160">
		    	<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.retailPrice | toFixed(2)">{{scope.row.retailPrice | toFixed(2)}}起</span>
		    	</template>
		    </el-table-column>
		    <el-table-column prop="stock" label="库存" width="160"></el-table-column>
		    <el-table-column  label="是否在售" width="160">
		      	<template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
		    </el-table-column>
		    <el-table-column label="排序">
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-sort-up" @click="upData(scope.$index)" size="mini"></el-button>
					<el-button type="text" icon="el-icon-sort-down" @click="downData(scope.$index)" size="mini"></el-button>
				</template>
	    	</el-table-column>
	      	<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<span>
						<el-popover placement="top" width="200" trigger="click" v-model="scope.row.popover" >
							<p>是否移除"{{ scope.row.name }}"这个商品？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="scope.row.popover = false;delWindowGoods(scope.row.id,scope.$index)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="mini">移除</el-button>
						</el-popover>
					</span>
				</template>
	      	</el-table-column>
	    </el-table>


		<el-dialog title="选择商品" ref="selectProduct" :visible.sync="dialogVisible" width="900px" >
			<div style="height:429px">
			<el-table ref="productTable" v-if="dialogVisible" :data="productData" class="table-one-line" @selection-change="handleCheck" size="mini" height="429" v-loading="goodsLoading">
			    <el-table-column type="selection"  width="35" :selectable="checkSelect"></el-table-column>
			    <el-table-column label="商品编号" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.code">{{scope.row.code}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="商品名称">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="销售价" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.retailPrice | toFixed(2)">{{scope.row.retailPrice | toFixed(2)}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column prop="stock" label="库存" width="70"></el-table-column>
			    <el-table-column  label="是否在售" width="70">
			      	<template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
			    </el-table-column>
		  	</el-table>
		  	</div>
		  	<div class="pro_footer">
		  		<el-pagination size="small" @current-change="handlePro" :current-page="pro_page" :page-size="10" layout="total, prev, pager, next, jumper" :total="pro_total" class="pro_page"></el-pagination>
		  	</div>
		  	<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
			    <el-button type="primary" size="mini" @click="confirmselect">确 定</el-button>
			</span>
		</el-dialog>


	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'

	export default {
		data() {
			return {
				goodsLoading:false,
				dialogVisible:false,
				productData:[],
				selection:[],
				pro_page:1,
				pro_total:0,


				loading:true,
				detail:{},
				goodsList:[],
			}
		},
		mounted() {
			this.id = this.$route.query.id || ''
			if(this.id!=''){
				this.getWindow()
			}
		},
		methods: {
			exchange(index1,index2){
				this.$api("goods.exchangeGoods",{showcaseId:this.id,sourceGoodsId:this.goodsList[index1].id,targetGoodsId:this.goodsList[index2].id}).then((result) => {
					this.goodsList[index1] = this.goodsList.splice(index2, 1, this.goodsList[index1])[0]
					this.$message({ message: '排序成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '排序出错', type: 'error' });
				});
			},
			upData(index){
				if(index == 0) { return }
				this.exchange(index,index-1)
			},
			downData(index){
				if(index == this.goodsList.length - 1) { return }
				this.exchange(index,index+1)
			},
			refreshGoodsList(){
				this.selection.forEach( (el, index) => {
					let rowIndex = this.goodsList.findIndex((n)=>n.id==el.id)
					if(rowIndex==-1){
						// this.goodsList.push(el)
						this.goodsList.splice(0, 0, el);
					}
				});
			},
			checkSelect(row,index){
				let rowIndex = this.goodsList.findIndex((n)=>n.id==row.id)
				if(rowIndex>-1){
					return false
				}else {
					return true
				}
			},
			confirmselect(){
				if(this.selection.length==0){
					this.$message({ message: '请选择商品', type: 'error' });return
				}
				let arr = []
				this.selection.forEach( (el, index) => {
					let elIndex = this.goodsList.findIndex((n)=>n.id==el.id)
					if(elIndex==-1){
						arr.push(el.id)
					}
				});
				this.$api("goods.addWindowGoods",{showcaseId:this.id,ids:arr.join(",")}).then((result) => {
					this.refreshGoodsList()
					this.dialogVisible = false
					this.$message({ message: '添加成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '添加商品出错', type: 'error' });
				});
			},
			handleSelect(){
				this.goodsList.forEach( (el, index) => {
					let row = this.productData.findIndex((n)=>n.id==el.id)
					console.log(row)
					if(row>-1){
						console.log(this.productData[row])
						setTimeout(()=>{
							this.$refs.productTable.toggleRowSelection(this.productData[row])
						})
					}
				});
			},
			handlePro(val){
				this.pro_page = val;
				this.getGoodsList()
			},
			handleCheck(val){
				this.selection = val;
			},
			addWindow(){
				this.pro_page = 1
				this.dialogVisible = true
				this.getGoodsList()
			},
			getGoodsList(){
				this.goodsLoading = true
				let params = {
					page: this.pro_page,
					pageSize: 10
				}
				this.$api("goods.getGoods",params).then((result) => {
					this.goodsLoading = false
					this.pro_total = result.page.total
					this.productData = result.list
					this.handleSelect()
				}, (error) => {
					this.goodsLoading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品列表出错', type: 'error' });
					}else{
						this.pro_total = 0
						this.productData = []
					}
				});
			},
			delWindowGoods(id,index){
				this.$api("goods.removeWindowGoods",{showcaseId:this.id,ids:id}).then((result) => {
					this.goodsList.splice(index,1)
					this.$message({ message: '操作成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '移除橱窗商品出错', type: 'error' });
				});
			},
			getWindow(){
				this.$api("goods.getWindow",{id:this.id}).then((result) => {
					this.loading = false
					this.detail = result
					this.goodsList = result.goodsList || []
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询橱窗商品出错', type: 'error' });
					}
				});
			},
		},
		components: {
			pageTitle,
		}
	}
</script>
<style>
.pro_page{float: right;}
.pro_footer{overflow: hidden; padding-top: 10px}
.producttable{font-size:12px; width: 100%}
</style>
