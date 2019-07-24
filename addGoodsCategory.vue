<template>
	<div class="contents">
		<page-title :title="(id!=''?'编辑':'新增')+'商品分类'" goback></page-title>

		<el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="140px" size="small">
			<el-form-item label="分类名称：" prop="categoryName">
				<el-input placeholder="请输入分类名称" class="formInput" v-model="basicForm.categoryName"></el-input>
				<span class="formPrompt">最多15个字符</span>
		    </el-form-item>
			<el-form-item label="上级分类：" prop="parentId">
				<el-select placeholder="请选择上级分类" class="formInput" v-model="basicForm.parentId">
					<el-option label="顶级分类" value=" "></el-option>
				    <el-option v-for="item in categoryData" :key="item.id" :label="item.categoryName" :value="item.id" :disabled="item.disabled"></el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="类型：" prop="templateId">
				<el-select placeholder="请选择类型" class="formInput" v-model="basicForm.templateId">
				    <el-option v-for="item in typeData" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
				</el-select>
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
		    <el-form-item label="关键词：" prop="keywords">
				<el-input placeholder="请输入关键词" class="formInput" v-model="basicForm.keywords"></el-input>
		    </el-form-item>
		    <el-form-item label="说明：">
		    	<div>
					<custom-editor v-model="basicForm.content"></custom-editor>
				</div>
		    </el-form-item>
		</el-form>

		<div class="promotion_button">
			<el-button type="primary" size="small" @click="saveCategory">保存</el-button>
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
		    //       callback(new Error('分类名称格式不正确'));
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
					categoryName:'',
					parentId:'',
					templateId:'',
					sequence:'',
					keywords:'',
					content:'',
					imageId:'',
					imageUrl:'',
				},
				basicRules:{
					categoryName:[
			            { required: true, message: '请输入分类名称', trigger: 'blur' },
			            { max: 15, message: '类名称最长15个字符', trigger: 'blur' }
			        ],
					parentId:[
			            { required: true, message: '请选择上级分类', trigger: 'blur' },
			        ],
					sequence:[
						{ validator: checkCode , trigger: 'blur' },
					],
					keywords:[
						{ max: 100, message: '关键字最长100个字符', trigger: 'blur' }
					]
				}
			}
		},
		mounted() {
			this.id=this.$route.query.id || ''
			this.parentId=this.$route.query.parentId
			this.getCategory()
			this.getType()
			if(this.id){
				this.getCategoryById(this.id)
			}
		},
		methods: {
			getSrc(val){
				this.basicForm.imageUrl = val.imgUrl
				this.basicForm.imageId = val.id
			},
			getType(){
				this.$api("goods.getGoodsType").then((result) => {
					this.typeData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品类型出错', type: 'error' });
					}
				});
			},
			getCategoryById(id){
				this.$api("goods.getCategoryById",{id:id}).then((result) => {
					this.basicForm = result
					if(this.basicForm.parentId == null || this.basicForm.parentId == 'null' || this.basicForm.parentId == '0'){
						this.basicForm.parentId = ' '
					}
				}, (error) => {
					this.$message({ message: '查询商品分类出错', type: 'error' });
				});
			},
			getCategory(){
				this.$api("goods.getGoodsCategory").then((result) => {
					this.categoryData = utilFun.findCategory(result.list,this.id);
					if(this.parentId){
						this.basicForm.parentId = Number(this.parentId)
					}
				}, (error) => {
					if(error.data.status != 102){
						this.$message({ message: '查询商品分类出错', type: 'error' });
					}
				});
			},
			saveCategory(){
				this.$refs.basicForm.validate((valid) => {
		        	if (valid) {
						delete this.basicForm.childrenList
						delete this.basicForm.updateDate
						delete this.basicForm.templateName
						if(!this.basicForm.templateId){
							delete this.basicForm.templateId
						}
						if(this.basicForm.parentId == ' '){
 							this.basicForm.location = 1
						}else{
							let parentLocation = this.categoryData.find((n)=>n.id == this.basicForm.parentId).location
							this.basicForm.location = Number(parentLocation) + 1
						}
						this.basicForm = this.checkNull(this.basicForm)

						this.$api("goods.saveGoodsCategory",this.basicForm).then((result) => {
							this.$message({ message: '保存商品分类成功', type: 'success' });
							this.$router.push({name:'goodsCategory'})
						}, (error) => {
							this.$message({ message: '保存商品分类出错', type: 'error' });
						});
		        	}else{
		        		console.log('error validate');return
		        	}
		        });
			},
			cancelAdd(){
				this.$router.push({name:'goodsCategory'})
			},
			checkNull(obj){
				for(let i in obj){
					if(obj[i] == null || obj[i] == 'null'){
						obj[i] = ''
					}
				}
				return obj
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
