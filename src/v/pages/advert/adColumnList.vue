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
                <label>电脑版：</label>
                <el-radio-group @change="changePcStatus" v-model="modelPcVal">
                    <!-- <el-radio size="mini" type="text" v-for="(item,index) in pcStatus" :key="index" :label="item.name">{{item.label}}</el-radio> -->
                    <el-radio size="mini" type="text" :label="-1">全部</el-radio>
                    <el-radio size="mini" type="text" :label="1">显示</el-radio>
                    <el-radio size="mini" type="text" :label="0">隐藏</el-radio>
                </el-radio-group>
                <label style="margin-left:30px;">移动版：</label>
                <el-radio-group @change="changeMobileStatus" v-model="modelMobileVal" style="margin-right:30px;">
                    <!-- <el-radio size="mini" type="text" v-for="(item,index) in mobileStatus" :key="index" :label="item.name">{{item.label}}</el-radio> -->
                    <el-radio size="mini" type="text" :label="-1">全部</el-radio>
                    <el-radio size="mini" type="text" :label="1">显示</el-radio>
                    <el-radio size="mini" type="text" :label="0">隐藏</el-radio>
                </el-radio-group>
            </span>
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
        <div class="uploadBtns" style="margin-top:10px;">
            <el-dropdown split-button type="primary" @command="uploadImgs" size="small" @click="handleClick">
                添加图片
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='local'>
                        <el-upload
                        class="upload-demo"
                        ref="upload"
                        :action="uploadUrl"
                        :file-list="fileList"
                        :on-success="uploadSuccess"
                        :auto-upload="true"
                        :show-file-list='false'
                        list-type="picture">
                            从本地添加图片
                        </el-upload>
                    </el-dropdown-item>
                    <el-dropdown-item command='lib'>选择图片库图片</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="content-table">
            <!-- 分类广告table表格 -->
            <el-table ref="classifyTable" :data="tableData" @selection-change="handleSelectionChange" type="card" style="width: 100%" size="mini" class="table-one-line" v-loading="isLoading" @sort-change="adColumnSort">
                <!-- 复选框 -->
                <el-table-column
                type="selection"
                width="55"
                >
                </el-table-column>
                <!-- 类型 -->
                <el-table-column
                label="类型"
                sortable
                prop="type">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.resUrl">
							<!-- <img src="../../common/images/img-del.png" /> -->
							<img :src="scope.row.resUrl" alt="" width="20" height="20" style="display: inline-block;">
						</div>
					</template>
				</el-table-column>
                <!-- 图片内容名称 -->
                <el-table-column
                label="图片内容名称"
                sortable
                prop="title">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.name">
                            {{scope.row.title}}
						</div>
					</template>
				</el-table-column>
                <!-- 开始时间 -->
                <el-table-column
                label="开始时间"
                sortable
                prop="beginTime">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.beginTime">
                            {{scope.row.beginTime}}
						</div>
					</template>
				</el-table-column>
                <!-- 结束时间 -->
                <el-table-column
                label="结束时间"
                sortable
                prop="endTime">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.endTime">
                            {{scope.row.endTime}}
						</div>
					</template>
				</el-table-column>
                <!-- 电脑板 -->
                <el-table-column
                label="电脑板"
                sortable
                prop="isShow">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.isShow">
                            {{scope.row.isShow?'显示':'隐藏'}}
						</div>
					</template>
				</el-table-column>
                <!-- 移动版 -->
                <el-table-column
                label="移动版"
                sortable
                prop="isMobileShow">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.mobileState">
                            {{scope.row.mobileState?'显示':'隐藏'}}
						</div>
					</template>
				</el-table-column>
                <!-- 移动版 -->
                <el-table-column label="排序">
					<template slot-scope="scope">
						<div class="one-line">
							<span>
								<i style="cursor:pointer;" class="sorts el-icon-sort-up" type="text" size="small" @click="sortUp('up',scope.row)"></i>
								<i style="cursor:pointer;" class="sorts el-icon-sort-down" type="text" size="small" @click="sortDown('down',scope.row)"></i>
							</span>
						</div>
					</template>
				</el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作">
                    <!-- 下拉操作 -->
					<template slot-scope="scope">
						<div class="table-operation">
							<el-button type="text" size="small" @click="eidtColumn(scope.row.apId,scope.row.id)">编辑</el-button>
							<el-dropdown trigger="click">
                                <el-button type="text" size="small">
						        	<i class="el-icon-arrow-down el-icon--right"></i>
						      	</el-button>
                                <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="switchDeviceStatus('pc',scope.row.id,scope.row.isShow)">{{scope.row.isShow?'隐藏电脑板':'显示电脑板'}}</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="switchDeviceStatus('mobile',scope.row.id,scope.row.mobileState)">{{scope.row.mobileState?'隐藏移动版':'显示移动版'}}</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" size="small" @click="delItem(scope.row.id,flag='one')">删除</el-button>
                                    </el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</template>
				</el-table-column>
            </el-table>
            <!-- 栏目分页组件 -->
			<pages :total="totalCount" @change="getReqParams('batch')">
                <!-- 批量操作 -->
                <div slot="leftop">
					<el-checkbox @change="selectAll" size="small" >全选</el-checkbox>
					<span class="op_project">
                        <el-button type="text" size="small" :disabled="tabChecked.length == 0">显示电脑版</el-button>
                        <el-dropdown trigger="click">
                            <el-button type="text" size="small">
                                <i class="el-icon-arrow-down el-icon--right" v-show="tabChecked.length>0" style="margin-left:0;"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                <el-dropdown-item>
                                    <el-button type="text" size="small" @click="switchDeviceStatus('pcMoreShow')">显示电脑版</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button type="text" size="small" @click="switchDeviceStatus('pcMoreHide')">隐藏电脑版</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
					<span class="op_project">
                        <el-button type="text" size="small" :disabled="tabChecked.length == 0">显示移动版</el-button>
                        <el-dropdown trigger="click">
                            <el-button type="text" size="small">
                                <i class="el-icon-arrow-down el-icon--right" v-show="tabChecked.length>0" style="margin-left:0;"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                <el-dropdown-item>
                                    <el-button type="text" size="small" @click="switchDeviceStatus('mobileMoreShow')">显示移动版</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button type="text" size="small" @click="switchDeviceStatus('mobileMoreHide')">隐藏移动版</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
					<span class="op_project"><el-button type="text" size="small" :disabled="tabChecked.length == 0" @click="delItem">删除</el-button></span>
				</div>
            </pages>
        </div>
        <picture-prop :appId="appId" :apId="apId" @closeProps="closePicsProps" @getADPage="getADColumnPage" :visibility.sync="picPropFlag" v-if="picPropFlag"></picture-prop>
        <batch-addimgs :fileList="fileList" @closeBacthProps="closeBacthProps" :visibility.sync="bacthFlag" v-if="bacthFlag"></batch-addimgs>
    </div>
