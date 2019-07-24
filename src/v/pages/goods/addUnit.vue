<template>
	<span>
		<span @click=" dialogVisible = true "><slot></slot></span>

		<el-dialog title="新增计量单位" :visible.sync="dialogVisible" width="400px" :before-close="handelClose">
		  	<el-form :model="addData" :rules="addRules" ref="addData" label-width="95px" class="mt20" >
				<el-form-item label="单位名称：" prop="name">
				    <el-input v-model.trim="addData.name" size="small" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button size="small" @click="handelClose">取 消</el-button>
		    	<el-button size="small" type="primary" @click="addUnit">确 定</el-button>
		  	</span>
		</el-dialog>

	</span>
</template>
<script>
	export default {
		data() {
			let checkUnit = (rule, value, callback) => {
				let reg = /^([A-Za-z\u4e00-\u9fa5]){1,10}$/
		        if (!reg.test(value)) {
		          callback(new Error('支持中文、英文、长度10以内'));
		        } else {
		          callback();
		        }
		    };
			return {
				dialogVisible:false,
				addData:{
					name:'',
					defaulted:0,
					status:1
				},
				addRules:{
			        name: [
			            { required: true, message: '请输入计量单位', trigger: 'blur' },
			            { validator: checkUnit , trigger: 'blur' }
			        ],
			    }
			}
		},
		mounted() {
		},
		methods: {
			handelClose(){
				this.dialogVisible=false
				this.addData.name=''
				this.$refs.addData.resetFields();
			},
			addUnit(){
				this.$refs.addData.validate((valid) => {
		        	if (valid) {
			            this.$api("goods.addUnit",this.addData).then((result) => {
							this.handelClose()
							this.$message({ message: '添加成功', type: 'success' });
							this.$emit('change',result)
						}, (error) => {
							if(error.data.status=='202'){
								this.$message({ message: '计量单位重复', type: 'error' });
							}else{
								this.$message({ message: '新增计量单位失败', type: 'error' });
							}
						});
		        	}else{
		        		console.log('error validate');return
		        	}
				});
			},
		},
		components: {
		}
	}
</script>
<style>
.unitContent{padding: 20px 0}
</style>
