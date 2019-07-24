<template>
    <div class="contents" v-loading="loading">
        <page-title :title=" isEdit ? '编辑优惠券' : '新增优惠券'" goback></page-title>
        <el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small">
            <div v-show="steps == 0">
                <el-form-item label="优惠券名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入优惠券名称" class="formInput"></el-input>
                    <span class="formPrompt">最长30个字，只在后台活动列表中显示</span>
                </el-form-item>
                <el-form-item label="优惠券面值："  prop="faceVal">
                    <el-input v-model="ruleForm.faceVal" placeholder="请输入优惠券面值" class="formInput" :disabled="isEdit"></el-input>元
                    <span class="formPrompt">正整数，不能超过6位</span>
                </el-form-item>
                <el-form-item label="发放总数："  prop="number">
                    <el-input v-model="ruleForm.number" placeholder="请输入发放总数" class="formInput" :disabled="isEdit && state == 2"></el-input>张
                    <span class="formPrompt">正整数，不能超过6位</span>
                </el-form-item>
                <div class="time">
                    <el-form-item label="有效期：" prop="timeStart">
                        <el-date-picker
                        v-model="ruleForm.timeStart"
                        type="datetime"
                        placeholder="选择日期"
                        size='small'
                        :disabled="isEdit">
                        </el-date-picker>
                        <span>至</span>
                    </el-form-item>       
                </div>
                <div class="time">
                    <el-form-item label="" prop="timeEnd" label-width="0">
                        <el-date-picker
                        v-model="ruleForm.timeEnd"
                        type="datetime"
                        placeholder="选择日期"
                        size='small'
                        :disabled="isEdit">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </div>
            <div v-show="steps == 1">
                <el-form-item label="限用商品：" prop="ruleType">
                    <el-radio class="radio" v-model="ruleForm.ruleType" label="3" :disabled="isEdit">
                        <el-button type="text" size="small">全部商品</el-button>
                    </el-radio>
                    <el-radio class="radio" v-model="ruleForm.ruleType" label="1" :disabled="isEdit">
                        <select-product :selectids="selectids" :button="'text'" @change="getSelect" :resets='resets' :orderSkuId="orderSkuId" :isEdit="isEdit"></select-product>
                    </el-radio>
                    <el-radio class="radio" v-model="ruleForm.ruleType" label="2" :disabled="isEdit">
                        <select-category :catids="catids" @change="getCategory" button="text" :isEdit="isEdit"></select-category>
                    </el-radio>
                </el-form-item>
            </div>
            <div v-if="steps == 2">
                <el-form-item label="每人限领：" prop="limitReceive">
                    <el-input v-model="ruleForm.limitReceive" placeholder="请输入每人限领的张数" class="formInput" :disabled="isEdit"></el-input>张
                    <span class="formPrompt">正整数，不能超过2位</span>
                </el-form-item>
                <el-form-item label="使用条件：">
                    <el-col style="width:100px">
                        <el-form-item label="" prop="conditions">
                            <el-radio class="radio" v-model="ruleForm.conditions" label="1" :disabled="isEdit">
                                无限制
                            </el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="" prop="fullMoney">
                            <el-radio class="radio" v-model="ruleForm.conditions" label="2" :disabled="isEdit">
                                满<el-input v-model="ruleForm.fullMoney" placeholder=""  size="mini" class="smallinput" style="width:100px" :disabled="isEdit"></el-input>元可用
                            </el-radio>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="使用说明：" prop="rule_declaration">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="ruleForm.rule_declaration"
					class="areaWidth"
				>
				</el-input>
			</el-form-item>
            </div>
        </el-form>
        <div class="promotion_button">
		<el-button size="small" plain v-if="steps != 0" @click="prevStep()">上一步</el-button>
		<el-button size="small" plain v-if="steps != (stepsData.length-1)" @click="nextStep()">下一步</el-button>
		<el-button type="primary" v-if="steps == (stepsData.length-1)" size="small" @click="savePromtion('ruleForm')" :loading="btnLoading" >保存</el-button>
		<!-- <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button> -->
		</div>
    </div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import selectProduct from '@components/selectProduct';
