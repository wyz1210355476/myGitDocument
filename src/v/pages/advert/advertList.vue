<template>
    <div class="contents advertList">
        <page-title title="广告管理"></page-title>
        <div class="tabs">
			<ul>
				<li>
					<el-select v-model="selectVal" placeholder="全部Banner" size="8" class="selects" @change="chngeADIds">
						<el-option :value="-1">全部Banner</el-option>
						<el-option v-for="item in groupMenu" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</li>
			</ul>
		</div>
		<el-autocomplete
		size="small"
		placeholder="请输入内容"
		v-model="search.search_value"
		style="font-size:12px;width:300px"
		class="searchInput"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearchAsync"
        @input="handleSelect">
			<el-button slot="append" size="small" style="font-size:12px" @click="handleSearchClick">查询</el-button>
		</el-autocomplete>
		<div class="changeBtns">
            <span>
                <label>创建时间：</label>
                <el-radio-group @change="changeTimerStatus" v-model="modelVal">
                <!-- <el-radio size="mini" type="text" v-for="(item,index) in timer" :key="index" :label="index">{{item.label}}</el-radio> -->
                    <el-radio size="mini" type="text" :label="0">全部</el-radio>
                    <el-radio size="mini" type="text" :label="3">最近三天</el-radio>
                    <el-radio size="mini" type="text" :label="1">本周</el-radio>
                    <el-radio size="mini" type="text" :label="4">本月</el-radio>
                    <el-radio size="mini" type="text" :label="2">自定义</el-radio>
                </el-radio-group>
                <span class="zdyBox" v-show="customShow">
                    <el-date-picker
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    v-model="searchDates"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <el-button size="mini" type="primary" @click="searchTime">确定</el-button>
                </span>
            </span>
		</div>
        <div class="uploadBts">
        </div>
        <div class="content-table">
            <!-- 全部广告table表格 -->
            <el-table ref="advertTable" v-show="changeFlag" :data="tableData" type="card" style="width: 100%" size="mini" class="table-one-line" v-loading="isLoading" @sort-change="adSort">
                <!-- 缩略图 -->
                <el-table-column label="缩略图">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.coverUrl">
							<!-- <img src="../../common/images/img-del.png" /> -->
							<img :src="scope.row.coverUrl" alt="" width="20" height="20" style="display: inline-block;">
						</div>
					</template>
				</el-table-column>
                <!-- Banner名称 -->
                <el-table-column
                label="Banner名称"
                sortable
                prop="name"
                >
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.name">
                            {{scope.row.name}}
						</div>
					</template>
				</el-table-column>
                <!-- 内容数量 -->
                <el-table-column
                label="内容数量"
                sortable
                prop="count">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.count">
                            {{scope.row.count}}
						</div>
					</template>
				</el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                    <!-- 下拉操作 -->
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" size="small" @click='MaintainAD(scope.row.id)'>维护</el-button>
							<el-dropdown trigger="click">
                                <el-button type="text" size="small">
						        	<i class="el-icon-arrow-down el-icon--right"></i>
						      	</el-button>
                                <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="editAD(scope.row.id)">编辑</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="addPicLibInfo(scope.row.id,flag='addItem')">添加图片内容</el-button>
                                    </el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
            </el-table>
            <!-- 全部广告分页组件 -->
			<pages :total="totalCount" @change="getReqParams('single')"></pages>
        </div>
        <edit-prop :ADId="ADId" @closeProps="closeProps" :visibility.sync="editPropFlag" v-if="editPropFlag"></edit-prop>
        <picture-prop :appId="appId" :apId="apId" @closeProps="closePicsProps" @getADPage="getADPage" :visibility.sync="picPropFlag" v-if="picPropFlag"></picture-prop>
    </div>
