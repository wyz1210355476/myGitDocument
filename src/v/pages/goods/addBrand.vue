<template>
	<div class="contents">
		<page-title :title="(id!=''?'编辑':'新增')+'品牌'" goback></page-title>

		<el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="140px" size="small">
			<el-form-item label="品牌名称：" prop="name">
				<el-input placeholder="请输入品牌名称" class="formInput" v-model="basicForm.name"></el-input>
				<span class="formPrompt">最多50个字符</span>
		    </el-form-item>
			
		     <el-form-item label="图片：">
				<add-img @confirm="getSrc" ><el-button size="small">添加图片</el-button></add-img>
				<div class="imgCon" v-if="Boolean(basicForm.imageId)">
					<span class="imgItem">
							<img :src="basicForm.imageUrl" >
							<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="basicForm.imageUrl = '';basicForm.imageId ='' "></el-button>
						</span>
				</div>
		    </el-form-item>
		    <el-form-item label="排序码：" prop="sequence">
				<el-input placeholder="请输入排序码" class="formInput" v-model="basicForm.sequence"></el-input>
			    <span class="formPrompt">只支持数字，1-8个字符</span>
		    </el-form-item>
		    <el-form-item label="说明：">
		    	<div>
					<custom-editor v-model="basicForm.des"></custom-editor>
				</div>
		    </el-form-item>
		</el-form>

		<div class="promotion_button">
			<el-button type="primary" size="small" @click="saveBrand">保存</el-button>
			<el-button size="small" @click="cancelAdd">取消</el-button>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import { quillEditor } from 'vue-quill-editor'
	import customEditor from '@components/customEditor'
	import addImg from '@components/addImg'
	import * as utilFun from '@c/util/index.js'

	export default {
		data() {
			let checkCode = (rule, value, callback) => {
				let reg = /^([0-9]){1,8}$/
		        if (value!='' && !reg.test(value)) {
		          callback(new Error('排序码格式不正确'));
		        } else {
		          callback();
		        }
		    };
		    // let checkName = (rule, value, callback) => {
			// 	let reg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,15}$/
		    //     if (!reg.test(value)) {
		    //       callback(new Error('品牌名称格式不正确'));
		    //     } else {
		    //       callback();
		    //     }
		    // };
			return {
				id:'',
				parentId:' ',
				categoryData:[],
				typeData:[],
				basicForm:{
					name:'',
					sequence:'',
					des:'',
					imageId:'',
					imageUrl:'',
				},
				basicRules:{
					name:[
			            { required: true, message: '请输入品牌名称', trigger: 'blur' },
			            { max: 50, message: '最长50个字符', trigger: 'blur' }
			        ],
					sequence:[
						{ validator: checkCode , trigger: 'blur' },
					]
				}
			}
		},
		mounted() {
			this.id=this.$route.query.id || ''
			// this.parentId=this.$route.query.parentId
			if(this.id){
				this.getBrandById(this.id)
			}
		},
		methods: {
			getSrc(val){
				this.basicForm.imageUrl = val.imgUrl
				this.basicForm.imageId = val.id
			},
			getBrandById(id){
				this.$api("goods.getBrandInfo",{id:id}).then((result) => {
					this.basicForm = result
					if(this.basicForm.parentId == null || this.basicForm.parentId == 'null' || this.basicForm.parentId == '0'){
						this.basicForm.parentId = ' '
					}
				}, (error) => {
					this.$message({ message: '查询商品品牌出错', type: 'error' });
				});
			},
			saveBrand(){
				this.$refs.basicForm.validate((valid) => {
		        if (valid) {
						let saveApi,
						data = {
							name:this.basicForm.name,
							des:this.basicForm.des,
							sequence:this.basicForm.sequence,
							imageId:this.basicForm.imageId ? this.basicForm.imageId  : "",
							imageUrl:this.basicForm.imageUrl
						};
						if(this.id != ""){
							saveApi = "goods.updateBrand";
							data.id = this.id;
						}else{
							saveApi = "goods.addBrand";
						}
						this.$api(saveApi,data).then((result) => {
							this.$message({ message: '保存商品品牌成功', type: 'success' });
							this.$router.push({name:'brandManage'})
						}, (error) => {
							this.$message({ message: '保存商品品牌出错', type: 'error' });
						});
		        	}else{
		        		console.log('error validate');return
		        	}
		        });
			},
			cancelAdd(){
				this.$router.push({name:'brandManage'})
			}
		},
		components: {
			pageTitle,
			quillEditor,
			customEditor,
			addImg
		}
	}
</script>
<style>
.imgCon{overflow: hidden; padding-top: 10px}
.imgItem{display: block; float: left; width:100px; height: 100px; overflow: hidden; margin-right: 10px; margin-bottom: 10px; border:1px solid #efefef; border-radius: 4px; position: relative;}
.imgItem .delImg{position: absolute; right: 0px; top: 0px; z-index: 8; padding: 5px; color:#ddd; font-size: 16px}
.imgCon img{width:100%;}
</style>
