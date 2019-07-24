<template>
	<div>
		<el-dialog
		  	title="手工增减"
		  	:visible.sync="visible"
		  	width="500px">
		  	<div>
		  		<p class="adjust-desc">管理员手工增减返利（正数为增加、负数为扣减）：</p>
		  		<el-form ref="form1" :model="form1" :rules="rules" label-width="100px" size="small" class="order-form">
	    			<el-form-item label="调整额度：" prop="amount">
					    <el-input v-model="form1.amount"></el-input>
					</el-form-item>
					<el-form-item label="收支类型：" prop="bapatypeId">
						<el-select v-model="form1.bapatypeId">
						    <el-option v-for="type in typeList" :key="type.id" :value="type.id" :label="type.bapatype_name" v-if="type.start_using == 1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="业务说明：" prop="reference">
					    <el-input type="textarea" v-model="form1.reference" :maxlength="100"></el-input>
					</el-form-item>
				</el-form>
		  	</div>
		  	<div slot="footer">
			  	<el-button plain size="small" @click="cancel">取消</el-button>
		  		<el-button  type="primary" size="small" @click="submitForm('form1')" :loading="isBtnLoading">保存</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import * as validator from '@c/util/validator'
	export default {
		data() {
			//10位整数
			let Int10 = (rule, value, callback) => {
				if (/^-?[0-9]{1,10}$/.test(value) || value == '' || value == null) {
					callback();
				} else {
					callback(new Error(''));
				}
			};
			return {
				typeList: [],
				form1: {
					id: this.id,
					amount: '',
					bapatypeId: '',
					reference: ''
				},
				rules: {
					amount: [
						{ required: true, message: '请输入调整额度', trigger: 'blur'},
						{ validator: Int10, message: '请输入最多10位整数', trigger: 'blur'}
					]
				},
				isBtnLoading: false
			}
		},
		props: {
			id: [String, Number],
			required: true
		},
		mixins: [dialogVisibility],
		mounted() {
			this.getTypeList();
		},
		methods: {
			//获取类型列表
			getTypeList() {
				this.$api("rebate.getBaccountBapatypeList").then((result) => {
					this.typeList = result;
					for (let i in result) {
						if (result[i].start_using == 1) {
							this.form1.bapatypeId = result[i].id;
							break;
						}
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
                    	this.typeList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '获取类型列表出错'
                        });
                    }
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.save();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			save() {
				this.isBtnLoading = true;
				this.$api("rebate.grantBalance", this.form1).then((result) => {
					this.isBtnLoading = false;
					this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.visible = false;
                    this.$emit("update");
				}, (error) => {
					this.isBtnLoading = false;
					if (error && error.data && error.data.status == 301) {
						this.$message({
							type: 'error',
							message: error.data.msg
						});
					} else {
						this.$message({
							type: 'error',
							message: '保存失败'
						});
					}
				});
			},
			//关闭
			cancel() {
				this.visible = false;
			}
		},
		components: {

		}
	}
</script>
<style scoped>
	.adjust-desc {font-size: 14px; margin-top: 0; margin-left: 20px;}
</style>