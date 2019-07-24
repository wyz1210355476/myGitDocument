<template>
	<div class="contents">
		<page-title :title="'页面设置'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addPage()">新增页面</el-button>
			<!-- <el-button size="small" >整站发布</el-button> -->
		</div>
		<el-table :data="data" size="mini" v-loading="loading" class="table-one-line">
	      	<el-table-column prop="markName" label="名称" >
	      		<template slot-scope="scope">
	      			<el-input v-show="rename.id==scope.row.id" size="small" class="formInput" v-model="rename.name" placeholder="请输入名称"></el-input>
					<span v-show="rename.id!=scope.row.id" class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="类别" width="160">
				<template slot-scope="scope">
					<span>{{scope.row.isHomePage?'首页':'营销页'}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="链接" width="160">
				<template slot-scope="scope">
					<el-button type="text" class="copyBtn" size="small" :data-clipboard-text="webURL+'/'+scope.row.fileName+'.html'">复制链接</el-button>
				</template>
	      	</el-table-column>
	      	<el-table-column label="二维码" width="160">
				<template slot-scope="scope">
					<el-popover
					  placement="left"
					  width="220"
					  trigger="hover"
					  :open-delay="100"
					  v-model="scope.row.popover">
					  <span>
					  	<qrcode
							:value="webURL+'/'+scope.row.fileName+'.html'"
							:options="{ size: 220 }">
						</qrcode>
					  </span>
					  <i slot="reference" class="qrImg"></i>
					</el-popover>
					<!-- <el-button type="text">下载</el-button> -->
				</template>
	      	</el-table-column>
	      	<el-table-column label="最后修改时间" width="200">
				<template slot-scope="scope">
					{{scope.row.makeTime | formatDate('yyyy-MM-dd hh:mm:ss')}}
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<span v-show="rename.id==scope.row.id">
						<el-button type="primary" size="mini" @click="renamePage(scope.$index)">确定</el-button>
						<el-button size="mini" @click="rename.id='';rename.name=''">取消</el-button>
					</span>
					<span v-show="rename.id!=scope.row.id">
						<el-button type="text" size="mini" class="mr10" @click="editPage(scope.row.id,scope.row.fileName)">编辑</el-button>
						<el-dropdown trigger="click">
                            <el-button type="text" size="mini">
					        	更多<i class="el-icon-arrow-down el-icon--right"></i>
					      	</el-button>
                            <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                <el-dropdown-item>
                                    <el-button type="text" size="mini" @click="copyPage(scope.row.id)">复制</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="!scope.row.isHomePage">
                                    <el-button type="text" size="mini" @click="delPage(scope.row)">删除</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button type="text" size="mini" @click="rename.id=scope.row.id;rename.name=scope.row.name">重命名</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="!scope.row.isHomePage">
                                    <el-button type="text" size="mini" @click="setHomePage(scope.row.id)">设为首页</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button type="text" size="mini" @click="releasePage(scope.row)">发布</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
					</span>
				</template>
	      	</el-table-column>
	    </el-table>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import Clipboard from 'clipboard'
	import { Message } from 'element-ui'
	import Qrcode from '@xkeshi/vue-qrcode';
	import qrImg from '@v/common/images/qrcode.png'
	let clipboard = new Clipboard('.copyBtn')
	clipboard.on('success', function(e) {
        Message({
	        type: 'success',
	        message: '复制成功'
	    })
    });
	export default {
		data() {
			return {
				webURL:__ce.baseURL,
				loading:true,
				data:[],
				activeTab:'1',
				rename:{
					id:'',
					name:''
				},
				qrimg:qrImg,
			}
		},
		mounted() {
			if(this.webURL.indexOf('.make') == '-1'){
				this.webURL = this.webURL.split(".yun300.cn")[0]+'.make.yun300.cn'
			}
			this.getReNovationList()
		},
		methods: {
			setloading(){this.loading=true},
			unloading(){this.loading=false},
			releasePage(row){
				let makeTime = row.makeTime || 0
				let releaseTime = row.releaseTime || 0
				if(makeTime < releaseTime){
					this.$confirm('当前制作期页面可能比线上运营期页面旧，是否发布？', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						this.releaseOp(row.id)
			        }).catch(() => {});
				}else{
					this.releaseOp(row.id)
				}
			},
			releaseOp(id){
				this.setloading()
				this.$api("systemSetup.releasePage",{pageId:id}).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.getReNovationList()
				}, (error) => {
					this.$message({ message: '发布出错', type: 'error' });
					this.unloading()
				});
			},
			getReNovationList(){
				this.$api("systemSetup.getReNovationList").then((result) => {
					this.data = result
					this.unloading()
				}, (error) => {
					this.$message({ message: '查询出错', type: 'error' });
					this.unloading()
				});
			},
			setHomePage(id){
				this.setloading()
				this.$api("systemSetup.seReNovationHome",{pageId:id}).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.getReNovationList()
				}, (error) => {
					this.unloading()
					this.$message({ message: '设为首页失败', type: 'error' });
				});
			},
			delPage(row){
				let makeTime = row.makeTime || 0
				let releaseTime = row.releaseTime || 0
				let propt = '是否删除此页面？'
				if(releaseTime != 0){
					propt = '此操作会删除线上文件，是否继续删除？'
				}
				this.$confirm(propt, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					this.setloading()
		          	this.$api("systemSetup.deletePage",{pageId:row.id}).then((result) => {
						this.$message({ message: '操作成功', type: 'success' });
						this.getReNovationList()
					}, (error) => {
						this.unloading()
						this.$message({ message: '删除失败', type: 'error' });
					});
		        }).catch(() => {});
			},
			renamePage(index){
				this.setloading()
				let params={
					pageId:this.rename.id,
					name:this.rename.name
				}
				this.$api("systemSetup.updateName",params).then((result) => {
					this.data[index].name=this.rename.name
					this.rename.id=''
					this.rename.name=''
					this.$message({ message: '操作成功', type: 'success' });
					this.unloading()
				}, (error) => {
					this.$message({ message: '重命名出错', type: 'error' });
					this.unloading()
				});
			},
			editPage(id,filename){
				this.$router.push({
					name:'designPage',
					query:{
						id:id,
						fileName:filename
					}
				})
			},
			copyPage(id){
				this.setloading()
				this.$api("systemSetup.copyPage",{pageId:id}).then((result) => {
					console.log(result)
					this.unloading()
					this.editPage(result.id,result.fileName)
					this.$message({ message: '操作成功', type: 'success' });
				}, (error) => {
					this.unloading()
					this.$message({ message: '复制出错', type: 'error' });
				});
			},
			addPage(){
				this.$router.push({
					name:'addRenovation',
				})
			},
		},
		components: {
			pageTitle,
			Qrcode,
			qrImg
		}
	}
</script>
<style>
.qrImg{background: url(../../common/images/qrcode.png) no-repeat; width: 26px; height: 26px; display: inline-block; vertical-align: middle; background-size: 100%; margin-top: -3px; line-height: 100%}
</style>
