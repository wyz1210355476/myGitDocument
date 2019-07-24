<template>
	<div class="contents" v-loading="loading">
		<page-title :title="title" goback></page-title>
		<el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" v-show="steps == 0">
			<el-form-item label="折扣活动名称："  prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入活动名称" class="formInput"></el-input>
					<span class="formPrompt">最长30个字，只在后台活动列表中显示</span>
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
							<el-option :key="item.id" :label="item.lname|specCharacter" :value="item.id|tranString" v-for="item in labelData"></el-option>
							<el-option value="custom" label="-自定义-" ></el-option>
					</el-select>
					<el-input v-model="customLabel" class="formInput-short" v-if="ruleForm.label=='custom'"></el-input>
					<span class="formPrompt">最长30个字，在商品详情页的价格旁显示</span>
				</el-form-item>
			<el-form-item label="规则说明：" prop="rule_declaration">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="ruleForm.rule_declaration"
					class="areaWidth"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<el-form :model="goods" label-width="140px" size="small" v-show="steps == 1">
				<el-form-item label="活动商品：" prop="ruleType">
				<el-radio class="radio" v-model="goods.type" label="allGoods">
					<el-button type="text" size="small">全部商品</el-button>
				</el-radio>
					<el-radio class="radio" v-model="goods.type" label="goods">
						<select-product :selectids="selectids" :button="'text'" @change="getSelect" :resets='resets' :orderSkuId="orderSkuId"></select-product>
					</el-radio>
					<el-radio class="radio" v-model="goods.type" label="category">
						<select-category :catids="catids" @change="getCategory" button="text"></select-category>
					</el-radio>
				</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 2">
				<slot name="activeRull"></slot>
		</el-form>
		<div class="promotion_button">
		<el-button size="small" plain v-if="steps != 0" @click="prevStep()">上一步</el-button>
		<el-button size="small" plain v-if="steps != (stepsData.length-1)" @click="nextStep()">下一步</el-button>
		<el-button type="primary"  v-if="steps == (stepsData.length-1)" size="small" @click="savePromtion" :loading="comBtnLoading">保存</el-button>
		<!-- <slot name="saveBtn" :saveInfo='{ruleForm,ruleData,customLabel}' v-if="steps == (stepsData.length-1)">
			
		</slot> -->
		
		<!-- <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button> -->
		</div>
	</div>

