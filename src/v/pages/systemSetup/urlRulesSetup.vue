<template>
	<div class="contents">
		<page-title title="网址规则设置"></page-title>
		<el-alert
	    	title=""
	    	type="warning"
	    	:closable="false">
	    	<div><i class="el-icon-warning"></i> 注:非高级使用用户请勿随意改变规则，改变URL规则会导致您的网站在搜索引擎的结果发生变化(可能导致结果被清零)，需等新的结果被收录时才能趋于正常。</div>
	  	</el-alert>
	  	<div class="order-form" v-loading="isLoading">
			<el-form ref="form1" label-width="100px" size="small">
				<el-form-item label="选择格式：" prop="mode">
    				<el-radio-group v-model="rule">
      					<el-radio :label="0" :key="0">参数型</el-radio>
    				</el-radio-group>
    				<span class="example">示例：www.300.cn/product/22.html（实现网址静态化）</span></br>
    				<el-radio-group v-model="rule">
      					<el-radio :label="1" :key="1">标题名称型</el-radio>
    				</el-radio-group>
    				<span class="example">示例：www.300.cn/product/天山奔马304型-22.html（实现网址静态化和语义化）</span></br>
    				<el-radio-group v-model="rule">
      					<el-radio :label="2" :key="2">标题拼音型</el-radio>
    				</el-radio-group>
    				<span class="example">示例：www.300.cn/product/tian-shan-ben-ma-304-xing-22.html（实现网址静态化和语义化，避免出现乱码）</span></br>
    				<el-radio-group v-model="rule">
      					<el-radio :label="3" :key="3">标题日期型</el-radio>
    				</el-radio-group>
    				<span class="example">示例：www.300.cn/20150610-22.html（实现网址静态化和语义化，避免出现乱码）</span>
  				</el-form-item>
  				<el-form-item>
  					<el-button type="primary" :loading="btnLoading" @click="submitForm()" size="small">保存</el-button>
  				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as validator from '@c/util/validator';
	export default {
		data() {
			return {
				isLoading:false,
				btnLoading:false,
				rule:''
			}
		},
		mounted() {
			this.getUrlRules();
		},
		methods: {
			getUrlRules(){
				this.isLoading = true;
				this.$api("systemSetup.getUrlRules", {}).then((result) => {
					this.isLoading = false;
					this.rule = result.rule;
				}, (result)=>{
					this.isLoading = false;
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			submitForm(){
				this.btnLoading = true;
				this.$api("systemSetup.saveUrlRules", {rule:this.rule}).then((result) => {
					this.$message({
						message: '设置成功',
						type: 'success'
					});
					this.btnLoading = false;
				}, (result)=>{
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
					this.btnLoading = false;
				})
			}
		},
		components: {
			pageTitle
		}
	}
</script>
<style>
.order-form {margin-top: 20px;}
.example{
	font-size: 12px;
	color: #999;
	padding-left: 10px;
}
</style>