</template>
<script>
    import pageTitle from '@components/pageTitle';//引入标题组件
    import pages from '@components/pages';//引入分页组件
    import pictureProp from './pictureProp'//上传图片弹窗
    import batchAddimgs from './batchAddimgs'//添加图片弹窗

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
                    state:-1,//pc状态查询条件
                    mobileState:-1,//移动端状态查询条件
                    wd:'',//关键词搜索
				},
                adItem:'',// 获取单条广告信息
                isLoading:false,// 广告数据loading
                totalCount:0,// 数据条数
                changeFlag:true,//不同分类下显示不同操作项
                tabChecked:[],//存储复选框选中项
                //筛选数据
                modelVal:0,//时间单选按钮组监听值
                modelPcVal:-1,//PC单选按钮组监听值
                modelMobileVal:-1,//移动单选按钮组监听值
                customShow:false,//自定义时间显示隐藏变量
				searchDates:[],// 自定义时间
                search:{// 查询默认值
                    search_select: '',
					search_value: ''
                },
                searchPid:'',//搜索时传分类id
                editPropFlag:false,//编辑弹窗临时变量
                ADId:'',//编辑广告位时获取当前项ID
                restaurants:[],//搜索数据
                timeout:null,//搜索时间
                appId:'',
                apId:'',
                picPropFlag:false,
                uploadUrl:__ce.baseURL+'/manager/ceshopimgrepository/img/upload',
                fileList:[],
                bacthFlag:false,
                dialog:false,
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
            this.getADColumnPage();
            if(this.$route.query.id){
                this.chngeADIds(this.$route.query.id);
                localStorage.setItem("id",this.$route.query.id);
            }
        },
        methods: {
            adColumnSort(column, prop, order){//点击表头排序
                if(column.prop){
                    switch(column.prop){
                        case 'type':
                            this.reqParam.orderColumn='type'
                            break;
                        case 'title':
                            this.reqParam.orderColumn='title'
                            break;
                        case 'beginTime':
                            this.reqParam.orderColumn='beginTime'
                            break;
                        case 'endTime':
                            this.reqParam.orderColumn='endTime'
                            break;
                        case 'isShow':
                            this.reqParam.orderColumn='isShow'
                            break;
                        case 'isMobileShow':
                            this.reqParam.orderColumn='isMobileShow'
                            break;
                    }
                    this.sortFlag?this.reqParam.orderType='DESC':this.reqParam.orderType='ASC';
                    this.sortFlag=!this.sortFlag;
                }else{
                    this.reqParam.orderColumn=''
                    this.reqParam.orderType=''
                }
                this.getADColumnPage();
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
            getADColumnPage(){// 获取全部广告栏目内容分页数据
                //请求参数示例：queryType=1&page=1&pageSize=11
                this.reqParam.pid=this.$route.query.id;
                this.isLoading=true;// 请求数据前启用loading加载
                this.$api("advert.getAdColumnPage",this.reqParam).then((result)=>{
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
            handleClick() {//左上角先择本地上传或图片库上传
                alert('button click');
            },
            uploadImgs(val){
                if(val=='local'){//上传本地图片
                    if(this.dialog){
                        this.bacthFlag=true;
                    }
                }else{//上传图片库图片
                    this.addPicLibInfo();
                }
            },
            uploadSuccess(response, file, fileList){
                if (response.status != 101) {
		    		this.$message({
                        type: 'error',
                        message: '上传失败！'
                    });
                    return;
		    	}
		    	let img = response.data;
                fileList = [file];
                this.fileList.push(img);
                this.dialog=true;
            },
            //排序
            sortUp(type,data){
                let params={};
                let targetItemIndex = this.tableData.findIndex((value, index, arr)=>{
                    return value.id == data.id
                })
                let targetItem = this.tableData.find((value, index, arr)=>{
                    return index == targetItemIndex-1
                })
                if(!targetItem){
                    this.$message({
                        type:'error',
                        message: '不能再靠前了！'
                    })
                    return false
                }else{
                    params.ids=data.id;
                    params.targetId=targetItem.id
                    params.minOrder=data.showOrder
                    params.maxOrder=targetItem.showOrder
                    params.direction=-1
                }
                this.$api("advert.sort",params).then((result)=>{
                    console.log(result);
                    this.getADColumnPage();
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({
                            type:'error',
                            message:error.data.msg
                        })
                    }
                })
            },
            sortDown(type,data){
                let params={};
                let targetItemIndex = this.tableData.findIndex((value, index, arr)=>{
                    return value.id == data.id
                })
                let targetItem = this.tableData.find((value, index, arr)=>{
                    return index == targetItemIndex+1
                })
                if(!targetItem){
                    this.$message({
                        type:'error',
                        message: '不能再向后了！'
                    })
                    return false;
                }else{
                    params.ids=data.id;
                    params.targetId=targetItem.id
                    params.minOrder=targetItem.showOrder
                    params.maxOrder=data.showOrder
                    params.direction=0
                }
                this.$api("advert.sort",params).then((result)=>{
                    console.log(result);
                    this.getADColumnPage();
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({
                            type:'error',
                            message:error.data.msg
                        })
                    }
                })
            },
            //打开图片库弹窗
            addPicLibInfo(){
                this.appId=5;
                this.apId=this.$route.query.id;
                this.picPropFlag=true;
            },
            closePicsProps(){//关闭图片库组件弹窗
                this.picPropFlag=false;
            },
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
            changePcStatus(val){//电脑版
                this.reqParam.state=val;
                this.getADColumnPage();
            },
            changeMobileStatus(val){//移动版
                this.reqParam.mobileState=val;
                this.getADColumnPage();
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
                    this.getADColumnPage();
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
					this.getADColumnPage();
				}
			},
            handleSearchClick(){// 查询
                this.reqParam.wd = this.search.search_value;
                this.reqParam.queryType=1;
                this.getADColumnPage();
            },
            getReqParams(type){// 请求参数函数
                this.reqParam.queryType=this.selectVal;
                this.reqParam.page = this.$route.query.currentPage ? Number(this.$route.query.currentPage) : 1;//当前页数
                this.reqParam.pageSize = this.$route.query.pageSize ? Number(this.$route.query.pageSize) : 10;//当前条数
                this.getADColumnPage();// 请求数据方法
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
                        query:{id:adsId,flag:'addItem'}
                    })
                }
                this.search.search_value='';//切换分类同时置空搜索框
                this.modelVal=0;//时间搜索条件复原
                this.modelPcVal=-1;//pc搜索条件复原
                this.modelMobileVal=-1;//移动搜索条件复原
                this.customShow=false;//自定义时间隐藏
                this.reqParam.pid=adsId;
                this.getADColumnPage();// 栏目内容列表
                this.searchAdvert(adsId);//搜索数据
                if(this.reqParam.pid == undefined){
                    this.reqParam.pid = 0
                }
            },
            handleSelectionChange(val){// 表格复选框操作
                this.tabChecked=val;//将选中项赋值给tabChecked数组
            },
            //栏目内容表格选中事件
            selectAll(val){//选择要操作项
				if(val && this.tableData.length > 0){
					this.tableData.forEach(row => {
			            this.$refs.classifyTable.toggleRowSelection(row);
			        });
				}else{
					this.$refs.classifyTable.clearSelection();
				}
            },
            //维护全部广告列表
            delItem(id,flag){//批量删除和单条删除
                if(arguments.length<=1){//判断如果参数不存在，为批量删除
                    //批量删除时，遍历每一个选中项并将选中项id存到上面的selectionItem数组变量中
                    let selectionItem=[];// 删除多项id数组
                    this.tabChecked.forEach(element => {// 存放选中项id
                        selectionItem.push(element.id);
                    });
                    this.$confirm('您是否要删除选中项?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$api("advert.delColumn",{id:selectionItem.join(",")}).then((result)=>{// 调用删除接口
                            this.$message({
                                type:'success',
                                message: '批量删除成功！'
                            })
                            this.getADColumnPage();
                        },(error)=>{
                            this.$message({
                                type:'error',
                                message: '批量删除出错！'
                            })
                        })
                    }).catch(()=>{})
                }else{
                    this.$confirm('您是否要删除该项目?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$api("advert.delColumn",{id:id}).then((result)=>{// 调用删除接口
                            this.$message({
                                type:'success',
                                message: '删除成功！'
                            })
                            this.getADColumnPage();
                        },(error)=>{
                            this.$message({
                                type:'error',
                                message: '删除出错！'
                            })
                        })
                    }).catch(()=>{})
                }
            },
            switchDeviceStatus(type,id,flag){//批量和单条设置终端状态
                let deviceVals=[];
                if(type==undefined || id==undefined){
                    this.tabChecked.forEach(element => {// 存放选中项id
                        deviceVals.push(element.id);
                    });
                    let params={};
                    if(type=='pcMoreShow'){
                        params.type=1;
                        params.state=true;
                    }else if(type=='pcMoreHide'){
                        params.type=1;
                        params.state=false;
                    }
                    if(type=='mobileMoreShow'){
                        params.type=2;
                        params.state=true;
                    }else if(type=='mobileMoreHide'){
                        params.type=2;
                        params.state=false;
                    }
                    params.id=deviceVals.join(",");
                    this.$confirm('您是否要设置选中项?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$api("advert.updateState",params).then((result)=>{// 调用删除接口
                            this.$message({
                                type:'success',
                                message: '设置成功！'
                            })
                            this.getADColumnPage();
                        },(error)=>{
                            this.$message({
                                type:'error',
                                message: '设置失败！'
                            })
                        })
                    }).catch(()=>{})
                }else{
                    let params={};
                    if(type=='pc' && flag){//pc
                        params.type=1;
                        params.state=false;
                    }else if(type=='mobile' && flag){//移动
                        params.type=2;
                        params.state=false;
                    }else if(type=='pc' && !flag){//pc
                        params.type=1;
                        params.state=true;
                    }else if(type=='mobile' && !flag){//pc
                        params.type=2;
                        params.state=true;
                    }
                    params.id=id;
                    this.$confirm('您是否要设置该项目?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        this.$api("advert.updateState",params).then((result)=>{// 调用删除接口
                            this.$message({
                                type:'success',
                                message: '设置成功！'
                            })
                            this.getADColumnPage();
                        },(error)=>{
                            this.$message({
                                type:'error',
                                message: '设置失败！'
                            })
                        })
                    }).catch(()=>{})
                }
            },
            eidtColumn(apId,id){//编辑栏目内容
                this.$router.push({
                    path: './editColumn',
                    query:{
                        parentId:apId,
                        id:id,
                        type:'edit'
                    }
                })
            },
            closeBacthProps(){//关闭内层弹窗
                this.bacthFlag=false;
            },
        },
        components: {
            pageTitle,//注册标题组件
            pages,//注册分页组件
            pictureProp,//弹窗组件
            batchAddimgs,//添加图片组件
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
    .advertList .sorts{
        display: inline-block;
        margin: 0 12px 0 -8px;
        font-size: 16px;
        color: #409EFF;
    }
</style>
