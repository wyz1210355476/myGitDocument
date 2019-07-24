<template>
	<div class="contents">
		<page-title title="基本设置"></page-title>
		<el-alert
	    	title=""
	    	type="success"
	    	:closable="false">
	    	<div><i class="el-icon-warning"></i> 请按实际情况填写下列信息，这有利于搜索引擎优化且可让客户更直观地了解企业信息！</div>
	  	</el-alert>
		<div class="order-form">
			<el-form ref="form1" :model="setupInfo" :rules="rules" label-width="150px" size="small" v-loading="isLoading">
				<el-form-item label="网站名称：" prop="title">
				    <el-input v-model="setupInfo.title"></el-input>
				</el-form-item>
				<el-form-item label="主营行业：" prop="industry">
					<el-select v-model="setupInfo.industry" style="width: 300px;" popper-class="item-dropdown-option">
					    <el-option
					      	v-for="industry in industryList"
					      	:key="industry.id"
					      	:label="industry.name"
					      	:value="industry.id+','+industry.name"
					      	:title="industry.name"
					      	>
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="主营产品：" prop="product" class="item-input-tag">
					<el-select
   						v-model="setupInfo.product"
    					multiple
    					filterable
    					allow-create
    					default-first-option
    					style="width: 300px;"
    					popper-class="item-input-tag-dropdown">
  					</el-select>
				</el-form-item>
				<el-form-item label="经营模式：" prop="businessMode">
    				<el-radio-group v-model="setupInfo.businessMode">
      					<el-radio v-for="mode in modeList" :label="mode.id" :key="mode.id">{{mode.name}}</el-radio>
    				</el-radio-group>
  				</el-form-item>
  				<el-form-item label="主营业务介绍：" prop="businessIntro">
    				<el-input type="textarea" v-model="setupInfo.businessIntro"></el-input>
  				</el-form-item>
			</el-form>
			<div class="btn-area left">
				<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">保存</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as validator from '@c/util/validator';
	export default {
		data() {
			return {
				industryList: [],
				modeList: [
					{id: '1', name: '生产厂家'},
					{id: '2', name: '经销批发'},
					{id: '3', name: '商业服务'},
					{id: '4', name: '招聘代理'},
					{id: '5', name: '其他'}
				],
				setupInfo: {
					title: '',
					industry: '',
					product: '',
					businessMode: '',
					businessIntro: ''
				},
				rules: {
					title: [
						{ required: true, message: '请输入网站名称', trigger: 'blur' },
					],
					industry: [
						{ required: true, message: '请选择主营行业', trigger: 'blur' }
					],
					product: [
						{ required: true, message: '请输入主营产品', trigger: 'change' }
					],
					businessMode: [
						{ required: true, message: '请选择经营模式', trigger: 'change' }
					],
					businessIntro: [
						{ max: 200, message: '最多可输入200个字符', trigger: 'blur' }
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getBasicSet();
		},
		methods: {
			//获取基本设置信息
			getBasicSet() {
				this.isLoading = true;
				this.$api("systemSetup.getBasicSet").then((result) => {
					this.industryList = result.mainindustryList;
					this.setupInfo.id = result.id ? result.id : '';
					this.setupInfo.title = result.title ? result.title : '';
					this.setupInfo.businessIntro = result.businessIntro ? result.businessIntro : '';
					this.setupInfo.businessMode = result.businessMode ? ('' + result.businessMode) : '';
					this.setupInfo.industry = result.mainIndustry ? (result.mainIndustry + ',' + result.mainIndustryName) : '';
					this.setupInfo.product = result.mianProduct ? result.mianProduct.split(",") : [];
					this.isLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取基本设置信息失败！'
			          	});
					}
					this.isLoading = false;
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveSetup();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	      	//保存
	      	saveSetup() {
	      		let data = {};
	      		if (this.setupInfo.id != '') {
	      			data.id = this.setupInfo.id;
	      		}
	      		data.title = this.setupInfo.title;
	      		data.businessIntro = this.setupInfo.businessIntro;
	      		data.businessMode = this.setupInfo.businessMode;
	      		let industry = this.setupInfo.industry.split(",");
	      		data.mainIndustry = industry[0];
	      		data.mainIndustryName = industry[1];
	      		let mianProduct = '';
	      		this.setupInfo.product.forEach((v, i) => {
	      			mianProduct += v;
	      			if (i != this.setupInfo.product.length-1) {
	      				mianProduct += ',';
	      			}
	      		});
	      		data.mianProduct = mianProduct;
	      		this.isBtnLoading = true;
	      		this.$api("systemSetup.saveBasicSet", data).then((result) => {
	      			this.$message({
		            	type: 'success',
		            	message: '保存基本设置信息成功！'
		        	});
		        	this.isBtnLoading = false;
	      		}, (error) => {
	      			this.$message({
		            	type: 'error',
		            	message: '保存基本设置信息失败！'
		          	});
		          	this.isBtnLoading = false;
	      		})
	      	}
		},
		components: {
			pageTitle
		}
	}
</script>
<style scoped>
	.order-form {margin-top: 20px;}
</style>