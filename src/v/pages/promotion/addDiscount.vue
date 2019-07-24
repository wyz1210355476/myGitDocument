<template>
	<div class="contents" v-loading="loading">
		<page-title :title="'商品折扣'" goback></page-title>
		<el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" v-show="steps == 0">
			<el-form-item label="折扣活动名称："  prop="name">
			    <el-input v-model="ruleForm.name" placeholder="请输入活动名称" class="formInput"></el-input>
			    <span class="formPrompt">2到50个字，只在后台活动列表中显示</span>
		    </el-form-item>
		    <el-form-item label="活动开始时间：" prop="startDate">
		      	<el-date-picker type="datetime" placeholder="自定义开始时间" class="formInput" v-model="ruleForm.startDate" @change="getEndDate"></el-date-picker>
		      	<span class="formPrompt">自定义开始时间</span>
		    </el-form-item>
		    <el-form-item label="活动结束时间：" prop="endDate">
		      	<el-date-picker type="datetime" placeholder="自定义结束时间" class="formInput" v-model="ruleForm.endDate" ></el-date-picker>
		      	<span class="formPrompt">自定义结束时间</span>
		 	</el-form-item>
		  	<el-form-item label="活动标签：" prop="label">
		    	<el-select v-model="ruleForm.label" placeholder="请选择活动区域" class="formInput">
		      		<el-option :key="item.id" :label="item.lname" :value="item.id" v-for="item in labelData"></el-option>
		      		<el-option value="custom" label="-自定义-" ></el-option>
		    	</el-select>
		    	<el-input v-model="customLabel" class="formInput-short" v-if="ruleForm.label=='custom'"></el-input>
		    	<span class="formPrompt">2到6个字，在商品详情页的价格旁显示</span>
		  	</el-form-item>
		</el-form>
		<el-form :model="ruleData" :rules="rule2" ref="ruleData" label-width="140px" size="small" v-show="steps == 1">
		  	<el-form-item label="活动商品：" prop="ruleType">
		  		<select-product :selectids="selectids" @change="getSelect" :resets='resets' :orderSkuId="orderSkuId"></select-product>
		  	</el-form-item>
		</el-form>
		<el-form :model="ruleData" :rules="rule2" ref="ruleData" label-width="140px" v-show="steps == 2">
		  	<el-form-item label="促销规则：" prop="ruleType">
		        <el-select v-model="ruleData.ruleType" size="small" class="formInput-short">
			    	<el-option label="打折" value="3"></el-option>
			    	<el-option label="减价" value="4"></el-option>
			    </el-select>
		  	</el-form-item>
		  	<el-form-item v-if="ruleData.ruleType == '3'" label="打" prop="ruleVal" :rules="rule2.ruleVal">
				<span>
				    <el-input v-model="ruleData.ruleVal" size="small" class="formInput-short"></el-input>折
				    <span class="promptspan" v-if="ruleData.ruleType == '3'">(折扣大于0小于等于10)</span>
				</span>
		  	</el-form-item>
		  	<el-form-item v-if="ruleData.ruleType == '4'" label="减" prop="ruleVal" :rules="rule2.ruleVal1">
				<span>
				    <el-input v-model="ruleData.ruleVal" size="small" class="formInput-short"></el-input>元
				</span>
		  	</el-form-item>
		</el-form>
		<div class="promotion_button">
		<el-button size="small" plain v-if="steps != 0" @click="prevStep()">上一步</el-button>
		<el-button type="primary" size="small"  v-if="steps != (stepsData.length-1)" @click="nextStep()">下一步</el-button>
		<el-button type="primary" v-if="steps == (stepsData.length-1)" size="small" @click="savePromtion()">保存</el-button>
		<!-- <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button> -->
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as utilFun from '@c/util/index.js';
	import * as vali from '@c/util/validator.js';
	import selectProduct from '@components/selectProduct';
	export default {
		data() {
			var checkEndDate = (rule, value, callback) => {
		        if (this.ruleForm.startDate >= value) {
		          callback(new Error('活动结束时间要大于活动开始时间'));
		        } else {
		          callback();
		        }
		    };
		    let now = new Date;
		    let dd = new Date;
			dd.setDate(dd.getDate()+7);
			return {
				loading:true,
				steps:0,
				stepsData:[
					{label:'设置折扣信息',id:1},
					{label:'设置活动商品',id:2},
					{label:'设置活动规则',id:3},
				],

		        selectids:[],
		        resets:['reset'],
		        orderSkuId:[],

				ruleForm: {
          			proType:1,
					name:'促销'+ Math.floor(Math.random()*9000+1000),
					startDate:now,
					endDate:dd,
					label:'',
					rule:''
        		},
        		ruleData:{
        			goods:'',
        			ruleType:'3',
					ruleVal:''
        		},
        		goods:{
			        type:"goods",
			        ids:""
			    },

        		promotionData:'',
				labelData:[],
				customLabel:'',

				rules: {
			        name: [
			            { required: true, message: '请输入活动名称', trigger: 'blur' },
			            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
			        ],
			        startDate: [
			            { type: 'date', required: true, message: '请选择活动开始时间', trigger: 'change' },
			        ],
			        endDate: [
			            { type: 'date', required: true, message: '请选择活动结束时间', trigger: 'change' },
			            { validator: checkEndDate , trigger: 'blur' }
			        ],
			        label: [
			            { required: true, message: '请选择活动标签', trigger: 'change' },
			        ]
		        },
		        rule2: {
		        	ruleType: [
			            { required: true, message: '请选择促销规则', trigger: 'blur' },
			        ],
			        ruleVal: [
			            { required: true, message: '请输入折扣', trigger: 'blur' },
			            { validator: vali.checkZhekou , trigger: 'blur' }
			        ],
			        ruleVal1: [
			            { required: true, message: '请输入减钱金额', trigger: 'blur' },
			            { validator: vali.checkJianqian , trigger: 'blur' }
			        ],
		        },
			}
		},
		mounted() {
			this.getLabels();
			if(this.$route.query.id){
				this.id = this.$route.query.id
			}
		},
		methods: {
			// 上一步
			prevStep(){
				this.steps -= 1
			},
			// 下一步
			nextStep(){
				if(this.steps == 0){
					this.$refs.ruleForm.validate((valid) => {
			        	if (valid) {
				          	if(this.ruleForm.label == 'custom'){
				            	if(!this.customLabel.trim()){
				            		this.$message({ message: '请输入自定义活动标签', type: 'warning' }); return
				            	}
				            	if(this.customLabel.trim().length < 2 || this.customLabel.trim().length >6){
			            			this.$message({ message: '活动标签限制2到6个字', type: 'warning'}); return
			            		}
				            }
				            this.steps += 1
			        	}else{
			        		console.log('error validate');return
			        	}
			        });
				}else if(this.steps == 1){
					if(this.goods.ids == ''){
		          		this.$message({ message: '请选择参与活动的商品', type: 'warning' }); return
		          	}
		          	this.ruleData.goods = this.goods
		          	this.steps += 1
				}
			},
			// 自动选择结束时间
			getEndDate(){
				if(this.ruleForm.endDate == '' && this.ruleForm.startDate != ''){
					let dd = new Date(this.ruleForm.startDate);
					dd.setDate(dd.getDate()+7);
					this.ruleForm.endDate = dd
				}
			},
			// 选择货品回掉
			getSelect(val){
				this.goods.ids = val.join(",")
			},
			// 查询活动
			getPromotion(reset){
				this.$api("promotion.getPromotionDetail",{id:this.id}).then((result) => {
					this.loading = false
					this.promotionData = result;
					let rule = JSON.parse(this.promotionData.rule);
					this.ruleForm = {
						id:this.promotionData.id,
	          			proType:this.promotionData.type,
						name:this.promotionData.name,
						startDate:new Date(this.promotionData.start_date),
						endDate:new Date(this.promotionData.end_date),
						label:this.promotionData.label.id,
		        		ruleId:this.promotionData.rule_id,
					}
					this.ruleData = rule
					this.goods = rule.goods
					this.selectids = rule.goods.ids.split(",");
					this.orderSkuId = rule.goods.ids.split(",");
					if(reset == 'reset'){
						this.resets = rule.goods.ids.split(",");
					}
				}, (error) => {
					this.loading = false
					this.$message({ message: '查询活动数据出错', type: 'error' });
				});
			},
			// 查询活动标签
			getLabels(){
				this.$api("promotion.getPromotionLabel").then((result) => {
					this.labelData = result.list;
					if(this.id){
						this.getPromotion();
					}else{
						this.loading = false
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询活动标签出错', type: 'error' });
					}
				});
			},
			// 创建促销活动
			addPromotion(params){
				let api = 'promotion.addPromotion';
				if(params.id){
					api = 'promotion.updatePromotionLabel';
				}
				this.$api(api,params).then((result) => {
					this.$message({ message: '新增促销活动成功', type: 'success' });
					this.$router.push({name:'discount'})
				}, (error) => {
					this.$message({ message: '创建促销活动出错', type: 'error' });
				});
			},
			// 创建活动标签
			addPromotionLabel(params){
				this.$api("promotion.addPromotionLabel",{name:this.customLabel.trim()}).then((result) => {
					this.getLabels();
					params.label = result.id;
					this.addPromotion(params);
				}, (error) => {
					this.$message({ message: '创建活动标签出错', type: 'error' });
				});
			},
			// 保存促销活动
			savePromtion(){
				this.$refs.ruleData.validate((valid) => {
		        	if (valid) {
			          	var extend=function(o,n){
						   for (var p in n){
						        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
						            o[p]=n[p];
						    }
						    return o;
						};
						let params = extend({},this.ruleForm)
			            params.startDate = utilFun.formatDate(params.startDate.getTime(),'yyyy-MM-dd hh:mm:ss')
			            params.endDate = utilFun.formatDate(params.endDate.getTime(),'yyyy-MM-dd hh:mm:ss')
			            params.rule = JSON.stringify(this.ruleData)
			            if(params.label == 'custom'){
			            	if(!this.customLabel.trim()){
			            		this.$message({ message: '请输入自定义活动标签', type: 'warning' }); return
			            	}
			            	if(this.customLabel.trim().length < 2 || this.customLabel.trim().length >6){
		            			this.$message({ message: '活动标签限制2到6个字', type: 'warning'}); return
		            		}
			            	this.addPromotionLabel(params);
			            }else{
			            	this.addPromotion(params);
			            }
		        	}else{
		        		console.log('error validate');return
		        	}
		        });
			},
			resetForm(formName) {
		        if(this.id){
		        	this.getPromotion('reset');
		        }else{
	        		this.ruleForm = {
	          			proType:1,
						name:'促销'+ Math.floor(Math.random()*9000+1000),
						startDate:"",
						endDate:'',
						label:'',
						rule:''
	        		}
	        		this.ruleData = {
	        			goods:'',
	        			ruleType:'3',
						ruleVal:''
	        		}
	        		this.goods = {
				        type:"goods",
				        ids:""
				    }
	        		this.selectids = []
	        		this.resets = []
	        		this.$refs.ruleForm.resetFields();
	        		this.$refs.ruleData.resetFields();
		        }
		    }
		},
		components: {
			pageTitle,
			selectProduct
		}
	}
</script>
<style>

</style>
