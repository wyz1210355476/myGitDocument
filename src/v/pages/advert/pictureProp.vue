<template>
    <div>
        <el-dialog
        title="选择图片"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        width="60%"
        :before-close="handleClose"
        class="picsComponent"
        append-to-body>
            <el-col :span="24">
                <el-form>
                    <!-- 选择图片和上传本地图片 -->
                    <el-form-item>
                        <el-col :span="12">
                            图片库：
                            <el-select v-model="source" @change="selectClass">
                                <el-option v-for="(item,index) in sourceData" :key="index" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                            <!-- 
                            :on-preview="handlePreview"
                            :on-remove="handleRemove" 
                            :file-list="fileList"
                            -->
                            <el-upload
                            class="upload-demo"
                            ref="upload"
                            :action="uploadUrl"
                            :auto-upload="true"
                            :on-success="handleSuccess"
                            :file-list="picListData">
                                <el-button slot="trigger" size="small" type="primary"><i class="el-icon-upload2"></i>本地上传</el-button>
                            </el-upload>
                        </el-col>
                    </el-form-item>
                    <!-- 筛选 -->
                    <el-form-item>
                        <el-col :span="12">
                            上传时间：
                            <el-radio-group v-model="times" @change="changeTimer">
                                <el-radio v-for="(item,index) in searchArr" :key="index" :label="index">{{item.label}}</el-radio>
                            </el-radio-group>
                        </el-col>
                        <el-col :span="12" style="text-align:right;">
                            <!-- 搜索 -->
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
                        </el-col>
                    </el-form-item>
                </el-form>
                <div class="popContent">
				    <div class="nodata" v-if="picListData.length == 0">暂无数据</div>
                    <div v-if="picListData.length != 0">
                        <div class="imgList libImgList">
                            <span v-for="(item, index) in picListData" :key="index" @click="handleLibImgClick(index)">
                                <img :src="item.imgUrl" :title="item.name">
                                <label class="label-img-check" v-show="item.checked"><i class="el-icon-check"></i></label>
                                <label class="viewBtn" v-show="itemHide" @click="viewPics(item)">预览</label>
                            </span>
                        </div>
                        <div class="floatL" v-show="multiple">
                            <el-checkbox @change="selectAll" size="small">全选</el-checkbox>
                        </div>
                        <el-pagination
                            class="floatR"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-size="15"
                            layout="total, prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" v-show="isB" @click="submit">确 定</el-button> -->
                <el-button type="primary" :disabled="selection.length<=0" @click="submit">确 定</el-button>
                <el-button @click="cancal">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 预览 -->
        <views-pics :rowInfo="viewRowInfo" @hiddenProps="hiddenProps" :visibility.sync="viewPicsDialog" v-if="viewPicsDialog"></views-pics>
        <batch-addimgs :apIds="apIds" :selection="selection" @closeBacthProps="closeBacthProps" @cancel="cancal" :visibility.sync="bacthFlag" v-if="bacthFlag"></batch-addimgs>
    </div>