</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as vali from '@c/util/validator.js';
	import selectProduct from '@components/selectProduct';
	import selectCategory from '@components/selectCategory';
	export default {
		props:['step','btnLoading','title'],
		watch:{
			step:{
				handler(v){
					this.steps = v;
				}
			},
			steps:{
				handler(v){
					this.$emit("stepChange",{data:this.ruleForm,step:v})
				}
			},
			btnLoading:{
				handler(v){
					this.comBtnLoading = v;
				}
			},
			editInfo:{
				handler(v){
					this.$emit("rullChange",v)
				}
			}
		},
		data() {
			var checkEndDate = (rule, value, callback) => {
				if (this.ruleForm.startDate >= value) {
					callback(new Error('活动结束时间要大于活动开始时间'));
				} else {
					callback();
				}
			};
			var checkStartDate = (rule, value, callback) => {
				if(value < new Date(new Date().toLocaleDateString())){
					callback(new Error('活动开始时间不能小于当天'));
				}else if(value > this.ruleForm.endDate){
					callback(new Error('活动开始时间不能大于活动结束时间'));
				}else{
					callback();
				}
			};
				let now = new Date;
				let dd = new Date;
			dd.setDate(dd.getDate()+7);
			return {
				loading:true,
				steps:0,
				comBtnLoading:false,
				stepsData:[
					{label:'设置折扣信息',id:1},
					{label:'设置活动商品',id:2},
					{label:'设置活动规则',id:3},
				],
				/*----------分类-----------*/
				catids:[],
				pageCatids:[],
				/*---------商品------------*/
						selectids:[],
						pageSelectids:[],
						resets:['reset'],
						orderSkuId:[],
				ruleForm: {
					proType:2,
					name:'促销'+ Math.floor(Math.random()*9000+1000),
					startDate:now,
					endDate:dd,
					label:'',
					rule:'',
					rule_declaration:'',
					proc:'4'
						},
						ruleData:{
							goods:''
						},
						goods:{
							type:'goods',
							ids:''
				},
				// 传递给父组件的回显数据
				editInfo:'',
				labelData:[],
				customLabel:'',
				rules: {
					name: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
						{ min: 1, max: 30, message: '最长不能超过30个字符', trigger: 'blur' }
					],
					startDate: [
						{ type: 'date', required: true, message: '请选择活动开始时间', trigger: 'change' },
						{ validator: checkStartDate , trigger: 'blur' }
					],
					endDate: [
						{ type: 'date', required: true, message: '请选择活动结束时间', trigger: 'change' },
						{ validator: checkEndDate , trigger: 'blur' }
					],
					label: [
						{ required: true, message: '请选择活动标签', trigger: 'change' }
					],
					rule_declaration:[
						{ max: 100, message: '最长不能超过100个字符', trigger: 'blur' }
					]
						},
			}
		},
		mounted() {
			this.getLabels();
			if(this.$route.query.id){
				this.id = this.$route.query.id
			}
		},
		filters:{
			tranString(val){
				return val.toString();
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
											if(this.customLabel.trim().length >30){
												this.$message({ message: '活动标签最长输入30个字符', type: 'warning'}); return
											}
										}
										this.steps += 1
										console.log(this.ruleForm);
								}else{
									console.log('error validate');return
								}
							});
				}else if(this.steps == 1){
					switch(this.goods.type){
						case 'goods':
							this.goods.ids = this.pageSelectids.join(',');
							break;
						case 'category':
							this.goods.ids = this.pageCatids.join(',');
							break;
						case 'allGoods':
							this.goods.ids = '';
							break;
					}
					// this.goods.ids = this.goods.type == 'goods' ? this.pageSelectids.join(',') : this.pageCatids.join(',')
					if((this.goods.type != 'allGoods' && this.goods.ids == '')){
									this.$message({ message: '请选择参与活动的商品或分类', type: 'warning' }); return
						}
					this.ruleData.goods = this.goods
								this.steps += 1
				}
			},	
			getEndDate(){//选择开始时间自动选择结束时间
				if(this.ruleForm.endDate == ''){
					let dd = new Date(this.ruleForm.startDate);
					dd.setDate(dd.getDate()+7);
					this.ruleForm.endDate = dd
				}
			},
			getSelect(val){//选择货品回掉
				this.goods.type = "goods"
				this.pageSelectids = val
			},
			getCategory(val){//选择分类回掉
				this.goods.type = "category"
				this.pageCatids = val
			},
			getPromotion(reset){//获取促销详情
				this.$api("promotion.getPromotionDetail",{id:this.id}).then((result) => {
					this.loading = false
					this.promotionData = result;
					let rule = JSON.parse(this.promotionData.rule);
					this.ruleForm = {
						id:this.promotionData.id,
						proType:this.promotionData.type,
						name:this.promotionData.name.replace(/&lt;/g,"<").replace(/&gt;/g,">"),
						startDate:new Date(this.promotionData.start_date),
						endDate:new Date(this.promotionData.end_date),
						label:this.promotionData.lable_id+"",
						ruleId:this.promotionData.rule_id,
						rule_declaration:this.promotionData.rule_declaration,
					}
					this.ruleData = rule
					switch(this.promotionData.activity_type){
						case '1':
							rule.goods.type = "goods";
							break;
						case '2':
							rule.goods.type = "category";
							break;
						case '3':
							rule.goods.type = "allGoods";
							break;
					}
					this.goods = rule.goods;
					// 传递给父组件的回显数据
					this.editInfo = result;
					
					// 
					if(this.goods.type == 'goods'){
						this.pageSelectids = rule.goods.ids.split(",");
						this.selectids = rule.goods.ids.split(",");
						this.orderSkuId = rule.goods.ids.split(",");
						if(reset == 'reset'){
							this.resets = rule.goods.ids.split(",");
						}
					}else{
						this.pageCatids = rule.goods.ids.split(",");
						this.catids = rule.goods.ids.split(",");
					}
				}, (error) => {
					this.loading = false
					this.$message({ message: '查询活动数据出错', type: 'error' });
				});
			},
			getLabels(){// 查询活动标签
				this.$api("promotion.getPromotionLabel").then((result) => {
					this.labelData = result.list;
					// this.ruleForm.label = "2"
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
			addPromotionLabel(customLabel){// 创建活动标签
				this.$api("promotion.addPromotionLabel",{name:customLabel}).then((result) => {
					this.ruleForm.label = result.id;
					if(!result.id){
						this.$message({ message: '创建活动标签出错', type: 'error' });
						return;
					}
					this.$emit("savePromtion",{
								ruleForm:this.ruleForm,
								ruleData:this.ruleData
							})
				}, (error) => {
					this.$message({ message: '创建活动标签出错', type: 'error' });
				}); 
			},
			savePromtion(){
				this.$refs.ruleForm.validate((valid) => {
					if(valid){
						this.comBtnLoading = true;
						this.$emit('update:btnLoading', true);
						if(this.ruleForm.label == 'custom'){//自定义标签
							if(!this.ruleForm.label.trim()){
								$message({ message: '请输入自定义活动标签', type: 'warning' }); return
							}
							if(this.ruleForm.label.trim().length < 1 || this.ruleForm.label.trim().length >30){
								$message({ message: '活动标签限制1到30个字', type: 'warning'}); return
							}
							this.addPromotionLabel(this.customLabel.trim());
						}else{//选择已有标签
							this.$emit("savePromtion",{
								ruleForm:this.ruleForm,
								ruleData:this.ruleData
							})
						}		
					}else{
								this.steps = 0;
							}
				})	
			},
			resetForm(formName) {
						if(this.id){
							this.getPromotion('reset');
						}else{
							this.ruleForm = {
									proType:2,
									name:'促销'+ Math.floor(Math.random()*9000+1000),
									startDate:"",
									endDate:'',
									label:'',
									rule:{
										"goods":{
													"type":"",
													'ids':""
											},
											proTemplate:'',
											rule:'',
											},
										}
										this.cutrull = [
									{
										"ruleType": '4',
													"rulePrice": '',
													"ruleVal": '',
													"ruleCut": '',
													"ruleDiscount": ''
									}
								],
					//重置选择货品
							this.selectids = []
							this.resets = []
							//重置选择分类
							this.catids = []
					//重置选择地区
							this.barringRegion = []
					this.rulePrice = ''
					//重置validate
							this.$refs[formName].resetFields();
						}
				}
		},
		components: {
			pageTitle,
			selectProduct,
			selectCategory
		}
	}
</script>
<style scope>
.areaWidth{
	width: 500px;
}
</style>
<style>


.formPrompt{padding-left: 20px; font-size: 12px; color: #999}
.customLabel{width: 200px;}
.form_con .el-form-item__label{font-size: 12px;}
.promptspan{color: #999}
.rule-select .el-input{width: 100px; margin-right: 40px;}
.smallinput {width: 60px; margin:0 5px;}


.cuttype{margin-bottom: 10px;}
.cutrull{border:1px solid #ccc; width: 600px;}
.cutrullLi{border-bottom: 1px solid #ccc; padding: 10px;}
.cutrullLi:last-child{border-bottom:0px}
.cutrullLi p{overflow: hidden;}
.cutrullLi p .el-button{float: right;}
.cutrullLi .promptspan{color: #ccc}
.form_con .cutrull .el-input{width: 60px; margin:0 10px;}
.cutrull p,.discountrull p{margin:0;}
.cutrulltitle{background: #efefef;border-bottom: 1px solid #ccc; padding:0 10px; }

.form_con .el-form-item__label{font-size: 12px;}

.cutarea{font-size: 12px; color: #999; position: relative; padding-right: 60px; text-align: justify;}
.cutarea span{margin-right: 10px;}

.pro_page{float: right;}
.pro_footer{overflow: hidden; padding: 10px 0}
</style>
