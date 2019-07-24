<template>
    <div>
        <div class="contents editColumn">
            <page-title title="维护图片内容"></page-title>
            <el-header class="header">
                <span>图片内容</span>
            </el-header>
            <el-main>
                <el-col :span="2" style="text-align:right;">内容：</el-col>
                <el-col :span="22" style="position:relative;">
                    <el-col :span="24" class="CR_top">
                        <img :src="ruleForm.bigImgUrl">
                        <el-button @click="openPicsLib('bigImg')" v-show="showBtn">更换图片内容</el-button>
                    </el-col>
                    <el-col :span="24" class="CR_bot" style="background:#f0f0f0;">
                        <el-col :span="23" v-show="iconState" style="text-align:right;"><i @click="setFormStatus" :class="[{'el-icon-arrow-down':formStatus},{'el-icon-arrow-up':!formStatus}]" style="font-size:30px;color:#409EFF;cursor:pointer;"></i></el-col>
                        <el-col :span="4" class="posFn" style="position:relative;text-align:right;padding-left:20px;">
                            <img :src="ruleForm.smallImgUrl" />
                            <div class="positionBox">
                                <div class="position" @click="openPicsLib('smallImg')">更改缩略图</div>
                                <div class="position" @click="resetPics">重置缩略图</div>
                            </div>
                        </el-col>
                        <el-col :span="20" v-show="!formStatus">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-col :span="24">
                                    <el-col :span="11">
                                        <el-form-item label="标题：" prop="title">
                                            <el-input v-model="ruleForm.title" placeholder="请输入内容"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="链接：">
                                            <el-input placeholder="请输入内容" v-model="ruleForm.linkUrl" class="input-with-select">
                                                <el-select v-model="ruleForm.openMode" slot="prepend" placeholder="请选择">
                                                    <el-option label="原窗口" value="SELF"></el-option>
                                                    <el-option label="新窗口" value="BLANK"></el-option>
                                                </el-select>
                                                <!-- <el-button slot="append" icon="el-icon-search"></el-button> -->
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-col>
                                <el-col :span="23">
                                    <el-form-item label="描述：">
                                        <el-input type="textarea" v-model="ruleForm.description" placeholder="请输入内容"></el-input>
                                    </el-form-item>
                                    </el-col>
                                <el-col :span="24">
                                    <el-form-item label="日期：">
                                        <el-date-picker
                                        v-model="ruleForm.beginTime"
                                        type="date"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                        <span>-</span>
                                        <el-date-picker
                                        v-model="ruleForm.endTime"
                                        type="date"
                                        placeholder="选择日期"
                                        :disabled="ruleForm.isNever">
                                        </el-date-picker>
                                        <el-checkbox v-model="ruleForm.isNever" style="margin-left:10px;" @change="checks">长期有效</el-checkbox>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="电脑版状态：">
                                        <el-radio-group v-model="ruleForm.isShow" size="small">
                                            <el-radio-button :label="true">显示</el-radio-button>
                                            <el-radio-button :label="false">隐藏</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="移动版状态：">
                                        <el-radio-group v-model="ruleForm.mobileState" size="small">
                                            <el-radio-button :label="true">显示</el-radio-button>
                                            <el-radio-button :label="false">隐藏</el-radio-button>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-form>
                        </el-col>
                    </el-col>
                </el-col>
                <el-col :span="24" style="text-align:center;margin-top:15px;">
                    <el-col :span="12"><el-button type="primary" @click="submit('ruleForm')">确定</el-button></el-col>
                    <el-col :span="12"><el-button @click="cancel">取消</el-button></el-col>
                </el-col>
            </el-main>
            <picture-prop :appId="appId" :apId="ruleForm.apId" :itemFlag="itemFlag" @sendData="sendData" @closeProps="closePicProp" :visibility.sync="picPropFlag" v-if="picPropFlag"></picture-prop>
        </div>
    </div>
