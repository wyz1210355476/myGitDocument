<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="设置客户折扣" :visible.sync="dialogVisible" width="640px" :append-to-body="true">
			<div style="height:260px; overflow-y:auto">
				<span class="formPrompt">客户折扣价格（根据客户分组折扣率*销售价格计算实际销售价格）：</span>
				<el-table :data="memberData" size="mini" height="234" v-loading='loading'>
      				<el-table-column label="客户分组">
      					<template slot-scope="scope">
							{{scope.row.name}}
      					</template>
      				</el-table-column>
      				<el-table-column label="折扣率（%）">
      					<template slot-scope="scope">
      						<el-input v-model="scope.row.discount" class="smallInput" size="mini" placeholder="请输入"></el-input>
      					</template>
      				</el-table-column>
      			</el-table>
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
				memberData:[]
			}
		},
		mounted(){
			
		},
		methods: {
			getMemberLevel(){
				this.loading = true
				this.$api("member.getLevelList").then((result) => {
					this.loading = false
					let result1 = result || []
					this.memberData = []
					result1.forEach( (el, index) => {
						let discount = 100
						if(this.discount && this.discount.length>0){
							let tmp = this.discount.find((n)=>n.memberLevelId==el.id)
							if(tmp){
								discount = tmp.discount
							}
						}
						this.memberData.push({
							id:el.id,
							name:el.name,
							discount:discount
						})
					});
					this.getGoodsDiscount()
				}, (error) => {
					this.loading = false
					if(error.data.status!='102'){
						this.$message({type: 'error',message: '获取客户分组列表出错'})
					}
				});
			},
			getGoodsDiscount(){
				this.$api("goods.getGoodsDiscount",{goods_id:this.goodsid}).then((result) => {
					result.forEach((e)=>{
						var tmp = this.memberData.find((n)=>n.id == e.level_id);
						if(tmp){
							tmp.discount = e.discount
						}
					})
				}, (error) => {
					this.loading = false
					if(error.data.status!='102'){
						this.$message({type: 'error',message: '获取客户折扣出错'})
					}
				});
			},
			showDialog(){
				this.dialogVisible = true
				this.getMemberLevel()
			},
			confirm(){
				let params = []
				this.memberData.forEach((e)=>{
					params.push({
						goods_id: this.goodsid,
						level_id: e.id,
						discount: e.discount
					})
				})
				this.$api("goods.setGoodsDiscount",{data:params}).then((result) => {
					this.dialogVisible = false
					this.$message({ message: '设置客户折扣成功', type: 'success' });
					this.$emit("change",true);
				}, (error) => {
					this.$message({type: 'error',message: '设置客户折扣出错'})
				});
			},
		},
		components: {

		},
		props: ['discount','goodsid'],
	}
</script>
<style>

</style>
