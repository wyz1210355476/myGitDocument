<template>
	<div class="contents">
		<page-title :title="'商品橱窗'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addWindow">新增</el-button>
		</div>
		<el-table :data="data" size="mini" v-loading="loading" class="tabel-one-line">
	      	<el-table-column label="名称" >
	      		<template slot-scope="scope">
	      			<span v-if="scope.row.id==''"><el-input size="small" class="formInput" v-model.trim="scope.row.name" placeholder="请输入"></el-input></span>
					<span v-else class="one-line">{{scope.row.name}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" >
				<template slot-scope="scope">
					<span v-if="scope.row.id==''">
						<el-button size="mini" @click="data.splice(scope.$index,1)">取消</el-button>
						<el-button type="primary" size="mini" @click="confrimAdd(scope.$index)">保存</el-button>
					</span>
					<span v-else>
						<el-button type="text" size="mini" @click="toGoods(scope.row.id)">查看商品</el-button>
						<el-popover class="ml10" placement="top" width="200" trigger="click" v-model="scope.row.popover" >
							<p>是否删除"{{ scope.row.name }}"这个橱窗？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="scope.row.popover = false;delWindow(scope.row.id,scope.$index)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="mini">删除</el-button>
						</el-popover>
					</span>
				</template>
	      	</el-table-column>
	    </el-table>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'

	export default {
		data() {
			return {
				loading:true,
				data:[],
			}
		},
		mounted() {
			this.getGoodsWindow()
		},
		methods: {
			toGoods(id){
				console.log(id)
				this.$router.push({
					name:'windowGoods',
					query:{id:id}
				})
			},
			confrimAdd(index){
				if(this.data[index].name==''){
					this.$message({ message: '请输入橱窗名称', type: 'error' });return
				}
				this.$api("goods.addWindow",{name:this.data[index].name}).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.data[index].id=result.id
				}, (error) => {
					if(error.data.status == '202'){
						this.$message({ message: '橱窗名称已存在', type: 'error' });
					}else{
						this.$message({ message: '新增商品橱窗出错', type: 'error' });
					}
				});
			},
			addWindow(){
				if(this.data.find((n)=>n.id=='')){
					return
				}
				this.data.push({
					id:'',
					name:''
				})
			},
			delWindow(id,index){
				let params = {ids:id}
				this.$api("goods.deleteWindow",params).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.data.splice(index,1)
				}, (error) => {
					this.$message({ message: '请先移除商品橱窗内的商品', type: 'error' });
				});
			},
			getGoodsWindow(){
				this.$api("goods.findWindow").then((result) => {
					this.loading = false
					this.data = result.list
					console.log(result)
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品橱窗出错', type: 'error' });
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
.colorBlock{width: 16px; height: 16px; display: inline-block; border-radius: 4px}
</style>
