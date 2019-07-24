<template>
	<div class="contents navigator">
		<page-title title="导航管理"></page-title>
		<!-- tab -->
		<div class="tabs">
			<ul>
				<li>
					<el-select v-model="selectVal" placeholder="全部导航" @change="groupChange" size="8" class="selects">
						<el-option :value="-1">全部导航</el-option>
						<el-option v-for="(item,index) in groupMenu" :key="item.index" :label="item.name" :value="item.id"></el-option>
						<!-- <el-option v-for="(item,index) in groupMenu" :key="item.index" :label="item.name" :value="item.id"><router-link :to="{name:'childList', query:{navId: item.id}}">{{item.name}}</router-link></el-option> -->
					</el-select>
				</li>
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
				<label>添加时间：</label>
                <el-radio-group v-model="radioVal" @change="changeStatus">
                    <el-radio :label="-1">全部</el-radio>
                    <el-radio :label="3">最近三天</el-radio>
                    <el-radio :label="1">本周</el-radio>
                    <el-radio :label="4">本月</el-radio>
                    <el-radio :label="2">自定义</el-radio>
                </el-radio-group>
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
		<div class="content-table">
			<el-table :data="listData" type="card" style="width: 100%" size="mini" class="table-one-line" v-loading="isLoading">
				<el-table-column label="导航名称" width="800">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.name">
							{{scope.row.name}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="子栏目">
					<template slot-scope="scope">
						<div class="one-line">
							{{scope.row.columnNum}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="添加时间">
					<template slot-scope="scope">
						<div class="one-line" v-if="scope.row.createDate">
							{{scope.row.createDate}}
						</div>
						<div class="one-line" v-else>
							—
						</div>
					</template>
				</el-table-column>
				<el-table-column label="显示端">
					<template slot-scope="scope">
						<div class="one-line">
							{{scope.row.viewType==1?'PC':'手机'}}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" size="small" @click="maintain(scope.row.id)">维护</el-button>
							<el-dropdown trigger="click">
                                <el-button type="text" size="small">
						        	<i class="el-icon-arrow-down el-icon--right"></i>
						      	</el-button>
                                <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="maintain(scope.row.id)">维护</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="addNavList(scope.row.id)">添加</el-button>
                                    </el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<pages :total="totalCount" @change="getFilterParam('page')"></pages>
		</div>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import {trim} from '@c/util'
	// 
	export default {
		data(){
			return{
                radioVal:-1,
                totalCount: 0,
                selectVal: '',
                groupMenu: [],
                listData:[],
				// 查询
				search: {
					search_select: '',
					search_value: ''
                },
                filterParam:{
                    navId:'',
                    queryType:0,
                    name:'',
                    startDate:'',
                    endDate:'',
                },
				// 状态按钮
				active:0,
				// 时间按钮
				timer:[
					{label:"全部",name:"allTime"},
					{label:"最近三天",name:"lateLy"},
					{label:"本周",name:"week"},
					{label:"本月",name:"mounth"}
                ],
                customShow: false,
                isLoading: false,
                searchDates:[],// 自定义时间
                multipleSelection: [],
            }
		},
		mounted () {
            this.getAllNav();//获取全部导航
            this.getPageList();//获取分页导航
			this.getFilterParam();
		},
		methods: {
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
            // 获取分页数据
            getPageList(){
                this.$api("navigator.list",this.filterParam).then((result)=>{
                    this.listData=result.list
                    this.totalCount = result.totalCount;
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
            // 查询状态
            changeStatus(val){
                this.filterParam.queryType=val;
                if(val == 2){
                    this.customShow=true;
                    this.filterParam.queryType=0;
                }else{
                    this.customShow=false;
                }
                this.getPageList();
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
					this.selectVal = "全部导航"
                }
				this.filterParam.navId=val;
				if(val != -1){
					this.$router.push({
						path: './childList',
						query: {navId:val}
					})
				}
                
			},
			//维护
			maintain(id){
				this.$router.push({
					path: './childList',
					query: {navId:id}
				})
			},
			//添加
			addNavList(id){
				this.$router.push({
					path: './addNavList',
					query: {
						navId:id,
						flag: 'menuList'
					}
				})
			},
            //关键字查询
			searchTime(val){
				if(!this.searchDates[0]){
					this.$message({ type: 'error', message: '请选择查询起止时间！' });
					return;
				}else{
					this.filterParam.queryType=0;
					this.filterParam.startDate=this.searchDates[0];
					this.filterParam.endDate=this.searchDates[1];
					this.search.search_value="";
					this.filterParam.name="";
					this.getPageList();
				}
			},
            handleSearchClick(){
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
				this.getPageList();
            },
			custom(){
				this.customShow=true;
			},
		},
		components: {
            pageTitle,
            pages
		}
	}
</script>

<style>
	.navigator{
		position: relative;
	}
	.navigator .searchInput{
		position: absolute;
		right: 20px;
		top: 65px;
		z-index: 999;
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
	.navigator .el-date-editor.el-input__inner{
		width: 350px;
	}
</style>