</template>
<script>
    import pageTitle from '@components/pageTitle';//引入标题组件
    import pages from '@components/pages';//引入分页组件
    import editProp from './editProp';//引入分页组件
    import pictureProp from './pictureProp';//引入图片库组件

    export default {
        data(){
            return{
                // 全部表格
                groupMenu:[],// 全部广告位列表
                selectVal:'',// 选择全部广告位的值
                tableData:[],// 获取分页广告数据
                reqParam: {// 数据请求参数
                    queryType:-1, //时间查询条件
                    page:1,//当前页数
                    pageSize:10,//当前条数
                    startDate:'',//开始时间
                    endDate:'',//结束时间
                    status:-1,//pc状态查询条件
                    mobileStatus:-1,//移动端状态查询条件
                    wd:'',//关键词搜索
				},
                adItem:'',// 获取单条广告信息
                isLoading:false,// 广告数据loading
                totalCount:0,// 数据条数
                changeFlag:true,//不同分类下显示不同操作项
                tabChecked:[],//存储复选框选中项
                //筛选数据
                modelVal:0,//时间单选按钮组监听值
                modelPcVal:0,//PC单选按钮组监听值
                modelMobileVal:0,//移动单选按钮组监听值
                customShow:false,//自定义时间显示隐藏变量
				searchDates:[],// 自定义时间
                search:{// 查询默认值
                    search_select: '',
					search_value: ''
                },
                searchPid:'',//搜索时传分类id
                editPropFlag:false,//编辑弹窗临时变量
                ADId:'',//编辑广告位时获取当前项ID
                picPropFlag:false,//图片库弹窗组件临时变量
                appId:'',//添加图片库内容时时获取当前项大栏目ID
                apId:'',//添加图片库内容时时获取当前栏目项ID
                restaurants:[],//搜索数据
                timeout:null,//搜索时间
                sortFlag:false,
                // 分类表格

            }
        },
        beforeCreate () {
            this.$options.components.batchAddimgs = () => import('./batchAddimgs')
            this.$options.components.maintainImgs = () => import('./maintainImgs')
            this.$options.components.pictureProp = () => import('./pictureProp')
        },
        mounted () {
            this.getAllAds();//获取全部广告位
            this.getADPage();//获取分页数据
            // this.searchAdvert();//搜索数据
            if(this.$route.query.apid){
                this.chngeADIds(this.$route.query.apid)
            }
        },
        methods: {
            adSort(column, prop, order){//点击表头排序
                if(column.prop){
                    switch(column.prop){
                        case 'name':
                            this.reqParam.orderColumn='name'
                            break;
                        case 'count':
                            this.reqParam.orderColumn='count'
                            break;
                    }
                    this.sortFlag?this.reqParam.orderType='DESC':this.reqParam.orderType='ASC';
                    this.sortFlag=!this.sortFlag;
                }else{
                    this.reqParam.orderColumn=''
                    this.reqParam.orderType=''
                }
                this.getADPage();
            },
            //请求数据函数
            getAllAds(){//获取全部广告位
                this.$api("advert.adsList").then((result)=>{
                    this.groupMenu=result.list;
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({
                            type:'error',
                            message:'加载出错'
                        })
                    }
                })
            },
            getADPage(){// 获取全部广告分页数据
                //请求参数示例：queryType=1&page=1&pageSize=11
                this.isLoading=true;// 请求数据前启用loading加载
                this.$api("advert.getAdvertPage",this.reqParam).then((result)=>{
                    this.tableData=result.list;// 将表格变量赋值
                    this.totalCount=result.totalCount;// 将当前页显示条数赋值
                    this.isLoading=false;// 请求数据后停止loading加载
                },(error)=>{
                    this.totalCount = 0;// 请求错误将总条数设置为0
					this.isLoading = false;// 请求数据错误后停止loading加载
                    if(error&&error.data&&error.data.status==102){
                        this.tableData=[];// 无数据时将表格数据变量置空
                    }else{
                        this.$message({//错误提示
                            type:'error',
                            message:'加载出错'
                        })
                    }
                })
            },
            searchAdvert(pid){//搜索广告
                let params={};
                params.name=this.search.search_value || '新';
                if(pid>0){
                    params.pid=pid;
                }else{
                    params.pid=0;
                }
                this.restaurants=[];
                this.$api("advert.search",params).then((result)=>{
                    for(let i=0;i<result.length;i++){
                        let data={};
                        data.value=result[i];
                        this.restaurants.push(data);
                    }
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({
                            type:'error',
                            message:'搜索失败'
                        })
                    }
                })
            },
            // 实现方法
            handleSelect(item){//搜索广告位
                if(this.search.search_value!=''&&this.selectVal<=0){
                    this.searchAdvert();
                }else{
                    this.restaurants=[];
                }
                if(this.selectVal){
                   this.searchAdvert(this.selectVal); 
                }
            },
            querySearchAsync(queryString, cb) {//返回输入建议方法
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                clearTimeout(this.timeout);
                // this.timeout = setTimeout(() => {
                    cb(results);
                // }, 3000 * Math.random());
            },
            createStateFilter(queryString) {//大小写
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            changeStatus(val){//查询状态选择
				this.getADPage();
            },
            changeTimerStatus(val){//选择时间状态
                this.reqParam.queryType=val;
                if(val==0){
                    this.reqParam.queryType=-1;
                }
                if(val==2){
                    this.customShow=true;
                }else{
                    this.customShow=false;
                    this.getADPage();
                }
            },
			searchTime(){// 自定义时间查询
				if(!this.searchDates[0]){
					this.$message({ type: 'error', message: '请选择查询起止时间！' });
					return;
				}else{
					this.reqParam.queryType=4;
					this.reqParam.startDate=this.searchDates[0];
					this.reqParam.endDate=this.searchDates[1];
					this.search.search_value="";
					this.reqParam.name="";
					this.getADPage();
				}
			},
            handleSearchClick(){// 查询
                this.reqParam.wd = this.search.search_value;
                this.reqParam.queryType=1;
                this.getADPage();
            },
            getReqParams(type){// 请求参数函数
                this.reqParam.queryType=this.selectVal || -1;
                this.reqParam.page = this.$route.query.currentPages ? Number(this.$route.query.currentPages) : 1;//当前页数
                this.reqParam.pageSize = this.$route.query.pagesSize ? Number(this.$route.query.pagesSize) : 10;//当前条数
                this.getADPage();// 请求数据方法
            },
            chngeADIds(adsId){//选择广告来源函数
                this.selectVal = Number(adsId);//选择分类获取id并赋值给selectVal
                //判断选择的是哪种分类，根据分类的不同显示不同的操作项
                if(adsId<0){
                    this.changeFlag=true
                    this.$router.push({
                        path:'./advertList',
                        query:{}
                    })
                }else{
                    this.changeFlag=false;
                    this.$router.push({
                        path:'./adColumnList',
                        query:{id:adsId}
                    })
                }
                this.search.search_value='';//切换分类同时置空搜索框
                this.modelVal=0;//时间搜索条件复原
                this.modelPcVal=0;//pc搜索条件复原
                this.modelMobileVal=0;//移动搜索条件复原
                this.customShow=false;//自定义时间隐藏
                this.selectVal = '全部Banner';
                this.reqParam.pid=0;
                this.getADPage();//全部广告列表
                this.searchAdvert();//搜索数据
            },
            //维护全部广告列表
            MaintainAD(pid){
                this.reqParam.pid=pid;
                this.selectVal=pid;//选择分类获取id并赋值给selectVal
                this.changeFlag=false;
                this.search.search_value='';
                this.restaurants=[];
                this.$router.push({
                    path:'./adColumnList',
                    query:{id:pid}
                })
            },
            // 编辑
            editAD(id){
                this.editPropFlag=true;
                this.ADId=id;
            },
            //关闭编辑弹窗
            closeProps(){
                this.editPropFlag=false;
                this.getADPage();
            },
            //打开图片库弹窗
            addPicLibInfo(columnId,flag){
                this.appId=5;
                this.apId=columnId;
                this.picPropFlag=true;
                this.$router.push({
                    path:'./advertList',
                    query:{
                        columnId:columnId,
                        flag:flag
                    }
                })
            },
            closePicsProps(){//关闭图片库组件弹窗
                this.picPropFlag=false;
            },
        },
        components: {
            pageTitle,//注册标题组件
            pages,//注册分页组件
            editProp,//注册弹窗组件
            pictureProp,//注册图片库组件
        }
    }
</script>
<style>
    .advertList{
        position: relative;
    }
    .advertList .el-radio+.el-radio{
        margin-left: 0;
    }
    .advertList .tabs{
		height: 40px;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
	}
	.advertList .tabs ul,
	.advertList .tabs li{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.advertList .tabs li{
		float: left;
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
	.advertList .tabs li:nth-of-type(1){
		padding: 0;
		border-top-left-radius: 4px;
	}
    .advertList .el-radio__input{
        display: none;
    }
    .changeBtns{
        height: 40px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
    }
	.selects .el-input__inner{
        width: 130px;
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
	.advertList .searchInput{
		position: absolute;
		right: 20px;
		top: 65px;
	}
</style>
