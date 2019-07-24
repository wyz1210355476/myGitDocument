<template>
	<div class="contents addNvaList">
		<page-title title="添加栏目"></page-title>
		<div class="content-table">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="所属栏目：" required>
					<div class="selectBox">
						<!-- <el-input v-model="itemName" placeholder="请输入内容"></el-input> -->
						<div class="el-input" @click="showTreeCon">
							<i v-if="!itemName" class="el-input__icon el-icon-arrow-down" :class="{'is-reverse':treeFlag}"></i>
							<i v-else class="el-input__icon el-icon-circle-close is-show-close" :class="{'is-reverse':treeFlag}" @click="clearData"></i>
							<input autocomplete="off" :placeholder="placeholder" v-model="itemName" readonly="readonly" icon="caret-top" type="text" rows="2" class="el-input__inner defaultVal">
						</div>
						<div class="el-select-dropdown treeBox" v-show="treeFlag" x-placement="bottom-start">
							<div class="el-scrollbar">
								<div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
									<el-tree
									:data="data"
									:props="defaultProps"
									@node-click="handleNodeClick"
									:load="loadNode"
									:lazy="true"
									v-model="isLoading"
									:expand-on-click-node="false"
									:check-strictly="true"
									node-key="id"
									highlight-current>
									</el-tree>
								</div>
							</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="栏目标题：" prop="name" required>
					<el-input v-model="ruleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="栏目副标题：">
					<el-input v-model="ruleForm.subTitle"></el-input>
				</el-form-item>
				<el-form-item label="图标：">
					<div class="changeImg" @mouseover="uploads=true" @mouseout="uploads=false">
						<!-- 显示默认图片图片 -->
						<div class="changeBox">
							<span style="display:block;width:135px !important;height:135px !important;">
								<img :src="ruleForm.imgUrl" alt="">
							</span>
						</div>
						<!-- 显示本地上传图片 -->
						<!-- <div class="changeBox" v-show="localImgs">
							<span class="imgItem" style="display:block;width:135px !important;height:135px !important;">
								<img :src="ruleForm.imgUrl" alt="">
							</span>
						</div> -->
						<!-- 显示图片库图片 -->
						<div class="uploadBox" v-show="uploads">
							<div v-show="isShowLib">
								<div class="uploadLocal"><add-img @confirm="updataLocalImgs"><el-button size="small" type="primary">上传图片</el-button></add-img></div>
								<div class="uploadLib"><add-img @confirm="updataLocalImgs"><el-button size="small" type="primary">图片库</el-button></add-img></div>
							</div>
							<div v-show="isShowDel">
								<div class="uploadLocal"><add-img @confirm="updataLocalImgs"><el-button size="small" type="primary">更换图片</el-button></add-img></div>
								<div class="dels" @click="delImgs"><el-button size="small" type="primary">移除</el-button></div>
							</div>
						</div>
					</div>
					<span style="display:block">图标是否显示，取决于导航的展示样式</span>
				</el-form-item>
				<el-form-item label="链接：" prop="linkUrl">
					<el-input placeholder="请输入内容" v-model="ruleForm.linkUrl" class="input-with-select" required>
						<el-select v-model="ruleForm.targetType" slot="prepend" placeholder="请选择">
							<el-option label="原窗口" value="false"></el-option>
							<el-option label="新窗口" value="true"></el-option>
						</el-select>
						<!-- <el-button slot="append">选择</el-button> -->
					</el-input>
				</el-form-item>
				<el-form-item label="状态：" required>
					<el-switch v-model="ruleForm.showFlag" :active-value="true" :inactive-value="false"></el-switch>
				</el-form-item>
				<el-form-item label="栏目描述：">
					<el-input type="textarea" v-model="ruleForm.description"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
					<el-button type="success" @click="submitForm('ruleForm',flag='saveAdd')" v-show="showBtn">保存并继续添加</el-button>
					<el-button @click="resetForm('ruleForm')" style="float:right;">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle';
    import addImg from '@components/addImg'
	 
	export default {
		data(){
			return{
				//imgUrl,imgThumbUrl,imgId,showFlag,targetType,parentId,navId,linkUrl,type,name,subTitle,description
				data:[],
				defaultProps: {
					children: 'children',
					label: 'name',
				},
				treeFlag:false,
				placeholder:'请选择',
                localImgs: false,
                uploads: false,
                isShowLib: false,
				isShowDel: false,
				isLoading: false,
				showBtn: true,
				imgFlag: 1,
				parentFlag: false,
				groupMenu:[],
				itemName:'做为顶级栏目',
				ruleForm: {
					id:'',
					type:0,
					imgUrl:'',
					imgThumbUrl:'',
					imgId:'',
					showFlag:false,
					targetType:"false",
					parentId:0,
					navId:'',
					linkUrl:'',
					name:'',
					subTitle:'',
					description:'',
				},
				rules: {
					column: [
						{ required: true, message: '请选择所属栏目名称', trigger: 'change' }
					],
					name: [
						{ required: true, message: '请输入栏目名称', trigger: 'blur' }
					],
					linkUrl: [
						{ required: true, message: '请输入以http://或https://开头的链接信息(中文除外)', trigger: 'blur', pattern:/^(http|ftp|https):\/\/[^\u4e00-\u9fa5]+$/ }, // pattern
					],
				},
				// 图片
				imageListStr:{},
            }
		},
		mounted() {
			this.getAllNav();
			this.getChildList();
			//获取栏目信息
			if(this.$route.query.flag=='editItem' || this.$route.query.flag=='copyItem'){
				this.getColumn()
			}
			if(this.$route.query.flag=='editItem'){
				this.showBtn=false;
			}
			// 获取父级栏目信息
			if(this.$route.query.id){
				this.getParentName();
			}
			this.showPics()
		},
		methods: {
			// 获取父级栏目名称
			getParentName(){
				// if(this.$route.query.flag=='editItem' && this.$route.query.parentId>0){
					let params = {};
					params.id=this.$route.query.parentId || this.$route.query.id;
					params.navId=this.$route.query.navId;
					this.$api("navigator.getColumn",params).then((result)=>{
						let queryData = result;
						this.itemName = queryData.name;
						console.log(this.itemName)
					},(error)=>{
					})
				// }
			},
			// 下拉tree
            showTreeCon(e) {
                this.treeFlag = this.treeFlag == false ? true : false;
                e.stopPropagation();
			},
			clearData(e){
                this.itemName = '';
                this.treeFlag = false;
                e.stopPropagation();
			},
			//获取栏目信息
			getColumn(){
				let params={};
				let name="";
				params.id=this.$route.query.id;
				params.navId=this.$route.query.navId;
				params.parentId=this.$route.query.parentId;
				if(params.parentId==0 || this.$route.query.flag=='copyItem'){
					name='做为顶级栏目'
				}
				this.$api("navigator.getColumn",params).then((result)=>{
					let queryData = result;
					this.ruleForm.id = queryData.id || 0;
					this.itemName = name;
					this.ruleForm.type = queryData.type || 0;
					this.ruleForm.imgThumbUrl = queryData.imgUrl || ''
					this.ruleForm.imgId = queryData.imgId || ''
					this.ruleForm.showFlag = queryData.showFlag
					this.ruleForm.parentId = queryData.parentId || 0
					this.ruleForm.navId = queryData.navId
					this.ruleForm.linkUrl = queryData.linkUrl
					this.ruleForm.name = queryData.name
					this.ruleForm.subTitle = queryData.subTitle
					this.ruleForm.description = queryData.description
					if(queryData.imgUrl&&queryData.imgUrl.indexOf("http"||"https")>-1){
						this.ruleForm.imgUrl = queryData.imgUrl || ''
					}else{
						this.ruleForm.imgUrl = __ce.baseURL+queryData.imgUrl || ''
					}
					queryData.targetType?this.ruleForm.targetType='true':this.ruleForm.targetType='false';
					if(queryData.imgUrl){
						this.isShowDel=true;
						this.isShowLib=false;
					}else if(!this.$route.imgUrl){
						this.isShowDel=false;
						this.isShowLib=true;
					}
					if(this.$route.query.flag=='editItem' && this.$route.query.parentId>0){
						let params = {};
						params.id=this.$route.query.parentId;
						params.navId=this.$route.query.navId;
						this.$api("navigator.getColumn",params).then((result)=>{
							let queryData = result;
							this.itemName = queryData.name;
						},(error)=>{
						})
					}
				},(error)=>{
				})
				
				
			},
            // 获取全部导航
            getAllNav(){
                this.$api("navigator.navList",{}).then((result)=>{
					this.groupMenu=result.list
                },(error)=>{
                    if(error && error.data && error.data.status == 102){

                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取导航失败！'
                        })
                    }
				})
			},
            // 获取子集数据
            getChildList(){
                this.$api("navigator.childList",{navId:this.$route.query.navId}).then((result)=>{
					if(result.status != 102){
						this.data = result.list;
						this.data.unshift({
							name:'做为顶级栏目',
							id: 0,
							navId: this.$route.query.navId
						});
					}
                },(error)=>{
                    if(error && error.data && error.data.status == 102){
						this.data=[]
                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取导航失败！'
                        })
                    }
                })
			},
			changeSelect(val){
			},
			showTree(){
				this.treeFlag=true;
			},
            //上传本地图片
			updataLocalImgs(val){
				this.imgFlag=2;
				this.imageListStr=val
				// this.imageListStr.listImageFlag = 1
				// this.imageListStr.imageName = this.imageListStr.name
				this.imageListStr.url = this.imageListStr.path//path
				this.imageListStr.imgId = this.imageListStr.id//id
				if(this.imageListStr.url != ''){
					this.isShowDel=true;
					this.isShowLib=false;
				}else{
					this.isShowDel=false;
					this.isShowLib=true;
				}
				this.ruleForm.imgUrl = this.imageListStr.url;
				this.ruleForm.imgThumbUrl = '/'+this.ruleForm.imgUrl;
				this.ruleForm.imgId = this.imageListStr.id
			},
			// 删除图片
			delImgs(){
				this.imageListStr={}
				this.ruleForm.imgUrl = "";
				this.ruleForm.imgId = ''
				this.isShowDel=false;
				this.isShowLib=true;
			},
			selectVal(val){
			},
			// 选择下来树
			handleNodeClick(node){
				this.ruleForm.navId = node.navId;
				this.ruleForm.parentId = node.id;
				this.itemName = node.name;
				this.treeFlag = false;
				this.parentFlag=true;
			},
            submitForm(form,saveAdd){
				this.$refs[form].validate((valid) => {
					if (valid) {
						// 添加
						let flag = this.$route.query.flag;
						switch(flag){
							case 'menuList':
								this.ruleForm.navId = this.$route.query.navId;
								this.$api("navigator.addNavList",this.ruleForm).then((result)=>{
									this.$message({
										type: 'success',
										message: '添加成功！'
									})
									if(!saveAdd){
										this.$router.go(-1);
									}
								},(error)=>{
									if(error && error.data && error.data.status == 102){

									}else{
										this.$message({
											type: 'error',
											message: '添加失败！'
										})
									}
								})
								break;
							case 'addItem':
								this.ruleForm.navId = this.$route.query.navId;
								this.$route.query.id?this.ruleForm.parentId = this.$route.query.id:'';
								this.$api("navigator.addNavList",this.ruleForm).then((result)=>{
									this.$message({
										type: 'success',
										message: '添加成功！'
									})
									if(!saveAdd){
										this.$router.go(-1);
									}
								},(error)=>{
									if(error && error.data && error.data.status == 102){

									}else{
										this.$message({
											type: 'error',
											message: '添加失败！'
										})
									}
								})
								break;
							case 'editItem':
								if(!this.parentFlag){
									this.ruleForm.parentId = this.$route.query.parentId;
								}
								this.ruleForm.navId = this.$route.query.navId;
								this.ruleForm.id = this.$route.query.id;
								this.$api("navigator.editNavItem",this.ruleForm).then((result)=>{
									this.$message({
										type: 'success',
										message: '编辑成功！'
									})
									this.$router.go(-1);
								},(error)=>{
									if(error && error.data && error.data.status == 102){

									}else{
										this.$message({
											type: 'error',
											message: '编辑失败！'
										})
									}
								})
								break;
							case 'copyItem':
								this.ruleForm.navId = this.$route.query.navId;
								this.ruleForm.parentId = 0;
								this.ruleForm.id = 0 || '';
								this.$api("navigator.addNavList",this.ruleForm).then((result)=>{
									this.$message({
										type: 'success',
										message: '复制成功！'
									})
									if(!saveAdd){
										this.$router.go(-1);
									}
								},(error)=>{
									if(error && error.data && error.data.status == 102){

									}else{
										this.$message({
											type: 'error',
											message: '复制失败！'
										})
									}
								})
								break;
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				
			},
			resetForm(){
				this.$router.go(-1);
				this.getChildList();
			},
			// 显示图片
			showPics(){
				if(this.$route.query.imgUrl){
					this.isShowDel=true;
					this.isShowLib=false;
				}else if(!this.$route.query.imgUrl){
					this.isShowDel=false;
					this.isShowLib=true;
				}
			},
			// 编辑
			editItem(queryData){
				if(queryData != ""){
					if(queryData.targetType){
						queryData.targetType='true'
					}else{
						queryData.targetType='false'
					}
					this.showBtn=false;
					this.ruleForm.id = queryData.id || 0;
					this.itemName = queryData.navId;
					this.ruleForm.type = queryData.type || 0;
					if(queryData.imgUrl.indexOf("http"||"https")>-1){
						this.ruleForm.imgUrl = queryData.imgUrl
					}else{
						this.ruleForm.imgUrl = __ce.baseURL+queryData.imgUrl
					}
					this.ruleForm.imgThumbUrl = queryData.imgThumbUrl
					this.ruleForm.imgId = queryData.imgId
					this.ruleForm.showFlag = queryData.showFlag
					this.ruleForm.targetType = queryData.targetType;
					this.ruleForm.parentId = queryData.parentId || 0
					this.ruleForm.navId = queryData.navId
					this.ruleForm.linkUrl = queryData.linkUrl
					this.ruleForm.name = queryData.name
					this.ruleForm.subTitle = queryData.subTitle
					this.ruleForm.description = queryData.description
				}
			},
			// 懒加载tree数据
			loadNode(node, resolve){
				var data = [];
				if(node.data.childrenNum > 0){//点击树节点1的处理
					let param={};
					param.parentId=node.data.id;
					param.navId=node.data.navId;
					this.$api("navigator.childList",param).then((result)=>{
						if(result.status != 102){
							data = result.list;
							resolve(data)
						}
					},(error)=>{
						if(error && error.data && error.data.status == 102){
							data=[]
						}else{
							this.$message({
								type: 'error',
								message: '获取导航失败！'
							})
						}
					})
				}else{
					resolve(data)
				}
			}
		},
		components: {
			pageTitle,
			addImg
		}
	}
</script>

<style>
	.addNvaList .el-form-item:last-child .el-form-item__content{
		margin-left: 0 !important;
	}
	.selectBox{
		position: relative;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		width: 200px;
		height: 40px;
		cursor: pointer;
	}
	.selectBox .arrow{
		position: absolute;
		right: 10px;
		top: 14px;
	}
	.selectBox .is-show-close,
	.selectBox .el-icon-arrow-up,
	.selectBox .el-icon-arrow-down{
		position: absolute;
		right: 0;
		top: 0;
		height: 41px;
		z-index: 999;
	}
	.addNvaList .treeBox{
		position: absolute;
		left: -1px;
		right: 0;
		top: 35px;
		z-index: 99999;
		border: 1px solid #dcdfe6;
		border-top: 0;
		background: #fff;
	}
	.addNvaList .treeBox .el-tree-node__content{
		height: 30px;
	}
	.changeImg{
		display: inline-block;
		position: relative;
		width: 135px;
		height: 135px;
		background: url("../../common/images/addimg.png") no-repeat;
	}
	.changeImg img{
		display: block;
		width: 135px;
		height: 135px;
	}
	.changeBox{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
	.uploadLocal,
	.uploadLib,
	.dels{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 70%;
		background: rgba(64, 158, 255, .5)
	}
	.uploadLocal:hover,
	.uploadLib:hover,
	.dels:hover{
		background: rgba(64, 158, 255, .7)
	}
	.uploadLocal .el-button,
	.uploadLib .el-button,
	.dels .el-button{
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%,-50%);
		background: none;
		border: 0;
	}
	.uploadLib,
	.dels{
		top: auto;
		bottom: 0;
		height: 30%;
	}
	.dels:hover .el-button{
		color: #f00;
	}
	.el-select .el-input {
		width: 130px;
	}
	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}
</style>