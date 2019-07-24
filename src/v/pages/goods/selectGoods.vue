<template>
	<span>
		<el-button :type="buttontype" size="small"  @click="selectProduct">选择商品</el-button>

		<el-dialog title="选择商品" ref="selectProduct" v-if="dialogVisible" :visible.sync="dialogVisible" width="1000px">
			<div style="min-height:440px" v-loading="tableLoading">
			<el-table ref="productTable" :data="productData" class="producttable table-one-line" @selection-change="handleCheck" size="mini" >
			    <el-table-column type="selection"  width="55" :selectable="checkSelect"></el-table-column>
			    <el-table-column label="商品名称">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column prop="code" label="商品编号"></el-table-column>
			    <el-table-column  label="是否上架">
			      	<template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
			    </el-table-column>
			    <el-table-column prop="price" label="市场价"></el-table-column>
			    <el-table-column prop="retailPrice" label="销售价"></el-table-column>
			    <el-table-column prop="weight" label="重量"></el-table-column>
			    <el-table-column prop="stock" label="库存"></el-table-column>
			    <el-table-column label="图片标签">
			    	<template slot-scope="scope">
			    		<div class="one-line">
						<span v-for="(item,index) in scope.row.goodsMarkList" :key="item.id"><span v-if="index!=0">，</span>{{item.markName}}</span>
						</div>
			    	</template>
			    </el-table-column>
		  	</el-table>
			</div>
		  	<div class="pro_footer">
		  		<el-pagination size="small" @current-change="handlePro" :current-page="pro_page" :page-size="10" layout="total, prev, pager, next, jumper" :total="pro_total" class="pro_page"></el-pagination>
		  		<el-button type="primary" size="small" @click="confirmselect">确定</el-button>
		  	</div>
		</el-dialog>
	</span>
</template>

<script>
	export default {
		data() {
			return {
				tableLoading:true,
				buttontype:'',
				dialogVisible:false,
				pro_page:1,
		        pro_size:10,
		        pro_total:0,
				productData:[],
				selection:[],
		        selectData:{},
		        lostgoods:[],
		        sids:[]
			}
		},
		methods: {
			checkSelect(row,index){
				if(this.goodsids.indexOf(row.id.toString()) > -1 || this.goodsids.indexOf(row.id) > -1 || this.sids.indexOf(row.id) >-1 || this.sids.indexOf(row.id.toString()) >-1){
					return false
				}else{
					return true
				}
			},
			//确认选择
			confirmselect(){
				if(this.selection.length == 0){
					this.$message({ message: '请至少选择一种商品', type: 'error'});return
				}
				
				this.handleData()
			},
			//翻页
			handlePro(val){
				this.handleData()
				this.pro_page = val;
				this.selectProduct();
			},
			//处理数据
			handleData(){
				let goodsArr = [];
				this.selection.forEach((row)=>{
					goodsArr.push({
						name:row.name,
						relatedId: row.id,
						relatedType: "0",
					})
				})
				this.dialogVisible = false;
				this.$emit("change",goodsArr);
			},
			//复选框
			handleCheck(val) {
		        this.selection = val;
		    },
		    //回显选中数据
		    showData(){
				setTimeout(()=>{
					this.sids.forEach((row)=>{
						let index = this.productData.findIndex((n) => n.id == row)
						if(index > -1){
							this.$refs.productTable.toggleRowSelection(this.productData[index])
						}
					})
				})
		    },
			//选择商品
			selectProduct(){
				this.dialogVisible = true
				this.tableLoading = true
				let param = {
					page:this.pro_page,
					pageSize:10
				}
				if(this.orderSkuId && this.orderSkuId.length > 0){
					param.orderSkuId = this.orderSkuId.join(',')
				}
				this.$api("goods.getGoods",param).then((result) => {
					this.tableLoading = false
					this.productData = result.list
					this.pro_total = result.page.total
					this.showData()
				}, (error) => {
					this.tableLoading = false
					if(error.data.status!=102){
						this.$message({ message: '获取商品列表失败', type: 'warning'});
					}
					this.productData = []
					this.pro_total = 0
				});
			},
		},
		watch: {
			selectids: {
                handler(v) {
                	let tmp = [];
					for(let i in v){
						tmp.push(v[i].relatedId)
					}
					this.sids = tmp
                },
            },
        },
		mounted() {
			let tmp = [];
			for(let i in this.selectids){
				tmp.push(this.selectids[i].relatedId)
			}
			this.sids = tmp
			this.buttontype = this.button || ''
		},
		props: ['selectids','button','resets','orderSkuId','goodsids'],
		components:{

        },
	}
</script>
<style>
.pro_page{float: right;}
.pro_footer{overflow: hidden; padding: 10px 0}
.producttable{font-size:12px; width: 100%}
</style>