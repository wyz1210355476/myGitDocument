<template>
	<span>
		<el-button type="text" size="mini" @click="editAttrValue()">编辑客户价格</el-button>

		<el-dialog title="编辑客户价格" :visible.sync="attrVisible" width="800px" :before-close="close">
			<el-table :data="options" size="mini" style="width: 100%">
		    	<el-table-column label="客户分组" prop="name"></el-table-column>
		    	<el-table-column label="价格">
					<template slot-scope="scope">
						<el-input class="smallInput" v-model="priceList[scope.row.id]"></el-input>
					</template>
		    	</el-table-column>
		    	<el-table-column label="折扣" prop="discount"></el-table-column>
		    	<el-table-column label="客户分组价">
					<template slot-scope="scope">
						{{Boolean(price) ? Number(price)*Number(scope.row.discount)/100 : '无'}}
					</template>
		    	</el-table-column>
		    </el-table>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="confirmAttrValue">确 定</el-button>
		  	</span>
		</el-dialog>
	</span>
</template>
<script>

	export default {
		data() {
			return {
				attrVisible:false,
				options:[],
				priceList:{}
			}
		},
		mounted() {
			this.getMemberList()
		},
		watch: {
            priceData: {
                handler(v) {
                	if(v.length > 0){
						for(let i in v){
							this.priceList[v[i].memberLevelId] = v[i].price
						}
					}
                },
            },
        },
		methods: {
			getMemberList(){
				this.$api("member.getLevelList").then((result) => {
					this.options = result;
					for(let i in this.options){
						this.priceList[this.options[i].id]=''
					}
					if(this.priceData.length > 0){
						for(let i in this.priceData){
							this.priceList[this.priceData[i].memberLevelId] = this.priceData[i].price
						}
					}
				}, (error) => {
					if(error.status!='102'){
						this.$message({type: 'error',message: '加载数据出错'})
					}
				});
			},
			editAttrValue(){
				this.attrVisible = true
			},
			close(){
				this.attrVisible = false
				for(let i in this.priceList){
					this.priceList[i] = ''
				}
			},
			confirmAttrValue(){
				this.attrVisible = false
				let obj = {data:[]}
				for(let i in this.priceList){
					obj.data.push({
						"memberLevelId":i,
						"price":this.priceList[i]
					})
					this.priceList[i] = ''
				}
				if(this.index){
					obj.index=this.index
				}
				this.$emit("change",obj)
			},
		},
		components: {

		},
		props: ['index','price','priceData'],
	}
</script>
<style>

</style>
