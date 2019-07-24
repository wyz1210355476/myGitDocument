<template>
	<span>
		<el-button :type="buttontype" size="small"  @click="selectProduct">选择商品（{{productCount}}）</el-button>

		<el-dialog title="选择货品" ref="selectProduct" :visible.sync="dialogVisible" width="900px" >
			<el-table ref="productTable" :data="productData" class="producttable table-one-line" @selection-change="handleCheck" size="mini" height="429">
			    <el-table-column type="selection"  width="35"></el-table-column>
			    <el-table-column label="货品编号" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.code">{{scope.row.code}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column label="商品名">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
			    	</template>
			    </el-table-column>
			    <!-- <el-table-column  label="规格">
			      	<template slot-scope="scope">
			      	<div class="one-line">
			      		<span v-for="(item,index) in scope.row.goodsSkuSpecList" :key="item.id">
			      			<span v-if="index!=0"> | </span>
			      			{{ item.specValueName }}
			      		</span>
			      	</div>
			      	</template>
			    </el-table-column> -->
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
		  	<div class="pro_footer">
		  		<el-pagination size="small" @current-change="handlePro" :current-page="pro_page" :page-size="10" layout="total, prev, pager, next, jumper" :total="pro_total" class="pro_page"></el-pagination>
		  	</div>
		  	<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
			    <el-button type="primary" size="mini" @click="confirmselect">确 定</el-button>
			</span>
		</el-dialog>
	</span>
</template>

<script>
	export default {
		data() {
			return {
				buttontype:'',
				dialogVisible:false,
				pro_page:1,
		        pro_size:10,
		        pro_total:0,
				productCount:0,
				productData:[],
				selection:[],
		        selectData:{},
		        lostgoods:[],
			}
		},
		methods: {
			//确认选择
			confirmselect(){
				this.dialogVisible = false;
				this.handleData()
			},
			//翻页
			handlePro(val){
				debugger
				this.handleData()
				this.pro_page = val;
				this.selectProduct();
			},
			//处理数据
			handleData(){
				let arr = [];
				this.selection.forEach((row)=>{
					arr.push(row.id);
				})
				this.selectData[this.pro_page] = arr;
				let goods = [];
				for(let i in this.selectData){
					this.selectData[i].forEach((row)=>{
						goods.push(row)
					})
				}
				if(this.lostgoods.length > 0){
					this.lostgoods.forEach((row)=>{
						goods.push(row)
					})
				}
				this.productCount = goods.length;
				this.$emit("change",goods);
				this.$emit("resets",'1');
			},
			//复选框
			handleCheck(val) {
		        this.selection = val;
		    },
		    //回显选中数据
		    showData(){
		    	if(this.selectids.length > 0 && !this.selectData[this.pro_page]){
					this.selectData[this.pro_page] = [];
					this.lostgoods = []
					this.selectids.forEach((row)=>{
						let product = this.productData.find((n) => n.id == row)
						if(product){
							this.selectData[this.pro_page].push(row);
						}else{
							this.lostgoods.push(row);
						}
					})
					this.selectData[this.pro_page].forEach((row)=>{
						let index = this.selectids.findIndex((n)=>n == row);
						if(index > -1){
							this.selectids.splice(index,1)
						}
					})
				}
		    	if(this.selectData[this.pro_page]){
		        	setTimeout(()=>{
		        		this.selectData[this.pro_page].forEach((row)=>{
		        			let index = this.productData.findIndex((n) => n.id == row)
		        			if(index > -1){
		        				this.$refs.productTable.toggleRowSelection(this.productData[index])
		        			}
		        		})
		        	})
		        }
		    },
			//选择商品
			selectProduct(){
				if(this.isEdit === true){
					return;
				}
				let param = {
					page:this.pro_page,
					pageSize:10
				}
				if(this.orderSkuId && this.orderSkuId.length > 0){
					param.orderSkuId = this.orderSkuId.join(',')
				}
				this.$api("promotion.selectProductSkus",param).then((result) => {
					this.dialogVisible = true
					this.productData = result.list
					this.pro_total = result.page.total
					this.showData()
				}, (error) => {
					this.$message({ message: '获取商品列表失败', type: 'warning'});
				});
			},
		},
		watch: {
            selectids: {
                handler(v) {
                	if(v.join(',') == this.resets.join(',') && this.resets.join(',') != 'reset'){
                		this.selectData = {}
                	}
                	let c = 0;
                	for(let i in this.selectData){
						c += this.selectData[i].length
					}
                	this.productCount = v.length + c
                },
            },
        },
		mounted() {
			this.buttontype = this.button || ''
			//this.$api("promotion.selectProductSkus",{currentPage:1,pageSize:10}).then((result) => {}, (error) => {});
		},
		props: ['selectids','button','resets','orderSkuId',"isEdit"],
		components:{

        },
	}
</script>
<style>
.pro_page{float: right;}
.pro_footer{overflow: hidden; padding-top: 10px}
.producttable{font-size:12px; width: 100%}
</style>