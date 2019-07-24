<template>
	<div class="contents">
		<page-title :title="'新增页面'" goback></page-title>
		<div class="pageForm">
			<el-form ref="params" size="small" :model="params" label-width="70px">
			  	<el-form-item label="名称：">
			    	<el-input class="formInput" v-model.trim="params.name"></el-input>
			  	</el-form-item>
			  	<!-- <el-form-item label="设为首页">
	      			<el-checkbox v-model="params.isHomePage"></el-checkbox>
				</el-form-item> -->
			</el-form>
		</div>
		<page-title :title="'选择页面模板'"></page-title>
		<div class="contentList">
			<span class="item" :class="{'cover':params.styleId==''}" @click="checkModel()">
				<div class="label">选中</div>
				<div class="img"></div>
				<span class="name">自定义模板</span>
			</span>
			<span class="item" :class="{'cover':params.styleId==item.styleId}" v-for="item in data" @click="checkModel(item.styleId)">
				<div class="label">选中</div>
				<div class="img"><img :src="stylePath+item.thumb"></div>
				<span class="name">{{item.name}}</span>
			</span>
		</div>
		<div >
			<el-button type="primary" size="small" @click="creatPage" :loading="btnLoading">下一步</el-button>
			<el-button size="small" @click="cancel">取消</el-button>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'

	export default {
		data() {
			return {
				loading:false,
				btnLoading:false,
				data:[],
				stylePath:__ce.designImgURL,
				params:{
					name:'',
					fileName:'ceshop' + +new Date,
					styleId:'',
				}
			}
		},
		mounted() {
			this.getContentList()
		},
		methods: {
			checkModel(id){
				if(id!=undefined){
					this.params.styleId=id
				}else{
					this.params.styleId=''
				}
			},
			creatPage(){
				if(this.params.name == ''){
					this.$message({ message: '请输入页面名称', type: 'error' });return
				}
				this.btnLoading = true
				this.$api("systemSetup.createPage",this.params).then((result) => {
					this.$message({ message: '新建页面成功', type: 'success' });
					console.log(result)
					this.$router.push({
						name:'designPage',
						query:{
							id:result.id,
							fileName:result.fileName
						}
					})
				}, (error) => {
					this.btnLoading = false
					this.$message({ message: '新建页面失败', type: 'error' });
				});
			},
			cancel(){
				this.$router.go(-1)
			},
			getContentList(){
				let params = {
					type:''
				}
				this.$api("systemSetup.getContentList",params).then((result) => {
					this.data = result || []
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询页面模板出错', type: 'error' });
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
.pageForm{
	background-color: #efefef;
	padding: 10px 0;
	margin-bottom: 20px
}
.pageForm .el-form-item--small.el-form-item{margin-bottom: 0}
.pageTitle{font-weight: normal; font-size: 16px; border-bottom: 1px solid #efefef; padding:10px 0; margin:10px 0;}
.contentList{overflow: hidden; overflow-y:auto;}
.contentList .item{display: block; width: 170px; height: 230px; margin-right: 10px; margin-bottom: 10px; float: left; box-sizing:border-box; border:1px solid #efefef; overflow: hidden;}
.contentList .item .label{
	transform:rotate(45deg);
	position: absolute;
	right: -30px;
	top: 5px;
	background: #fb6b6b;
	color:#fff;
	line-height: 30px;
	width:100px;
	text-align: center;
}
.contentList .item.cover{position: relative;}
.contentList .item.cover .label{display: block;}
.contentList .item .img{height: 198px; overflow: hidden; background: url(../../common/images/modelImg.jpg) no-repeat center #f5f5f5; background-size: 100%}
.contentList .item .img img{width: 100%; height: 100%}
.contentList .item .name{height: 30px; line-height:30px; padding: 0 10px; background: #efefef; display: block; overflow: hidden;white-space: nowrap;  text-overflow: ellipsis;  }
</style>