</template>
<script>
    import pages from '@components/pages';//引入分页组件
    import viewsPics from '@v/pages/pictureLib/viewPics'//预览
    import batchAddimgs from './batchAddimgs'//预览
    export default {
        data(){
            return{
                dialogVisible: true,
                viewPicsDialog:false,
                multiple:false,
                total:0,
                source:'',
                sourceData:[],
                uploadUrl:__ce.baseURL+'/manager/ceshopimgrepository/img/upload',
                searchArr:[
                    {label:"全部",name:"allTime"},
					{label:"最近三天",name:"lateLy"},
					{label:"本周",name:"week"},
					{label:"本月",name:"mounth"}
                ],
                times:0,
                search:{// 查询默认值
                    search_select: '',
					search_value: ''
                },
                restaurants:[],//搜索数据
                timeout:null,//搜索时间
                picListData:[],
                selection:[],
                propParam: {// 数据请求参数
                    appId:'',
                    page:1,//当前页数
                    pageSize:10,//当前条数
                    startDate:'',//开始时间
                    endDate:'',//结束时间
                    status:-1,//pc状态查询条件
                    mobileStatus:-1,//移动端状态查询条件
                    wd:'',//关键词搜索
				},
                totalCount:0,// 数据条数
                viewRowInfo:{},
                localImgList:[],
                itemHide:false,
                isB:false,
                infos:{},
                innerVisible:false,
                bacthFlag:false,
                apIds:'',
                queryType:'',
            }
        },
        beforeCreate() {
            this.$options.components.batchAddimgs = () => import('./batchAddimgs')
            this.$options.components.maintainImgs = () => import('./maintainImgs')
            this.$options.components.pictureProp = () => import('./pictureProp')
        },
        mounted () {
            this.getAllClass();//获取所有分类数据
            this.selectClass(this.appId);
            this.source=this.appId;
            this.itemFlag=='bigImg'||this.itemFlag=='smallImg'?this.itemHide=false:this.itemHide=true;
            // if(this.itemFlag=='bigImg'||this.itemFlag=='smallImg'){
            //     this.isB=true;
            // }
            if(this.itemFlag=='smallImg'){
                this.multiple=false;
            }
            this.apIds=this.apId;
            this.$route.query.type?this.queryType=this.$route.query.type:this.queryType='';
        },
        methods: {
            //栏目内容表格选中事件
            getReqParams(){// 请求参数函数
                this.propParam.page = this.$route.query.currentPage ? Number(this.$route.query.currentPage) : 1;//当前页数
                this.propParam.pageSize = this.$route.query.pageSize ? Number(this.$route.query.pageSize) : 10;//当前条数
                this.getPicList();// 请求数据方法
            },
            getAllClass(){//获取所有分类数据
                this.$api("pictureLib.appList",{}).then((result)=>{
                    this.sourceData=result.list;
                    this.sourceData.unshift({name:"全部图片",id:'-1'})
                },(error)=>{
                    this.$message({
                        type:'error',
                        message:'获取分类失败！'
                    })
                })
            },
            getPicList(page=1){//获取对应分类数据
                this.propParam.appId>0?this.propParam.appId=this.propParam.appId:this.propParam.appId=-1;
                this.propParam.wd=this.search.search_value;
                this.propParam.page=page;
                this.propParam.pageSize=14;
                this.$api("pictureLib.getAllPics",this.propParam).then((result)=>{
                    this.picListData=result.list;
                    // this.totalCount=result.page.total;// 将当前页显示条数赋值
                    this.total=result.page.total;// 将当前页显示条数赋值
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                        this.picListData=[];
                        this.total=0;
                    }else{
                        this.$message({
                            type:'error',
                            message:'获取分类失败！'
                        })
                    }
                })
            },
            handleLibImgClick(index){//图片库选中取消
                let checked = this.picListData[index].checked;
		    	if (!this.multiple) {
		    		this.picListData.forEach((v) => {
		    			v.checked = false;
		    		});
                }
                this.picListData[index].checked = checked ? false : true;
                if(!this.multiple){
                    this.selection=this.picListData[index];
                    if(!this.itemHide){//将第一张图片返回给父组件
                        this.infos=this.picListData[index];// this.infos = this.picListData[0];
                    }
                    if(this.itemFlag=='smallImg'){
                        this.infos.smallImgs="small"
                    }
                }else{
                    this.picListData[index].checked = checked ? false : true;
                    this.selection.push(this.picListData[index])
                }
            },
            handleCurrentChange(page){
                this.getPicList(page)
            },
            selectClass(val){//选择分类
                this.propParam.appId=val;
                this.getPicList(val);
            },
            changeTimer(val){//时间选择
                console.log(val)
            },
            handleClose(){//右上角关闭按钮
                this.dialogVisible=false;
                this.$emit("closeProps");
            },
            handleSearchClick(){// 查询
                this.search.search_value;
                this.getPicList(this.appId);
            },
            selectAll(val){//选择要操作项
				this.picListData.forEach((v) => {
                    v.checked = val;
                    if(val){
                        this.selection.push(v);
                    }else{
                        this.selection=[];
                    }
                });
                
            },
            searchAdvert(pid){//搜索广告
                let params={};
                params.name=this.search.search_value;
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
                if(this.search.search_value!=''&&this.source<=0){
                    this.searchAdvert();
                }else{
                    this.restaurants=[];
                }
                if(this.source){
                   this.searchAdvert(this.source); 
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
            //预览
            viewPics(row){
                this.viewPicsDialog=true;
                this.viewRowInfo=row;
            },
			hiddenProps(){
				this.viewPicsDialog = false;
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
					fileList = [file];
		    	}
		    	this.localImgList.push(img);
		    	this.getPicList();
            },
            submit(){
                if(!this.queryType){
                    if(!this.$route.query.id || !this.$route.query.columnId){
                        this.bacthFlag=true;
                    }else{
                        this.dialogVisible=false;
                        this.$emit("closeProps");
                        if(this.itemFlag=='smallImg'){
                            this.infos.smallImgs="small"
                        }
                    }
                }else{
                    this.bacthFlag=false;
                    this.dialogVisible=false;
                    this.$emit("closeProps");
                }
                if(this.multiple){
                    let newArr=[];
                    this.selection.forEach((v)=>{
                        if(v.checked){
                            newArr.push(v)
                        }
                    })
                    this.selection=newArr;
                }
                this.$emit("sendData",this.multiple?this.selection:this.infos);
            },
            cancal(){
                this.dialogVisible=false;
                this.$emit("closeProps");
            },
            closeBacthProps(){//关闭内层弹窗
                this.bacthFlag=false;
            },
        },
        components: {
            pages,
            viewsPics,
            batchAddimgs,
        },
        props: ['appId','itemFlag','apId']
        
    }