</template>
<script>
    import pageTitle from '@components/pageTitle';//引入标题组件
    import pictureProp from './pictureProp';//引入图片库组件
    import {formatDate} from '@c/util'
    // import formatDate from 
    export default {
        data(){
            return{
                formStatus:false,
                iconState:false,
                ruleForm:{
                    apId:'',
                    id:'',
                    bigImgUrl:'',
                    resUrl:'',
                    smallImgUrl:'',
                    thumbId:'',
                    thumbUrl:'',
                    resId:'',
                    title:'',
                    linkUrl:'',
                    openMode:'SELF',
                    description:'',
                    beginTime:'',
                    endTime:'',
                    isNever:true,
                    isShow:true,
                    mobileState:true,
                },
                rules: {
                    title: [
                        { required: true, message: '请输入标题名称', trigger: 'blur' },
                    ]
                },
                appId:'',
                picPropFlag:false,
                itemFlag:'',
                oldPath:'',
                pathId:'',
                showBtn:true,
                slt:'',
                dtxx:'',
            }
        },
        beforeCreate() {
            this.$options.components.batchAddimgs = () => import('./batchAddimgs')
            this.$options.components.maintainImgs = () => import('./maintainImgs')
            this.$options.components.pictureProp = () => import('./pictureProp')
        },
        mounted () {
            if(this.$route.query.type=='edit'){
                this.getColumnInfo();//获取单条数据
            }else{
                this.getParentsData();
            }
            this.$route.query.columnId?this.pathId=this.$route.query.columnId:this.pathId=this.$route.query.id||localStorage.getItem('id');
            if(this.$route.query.flag=='addItem'){
                this.showBtn=false;
                this.ruleForm.apId=this.$route.query.columnId||this.$route.query.id;
            }
        },
        methods: {
            // 获取栏目信息
            // contentId
            getColumnInfo(){
                this.$api("advert.getColumnInfo",{contentId:this.$route.query.id||''}).then((result)=>{
                    this.dtxx=result;
                    this.ruleForm.apId=result.apId;
                    this.ruleForm.id=result.id;
                    this.ruleForm.bigImgUrl=result.resUrl.indexOf('http'||'https')>-1?result.resUrl:__ce.baseURL+result.resUrl;
                    this.ruleForm.resUrl=result.resUrl;
                    this.oldPath=this.ruleForm.smallImgUrl=result.thumbUrl.indexOf('http'||'https')>-1?result.thumbUrl:__ce.baseURL+result.thumbUrl;
                    this.ruleForm.thumbId=result.thumbId;
                    this.ruleForm.thumbUrl=result.thumbUrl;
                    this.ruleForm.resId=result.resId;
                    this.ruleForm.title=result.title;
                    this.ruleForm.linkUrl=result.linkUrl;
                    this.ruleForm.openMode=result.openMode;
                    this.ruleForm.description=result.description;
                    this.ruleForm.beginTime=result.createDate;
                    this.ruleForm.endTime=!result.isNever?result.endTime:'';
                    this.ruleForm.isNever=result.isNever;
                    this.ruleForm.isShow=result.isShow;
                    this.ruleForm.mobileState=result.mobileState;
                    this.ruleForm.type=result.type;
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取信息失败！'
                        })
                    }
                })
            },
            checks(val){
                this.ruleForm.isNever=val;
                if(val){
                    this.ruleForm.endTime=''
                }
            },
            setFormStatus(){
                this.formStatus=!this.formStatus;
            },
            openPicsLib(type){
                this.itemFlag=type;
                this.appId=5;
                this.picPropFlag=true;
                if(type=='smallImg'){
                    this.posFlag=false;
                }
            },
            closePicProp(){
                this.picPropFlag=false;
            },
            submit(ruleForm){
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        if(this.$route.query.type == 'edit'){
                            let extName=this.dtxx.resUrl.substr(this.dtxx.resUrl.lastIndexOf('.')+1);
                            this.ruleForm.beginTime=formatDate(this.ruleForm.beginTime,'yyyy-MM-dd hh:mm:ss')
                            this.ruleForm.endTime=formatDate(this.ruleForm.endTime,'yyyy-MM-dd hh:mm:ss')
                            this.ruleForm.bigImgUrl=this.dtxx.resUrl;
                            this.ruleForm.resUrl=this.dtxx.resUrl;
                            this.ruleForm.smallImgUrl=this.dtxx.resUrl+'_135x135.'+extName;
                            this.ruleForm.thumbUrl=this.dtxx.thumbUrl;
                            if(this.slt.smallImgs){
                                let extName=this.slt.imgUrl.substr(this.slt.path.lastIndexOf('.')+1);
                                // this.ruleForm.bigImgUrl=this.slt.path;
                                // this.ruleForm.resUrl=this.slt.path;
                                this.ruleForm.smallImgUrl=this.slt.path+'_135x135'+extName;
                                this.ruleForm.thumbUrl=this.slt.imgUrl+'_135x135'+extName;
                            }
                            this.$api("advert.updateAdInfo",{advertContent:this.ruleForm}).then((result)=>{
                                this.$message({
                                    type:'success',
                                    message:'编辑成功'
                                })
                                this.$router.push({
                                    path:'./adColumnList',
                                    query:{id:this.$route.query.parentId}
                                });
                            },(error)=>{
                                this.$message({
                                    type: 'error',
                                    message: '编辑失败！'
                                })
                            })
                        }else{
                            // let extName=this.selectionData.path.substr(this.selectionData.path.lastIndexOf('.')+1);
                            this.ruleForm.beginTime=formatDate(this.ruleForm.beginTime,'yyyy-MM-dd hh:mm:ss');
                            this.ruleForm.endTime=formatDate(this.ruleForm.endTime,'yyyy-MM-dd hh:mm:ss');
                            // this.ruleForm.bigImgUrl=this.selectionData.path;
                            // this.ruleForm.resUrl=this.selectionData.imgUrl;
                            // this.ruleForm.smallImgUrl=this.selectionData.imgUrl+'_135x135.'+extName;
                            // this.ruleForm.thumbUrl=this.selectionData.imgUrl+'_135x135.'+extName;
                            this.$api("advert.addAdInfo",{advertContent:this.ruleForm}).then((result)=>{
                                this.$message({
                                    type:'success',
                                    message:'添加成功'
                                })
                                this.$router.push({
                                    path:'./adColumnList',
                                    query:{id:this.pathId}
                                })
                                this.$emit("cancels");
                            },(error)=>{
                                this.$message({
                                    type: 'error',
                                    message: '添加失败！'
                                })
                            })
                            this.$router.push({
                                path:'./advertList'
                            })
                        }
                    }else{
                        console.log("error")
                    }
                })
            },
            cancel(){
                this.$emit("cancels");
                this.$router.go(-1);
            },
            sendData(childData){//接收子组件传递的数据
                this.slt=childData;
                if(childData){
                    let extName=childData.path.substr(childData.path.lastIndexOf('.')+1);
                    if(childData.smallImgs){
                        this.ruleForm.smallImgUrl=childData.path.indexOf('http'||'https')>-1?childData.path+'_135x135.'+extName:__ce.baseURL+childData.path+'_135x135.'+extName;
                        this.ruleForm.thumbUrl=childData.path.indexOf('http'||'https')>-1?childData.path+'_135x135.'+extName:__ce.baseURL+childData.path+'_135x135.'+extName;
                    }else{
                        this.ruleForm.bigImgUrl=childData.path.indexOf('http'||'https')>-1?childData.path:__ce.baseURL+childData.path;
                        this.ruleForm.resUrl=childData.path.indexOf('http'||'https')>-1?childData.path:__ce.baseURL+childData.path;
                        this.ruleForm.smallImgUrl=childData.path.indexOf('http'||'https')>-1?childData.path+'_135x135.'+extName:__ce.baseURL+childData.path+'_135x135.'+extName;
                        this.ruleForm.thumbUrl=childData.path.indexOf('http'||'https')>-1?childData.path+'_135x135.'+extName:__ce.baseURL+childData.path+'_135x135.'+extName;
                    }
                }
            },
            //获取爷爷组件数据
            getParentsData(){
                console.log(this.selectionData)
                if(this.selectionData){
                    this.iconState=true;
                    let date = new Date();
                    let extName=this.selectionData.path.substr(this.selectionData.path.lastIndexOf('.')+1);
                    // this.ruleForm.apId=this.selectionData[0].id;
                    this.ruleForm.apId=this.apIdss;
                    this.ruleForm.bigImgUrl=this.selectionData.path;
                    this.ruleForm.resUrl=this.selectionData.path;
                    this.ruleForm.smallImgUrl=this.selectionData.path+'_135x135.'+extName;
                    this.ruleForm.thumbUrl=this.selectionData.path+'_135x135.'+extName;
                    this.ruleForm.thumbId=this.selectionData.id;
                    this.ruleForm.resId=this.selectionData.id;
                    this.ruleForm.beginTime=date;
                    this.ruleForm.isNever=true;
                    this.ruleForm.isShow=true;
                    this.ruleForm.mobileState=true;
                }else{
                    console.log(this.selectionData)
                }
            },
            resetPics(){
                this.posFlag=false;
                this.ruleForm.smallImgUrl=this.oldPath;
                this.ruleForm.thumbUrl=this.oldPath;
            }
        },
        components: {
            pageTitle,//注册标题组件
            pictureProp,//注册图片库弹窗组件
        },
        props:['selectionData','apIdss','fileData']
    }
