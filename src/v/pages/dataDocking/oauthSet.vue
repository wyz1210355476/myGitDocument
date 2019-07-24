<template>
    <div class="contents">
        <page-title :title="'oauth设置'"></page-title>
        <div class="content-table ce-content-style">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <div class="title">认证相关</div>
                <el-form-item label="client_id：" prop="clientId">
					<el-input v-model="ruleForm.clientId" placeholder="请输入client_id"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="client_secre：" prop="clientsecre">
					<el-input v-model="ruleForm.clientsecre" placeholder="请输入client_secre"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="redirect_uri：" prop="redirectUri">
					<el-input v-model="ruleForm.redirectUri " placeholder="请输入OAuth2.0回调URL"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="auth token：" prop="oauthToken">
					<el-input v-model="ruleForm.oauthToken" placeholder="请输入OAuth2.0认证URL"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="Authorization Code：" prop="authorizationCode">
					<el-input v-model="ruleForm.authorizationCode" placeholder="请输入Authorization Code"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="退出OAuth地址：" prop="exitOAuthUrl">
					<el-input v-model="ruleForm.exitOAuthUrl" placeholder="请输入退出OAuth地址"  class="formInput" size="small"></el-input>
				</el-form-item>
                <div class="title">信息获取</div>
                <el-form-item label="获取采购人用户信息：" prop="buyerInfoSourceUrl">
					<el-input v-model="ruleForm.buyerInfoSourceUrl" placeholder="请输入获取采购人用户信息的URL"  class="formInput" size="small"></el-input>
				</el-form-item>
                <el-form-item label="获取采购人单位信息：" prop="buyerOrganizationInfoSourceUrl">
					<el-input v-model="ruleForm.buyerOrganizationInfoSourceUrl" placeholder="请输入获取采购人单位信息的URL"  class="formInput" size="small"></el-input>
				</el-form-item>
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
        let checkUrl = (rule, value, callback) => {
            // debugger
            let reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
		        if (!reg.test(value)) {
		          callback(new Error('url格式不正确'));
		        } else {
		          callback();
		        }
        }
        return {
            ruleForm:{
                "clientId":"",
                "clientsecre":"",
                "redirectUri" :"",
                "oauthToken":"",
                "authorizationCode":"",
                "exitOAuthUrl":"",
                buyerInfoSourceUrl:"",
                buyerOrganizationInfoSourceUrl:""
            },
            rules:{
                "clientId":[
                    { required: true, message: '请输入client_id', trigger: 'blur' },
                    { max: 255, message: '最长255个字符', trigger: 'blur' },
                ],
                "clientsecre":[
                    { required: true, message: '请输入client_secre', trigger: 'blur' },
                    { max: 255, message: '最长255个字符', trigger: 'blur' }
                ],
                "redirectUri":[
                    { required: true, message: '请输入redirect_uri', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ],
                "oauthToken":[
                    { required: true, message: '请输入auth_token', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ],
                "authorizationCode":[
                    { required: true, message: '请输入Authorization_Code', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ],
                "exitOAuthUrl":[
                    { required: true, message: '请输入OAuth_address', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ],
                "buyerInfoSourceUrl":[
                    { required: true, message: '请输入useInfo', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ],
                "buyerOrganizationInfoSourceUrl":[
                    { required: true, message: '请输入companyInfo', trigger: 'blur' },
                    { validator: checkUrl , trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.getSetInfo();
    },
    methods: {
        getSetInfo(){
            this.$api("dataDocking.getSetInfo",{}).then((result) => {
                this.ruleForm = {
                    "clientId":result.dataSynOauth.clientId,
                    "clientsecre":result.dataSynOauth.clientsecre,
                    "redirectUri" :result.dataSynOauth.redirectUri,
                    "oauthToken":result.dataSynOauth.oauthToken,
                    "authorizationCode":result.dataSynOauth.authorizationCode,
                    "exitOAuthUrl":result.dataSynOauth.exitOAuthUrl,
                    buyerInfoSourceUrl:result.dataSynDataSource.buyerInfoSourceUrl,
                    buyerOrganizationInfoSourceUrl:result.dataSynDataSource.buyerOrganizationInfoSourceUrl
                }
            },(error) => {
                if(error.data.status != '102'){
                    this.$message({ message: '获取配置出错', type: 'error' });
                } 
            })
        },
        save(){
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                     let data = {
                        "dataSynDataSource":{
                            "buyerInfoSourceUrl":this.ruleForm.buyerInfoSourceUrl,
                            "buyerOrganizationInfoSourceUrl":this.ruleForm.buyerOrganizationInfoSourceUrl
                        },
                        "dataSynOauth":{
                            "clientId":this.ruleForm.clientId,
                            "clientsecre":this.ruleForm.clientsecre,
                            "redirectUri":this.ruleForm.redirectUri,
                            "oauthToken":this.ruleForm.oauthToken,
                            "authorizationCode":this.ruleForm.authorizationCode,
                            "exitOAuthUrl":this.ruleForm.exitOAuthUrl
                        }
                    }
                    this.$api("dataDocking.setSave",{config:data}).then((result) => {
                        this.$message({ message: '保存配置成功', type: 'success' });
                    },(error) => {
                        this.$message({ message: '保存配置出错', type: 'error' });
                    })
                }else{
                    
                }
            })
        }
    },
    components:{
        pageTitle,
    }
}
</script>
<style scoped>
    .title{
        font-size: 18px;
        color: #333;
        padding-left:40px; 
    }
</style>
