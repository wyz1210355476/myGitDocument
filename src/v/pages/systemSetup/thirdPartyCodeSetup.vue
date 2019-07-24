<template>
	<div class="contents">
		<page-title title="第三方代码设置"></page-title>
		<el-alert
	    	title=""
	    	type="success"
	    	:closable="false">
	    	<div><i class="el-icon-warning"></i> 请按实际情况填写下列信息，这有利于搜索引擎优化且可让客户更直观地了解企业信息！</div>
	  	</el-alert>
	  	<div class="order-form" v-loading="isLoading">
			<el-form ref="form1" :model="statistics" :rules="rules" label-width="100px" size="small">
  				<el-form-item label="百度统计：" prop="descrition">
    				<el-input type="textarea" :rows="8" v-model="statistics.baiduCode" style="max-width:300px"></el-input> 
    				<div style="display: inline-block;height:180px;" class="ce-noHover">
    					<el-tooltip class="item" effect="light" content="" placement="bottom-start">
    						<div slot="content">
    							function addLoadEvent(func) {<br/>
    							    &nbsp;&nbsp;&nbsp;&nbsp;var oldonload = window.onload;<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;if (typeof window.onload != 'function') {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;window.onload = func;<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;} else {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;window.onload = function() {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;oldonload();<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;func();<br/>
    								&nbsp;&nbsp;&nbsp;}<br/>
    								&nbsp;}<br/>
    							}
    						</div>
    						<el-button style="border:none;"><i class="el-icon-info col67C23A">&nbsp;示例代码</i></el-button>
    					</el-tooltip>
	    			</div>
  				</el-form-item>
  				<el-form-item label="谷歌统计：" prop="descrition">
    				<el-input type="textarea" :rows="8" v-model="statistics.googleCode" style="max-width:300px"></el-input>
    				<div style="display: inline-block;height:180px;" class="ce-noHover">
    					<el-tooltip class="item" effect="light" content="" placement="bottom-start">
    						<div slot="content">
    							function addLoadEvent(func) {<br/>
    							    &nbsp;&nbsp;&nbsp;&nbsp;var oldonload = window.onload;<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;if (typeof window.onload != 'function') {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;window.onload = func;<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;} else {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;window.onload = function() {<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;oldonload();<br/>
    								&nbsp;&nbsp;&nbsp;&nbsp;func();<br/>
    								&nbsp;&nbsp;&nbsp;}<br/>
    								&nbsp;}<br/>
    							}
    						</div>
    						<el-button style="border:none;"><i class="el-icon-info col67C23A">&nbsp;示例代码</i></el-button>
    					</el-tooltip>
	    			</div>
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

				statistics:{
					// id:'',
					baiduCode:'',
					googleCode:''
				},
				rules:{}
			}
		},
		mounted() {
			this.getCode();
		},
		methods: {
			getCode(){
				this.isLoading = true;
				this.$api("systemSetup.getThirdPartyCode", {}).then((result) => {
					this.isLoading = false;
					this.statistics = result;
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
				this.$api("systemSetup.saveThirdPartyCode", this.statistics).then((result) => {
					this.$message({
						message: '保存成功',
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
.col67C23A{
	color: #67C23A;
}
.ce-noHover .el-button:focus, .ce-noHover .el-button:hover {
     background-color: #fff; 

}
</style>