</script>
<style>
    .editColumn .header{
        font-size: 14px;
        height:38px !important;
        line-height:38px;
        border: 1px solid #d1d1d1;
        background: #fafafa;
    }
    .editColumn .m_label{
        float:left;
        padding-left:80px;
    }
    .editColumn .contRight{
        position:relative;
        float:left;
        width:calc(100% - 118px);
    }
    .editColumn .CR_top{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height:360px;
        background:#f0f0f0;
    }
    .editColumn .CR_top img{
        max-height:360px;
        max-width:100%;
        display:inline-block;
    }
    .editColumn .CR_top .el-button{
        position:absolute;
        right:20px;
        top:20px;
    }
    /* CR_bot */
    .CR_bot .labels{
        line-height: 40px;
        text-align: right;
    }
    .CR_bot .el-select .el-input {
        width: 90px;
    }
    .CR_bot .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
    .CR_bot .posFn{
        width: 135px;
        height: 135px;
    }
    .CR_bot .positionBox{
        position: absolute;
        right: -10px;
        top: 10px;
        display: none;
    }
    .CR_bot .posFn:hover .positionBox{
        display: inline-block;
    }
    .CR_bot .position{
        cursor: pointer;
        background: #fff;
        padding: 5px 10px;
        color: #5897ce;
    }
    .CR_bot .position:hover{
        background:#dfe9f6;
    }
</style>
