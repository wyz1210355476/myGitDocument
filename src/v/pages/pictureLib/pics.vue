<template>
	<div class="contents pics">
		<page-title title="图片列表"></page-title>
		<!-- tab -->
		<div class="tabs">
			<!-- <tab-filter :options="options" @click="getFilterParam()" param="type" v-if="isFrame"></tab-filter> -->
			<ul>
				<li @click="getFilterParam(options[0].name)">
					<el-select v-model="selectVal" placeholder="全部图片" size="8" @change="groupChange" class="selects">
						<el-option :value="-1">全部图片</el-option>
						<el-option v-for="item in groupMenu" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</li>
				<li @click="getFilterParam(options[1].name)">水印图片</li>
			</ul>
		</div>
		<el-input
		size="small"
		placeholder="请输入内容"
		v-model="search.search_value"
		style="font-size:12px;width:300px"
		class="searchInput">
			<el-button slot="append" size="small" style="font-size:12px" @click="handleSearchClick">查询</el-button>
		</el-input>
		<div class="changeBtns">
			<div class="leftDemo">
				<label>状态：</label>
				<el-button size="mini" type="text" v-for="item in status" :key="item.name" @click="changeStatus(item.name)">{{item.label}}</el-button>
			</div>
			<div class="leftDemo rightDemo">
				<label>上传时间：</label>
				<el-button size="mini" type="text" v-for="item in timer" :key="item.name" @click="changeStatus(item.name)">{{item.label}}</el-button>
				<el-button size="mini" type="text" @click="custom">自定义</el-button>
				<div class="zdyBox" v-show="customShow">
					<el-date-picker
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					v-model="searchDates"
					value-format="yyyy-MM-dd">
					</el-date-picker>
					<el-button size="mini" type="primary" @click="searchTime">确定</el-button>
				</div>
			</div>
		</div>
		<div class="topOp">
			<!-- <el-button size="small" type="primary" @click="uploadLocal">本地上传</el-button> -->
			<el-upload
			class="upload-demo"
			:action="uploadUrl"
			:on-success="handleSuccess">
			<el-button size="small" type="primary">本地上传</el-button>
			</el-upload>
		</div>
		<div class="content-table">
			<el-table ref="messageTable" @selection-change="handleSelectionChange" :data="picsList" type="card" style="width: 100%" size="mini" class="table-one-line" v-loading="isLoading">
				<el-table-column type="selection" width="55">
                </el-table-column>
				<el-table-column label="缩略图">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.imgUrl">
							<!-- <img src="../../common/images/img-del.png" /> -->
							<img :src="scope.row.imgUrl" alt="" width="30" height="30" style="display: inline-block;">
						</div>
					</template>
				</el-table-column>
				<el-table-column label="图片名称">
					<template slot-scope="scope">
						<div class="one-line">
							{{scope.row.name}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="所属分类">
					<template slot-scope="scope">
						<div class="one-line" v-if="scope.row.appName">
							{{scope.row.appName}}
						</div>
						<div class="one-line" v-else>
							-
						</div>
					</template>
				</el-table-column>
				<el-table-column label="尺寸">
					<template slot-scope="scope">
						<div class="one-line" v-if="scope.row.width">
							{{(scope.row.width?scope.row.width:"-")+'*'+(scope.row.height?scope.row.height:"-")}}
						</div>
						<div v-else>
							—
						</div>
					</template>
				</el-table-column>
				<el-table-column label="文件大小">
					<template slot-scope="scope">
						<div class="one-line" v-if="scope.row.displaySize">
							{{scope.row.displaySize}}
						</div>
						<div class="one-line" v-else>
							-
						</div>
					</template>
				</el-table-column>
				<el-table-column label="上传时间">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.updateDate">
							{{scope.row.updateDate}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="水印">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.watermarkFlag">
							{{scope.row.watermarkFlag == '0' ? '否' : '是'}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.used">
							{{scope.row.used == '0' ? '未使用' : '已使用'}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" size="small" @click="editPics(scope.row.id)">编辑</el-button>
							<el-dropdown trigger="click">
                                <el-button type="text" size="small">
						        	<i class="el-icon-arrow-down el-icon--right"></i>
						      	</el-button>
                                <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                    <el-dropdown-item v-if="scope.row.watermarkFlag==0">
                                        <el-button type="text" size="small" v-if="scope.row.status==0" @click="delPics(scope.row.id)">删除</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="preView(scope.row)">预览</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="transfer(scope.row.id)">转移</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-show="!scope.row.watermarkFlag">
                                        <el-button type="text" size="small" @click="addMarkProp(scope.row.id)">添加水印</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-show="scope.row.watermarkFlag">
                                        <el-button type="text" size="small" @click="delWaterMark(scope.row.id)">取消水印</el-button>
                                    </el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pages :total="totalCount" @change="getFilterParam('page')">
				<div slot="leftop">
					<el-checkbox @change="seleceAll" size="small" >全选</el-checkbox>
					<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length == 0" @click="transferDialog = true">转移</el-button></span>
					<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length == 0" @click="addMarkProp">添加水印</el-button></span>
					<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length == 0" @click="delWaterMark">取消水印</el-button></span>
					<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length == 0" @click="delPics">删除</el-button></span>
				</div>
			</pages>
		</div>
		<!-- 上传新图片 -->
		<el-dialog title="上传新图片" :visible.sync="dialogUploadLocal" class="picEdit" v-if="dialogUploadLocal">
			<el-upload
				class="upload"
				:action="uploadUrl"
				:on-success="handleSuccess"
				:on-remove="handleRemove"
				:file-list="fileList"
				:with-credentials="true"
				:headers="headerOption"
				list-type="picture">
				<el-button size="small" type="primary">点击上传</el-button>
			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogUploadLocal = false" class="el-button--small">取 消</el-button>
				<el-button type="primary" @click="submitLocal" class="el-button--small">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 编辑信息 -->
		<el-dialog title="编辑" :visible.sync="dialogFormVisible" class="editPics">
			<el-form label-width="150px" class="order-form new-account-form" size="small" :model="picsFrom" ref="form1" :rules="rules">
				<el-form-item label="图片名称：" prop="name">
					<el-input placeholder="不超过12个字符" :value="picsFrom.name" v-model="picsFrom.name"></el-input>
				</el-form-item>
				<el-form-item label="图片：" prop="comment">
					<div class="imgBox" @mouseover="uploadBox=true" @mouseout="uploadBox=false">
						<img :src="picsFrom.path" alt="" />
						<el-upload
						v-show="uploadBox"
						class="upload"
						:action="uploadUrl"
						:on-success="handleSuccess"
						:on-remove="handleRemove"
						:file-list="fileList"
						:with-credentials="true"
						:headers="headerOption"
						list-type="picture"
						:limit="1">
						<span size="small" type="primary">点击上传</span>
						<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
						</el-upload>
					</div>
				</el-form-item>
				<el-form-item label="原始尺寸：" prop="custMail">
					{{(picsFrom.width>0?picsFrom.width:'-')+'像素 * '+(picsFrom.height>0?picsFrom.height:'-')+'像素'}}
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-send" size="small" @click="saveData('form1')" style="float:left;">保存</el-button>
				<el-button size="small" plain @click="canel">取消</el-button>
			</span>
		</el-dialog>
		<!-- 转移图片 -->
		<transfer :picsIds="multipleSelection" :rowId="rowId" :groupMenu="groupMenu" @getPicsList="getPicsList" @hiddenShow="hiddenShow" :visibility.sync="transferDialog" v-if="transferDialog"></transfer>
		<!-- 预览 -->
		<view-pics :rowInfo="viewRowInfo" @hiddenProps="hiddenProps" :visibility.sync="viewPicsDialog" v-if="viewPicsDialog"></view-pics>
		<!-- 添加水印 -->
		<add-watermark :markIds="markIds" @hideMarkProp="hideMarkProp" :visibility.sync="addMarkDialog" v-if="addMarkDialog"></add-watermark>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import {trim} from '@c/util'
	import transfer from './transfer';
	import viewPics from './viewPics';
	import addWatermark from './addWatermark';
	// 
	export default {
		data(){
			return{
				activeName: "first",
				type: this.$route.query.type,
				totalCount: 0,
				picsList: [],
				filterParam: {
					queryStatus:"-1",
					queryType:"-1",
					startDate:"",
					endDate:"",
					name:"",
					appId:""||-1
				},
				// 分类菜单
				selectVal:'',
				groupMenu: [],//分类数据
				searchDates:[],// 自定义时间
				totalCount: [],
				multipleSelection:[],
				isFrame:true,// tab指定页签选中
				customShow:false,// 自定义变量
				isLoading: false,// loading
				dialogFormVisible: false,// 编辑弹窗变量
				dialogUploadLocal: false,// 上传新图片变量
				disabled:false,
				input:'',
				transferDialog: false,
				viewPicsDialog: false,
				addMarkDialog: false,
				showImgs:false,
				imgFlag: false,
				uploadBox: false,
				// 查询
				search: {
					search_select: '',
					search_value: ''
				},
				picsFrom:{
					id:'',
					name:'',
					path:'',
					width:'',
					height:'',
					updateDate:''
				},
				// tab标签
				options: [
					{label: "全部图片",name: "pics"},
					{label: "水印图片",name: "watermark"}
				],
				// 状态按钮
				active:0,
				status:[
					{label:"全部",name:"all"},
					{label:"已使用",name:"used"},
					{label:"未使用",name:"unUsed"}
				],
				// 时间按钮
				timer:[
					{label:"全部",name:"allTime"},
					{label:"最近三天",name:"lateLy"},
					{label:"本周",name:"week"},
					{label:"本月",name:"mounth"}
				],
				// 验证规则
				rules: {
					name: [
						{ required: true, message: '请输入图片名称', trigger: 'blur' },
					]
				},
				// 上传图片接口
				uploadUrl: __ce.baseURL+'/manager/ceshopimgrepository/img/upload',
				// 请求头
				headerOption: {
					// common: {
						'X-Requested-with': 'XMLHttpRequest'
					// }
				},
				fileList: [],
				localImgList: [],
				rowId:"",
				markIds:"",
				viewRowInfo:{}
			}
		},
		mounted() {
			this.getAppData(); // 分类数据
			this.getPicsList(); // 图片列表
		},
		methods: {
			changeStatus(name,index){
				this.active=index
				if(name == 'all'){
					this.filterParam.queryStatus=-1;
					this.filterParam.queryType='-1';
				}else if(name == 'used'){
					this.filterParam.queryStatus=1;
					this.filterParam.queryType='-1';
				}else if(name == 'unUsed'){
					this.filterParam.queryStatus=0;
					this.filterParam.queryType='-1';
				}else if(name == 'allTime'){
					this.filterParam.queryType=-1;
				}else if(name == 'lateLy'){
					this.filterParam.queryType=3;
				}else if(name == 'week'){
					this.filterParam.queryType=1;
				}else if(name == 'mounth'){
					this.filterParam.queryType=4;
				}
				this.customShow=false;
				this.filterParam.startDate='';
				this.filterParam.endDate='';
				this.searchDates=[];
				this.search.search_value="";
				this.filterParam.name="";
				this.getPicsList();
			},
			custom(){
				this.customShow=true;
			},
			searchTime(){
				if(!this.searchDates[0]){
					this.$message({ type: 'error', message: '请选择查询起止时间！' });
					return;
				}else{
					this.filterParam.queryType=2;
					this.filterParam.startDate=this.searchDates[0];
					this.filterParam.endDate=this.searchDates[1];
					this.search.search_value="";
					this.filterParam.name="";
					this.getPicsList();
				}
			},
			// 关键字查询
			handleSearchClick() {
				this.search.search_value = trim(this.search.search_value);
				// if (this.search.search_value == '') {
				// 	this.$message({ type: 'error', message: '请输入关键字' });
		        //   	return;
				// }
				this.filterParam.name=this.search.search_value;
				this.search.search_value="";
				this.filterParam.queryType="-1"
				this.filterParam.startDate="";
				this.filterParam.endDate="";
				this.getPicsList();
			},
			// 分类数据
			getAppData(){
				this.$api("pictureLib.appList",{}).then((result)=>{
					this.groupMenu=result.list
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						
					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				})
			},
			getFilterParam(type){
				// this.type = this.$route.query.type;
				if(type == 'pics' || type == 'page'){
					this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
					this.filterParam.num = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
					this.getPicsList();
				}else{
					this.waterMark(type);
				}
			},
			// 分类菜单
			groupChange(val) {
				if(val == '-1'){
					this.selectVal = "全部图片"
				}
				this.filterParam.appId=val;
				this.getPicsList();
			},
			//获取图片列表
			getPicsList() {
				this.isLoading = true;
				this.$api("pictureLib.getAllPics", this.filterParam).then((result) => {
					this.picsList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.totalCount = 0;
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
						this.picsList=[]
					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			// 转移
			transfer(rowId){
				this.rowId = rowId;
				this.transferDialog = true;
			},
			hiddenShow(){
				let that = this;
				this.transferDialog = false;
			},
			// 预览
			preView(row){
				this.viewRowInfo=row;
				this.viewPicsDialog = true;
			},
			hiddenProps(){
				let that = this;
				this.viewPicsDialog = false;
			},
			//添加水印图片
			addMarkProp(row){
				this.addMarkDialog = true;
				let paramsArr = [];
				if(this.multipleSelection.length > 0){
					this.multipleSelection.forEach( (element) => {
						paramsArr.push(element.id)
					})
					this.markIds=paramsArr.join(',')
				}else{
					this.markIds=row
				}
			},
			hideMarkProp(){
				let that = this;
				this.addMarkDialog = false;
			},
			//水印图片
			waterMark(type){
				let query = type;
				this.$router.push({
					path:'./watermark',
					query: {type:query}
				})
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			//取消水印
			delWaterMark(rowId){
				let paramsArr = [];
				let params = {};
				if(this.multipleSelection.length > 0){
					this.multipleSelection.forEach( (element) => {
						paramsArr.push(element.id)
					})
					params.ids=paramsArr.join(',')
				}else{
					params.ids=rowId
				}
				this.$api("waterMark.waterMarkDel",params).then((result)=>{
					this.$message({
						type: 'success',
						message: '删除水印成功！'
					});
					this.getPicsList();
				},(error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '删除水印失败！'
			          	});
					}
				})
			},
			//全选
			seleceAll(val){
				if(val && this.picsList.length > 0){
					this.picsList.forEach(row => {
			            this.$refs.messageTable.toggleRowSelection(row);
			        });
				}else{
					this.$refs.messageTable.clearSelection();
				}
			},
			//编辑图片
			editPics(id){
				this.dialogFormVisible = true;
				let query = {}
				if(id != undefined){
					query.id = id
				}
				this.$api("pictureLib.editor", {id:id}).then((result) => {
					this.picsFrom = {
						id:result.id,
						name:result.name,
						path:result.imgUrl,
						width:result.width,
						height:result.height,
						updateDate:result.updateDate
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
				// this.$router.push({
				// 	name:'add_pics',
				// 	query:query
				// })
			},
			// 上传本地图片
			uploadLocal(){
				// this.dialogUploadLocal = true;
				this.uploadUrl+'?appId='+this.filterParam.appId
				let selectedImgList = [];
				this.localImgList.forEach((v) => {
					selectedImgList.push(v);
				});
				console.log(selectedImgList.length)
				if (selectedImgList.length == 0) {
					this.$message({
                        type: 'error',
                        message: '请选择图片'
                    });
                    return;
				}
			},
			//删除图片
            delPics(id) {
				let paramsArr = [];
				if(id == undefined){
					if(this.multipleSelection.length == 0){
						this.$message({ message: '请选择您要删除的图片', type: 'warning' });
					}else{
						this.multipleSelection.forEach( (element) => {
							paramsArr.push(element.id)
						})
						this.$confirm('是否删除您选中的图片?', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
				        	this.$api("pictureLib.delPics",{ids:paramsArr.join(',')}).then((result) => {
								this.$message({ message: '删除图片成功', type: 'success' });
								this.getPicsList()
							}, (error) => {
								this.$message({ message: '删除图片出错', type: 'error' });
							});
				        }).catch(() => {});
					}
				}else{
					paramsArr.push(id)
					this.$confirm('是否删除您选中的图片?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$api("pictureLib.delPics",{ids:paramsArr.join(',')}).then((result) => {
							this.$message({ message: '删除图片成功', type: 'success' });
							this.getPicsList()
						}, (error) => {
							this.$message({ message: '删除图片出错', type: 'error' });
						});
					}).catch(() => {});
				}
			},
		    //上传本地图片成功回调
		    handleSuccess(response, file, fileList) {
		    	if (response.status != 101) {
		    		this.$message({
                        type: 'error',
                        message: '上传失败！'
                    });
                    return;
		    	}
		    	let img = response.data;
		    	if (!this.multiple) {
					this.localImgList = [];
				}
				this.localImgList.push(img);
				this.picsFrom.path=img.url;
				if(this.localImgList.length>1){
					this.$message({
                        type: 'error',
                        message: '您最多只能上传一张图片！'
                    });
                    return;
				}
		    },
		    //移除本地图片
			handleRemove(file, fileList) {
				let index = this.localImgList.findIndex(n => n.uid == file.uid);
				if (index > -1) {
					this.localImgList.splice(index, 1);
				}
			},
			submitLocal(){
				let selectedImgList = [];
				this.localImgList.forEach((v) => {
					selectedImgList.push(v);
				});
				if (selectedImgList.length == 0) {
					this.$message({
                        type: 'error',
                        message: '请选择图片'
                    });
                    return;
				}
			},
			// 保存编辑
			saveData(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveSetup();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
			},
	      	//保存编辑数据
	      	saveSetup() {
				  console.log(this.localImgList)
	      		let params = {};
	      		if (this.picsFrom.id != '') {
	      			params.id = this.picsFrom.id;
	      		}
				params.name = this.picsFrom.name;
				if(this.picsFrom.path){
					params.path = this.picsFrom.path;
				}else{
					params.path = this.localImgList.url || "";
				}
	      		this.$api("pictureLib.editor", params).then((result) => {
	      			this.$message({
		            	type: 'success',
		            	message: '保存成功！'
					})
					this.dialogFormVisible = false;
					this.getPicsList();
	      		}, (error) => {
	      			this.$message({
		            	type: 'error',
		            	message: '保存失败！'
		          	});
				});
	      	},
			canel(){
				this.dialogFormVisible = false;
			}
		},
		components: {
			pageTitle,
			pages,
			transfer,
			viewPics,
			addWatermark
		}
	}
</script>

<style>
	.pics{
		position: relative;
	}
	.pics .el-upload-list{
		display: none;
	}
	.pics .searchInput{
		position: absolute;
		right: 20px;
		top: 65px;
	}
	.pics .tabs{
		height: 40px;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
	}
	.pics .tabs ul,
	.pics .tabs li{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.pics .tabs li{
		float: left;
		padding: 0 20px;
		height: 41px;
		box-sizing: border-box;
		line-height: 41px;
		display: inline-block;
		list-style: none;
		font-size: 14px;
		font-weight: 500;
		color: #303133;
		position: relative;
		cursor: pointer;
		border: 1px solid #e4e7ed;
		border-bottom: none;
	}
	.pics .tabs li:nth-of-type(1){
		border-right: 0;
		padding: 0;
		border-top-left-radius: 4px;
	}
	.pics .tabs li:nth-of-type(2){
		border-top-right-radius: 4px;
	}
	.selects .el-input__inner{
		border: 0;
		color: #409EFF;
	}
	.selects .el-input__inner::-webkit-input-placeholder{
		color:#409EFF;
		font-size: 14px;
	}
	.el-select .el-input .el-select__caret{
		color: #409EFF;
	}
	.changeBtns{
		border-bottom:1px solid #eee;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}
	.changeBtns .el-button.el-button--mini{
		margin: 0 10px;
	}
	.pics .changeBtns .el-button+.el-button{
		margin: 0 10px;
	}
	.leftDemo{
		display: inline-block;
		margin-right: 50px;
	}
	.changeBtns div{
		display: inline-block;
	}
	.imgBox{
		position: relative;
		width: 120px;
		height: 130px;
	}
	.imgBox img{
		display: inline-block;
		width: inherit;
		height: inherit;
	}
	.editPics .upload span{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(77, 144, 203, .6);
		color: #fff;
		line-height: 130px;
	}
	.editPics .upload ul{
		position: absolute;
		left: 0;
		top: 0;
		width: 120px;
		height: auto;
		max-height: 100px;
	}
	.editPics .el-upload-list--picture .el-upload-list__item{
		margin: 0;
		height: 100px;
	}
	.pics .upload{
		display: inline-block;
	}
	.pics .el-button+.el-button{
		margin: 0;
	}
	.pics .el-button{
		line-height: normal;
	}
	.pics .imgUrl{
		white-space: normal;
		word-break: break-all;
	}
	.picLabel{
		float:right;
	}
	.custom{
		width: inherit;
		background: transparent;
		border: none;
		box-shadow: none;
	}
	.picEdit .el-form-item__label{
		width: 100px;
	}
	.picEdit .el-input{
		width: calc(100% - 120px);
	}
	.picEdit .imgBox{
		position: relative;
		width: 120px;
		height: 100px;
	}
	.picEdit .imgBox img{
		width: inherit;
		max-height: 100px;
	}
	.picEdit .addPics .upload button{
		position: absolute;
		left: 0;
		bottom: -15px;
	}
	.picEdit .addPics .upload ul{
		position: absolute;
		left: 0;
		top: 0;
		width: 120px;
		max-height: 100px;
	}
	.upload .el-upload-list,
	.picEdit .el-upload-list {
		height: 335px;
		overflow-y: auto;
	}
	.imgList span{
		border-radius:6px;
		display: inline-block;
		box-sizing:border-box;
		border:1px solid #ddd;
		float: left;
		width: 100px;
		height: 100px;
		margin:10px;
		overflow: hidden;
		position: relative;
	}
	.imgList span .label-img-check {
		position: absolute;
		right: -17px;
		top: -7px;
		width: 46px;
		height: 26px;
		line-height: 36px;
		background: #13ce66;
		text-align: center;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		-webkit-box-shadow: 0 1px 1px #ccc;
		box-shadow: 0 1px 1px #ccc;
		z-index: 222;
		color: #fff;
	}
	.internetImgList span:hover .label-img-check {
		display: none;
	}
	.imgList span:nth-child(5n+1){margin-left: 0}
	.imgList span:nth-child(5n){margin-right: 0}
	.imgList span img{
		max-width: 100%;
		max-height: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%,-50%);
		-ms-transform: translate(-50%,-50%);
		transform: translate(-50%,-50%);
	}
	.picEdit .el-icon-close{
		right: 5px;
		top: 5px;
		position: absolute;
		z-index: 111;
		cursor: pointer;
	}
	.changeBtns .el-date-editor .el-range__close-icon{
		margin: -30px -6px 0 0;
	}
	.perViewBox{
		width: auto;
	}
</style>