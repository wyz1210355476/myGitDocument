<template>
	<div class="contents">
		<page-title :title="'商品品牌'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addBrand">新增</el-button>
			<el-button size="small" @click="sortD = true" v-if="sortD == false">编辑排序</el-button>
			<el-button type="primary" size="small" @click="saveSort" v-if="sortD == true">保存</el-button>
		</div>
		<div class="categoryTh">
			<div class="treeRow th">
			<span class="td">品牌名称</span>
			<span class="td short">图片</span>
			<span class="td">排序码</span>
			<span class="td">操作</span>
		</div>
		</div>
		<el-tree
			v-loading="loading"
			class="goodsCategory"
			:data="brandData"
			:props="defaultProps"
			node-key="id"
			ref="category"
			:expand-on-click-node="false"
			:render-content="renderContent">
		</el-tree>


		<el-dialog title="相关商品" :visible.sync="dialogVisible" v-if="dialogVisible" width="900px" >
			<el-table :data="productData" class="table-one-line" size="mini" height="429">
			    <el-table-column label="商品名称" >
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="商品编号" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.code">{{scope.row.code}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column  label="是否在售" width="70">
			      	<template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
			    </el-table-column>
			    <el-table-column label="市场价" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.price | toFixed(2)">{{scope.row.price | toFixed(2)}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="销售价" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.retailPrice | toFixed(2)">{{scope.row.retailPrice | toFixed(2)}}起</span>
			    	</template>
			    </el-table-column>
			    <el-table-column prop="weight" label="重量" width="70"></el-table-column>
			    <el-table-column prop="stock" label="库存" width="70"></el-table-column>
		  	</el-table>
		  	<div class="pro_footer">
		  		<el-pagination size="small" @current-change="handlePro" :current-page="pro_page" :page-size="10" layout="total, prev, pager, next, jumper" :total="pro_total" class="pro_page"></el-pagination>
		  	</div>
		  	<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false" size="mini">关 闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';

	export default {
		data() {
			return {
				dialogVisible:false,
				pro_page:1,
		        pro_total:0,
		        productData:[],

				loading:true,
				sortD:false,
				brandData:[],
		        defaultProps: {
		        	children: 'childrenList',
		        	label: 'name'
		        },
				sortData:[],
				temData:""
			}
		},
		mounted() {
			this.getBrandList()
		},
		methods: {
			handlePro(val){
				this.pro_page = val;
				this.showBrandGoods(null,this.temData)
			},
			saveSort(){
				if(this.sortData.length == 0){
					this.sortD = false;return
				}
				let sequenceReg = /^[0-9]+$/
				let flag = true
				this.sortData.forEach( (element, index) => {
					if(!sequenceReg.test(element.sequence)){flag = false}
				})
				if(flag){
					let params = {sortParam:JSON.stringify(this.sortData)}
					this.$api("goods.changeBrandSort",params).then((result) => {
						this.$message({ message: '操作成功', type: 'success' })
						this.getBrandList()
						this.sortD = false
					}, (error) => {
						this.$message({ message: '编辑品牌排序失败', type: 'error' });
					});
				}else{
					this.$message({ message: '请输入正确的排序码', type: 'error' });return
				}

			},
			changeSort(node,data){
				let tmp = this.sortData.find((n) => n.id == data.id)
				if(tmp){
					tmp.sequence = data.sequence
				}else{
					this.sortData.push({"id":data.id,"sequence":Number(data.sequence)})
				}
			},
		    editBrand(node,data){
		    	this.$router.push({name:'addBrand',query:{id:data.id}})
		    },
		    delBrand(node,data){
		    	this.$confirm('确定删除品牌"'+node.label+'"吗？', '', {
		        	confirmButtonText: '确定',
		        	cancelButtonText: '取消',
		        	type: 'warning'
		        }).then(() => {
		        	let params = {ids:data.id}
					this.$api("goods.deleteBrandSort",params).then((result) => {
						this.$message({ message: '删除成功', type: 'success' })
						this.getBrandList()
					}, (error) => {
						if(error.data.status == '202'){
							this.$message({ message: '该品牌下有商品，不可删除', type: 'error' });
						}else{
							this.$message({ message: '删除商品品牌出错', type: 'error' });
						}

					});
		        }).catch(() => {});

		    },
		    showBrandGoods(node,data){
				this.temData = data;
		    	let params = {
					page:this.pro_page || 1,
					pageSize:10,
					brandId:data.id
				}
				this.$api("goods.getGoodsByBrand",params).then((result) => {
					this.pro_total = result.page.total
					this.productData = result.list
					this.dialogVisible = true
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品品牌出错', type: 'error' });
					}else{
						this.pro_total = 0
						this.productData = []
						this.dialogVisible = true
					}
				});
		    },
			addBrand(){
				this.$router.push({name:'addBrand'})
			},
			getBrandList(){
				let params = {}
				this.$api("goods.getBrandList",params).then((result) => {
					this.loading = false
					this.brandData = result.list
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品品牌出错', type: 'error' });
					}
				});
			},
			renderContent(h, { node, data, store }) {
		        return (
			        <div class="treeRow">
			            <span class="td">{data.name}</span>
			            <span class="td short"><span class="thumbImg" v-show={Boolean(data.imageId)}><img src={data.imageUrl} /></span></span>
			            <span class="td">
			            	{
					            !this.sortD ?
					            <span>{data.sequence}</span>  :

					            <el-input placeholder="请输入排序码" size="small" class="smallInput" v-model = { data.sequence } on-change={ ()=>this.changeSort(node,data) }></el-input>
					        }
			            </span>
			            <span class="td">
			              	<el-button type="text" size="small" on-click={ () => this.editBrand(node, data) }>编辑</el-button>
							<el-button type="text" size="small" on-click={ () => this.delBrand(node, data) } disabled={ data.childrenList && data.childrenList.length > 0 }>删除</el-button>
			              	<el-button type="text" size="small" on-click={ () => this.showBrandGoods(node, data) }>查看商品</el-button>
			            </span>
			        </div>
		        );
		    },
		},
		components: {
			pageTitle,
		}
	}
</script>
<style>
.goodsCategory .el-tree-node,.categoryTh{
	position:relative;
}
.goodsCategory .el-tree-node__content{
	border-bottom:1px solid #eee;
	height:auto
}
.th{background:#fafafa}
.th .td:first-child{padding-left:10px;}
.treeRow{
	overflow:hidden;
	width:100%
}
.treeRow .td{
	line-height:36px;
	height: 36px;
	display:block;
	width:20%;
	float:left;
	overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.treeRow .td .thumbImg{width:30px; height:30px; border:1px solid #efefef; display: block; overflow: hidden; margin-top: 2px}
.treeRow .td .thumbImg img{width: 100%}
.treeRow .td.short{width: 10%}
.treeRow .td:nth-child(2){position:absolute; left:25%}
.treeRow .td:nth-child(3){position:absolute; left:35%}
.treeRow .td:nth-child(4){position:absolute; left:55%}
.treeRow .td:nth-child(5){position:absolute; left:75%; min-width:200px}

.pro_page{float: right;}
.pro_footer{overflow: hidden; padding-top: 10px}
</style>
