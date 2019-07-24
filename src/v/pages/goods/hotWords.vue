<template>
	<div class="contents">
		<page-title :title="'搜索热词'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="dialogVisible = true">新增</el-button>
		</div>
		<el-table :data="data" size="mini" v-loading="loading" class="table-one-line">
	      	<el-table-column prop="markName" label="名称" >
	      		<template slot-scope="scope">
					<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="排序" >
				<template slot-scope="scope">
					<el-button type="text" icon="el-icon-sort-up" @click="upData(scope.$index)" size="mini"></el-button>
					<el-button type="text" icon="el-icon-sort-down" @click="downData(scope.$index)" size="mini"></el-button>
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" >
				<template slot-scope="scope">
					<span>
						<el-button size="small" type="text" class="mr10" @click="edite(scope.row)">编辑</el-button>
						<el-popover placement="top" width="200" trigger="click" v-model="scope.row.popover">
							<p>是否删除"{{ scope.row.name }}"这个热门词</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="scope.row.popover = false; deleteWords(scope.row.id)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>
					</span>
				</template>
	      	</el-table-column>
	    </el-table>




	    <el-dialog :title="(addData.id==undefined?'新增':'修改')+'热门词'" :visible.sync="dialogVisible" width="400px" @close="handelClose">
		  	<el-form :model="addData" :rules="addRules" ref="addData" label-width="95px" class="mt20" >
				<el-form-item label="热门词：" prop="name">
				    <el-input v-model.time="addData.name" size="small" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button size="small" @click="handelClose">取 消</el-button>
		    	<el-button size="small" type="primary" :loading="addLoading" @click="addHotWords">保存</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import colorPicker from '@components/colorPicker'

	export default {
		data() {
			return {
				dialogVisible:false,
				loading:true,
				addLoading:false,
				data:[],
				addData:{
					name:'',
				},
				addRules:{
			        name: [
			            { required: true, message: '请输入热门词', trigger: 'blur' },
			            { max: 50, message: '热门词最长限制50个字', trigger: 'blur' }
			        ],
			    }
			}
		},
		mounted() {
			this.getHotWords()
		},
		methods: {
			edite(row){
				this.addData = {
					id:row.id,
					name:row.name,
					sequence:row.sequence
				}
				this.dialogVisible=true
			},
			exchange(index1,index2){
				this.$api("goods.exchangeKeyword",{sourceId:this.data[index1].id,targetId:this.data[index2].id}).then((result) => {
					this.data[index1] = this.data.splice(index2, 1, this.data[index1])[0]
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
				if(index == this.data.length - 1) { return }
				this.exchange(index,index+1)
			},
			handelClose(){
				setTimeout(()=>{
					this.$refs.addData.resetFields();
					this.dialogVisible=false
					this.addData.name=''
					delete this.addData.id
					delete this.addData.sequence
				},300)
			},
			deleteWords(id){
				this.$api("goods.deleteKeyword",{ids:id}).then((result) => {
					this.$message({ message: '删除成功', type: 'success' });
					this.getHotWords()
				}, (error) => {
					this.$message({ message: '删除热门词出错', type: 'error' });
				});
			},
			addHotWords(){
				this.$refs.addData.validate((valid) => {
		        	if (valid) {
		        		let api = "goods.addKeyword"
		        		let prompt = "新增热门词"
		        		if(this.addData.id!=undefined && this.addData.id!='' && this.addData.id!=null){
		        			api = "goods.editeKeyword"
		        			prompt = "修改热门词"
		        		}
		        		this.addLoading=true
			            this.$api(api,this.addData).then((result) => {
			            	this.addLoading=false
							this.handelClose()
							this.$message({ message: prompt+'成功', type: 'success' });
							this.getHotWords()
						}, (error) => {
							this.addLoading=false
							this.$message({ message: prompt+'失败', type: 'error' });
						});
		        	}else{
		        		console.log('error validate');return
		        	}
				});
			},
			getHotWords(){
				this.$api("goods.findKeyword").then((result) => {
					this.loading = false
					this.data = result.list
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询热门词出错', type: 'error' });
					}
				});
			},
		},
		components: {
			pageTitle,
			colorPicker
		}
	}
</script>
<style>
.colorBlock{width: 16px; height: 16px; display: inline-block; border-radius: 4px}
</style>
