<template>
	<div class="contents navigator">
		<page-title title="导航管理"></page-title>
		<!-- tab -->
		<div class="tabs">
			<ul>
				<li @click="getFilterParam(options[0].name)">
					<el-select v-model="selectVal" placeholder="全部导航" size="8" @change="groupChange" class="selects">
						<el-option :value="-1">全部导航</el-option>
						<el-option v-for="(item,index) in groupMenu" :key="item.index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</li>
			</ul>
		</div>
		<div class="topOp">
			<el-button size="small" type="primary" @click="addNavList">添加栏目</el-button>
		</div>
		<!-- 
			accordion
			:render-content="renderContent"
		 -->
		 <div class="tabHead el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
			 <div class="el-table__header-wrapper">
				 <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" width="100%">
					<thead class="has-gutter">
						<tr class="">
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">栏目名称</div>
							</th>
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">栏目描述</div>
							</th>
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">创建时间</div>
							</th>
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">状态</div>
							</th>
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">排序</div>
							</th>
							<th colspan="1" rowspan="1" class="el-table_1_column_1     is-leaf">
								<div class="cell">操作</div>
							</th>
						</tr>
					</thead>
				</table>
			</div>
		 </div>
		<el-tree
		:data="data"
		:props="defaultProps"
		:load="loadNode"
		:lazy="true"
		v-model="isLoading"
		:expand-on-click-node="false"
		:check-strictly="true"
		:render-content="renderContent"
		node-key="id"
		highlight-current>
		</el-tree>
		<traner-prop :fatherId="fatherId" :myId="myId" @switchTranfer="switchTranfer" @getList="getChildList" :visibility.sync="tranferStatus" v-if="tranferStatus"></traner-prop>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import tranerProp from './tranerProp';
	// import {trim} from '@c/util'
	// 
	export default {
		data(){
			return{
				data: [],
				defaultProps: {
					children: 'children',
					label: 'name',
				},
                selectVal: '',
                groupMenu: [],
                listData:[],
				parentId:'',
                filterParam:{
                    navId:'',
                    queryType:0,
                    name:'',
                    startDate:'',
                    endDate:'',
                },
				isLoading: false,
				childFlag:false,
				tranferStatus: false,
				fatherId:'',
				myId:'',
				tempId:'',
				subData:[]
            }
		},
		mounted() {
            this.getAllNav();//获取全部导航
            this.getChildList();//获取分页导航
			this.getFilterParam();
		},
		methods: {
            // 获取全部导航
            getAllNav(){
				this.selectVal=Number(this.$route.query.navId);
				this.parentId=Number(this.$route.query.navId);
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
				let param={};
				param.navId=this.parentId
				this.$api("navigator.childList",param).then((result)=>{
					if(result.status != 102){
						this.data = result.list;
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
			getFilterParam(type){
                if(type == 'page'){
					this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
					this.filterParam.num = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
					this.getAllNav();
				}
			},
            groupChange(val){
				if(val == '-1'){
					this.$router.push({
						path: './menuList',
						query: {}
					})
				}
				this.filterParam.navId=val;
				if(val != -1){
					this.$router.push({
						path: './childList',
						query: {navId:val}
					})
					this.parentId=this.$route.query.navId;
                	this.getChildList();
				}
			},
			// tree 自定义内容
			renderContent(h,{node,data,store}){
				return (
					<div class="treeRow">
						<span class="td">
							<span>{node.label}</span>
						</span>
						<span class="td">
							<span>{data.description}</span>
						</span>
						<span class="td">
							<span>{data.createDate}</span>
						</span>
						<span class="td">
							<span>{data.showFlag==true?'显示':'隐藏'}</span>
						</span>
						<span class="td">
							<span>
								<i class="el-icon-sort-up" type="text" size="small" on-click={()=>this.sortUp(store, data)}></i>
								<i class="el-icon-sort-down" type="text" size="small" on-click={()=>this.sortDown(store, data)}></i>
							</span>
						</span>
						<span class="td setings" style="float: right; margin-right: 20px;">
							<el-button type="text" size="mini" on-click={ () => this.editItem(store, data) }>编辑</el-button>
							<el-dropdown trigger="click">
								<el-button type="text" size="small">
									<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
									<el-dropdown-item>
										<el-button type="text" size="small" on-click={()=>this.copyItem(store, data)}>复制</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button type="text" size="small" on-click={()=>this.addNavList(store, data)}>添加</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button type="text" size="small" on-click={()=>this.transfer(store, data)}>转移</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button type="text" size="small" on-click={()=>this.updateStatus(store, data)}>
										{
											!data.showFlag?'显示':'隐藏'
										}
										</el-button>
									</el-dropdown-item>
									<el-dropdown-item>
										<el-button type="text" size="small" on-click={()=>this.delete(store, data)}>删除</el-button>
									</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</span>
					</div>
				);
			},
			//添加栏目
			addNavList(store, data){
				if(!data){
					this.$router.push({
						path: './addNavList',
						query: {
							navId:this.$route.query.navId,
							flag: 'addItem'
						}
					})
				}else{
					this.$router.push({
						path: './addNavList',
						query: {
							navId:this.$route.query.navId,
							id: data.id,
							flag: 'addItem'
						}
					})
				}
			},
			//编辑栏目
			editItem(store, data) {
				this.$router.push({
					path: './addNavList',
					query: {
						id: data.id,
						navId: data.navId,
						parentId: data.parentId || 0,
						name: data.name,
						imgUrl:data.imgUrl,
						flag: 'editItem'
					}
				})
			},
			copyItem(store, data){
				this.$router.push({
					path: './addNavList',
					query: {
						id: data.id,
						navId:this.$route.query.navId,
						parentId:0||'',
						flag: 'copyItem'
					}
				})
			},
			// 删除栏目
			delete(store, data) {
				// {id:data.id}
				this.$confirm('是否删除所选中栏目?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api("navigator.delNavList",{id:data.id}).then((result) => {
						this.$message({ message: '删除栏目成功', type: 'success' });
						this.getChildList();
					}, (error) => {
						this.$message({ message: '删除栏目出错', type: 'error' });
					});
				}).catch(() => {});
			},
			// 转移
			transfer(store, data){
				this.tranferStatus=true;
				this.fatherId=data.navId;
				this.myId=data.id;
			},
			// 显示隐藏栏目
			//id=21522&flag=true
			//Flag：true显示，false不显示
			updateStatus(store, data){
				data.showFlag =! data.showFlag;
				let params={};
				params.id=data.id
				params.flag=data.showFlag
				this.$api("navigator.updateShowState",params).then((result)=>{
					this.$message({
						type: 'success',
						message: data.showFlag?'显示成功':'隐藏成功'
					})
					this.getChildList();
				},(error)=>{
					this.$message({
						type: 'error',
						message: data.showFlag+'失败'
					})
				})
			},
			//tree点击事件
			handleNodeClick(val,evt){
				// console.log(val)
				this.tempId = val.id
			},
			//sort
			sortUp(store, data){
				let params={};
				params.id=data.id;
				if(this.subData && this.subData != '' && data.parentId > 0){// 二级导航
					let targetItemIndex = this.subData.findIndex((value, index, arr)=>{
						return value.id == data.id
					})
					let targetItem = this.subData.find((value, index, arr)=>{
						if(targetItemIndex-2 < 0){
							return index == targetItemIndex-1
						}else{
							return index == targetItemIndex-2
						}
					})
					if(!targetItem || (targetItemIndex-2)<0){
						params.targetId=data.parentId;
						params.direction=-1;
						if(targetItemIndex-2==-2){
							this.$message({
								type:'error',
								message: '不能再靠前了！'
							})
							return false
						}
					}else{
						params.targetId=targetItem.id
						params.direction=0
					}
				}else{// 顶级导航
					let targetItemIndex = this.data.findIndex((value, index, arr)=>{
						return value.id == data.id
					})
					let targetItem = this.data.find((value, index, arr)=>{
						if(targetItemIndex-2 < 0){
							return index == targetItemIndex-1
						}else{
							return index == targetItemIndex-2
						}
					})
					if(!targetItem || (targetItemIndex-2)<0){
						params.targetId=-1
						params.direction=-1;
						if(targetItemIndex-2==-2){
							this.$message({
								type:'error',
								message: '不能再靠前了！'
							})
							return false
						}
					}else{
						params.targetId=targetItem.id
						params.direction=0
					}
				}
				// 排序接口
				this.$api("navigator.sort",params).then((result)=>{
					this.$message({
						type: 'success',
						message: '排序成功！'
					})
					this.getChildList();
				}, (error)=>{
					if(error && error.data && error.data.status == 102){

					}else{
						this.$message({
							type: 'error',
							message: '排序出错！'
						})
					}
				})
			},
			sortDown(store, data){
				let params={};
				params.id=data.id;
				if(this.subData && this.subData != '' && data.parentId > 0){// 二级导航
					let targetItemIndex = this.subData.findIndex((value, index, arr)=>{
						return value.id == data.id
					})
					let targetItem = this.subData.find((value, index, arr)=>{
						return index == targetItemIndex+1
					})
					if(!targetItem){
						this.$message({
							type:'error',
							message: '不能再向后了！'
						})
						return false;
					}else{
						params.targetId=targetItem.id
						params.direction=1
					}
				}else{
					let targetItemIndex = this.data.findIndex((value, index, arr)=>{
						return value.id == data.id
					})
					let targetItem = this.data.find((value, index, arr)=>{
						return index == targetItemIndex+1
					})
					if(!targetItem){
						this.$message({
							type:'error',
							message: '不能再向后了！'
						})
						return false;
					}else{
						params.targetId=targetItem.id
						params.direction=1
					}
				}
				this.$api("navigator.sort",params).then((result)=>{
					this.$message({
						type: 'success',
						message: '排序成功！'
					})
					this.getChildList();
				}, (error)=>{
					if(error && error.data && error.data.status == 102){

					}else{
						this.$message({
							type: 'error',
							message: '排序出错！'
						})
					}
				})
			},
			switchTranfer(){
				this.tranferStatus=false;
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
							this.subData = result.list;
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
			pages,
			tranerProp,
		}
	}
</script>

<style>
	.navigator{
		position: relative;
	}
	.navigator .topOp .sorts{
		display: inline-block;
		margin-left: 20px;
	}
	.navigator .searchInput{
		position: absolute;
		right: 20px;
		top: 65px;
	}
	.navigator .tabs{
		height: 40px;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
	}
	.navigator .tabs ul,
	.navigator .tabs li{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.navigator .tabs li{
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
	.navigator .tabs li:nth-of-type(1){
        border-right-width:1px;
		padding: 0;
		border-top-left-radius: 4px;
	}
	.navigator .tabs li:nth-of-type(2){
		border-top-right-radius: 4px;
	}
	.navigator .selects .el-input__inner{
		border: 0;
		color: #409EFF;
	}
	.navigator .selects .el-input__inner::-webkit-input-placeholder{
		color:#409EFF;
		font-size: 14px;
	}
	.navigator .el-select .el-input .el-select__caret{
		color: #409EFF;
	}
	.navigator .changeBtns{
		border-bottom:1px solid #eee;
		padding-bottom: 22px;
		margin-bottom: 10px;
        height: 40px;
        overflow: hidden;
	}
	.navigator .changeBtns .el-button.el-button--mini{
		margin: 0 10px;
	}
	.navigator .changeBtns .el-button+.el-button{
		margin: 0 10px;
	}
	.navigator .leftDemo{
		display: inline-block;
		margin-right: 50px;
	}
    .navigator .leftDemo .el-radio__input{
        display: none;
    }
    .navigator .leftDemo .el-radio+.el-radio{
        margin: 0 10px;
    }
	.navigator .changeBtns div{
		display: inline-block;
        vertical-align: top;
	}
	.navigator .changeBtns .el-button{
        margin-top: 7px !important;
    }
	.navigator .changeBtns .leftDemo > label,
    .navigator .changeBtns .el-radio-group{
        display:inline-block;
        padding-top: 15px;
    }
	/* tabHead */
	.navigator .el-tree-node__content{
		position: relative;
	}
	.navigator span.setings{
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0,-50%);
	}
	.navigator .el-tree-node__content{
		height: 38px;
	}
	.navigator .treeRow{
		height: 36px;
	}
	.navigator .treeRow .td{
		position: absolute;
		float: left;
		display: inline-block;
		width: 16.666%;
		line-height: 36px;
	}
	.navigator .treeRow .td:nth-child(2){
		left: 17.5%;
	}
	.navigator .treeRow .td:nth-child(3){
		left: 34%;
	}
	.navigator .treeRow .td:nth-child(4){
		left: 51%;
	}
	.navigator .treeRow .td:nth-child(5){
		left: 67%;
	}
	.navigator .treeRow .td:nth-child(5) i{
		display: inline-block;
		margin: 0 10px 0 0;
		font-size: 16px;
		color: #409EFF;
	}
	.navigator .treeRow .td:nth-child(6){
		left: 84%;
	}
	/* .navigator .el-tree-node:nth-child(even){
		background: #fafafa;
	} */
</style>