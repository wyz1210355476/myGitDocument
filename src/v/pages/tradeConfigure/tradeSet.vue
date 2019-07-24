<template>
	<div class="contents">
		<page-title :title="'订单规则设置'"></page-title>
		<div class="content-table ce-content-style">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" v-loading="isLoading">
				<el-form-item label="未支付订单自动作废时间：" prop="time">
					<el-radio-group v-model="ruleForm.enable">
						<el-radio label="0">从不</el-radio>
						<el-radio label="1">
							<span>待付款订单在</span>
							<el-input v-model="ruleForm.time" placeholder="" style="width:50px" size="small"></el-input>
							<el-select v-model="ruleForm.type" placeholder="请选择" style='width:75px' size="small">
								<el-option
								v-for="item in timeUnitOptions"
								:key="item.id"
								:label="item.type"
								:value="item.id">
								</el-option>
							</el-select>
							<span>后自动失效</span>
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="confirm('ruleForm')">保存</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import operation from '@components/operation';
	import router from '@c/router';
	export default {
		data() {
			var checkTimeNum = (rule,value,callback) => {
					if(this.ruleForm.enable === '1'){
						if(value === '' || !value){
							return callback(new Error('请输入时间值'));
						}else if((/^[1-9]+\d*$/).test(value)) {
							callback();
						}else{
							return callback(new Error('时间值必须为大于等于1的整数'));
						}
					}else{
						callback();
					}

				}
			return {
				isLoading:false,
				timeUnitOptions:[{
					id:"1",
					type: '分钟',
				},{
					id:"2",
					type: '小时',
				},{
					id:"3",
					type: '天',
				}],
				ruleForm:{
					enable:""
					// time:24,
					// type:"2"
				},
				rules:{
					time:[
						{validator:checkTimeNum}
						// { required: true, message: '请输入时间值'},
						// { type: 'number', message: '时间值必须为数字值'},
					]
				}
			}
		},
		mounted() {
			this.getOptions();
		},
		methods: {
			getOptions() {
				this.isLoading = true;
				// 获取配置信息
				this.$api("tradeConfig.tradeGet",{}).then((result) => {
					this.isLoading = false;
					this.ruleForm = result;
					if(result.enable == 0){
						this.ruleForm.time = '24';
						this.ruleForm.type = '2';
					}else{
						this.ruleForm.type = String(this.ruleForm.type);
					}
					this.ruleForm.enable = String(this.ruleForm.enable);

				},(result) => {
					this.isLoading = false;
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			confirm(formName){
				let submitData = this.ruleForm;
				// console.log(submitData)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$api("tradeConfig.tradeSet",submitData).then((result) => {
							this.$message({
								message: '设置成功！',
								type: 'success'
							});
						},(result) => {
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
		},
		components: {
			pageTitle,
			pages,
			operation
		}
	}
</script>
<style>
.ce-content-style{
/*	border: 1px solid #eaeefb;*/
	padding: 10px 0;
}
</style>