import selectCategory from '@components/selectCategory';
import * as utilFun from '@c/util/index.js'; 
export default {
    data(){
        // var checkNumber = (rule, value, callback) => {
        //     if(this.isEdit && Number(this.editTotal) > Number(value)){
        //         callback(new Error('编辑时优惠券总张数不能小于新增时的总张数'));
        //     }else{
                
        //     }
        // }
        var checkVal = (rule, value, callback) => {
            if(/^[1-9]\d{0,5}$/.test(value)){
                callback()
            }else{
                callback(new Error('输入格式不正确'));
            }
        }
        var checkTimeStart = (rule, value, callback) => {
            if(this.isEdit){
                callback();
                return;
            }
            if(value < new Date(new Date().toLocaleDateString())){
                callback(new Error('活动开始时间不能小于当天'));
            }else if(value > this.ruleForm.timeEnd){
                callback(new Error('活动开始时间不能大于活动结束时间'));
            }else{
                callback();
            }
        }
        var checkTimeEnd = (rule, value, callback) => {
            if(this.isEdit){
                callback();
                return;
            }
            if (this.ruleForm.timeStart >= value) {
                callback(new Error('活动结束时间要大于活动开始时间'));
            } else {
                callback();
            }
        }
        var checkLimit = (rule, value, callback) => {
            if(/^[1-9]\d{0,1}$/.test(value)){
                callback();
            }else{
                callback(new Error('输入格式不正确'));
            }
        }
        var checkFullMoney = (rule, value, callback) => {
            if(this.ruleForm.conditions == 2){
                if(value == ""){
                     callback(new Error('请输入限制额度'));
                }else{
                    checkVal(rule, value, callback);
                }   
            }else{
                callback()
            }
        }
        let now = new Date;
        let dd = new Date;
        dd.setDate(dd.getDate()+7);
        return {
            loading:false,
            btnLoading:false,
            steps:0,
            stepsData:[
                {label:'设置优惠券信息',id:1},
                {label:'设置限用商品',id:2},
                {label:'设置领用规则',id:3},
            ],
            /*----------分类-----------*/
            catids:[],
            pageCatids:[],
            /*---------商品------------*/
            selectids:[],
            pageSelectids:[],
            resets:['reset'],
            orderSkuId:[],
            ruleForm:{
                name:"",
                faceVal:"",
                number:"",
                timeStart:now,
                timeEnd:dd,
                ruleType:"1",
                limitReceive:"",
                conditions:"1",
                fullMoney:"",
                rule_declaration:"",
                ids:""
            },
            id:"",
            isEdit:false,
            state:1,
            rules: {
                name: [
                    { required: true, message: '请输入优惠券名称', trigger: 'blur' },
                    { min: 1, max: 30, message: '最长不能超过30个字符', trigger: 'blur' }
                ],
                faceVal: [
                    { required: true, message: '请输入优惠券面值', trigger: 'blur' },
                    { validator: checkVal , trigger: 'blur' }
                ],
                number:[
                    { required: true, message: '请输入发放总数', trigger: 'blur' },
                    { validator: checkVal , trigger: 'blur' }
                ],
                timeStart: [
                    { type: 'date', required: true, message: '请输入有效期的起始时间', trigger: 'change' },
                    { validator: checkTimeStart , trigger: 'blur' }
                ],
                timeEnd: [
                    { type: 'date', required: true, message: '请输入有效期的结束时间', trigger: 'change' },
                    { validator: checkTimeEnd , trigger: 'blur' }
                ],
                limitReceive: [
                    { required: true, message: '请输入每人限领的张数', trigger: 'blur' },
                    { validator: checkLimit , trigger: 'blur' }
                ],
                fullMoney: [
                    { validator: checkFullMoney , trigger: 'blur' }
                ],
                rule_declaration: [
                    { max: 100, message: '最长不能超过100个字符', trigger: 'blur' }
                ]
            },
        }
    },
    mounted(){
        if(this.$route.query.id){
            this.isEdit = true;
            this.id = this.$route.query.id;
            this.state = this.$route.query.state;
            this.getCouponDetail();
        }
    },
    filters:{

    },
    methods: {
        getCouponDetail(){//获取优惠券详情信息
            this.$api("promotion.getDetail",{coupon_id:this.id}).then((result) => {
                // debugger
                this.ruleForm = {
                    name:utilFun.specCharacter(result.coupon_name),
                    faceVal:result.coupon_value,
                    number:result.coupon_start_num,
                    timeStart:result.coupon_start_time*1000,
                    timeEnd:result.coupon_end_time*1000,
                    ruleType:result.obj_type+"",
                    limitReceive:result.limit_per_person,
                    conditions:result.coupon_type_rule,
                    fullMoney:result.coupon_use_money,
                    rule_declaration:result.coupon_use_desc ? result.coupon_use_desc : "",
                    ids:result.obj_id
                }
                switch(this.ruleForm.ruleType){
                    case '1':
                        this.pageSelectids = this.ruleForm.ids.split(",");
                        this.selectids = this.ruleForm.ids.split(",");
						this.orderSkuId = this.ruleForm.ids.split(",")
                        break;
                    case '2':
                        this.pageCatids = this.ruleForm.ids.split(",");
                        this.catids = this.ruleForm.ids.split(",");
                        break;
                }
            },(err) => {
                
            })
        },
        // 上一步
        prevStep(){
            this.steps -= 1
        },
        // 下一步
        nextStep(){ 
            if(this.steps == 0){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.steps += 1;
                    }else{
                        console.log('error validate');return
                    }
                });
            }else if(this.steps == 1){
                switch(this.ruleForm.ruleType){
                    case '1':
                        this.ruleForm.ids = this.pageSelectids.join(',');
                        break;
                    case '2':
                        this.ruleForm.ids = this.pageCatids.join(',');
                        break;
                    case '3':
                        this.ruleForm.ids = '';
                        break;
                }
                if((this.ruleForm.ruleType != '3' && this.ruleForm.ids == '')){
                    this.$message({ message: '请选择参与活动的商品或分类', type: 'warning' }); return
                }
                this.steps += 1
            }
        },
        getSelect(val){//选择货品回掉
            this.ruleForm.ruleType = "1"
            this.pageSelectids = val
        },
        getCategory(val){//选择分类回掉
            this.ruleForm.ruleType = "2"
            this.pageCatids = val
        },
        savePromtion(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    let data,api;
                    if(this.isEdit){//编辑时
                        data = {
                            "coupon_name" : this.ruleForm.name,
                            "coupon_start_num" : this.ruleForm.number,
                            "coupon_use_desc" : this.ruleForm.rule_declaration,
                            "coupon_id" : this.id
                        }
                        api = "promotion.upCoupon";
                    }else{//新增时
                        data = {
                            "coupon_name" : this.ruleForm.name,
                            "coupon_value" : this.ruleForm.faceVal,
                            "coupon_start_num" : this.ruleForm.number,
                            "coupon_start_time" : utilFun.formatDate(this.ruleForm.timeStart.getTime(),'yyyy-MM-dd hh:mm:ss'),
                            "coupon_end_time" : utilFun.formatDate(this.ruleForm.timeEnd.getTime(),'yyyy-MM-dd hh:mm:ss'),
                            "coupon_type_rule" : this.ruleForm.conditions,
                            "coupon_use_money" : this.ruleForm.fullMoney,
                            "coupon_use_desc" : this.ruleForm.rule_declaration,
                            "limit_per_person" : this.ruleForm.limitReceive,
                            "obj_id" : this.ruleForm.ids,
                            "obj_type" : this.ruleForm.ruleType
                        };
                        api = "promotion.addCoupon";
                    }
                    
                    this.$api(api,data).then((result) => {
                        this.btnLoading = false
                        let msg = this.isEdit ? "编辑优惠券成功" : '新增优惠券成功';
                        this.$message({ message: msg, type: 'success' });
					    this.$router.push({name:'couponLibrary'})
                    },(err) => {
                        this.btnLoading = false
                        this.$message({
                            type: 'error',
                            message: '保存失败'
                        });
                    })
                }else{
                    console.log('error validate');return
                }
            });
        }
    },
    components: {
        pageTitle,
        selectProduct,
		selectCategory
    }
}
</script>
<style scoped>
    .time{
        display:inline-block;
    }
    .areaWidth{
        width: 500px;
    }
    .smallinput {width: 70px; margin:0 5px;}
</style>