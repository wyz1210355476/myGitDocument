<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="设置库存" :visible.sync="dialogVisible" width="700px" :append-to-body="true">
			<div style="height:265px; overflow-y:auto" v-loading='loading'>
				<div v-if="specData.length==0">
					<span class="mastStar">*</span>商品库存：<el-input v-model="goodsDetail.stock" size="small" class="smallInput" placeholder="请输入库存"></el-input>
				</div>
				<div v-if="specData.length!=0">
					<div style="line-height:30px"><span class="mastStar">*</span>货品库存：</div>
					<el-table :data="skuList" size="mini" max-height="202" ref="skuTable" class="table-one-line" @selection-change="handleSkuList">
						<el-table-column type="selection" width="35"></el-table-column>
						<el-table-column label="货品编号" width="100" prop="code"></el-table-column>
						<!-- <el-table-column label="货品名称" >
							<template slot-scope="scope">
								<span class="one-line">{{scope.row.name}}</span>
							</template>
						</el-table-column> -->
						<el-table-column v-for="item in specData" :key="item.id" :label="item.name">
							<template slot-scope="scope">
								<span class="one-line">{{getSkuSpecValueName(item.id,scope.row.goodsSkuSpecList)}}</span>
							</template>
						</el-table-column>
						<el-table-column label="库存" width="100">
							<template slot-scope="scope">
								<el-input placeholder="请输入" size="mini" class="miniInput" v-model="scope.row.stock"></el-input>
							</template>
						</el-table-column>
					</el-table>
					<div class="pl10">
						<el-checkbox 
						@change="seleceAllsku" 
						:indeterminate="skuSelection.length!=0&&skuSelection.length!=skuList.length" 
						v-model="skuselectStatus" 
						class="mr10 font12" >全选</el-checkbox>
						<span class="op_project">
							<el-button type="text" size="small" :disabled="skuSelection.length==0" @click="plSetSkuStock()" >批量设置货品库存</el-button>
						</span>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click=" dialogVisible = false ">取 消</el-button>
				<el-button size="small" type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</span>
</template>
<script>

	export default {
		data() {
			return {
				loading:false,
				dialogVisible:false,
				memberData:[],
				//商品详情
				goodsDetail:{},
				//货品
				specData:[],
				skuList:[],
				noSpecSku:{},
				skuSelection:[],
				skuselectStatus:false,
			}
		},
		mounted(){
		},
		methods: {
			//批量设置货品库存
			plSetSkuStock(){
				this.$prompt(' ', '批量设置货品库存', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
				  inputPattern: /^\d+$/,
		          inputErrorMessage: '货品库存格式不正确',
		          customClass:'promptClass'
		        }).then(({ value }) => {
		          this.skuSelection.forEach( (element, index) => {
		          	element.stock = parseFloat(value)
		          });
		        }).catch(() => {});
			},
			//全选货品
			seleceAllsku(val){
				if(val && this.skuList.length > 0){
					this.skuList.forEach(row => {
			            this.$refs.skuTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.skuTable.clearSelection();
				}
			},
			//选择货品复选框
			handleSkuList(val){
				 this.skuSelection = val;
				 if(val.length == this.skuList.length){
		        	this.skuselectStatus = true
		        }else{
		        	this.skuselectStatus = false
		        }
			},
			//根据规格id，规格值id，获取规格值名称
			getSkuSpecValueName(specId,goodsSkuSpecList){
				let specValue = goodsSkuSpecList.find((n)=>n.specId == specId)
				return this.getSpecValueName(specId,specValue.specValueId)
			},
			//根据规格id，规格值id，获取规格名称
			getSpecValueName(specId,specValueId){
				let valueList = this.specData.find((n)=> n.id == specId).specValueList
				let valueItem = valueList.find((n)=> n.id == specValueId)
				return valueItem.name
			},
			//查询商品详情
			getGoodsSkus(){
				this.$api("goods.getGoodsById",{id:this.goodsid}).then((result) => {
					this.loading = false
					this.goodsDetail = result
					//规格项
					this.specData = result.attributeTemplate.specList || []
					//货品列表
					this.skuList = result.goodsSkuList || []
					this.noSpecSku = result.noSpecSku || {}
					if(this.specData.length==0){
						this.skuList = []
					}
					let par=[]
					this.skuList.forEach((e)=>{
						par.push({goods_id:e.id})
					})
					if(this.specData.length==0){
						par.push({goods_id:this.noSpecSku.id})
					}
					this.getSkuStock(par)
				}, (error) => {
					this.$message({ message: '查询商品详情出错', type: 'error' });
				});
			},
			//查询货品库存
			getSkuStock(par){
				this.$api("goods.getSkuStock",{map:JSON.stringify(par)}).then((result) => {
					if(this.specData.length==0){
						this.goodsDetail.stock = result[0].store
					}else{
						this.skuList.forEach((e)=>{
							let tmp = result.find((n)=>n.goods_id==e.id)
							e.stock = tmp ? tmp.store : 0
						})
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询货品库存出错', type: 'error' });
					}
				});
			},
			//显示弹窗
			showDialog(){
				this.dialogVisible = true
				this.loading = true
				this.getGoodsSkus()
			},
			confirm(){
				let stockData = []
				if(this.specData.length == 0){
					stockData.push({
						store:this.goodsDetail.stock == "" ? 0 : this.goodsDetail.stock,
						goods_id:this.goodsDetail.noSpecSku.id,
						type:4,
						product_id:this.goodsDetail.id,
						operator_id:2
					})
				}else{
					this.skuList.forEach((e)=>{
						stockData.push({
							store:e.stock == "" ? 0 : e.stock,
							goods_id:e.id,
							type:4,
							product_id:this.goodsDetail.id,
							operator_id:2
						})
					})
				}
				let params = {
					product_id:this.goodsDetail.id,
					map:stockData
				}
				this.$api("goods.setGoodsStock",params).then((result) => {
					this.dialogVisible = false
					this.$message({ message: '设置商品库存成功', type: 'success' });
					this.$emit("change",true);
				}, (error) => {
					this.$message({ message: '设置商品库存出错', type: 'error' });
				});
			},
		},
		components: {

		},
		props: ['goodsid'],
	}
</script>
<style>
.font12 .el-checkbox__label{font-size: 12px}
.promptClass{width:300px;}
.promptClass .el-input__inner {
	font-size: 12px;
    height: 32px;
	line-height: 32px;
}
.mastStar{
	color:#f56c6c;
	margin-right: 4px;
}
</style>
