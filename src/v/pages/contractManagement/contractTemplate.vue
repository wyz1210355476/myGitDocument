<template>
    <div class="contents">
        <page-title :title="'模板管理'"></page-title>
        <div class="content-table ce-content-style">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="合同编号：" prop="agreement_mould_number">
					<el-input v-model="ruleForm.agreement_mould_number" placeholder="请输入合同编号"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="公司名称：" prop="agreement_mould_company">
					<el-input v-model="ruleForm.agreement_mould_company" placeholder="公司名称"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="开户行名称：" prop="agreement_mould_bank">
					<el-input v-model="ruleForm.agreement_mould_bank " placeholder="请输入开户行名称"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="账号：" prop="agreement_mould_account">
					<el-input v-model="ruleForm.agreement_mould_account" placeholder="请输入账号"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="地址：" prop="agreement_mould_address">
					<el-input v-model="ruleForm.agreement_mould_address" placeholder="请输入地址"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="电话：" prop="agreement_mould_tel">
					<el-input v-model="ruleForm.agreement_mould_tel" placeholder="请输入电话"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="上传合同模板：" prop="agreement_mould_url">
					<el-upload
                        class="formInput"
                        :action="url"
                        :show-file-list="true"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :on-change="handleChange"
                        :on-remove="removeFile"
                        :headers="headerOption"
                        :data="dataParams"
                        :file-list="fileList"
                        :with-credentials="true"
                        v-model="ruleForm.agreement_mould_url"
                        accept=".docx"
                        list-type="text">
                        <el-button size="small" type="primary">点击上传</el-button>&nbsp;&nbsp;
                        <span slot="tip" class="el-upload__tip">只能上传docx文件,不能超过5M</span>
                        
                    </el-upload>
                    <div class="hint">
                        注：上传模板前，请自行编辑模板，将公章插入到相应位置，右键图片设置“大小和位置”，
                        并根据实际需求设置公章显示为“衬于文字下方”或显示为“浮于文字上方”。
                    </div>
				</el-form-item>
                <!-- <el-form-item label="公章：" prop="agreement_mould_tel">
					<el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
				</el-form-item> -->
            </el-form>
            <div class="promotion_button">
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import pageTitle from '@components/pageTitle';
export default {
    data () {
        let checkNum = (rule, value, callback) => {
            let reg = /^\d+$/
		        if (!reg.test(value)) {
		          callback(new Error('只能输入数字'));
		        } else {
		          callback();
		        }
        }
        return {
            url:__ce.baseURL+'/pmanager/agreement/upload',
            dataParams:{},
            uploadKey:'',
            fileList: [
                // {
                //     name: '',
                //     url: ''
                // }
            ],
            headerOption: {
            },
            ruleForm:{
                "agreement_mould_id":"",
                "agreement_mould_number":"",
                "agreement_mould_company":"",
                "agreement_mould_bank" :"",
                "agreement_mould_account":"",
                "agreement_mould_address":"",
                "agreement_mould_tel":"",
                "agreement_mould_url":""
            },
            rules:{
                "agreement_mould_number":[
                    { required: true, message: '请输入合同编号', trigger: 'blur' },
                    { max: 20, message: '最长20个字符', trigger: 'blur' },
                ],
                "agreement_mould_company":[
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                    { max: 50, message: '最长50个字符', trigger: 'blur' }
                ],
                "agreement_mould_bank":[
                    { required: true, message: '请输入开户行名称', trigger: 'blur' },
                    { max: 50, message: '最长50个字符', trigger: 'blur' }
                ],
                "agreement_mould_account":[
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { max: 30, message: '最长30个数字', trigger: 'blur' },
                    { validator: checkNum , trigger: 'blur' }
                ],
                "agreement_mould_address":[
                    { required: true, message: '请输入地址', trigger: 'blur' },
                    { max: 100, message: '最长100个数字', trigger: 'blur' },
                ],
                "agreement_mould_tel":[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkNum , trigger: 'blur' },
                    { max: 20, message: '最长20个数字', trigger: 'blur' },
                ],
                "agreement_mould_url":[
                    { required: true, message: '请上传合同模板', trigger: 'blur' }
                ]
            }
            
        }
    },
    mounted() {
        this.getSetInfo();
        if(sessionStorage.getItem('token')){
            this.dataParams.TOKEN=sessionStorage.getItem('token')
        }
    },
    methods: {
        beforeUpload(file){
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message.error('文件大小不能超过 5MB!');
            }
            return isLt5M;
        },
        handleChange(file, fileList) {
            if(!file.response || file.response.status == "101"){
                this.fileList = fileList.slice(-1);
            }else{
                this.fileList = fileList = [];
            }
            
        },
        handleError(err){
            this.$message({
                message: "文件上传失败！",
                type: 'error'
            });
        },
        removeFile(){
            this.ruleForm.agreement_mould_url = '';
        },
        handleSuccess(response, file, fileList){//上传成功的回调
            if(response.status == "101"){
                this.ruleForm.agreement_mould_url = response.data;//将上传文件的路径保存到表单数据对象中
                this.$message({
                    message: "文件上传成功",
                    type: 'success'
                });
            }else{
                this.ruleForm.agreement_mould_url = "";
                this.$message({
                    message: response.msg,
                    type: 'error'
                });
            }
            
        },
        
        getSetInfo(){
            this.$api("contractManagement.getSetInfo",{}).then((result) => {
                this.ruleForm = result;
                this.fileList = [
                    {
                        name: '',
                        url: ''
                    }
                ]
            },(error) => {
                if(error.data.status == 102){
                   
                }else{
                    this.$message({ message: '获取配置出错', type: 'error' });
                }
                
            })
        },
        save(){
            console.log()
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let url;
                    let data = {
                        "agreement_mould_number":this.ruleForm.agreement_mould_number,
                        "agreement_mould_company":this.ruleForm.agreement_mould_company,
                        "agreement_mould_bank" :this.ruleForm.agreement_mould_bank,
                        "agreement_mould_account":this.ruleForm.agreement_mould_account,
                        "agreement_mould_address":this.ruleForm.agreement_mould_address,
                        "agreement_mould_tel":this.ruleForm.agreement_mould_tel,
                        "agreement_mould_url":this.ruleForm.agreement_mould_url
                    }
                    if(this.ruleForm.agreement_mould_id == ""){//新增
                        url = "contractManagement.addTemplate";
                    }else{//编辑
                        url = "contractManagement.editTemplate";
                        // data.agreement_mould_id = this.ruleForm.agreement_mould_id;
                    }
                    this.$api(url,data).then((result) => {
                        this.$message({ message: '保存配置成功', type: 'success' });
                    },(error) => {
                        this.$message({ message: '保存配置出错', type: 'error' });
                    })
                }
            })
        }
    },
    components:{
        pageTitle,
    }
}
</script>
<style>
    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
<style scoped>
    .hint{
        color: #F56C6C;
        line-height: 20px;
    }
</style>

