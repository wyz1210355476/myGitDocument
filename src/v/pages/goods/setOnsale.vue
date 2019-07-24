<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="商品上下架" :visible.sync="dialogVisible" width="700px" :append-to-body="true">
			<div style="height:300px; overflow-y:auto" v-loading="loading">
				<div>
					<span class="mastStar">*</span>商品上架：
					<el-radio-group v-model="goodsDetail.status" @change="checkStatus">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</div>
				<div v-if="specData.length!=0">
					<div style="line-height:30px"><span class="mastStar">*</span>货品上架：</div>
					<el-table :data="skuList" size="mini" max-height="202" ref="skuTable"  class="table-one-line" >
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
						<el-table-column label="上架" width="82" >
							<template slot-scope="scope">
								<el-checkbox v-model="scope.row.status" @change="checkStatus2"></el-checkbox>
							</template>
						</el-table-column>
					</el-table>
					<div class="pl10">
						<el-checkbox 
						@change="seleceAllsku" 
						v-model="skuselectStatus" 
						:indeterminate="getSelectLength()!=0&&getSelectLength()!=skuList.length" 
						class="font12 floatR" >批量上架</el-checkbox>
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
				skuSelection:[],
				skuselectStatus:false,
				loading:false,
				dialogVisible:false,
				memberData:[],
				radio2:'1',

				//商品详情
				goodsDetail:{},
				//货品
				specData:[],
				skuList:[],
				noSpecSku:{}
			}
		},
		mounted(){
		},
		methods: {
			seleceAllsku(val){
				console.log(this.skuselectStatus,val,this.skuSelection)
				if(val){
					this.skuList.forEach((e)=>{
						e.status = true
					})
					this.goodsDetail.status = '1'
				}else{
					this.skuList.forEach((e)=>{
						e.status = false
					})
					this.goodsDetail.status = '0'
				}
				// if(val && this.skuList.length > 0){
				// 	this.skuList.forEach(row => {
			    //         this.$refs.skuTable.toggleRowSelection(row,true);
			    //     });
				// }else{
				// 	this.$refs.skuTable.clearSelection();
				// }
			},
			checkStatus(){
				if(this.goodsDetail.status=='0'){
					this.skuList.forEach((e)=>{
						e.status = false
					})
					this.skuselectStatus = false
				}
			},
			getSelectLength(){
				let c = 0
				this.skuList.forEach((e)=>{
					if(e.status){
						c+=1
					}
				})
				return c
			},
			checkStatus2(val){
				let tmp = this.skuList.find((n)=>n.status!=false)
				if(tmp){
					this.goodsDetail.status = '1'
				}else{
					this.goodsDetail.status = '0'
				}
				if(this.getSelectLength() == this.skuList.length){
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
					if(this.specData.length == 0){
						this.skuList = []
					}
					this.skuList.forEach((e)=>{
						e.status = e.status == '1' ? true : false
					})
					if(this.getSelectLength() == this.skuList.length){
						this.skuselectStatus = true
					}else{
						this.skuselectStatus = false
					}
				}, (error) => {
					this.loading = false
					this.$message({ message: '查询商品详情出错', type: 'error' });
				});
			},
			showDialog(){
				this.dialogVisible = true
				this.loading = true
				this.getGoodsSkus()
			},
			confirm(){
				let params = {
					goodsId:this.goodsid,
					status:this.goodsDetail.status,
					skuInfoList:[]
				}
				let flag = 0
				this.skuList.forEach((e)=>{
					if(!e.status){flag+=1}
					params.skuInfoList.push({
						skuId:e.id,
						status:e.status?1:0
					})
				})
			 
				if(flag!=0 && flag == this.skuList.length){
					if(this.goodsDetail.status == 1){
						this.$message({ message: '请至少选择一个货品上架', type: 'warning' });return
					}else{
						params.status = 0
					}
				}
			
				if(flag==0){
					params.skuInfoList.push({
						skuId:this.noSpecSku.id,
						status:this.goodsDetail.status
					})
				}


				console.log(params);
				this.$api("goods.setGoodsStatus",{statusStr:params}).then((result) => {
					this.dialogVisible = false
					this.$message({ message: '设置商品及货品上下架成功', type: 'success' });
					this.$emit("change",true);
				}, (error) => {
					this.$message({ message: '设置商品及货品上下架出错', type: 'error' });
				});
			},
		},
		components: {

		},
		props: ['goodsid'],
	}
</script>
<style>

</style>