</script>
<style>
    .picsComponent{}
    .picsComponent .el-radio__input{
        display: none;
    }
    .picsComponent .el-radio+.el-radio{
        margin-left: 0;
    }
    .propTable .el-table__header-wrapper{display: none;}
    .propTable .el-table__body tbody{
        width: 100%;
    }
    .propTable .el-table__body-wrapper,
    .propTable .el-table__body-wrapper table,
    .propTable .el-table__body-wrapper table tbody{
        display: block;
        float: left;
        width: 100%
    }
    .propTable .el-table__body tbody tr.el-table__row{
        position: relative;
        display: block;
        float: left;
        width: 20%;
        height: 151px;
        text-align: center;
        margin-bottom: 15px;
    }
    .propTable .el-table__body tbody tr.el-table__row:hover{
        background: #fff;
    }
    .propTable .el-table__body tbody tr.el-table__row td{
        float: left;
        width: 100%;
        padding: 0;
        border: 0;
    }
    .advertList .picsComponent .searchInput{
        position: absolute;
        right: 0;
        top: 0;
    }
    .propTable .el-table__body tbody tr.el-table__row td:first-child{
        position: absolute;
        left: 0;
        top: 0;
        width: 10px;
        height: 10px;
        z-index: 9;
        text-align: left;
    }
    .picsComponent .itemHide .el-table__body tbody tr.el-table__row td:first-child{
        display: none;
    }
    .propTable .el-table__body tbody tr.el-table__row td:last-child{
        position: absolute;
        right: 0;
        top: 0;
        width: auto;
        height: auto;
        background: transparent;
        text-align: right;
    }
    .upload-demo ul.el-upload-list{
        display: none;
    }
    .advertList .page{
        margin-bottom: 20px;
    }
    .advertList .dialog-footer{
        display: block;
        text-align: center;
    }
    /* 图片库 */
    .picsComponent .popContent{height: 400px; overflow-y: auto }
    .picsComponent .imgList{
        overflow-y: auto;
        height: 360px;
    }
    .picsComponent .nodata{line-height: 200px; text-align: center; color: #999}
    .picsComponent .imgList span{
        border-radius:6px;
        display: inline-block;
        box-sizing:border-box;
        border:1px solid #ddd;
        float: left;
        width: 100px;
        height: 100px;
        margin:10px 28px;
        overflow: hidden;
        position: relative;
    }
    .picsComponent .imgList span .label-img-check {
        position: absolute;
        right: -17px;
        top: -7px;
        width: 46px;
        height: 26px;
        background: #13ce66;
        text-align: center;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-box-shadow: 0 1px 1px #ccc;
        box-shadow: 0 1px 1px #ccc;
    }
    .picsComponent .imgList span:hover .label-img-check {
        display: none;
    }
    /* .imgList span:nth-child(5n+1){margin-left: 0} */
    .picsComponent .imgList span:nth-child(5n){margin-right: 0}
    .picsComponent .imgList span img{
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
    }
    .picsComponent .popContent .imgList span .label-img-check .el-icon-check {
        color: #fff;
        font-size: 12px;
        margin-top: 12px;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }
    .picsComponent .imgList span .viewBtn{
        display: none;
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid #ccc;
        padding: 0 5px;
        background: #fff;
    }
    .picsComponent .imgList span:hover .viewBtn{
        display: inline-block !important;
    }
</style>

