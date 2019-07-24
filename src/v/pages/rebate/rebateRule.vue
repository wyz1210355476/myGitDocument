<template>
	<div class="contents">
		<page-title :title="'返利规则'"></page-title>
		<div class="content-table ce-content-style">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" v-loading="isLoading">
				<el-form-item label="返利发放节点：">
					<el-radio v-model="ruleForm.rebateNode" label="1">订单支付</el-radio>
					<el-radio v-model="ruleForm.rebateNode" label="2">确认收货</el-radio>
				</el-form-item>
				<el-form-item label="返利锁定期限：" prop="day">
					<span>返利获取后</span>
					<el-input v-model="ruleForm.day" placeholder="" style="width:50px" size="small"></el-input>
					<span>天后可以使用<span>（注：按自然天计算）</span></span>
				</el-form-item>
				<el-form-item label="返利使用限制：" >
					<el-col style="width:250px"><span>单笔订单可以最多抵扣订单商品总额的</span>&nbsp;&nbsp;</el-col>
					<el-col :span="7"  style="width:210px">
						<el-form-item prop="percent">
							<el-radio v-model="ruleForm.type" label="1">百分比</el-radio>
							<el-input v-model="ruleForm.percent" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%</span>
						</el-form-item>
					</el-col>
					<el-col :span="7" >
						<el-form-item prop="limit">
							<el-radio v-model="ruleForm.type" label="2">额度</el-radio>
							<el-input v-model="ruleForm.limit" placeholder="" style="width:100px" size="small"></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="推荐返利是否启用：">
					<el-radio v-model="ruleForm.isUse" label="1">启用</el-radio>
					<el-radio v-model="ruleForm.isUse" label="2">停用</el-radio>
				</el-form-item>
				<el-form-item label="推荐资格审核：">
					<el-radio v-model="ruleForm.examination" label="1">申请立即通过</el-radio>
					<el-radio v-model="ruleForm.examination" label="2">手工审核</el-radio>
				</el-form-item>
				<el-form-item label="参与会员：">
					<el-checkbox-group v-model="ruleForm.checkMember" @change="handleCheckItemChange">
						<el-checkbox  v-for="item in memberList" :key="item.id" :label="item.id | toString">{{item.name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="推荐返利层级：">
					<el-select v-model="ruleForm.hierarchy" placeholder="请选择" size="small">
						<el-option
						v-for="item in hierarchyOpt"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="从每个推荐会员处获取的返利次数或期限：" label-width="280px">
					<div v-if="ruleForm.hierarchy == 1">	
						<el-col style="width:90px"><el-radio v-model="ruleForm.directRebateNum" label="1">无限制</el-radio>&nbsp;&nbsp;</el-col>
						<el-col :span="8"  style="width:230px">
							<el-form-item prop="directTimes">
								<el-radio v-model="ruleForm.directRebateNum" label="2">最多返利</el-radio>
								<el-input v-model="ruleForm.directTimes" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;次</span>
							</el-form-item>
						</el-col>
						<el-col :span="12" >
							<el-form-item prop="directDay">
								<el-radio v-model="ruleForm.directRebateNum" label="3">自注册之日起</el-radio>
								<el-input v-model="ruleForm.directDay" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;天内交易返利</span>
							</el-form-item>
						</el-col>
					</div>
				</el-form-item>
				<!-- 有间接推荐人时 -->
				<div v-if="ruleForm.hierarchy == 2">
					<el-form-item label="• 直接推荐人：">	
						<el-col style="width:90px"><el-radio v-model="ruleForm.directRebateNum" label="1">无限制</el-radio>&nbsp;&nbsp;</el-col>
						<el-col :span="10"  style="width:230px">
							<el-form-item prop="directTimes">
								<el-radio v-model="ruleForm.directRebateNum" label="2">最多返利</el-radio>
								<el-input v-model="ruleForm.directTimes" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;次</span>
							</el-form-item>
						</el-col>
						<el-col :span="10" >
							<el-form-item prop="directDay">
								<el-radio v-model="ruleForm.directRebateNum" label="3">自注册之日起</el-radio>
								<el-input v-model="ruleForm.directDay" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;天内交易返利</span>
							</el-form-item>
						</el-col>
					</el-form-item>
					<el-form-item label="• 间接推荐人：">	
						<el-col style="width:90px"><el-radio v-model="ruleForm.indirectRebateNum" label="1">无限制</el-radio>&nbsp;&nbsp;</el-col>
						<el-col :span="10"  style="width:230px">
							<el-form-item prop="indirectTimes">
								<el-radio v-model="ruleForm.indirectRebateNum" label="2">最多返利</el-radio>
								<el-input v-model="ruleForm.indirectTimes" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;次</span>
							</el-form-item>
						</el-col>
						<el-col :span="10" >
							<el-form-item prop="indirectDay">
								<el-radio v-model="ruleForm.indirectRebateNum" label="3">自注册之日起</el-radio>
								<el-input v-model="ruleForm.indirectDay" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;天内交易返利</span>
							</el-form-item>
						</el-col>
					</el-form-item>
				</div>
				<el-form-item label="每笔订单返利规则：">
					<div v-if="ruleForm.hierarchy == 1">	
						<el-select v-model="ruleForm.ladderVal" placeholder="请选择" size="small" style="width:160px" @change="changeLadder('0',ruleForm.ladderVal)">
							<el-option
							v-for="item in ladderOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
						<!-- 订单百分比阶梯 -->
						<div v-if="ruleForm.ladderVal == 1">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>返订单额&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%</span>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button>
							</div>
						</div>
						<!-- 订单指定金额阶梯 -->
						<div v-if="ruleForm.ladderVal == 2">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>返利&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button>
							</div>
						</div>
						<!-- 固定百分比 -->
						<div v-if="ruleForm.ladderVal == 3">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:180px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>订单额&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔返利封顶&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button> -->
							</div>
						</div>
						<!-- 固定金额 -->
						<div v-if="ruleForm.ladderVal == 4">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔订单返利&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button> -->
							</div>
						</div>
					</div>
				</el-form-item>
				<!-- 有间接推荐人时 -->
				<div v-if="ruleForm.hierarchy == 2">
					<el-form-item label="• 直接推荐人：">	
						<el-select v-model="ruleForm.ladderVal" placeholder="请选择" size="small" style="width:160px" @change="changeLadder('0',ruleForm.ladderVal)">
							<el-option
							v-for="item in ladderOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
						<!-- 订单百分比阶梯 -->
						<div v-if="ruleForm.ladderVal == 1">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>返订单额&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%</span>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button>
							</div>
						</div>
						<!-- 订单指定金额阶梯 -->
						<div v-if="ruleForm.ladderVal == 2">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>返利&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button>
							</div>
						</div>
						<!-- 固定百分比 -->
						<div v-if="ruleForm.ladderVal == 3">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:180px">
									<el-form-item
									:prop="'condition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>订单额&nbsp;</span><el-input v-model="ruleForm['condition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔返利封顶&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button> -->
							</div>
						</div>
						<!-- 固定金额 -->
						<div v-if="ruleForm.ladderVal == 4">
							<div class="ruleBox" v-for="(item,index) in rebateRules" :key="item.id">
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'conditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔订单返利&nbsp;</span><el-input v-model="ruleForm['conditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index)">删除</el-button> -->
							</div>
						</div>
					</el-form-item>
					<el-form-item label="• 间接推荐人：">
						<el-select v-model="ruleForm.inLadderVal" placeholder="请选择" size="small" style="width:160px" @change="changeLadder('1',ruleForm.inLadderVal)">
							<el-option
							v-for="item in ladderOption"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>	
						<!-- 订单百分比阶梯 -->
						<div v-if="ruleForm.inLadderVal == 1">
							<div class="ruleBox" v-for="(item,index) in inRebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'inCondition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['inCondition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'inConditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>返订单额&nbsp;</span><el-input v-model="ruleForm['inConditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%</span>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule('1')">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index,'1')">删除</el-button>
							</div>
						</div>
						<!-- 订单指定金额阶梯 -->
						<div v-if="ruleForm.inLadderVal == 2">
							<div class="ruleBox" v-for="(item,index) in inRebateRules" :key="item.id">
								<el-col :span="10"  style="width:160px">
									<el-form-item
									:prop="'inCondition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>满&nbsp;</span><el-input v-model="ruleForm['inCondition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;元，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'inConditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>返利&nbsp;</span><el-input v-model="ruleForm['inConditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<el-button type="text" @click="addRule('1')">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index,'1')">删除</el-button>
							</div>
						</div>
						<!-- 固定百分比 -->
						<div v-if="ruleForm.inLadderVal == 3">
							<div class="ruleBox" v-for="(item,index) in inRebateRules" :key="item.id">
								<el-col :span="10"  style="width:180px">
									<el-form-item
									:prop="'inCondition-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPercent,trigger:'blur'}
									]">
										<span>订单额&nbsp;</span><el-input v-model="ruleForm['inCondition-'+index]" placeholder="" style="width:100px" size="small"></el-input><span>&nbsp;%，</span>
									</el-form-item>
								</el-col>
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'inConditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔返利封顶&nbsp;</span><el-input v-model="ruleForm['inConditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule('1')">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index,'1')">删除</el-button> -->
							</div>
						</div>
						<!-- 固定金额 -->
						<div v-if="ruleForm.inLadderVal == 4">
							<div class="ruleBox" v-for="(item,index) in inRebateRules" :key="item.id">
								<el-col :span="10"  style="width:200px">
									<el-form-item
									:prop="'inConditionVal-'+index"
									:rules="[
										{ required: true, message: '输入不能为空'},
										{ validator:checkPrice,trigger:'blur'}
									]">
										<span>单笔订单返利&nbsp;</span><el-input v-model="ruleForm['inConditionVal-'+index]" placeholder="" style="width:100px" size="small"></el-input>
									</el-form-item>
								</el-col>
								<!-- <el-button type="text" @click="addRule('1')">增加</el-button>
								<el-button type="text" v-if="index != 0" @click="deleteRule(index,'1')">删除</el-button> -->
							</div>
						</div>
					</el-form-item>
				</div>
				<el-form-item>
					<el-button type="primary" size="small" @click="confirm('ruleForm')">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import operation from '@components/operation';
	import router from '@c/router';
	export default {
		data() {
			var checkTimeNum = (rule,value,callback) => {
					if(value === '' || !value){
						return callback(new Error('请输入时间值'));
					}else if((/^[1-9]+\d*$/).test(value)) {
						callback();
					}else{
						return callback(new Error('时间值必须为大于等于1的整数'));
					}
				}
			var checkPercent = (rule,value,callback) =>{
				if(this.ruleForm.type == 1){
					if(value === '' || !value){
						return callback(new Error('请输入百分比'));
					}else if((/^[1-9]\d{0,2}$/).test(value) && value <= 100) {
						callback();
					}else{
						return callback(new Error('百分比值必须为大于0小于100的整数'));
					}
				}else{
					callback();
				}
				
			}
			var checkLimit = (rule,value,callback) =>{
				if(this.ruleForm.type == 2){
					if(value === '' || !value){
						return callback(new Error('请输入额度'));
					}else if((/^[1-9]\d*$/).test(value)) {
						callback();
					}else{
						return callback(new Error('额度值必须为大于0的整数'));
					}
				}else{
					callback();
				}
				
			}
			var checkTimes = (rule,value,callback,obj) => {
				let keys = Object.keys(obj);
				let isDirect = keys[0].indexOf("in") == 0 ? false : true;
				if(isDirect && this.ruleForm.directRebateNum == 2 || !isDirect && this.ruleForm.indirectRebateNum == 2){
					if(value === '' || !value){
						return callback(new Error('请输入返利次数'));
					}else if((/^[1-9]\d*$/).test(value)) {
						if(value.length > 3){
							return callback(new Error('返利次数最大不能超过3位数'));
						}else{
							callback();
						}
					}else{
						return callback(new Error('返利次数必须为大于0的整数'));
					}
				}else{
					callback();
				}
			}
			var checkDay = (rule,value,callback,obj) => {
				let keys = Object.keys(obj);
				let isDirect = keys[0].indexOf("in") == 0 ? false : true;
				if(isDirect && this.ruleForm.directRebateNum == 3 || !isDirect && this.ruleForm.indirectRebateNum == 3){
					if(value === '' || !value){
						return callback(new Error('请输入返利期限天数'));
					}else if((/^[1-9]\d*$/).test(value)) {
						if(value.length > 3){
							return callback(new Error('返利期限天数最大不能超过3位数'));
						}else{
							callback();
						}
					}else{
						return callback(new Error('返利期限天数必须为大于0的整数'));
					}
				}else{
					callback();
				}
			}
			return {
				isLoading:false,
				ruleForm:{
					// rebateNode:'1',
					// day:'7',
					// type:'1',
					// percent:'70',
					// limit:'1000',
					// 推荐返利是否使用
					isUse: '1',
					// 推荐资格审核
					examination: '1',
					// 推荐返利层级的值
					hierarchy:"1",
					// 从每个推荐会员处获取的返利次数或期限-直接推荐人
					directRebateNum:"1",
					// 从每个推荐会员处获取的返利次数或期限-间接接推荐人
					indirectRebateNum:"1",
					// 直接推荐人最多返利次数
					directTimes: "",
					// 直接推荐人多少天内交易返利
					directDay: "",
					// 间接推荐人最多返利次数
					indirectTimes: "",
					// 间接推荐人多少天内交易返利
					indirectDay: "",
					// 订单百分比阶梯值
					ladderVal:"1",
					// 订单百分比阶梯值-间接推荐人
					inLadderVal:"1",
					// 返利规则的条件
					'condition-0':"",
					// 满足返利规则的返利值
					'conditionVal-0':"",
					// 选择的会员id
					checkMember:[]
				},
				rules:{
					day:[
						{validator:checkTimeNum}
					],
					percent:[
						{validator:checkPercent}
					],
					limit:[
						{validator:checkLimit}
					],
					directTimes:[
						{validator:checkTimes}
					],
					indirectTimes:[
						{validator:checkTimes}
					],
					directDay:[
						{validator:checkDay}
					],
					indirectDay:[
						{validator:checkDay}
					]
				},
				// 渲染参与会员的值
				memberList:[],
				// 推荐返利选项值
				hierarchyOpt:[
					{
						value: '1',
						label: '一级返利'
					}, {
						value: '2',
						label: '二级返利'
					}
				],
				// 返利规则阶梯选项值
				ladderOption:[
					{
						value: '1',
						label: '订单百分比阶梯'
					}, {
						value: '2',
						label: '订单指定金额阶梯'
					},{
						value: '3',
						label: '固定百分比'
					}, {
						value: '4',
						label: '固定金额'
					}
				],
				// 直接推荐人返利规则
				rebateRules:[
					{
						condition:"",
						conditionVal:""
					}
				],
				// 间接推荐人返利规则
				inRebateRules:[
					{
						inCondition:"",
						inConditionVal:""
					}
				],
				// 缓存已保存过的返利规则数据
				rebateOrderRule:""
			}
		},
		filters:{
			toString(v){
				return v+"";
			}
		},
		mounted() {
			this.getOptions();
			this.getMemberList();
		},
		methods: {
			/*------新增需求-------*/ 
			// 校验满返的金额
			checkPrice(rule,value,callback,obj){
				if(/^[1-9]\d*$/.test(value)){
					if(/^\d{1,8}$/.test(value)){
						callback()
						this.evaluate("1",obj)
					}else{
						callback(new Error('最大长度为8位'));
					}
				}else{
					callback(new Error('请输入大于0的正整数'));
				}
			},
			// 校验满返的金额值
			checkPercent(rule,value,callback,obj){
				value = String(value);
				if((/^(\d+|\d+\.\d+)$/).test(value)){
					let ary = value.match(/^(\d+)(?:\.([\d]+))?$/)
					if(ary && ary[1].length > 3){
						if (!ary[2]) {
							return callback(new Error('最多输入3位整数'));
						}else{
							return callback(new Error('小数点前不超过3位'));
						}
					}else if(ary[2] && ary[2].length > 2){
						return callback(new Error('小数点后不超过2位'));
					}else{
						callback();
						this.evaluate("1",obj)
					}
				}else{
					if(value == ""){
						callback();
						this.evaluate("1",obj)
					}else{
						return callback(new Error('必须为数字值'));
					}
				}
			},
			// 返利规则值变化时
			changeLadder(type,val){
				/**
				 * type 判断是间接推荐人还是直接推荐人
				 * 0 直接推荐人
				 * 1 间接推荐人
				 * 
				 * val 为返利规则的值
				 */
				switch(type+""){
					case "0":
						let direcRebateType = this.rebateOrderRule == "" ? "" : this.rebateOrderRule.direct_referee.rebate_order_rule_type;//直接推荐人返利订单百分比规则
						
						if(direcRebateType == val){
							this.rebateRules = [];
							(this.rebateOrderRule.direct_referee.rebate_order || []).forEach((item) => {
								this.rebateRules.push({
									condition:item.full_money,
									conditionVal:item.rebate_rercentage
								})
							})
							this.evaluate("4","0");
						}else if(direcRebateType != ""){
							this.rebateRules = [
								{
									condition:"",
									conditionVal:""
								}
							]
							this.evaluate("2","0");
						}
						break;
					case "1":
						let indirectRebateType = this.rebateOrderRule == "" ? "" : this.rebateOrderRule.indirect_referee.rebate_order_rule_type;//间接推荐人返利订单百分比规则
						if(indirectRebateType == val){
							this.inRebateRules = [];
							(this.rebateOrderRule.indirect_referee.rebate_order || []).forEach((item) => {
								this.inRebateRules.push({
									inCondition:item.full_money,
									inConditionVal:item.rebate_rercentage
								})
							})
							this.evaluate("4","1")
						}else if(indirectRebateType != ""){
							this.inRebateRules = [
								{
									inCondition:"",
									inConditionVal:""
								}
							]
							this.evaluate("2","1")
						}
						
						break;
				}
			},
			// ruleForm的规则值与rebateRules根据条件互相赋值
			evaluate(type,param){
				/** 
				 * type 规则的操作
				 * 1 为输入
				 * 2 重新赋值时
				 * 3 为删除
				 * 4 为编辑回显
				 * 
				 * param 判断是间接推荐人还是直接推荐人
				 * 1 间接推荐人
				 * 0 直接推荐人
				 * Object 通过key判断*/
				let rulesData,keyPrefix;
				switch(type+""){
					case "1":
						let keys = Object.keys(param);
						let ary = keys[0].split("-");
						let i = ary[1];
						let key = ary[0];
						rulesData = key.indexOf("in") == "0" ? this.inRebateRules : this.rebateRules;
						rulesData[i][key] = param[keys[0]]
						break;
					case "2":
						keyPrefix = param == "1" ? "inC" : "c";//判断是直接推荐或者间接推荐
						for(var key in this.ruleForm){
							if(key.indexOf(keyPrefix + "ondition") > -1){
								delete this.ruleForm[key]
							}
						}
						break;
					case "3":
						keyPrefix = param == "1" ? "inC" : "c";//判断是直接推荐或者间接推荐
						rulesData = param == "1" ? this.inRebateRules : this.rebateRules;
						rulesData.forEach((item,index) => {
							this.ruleForm[keyPrefix + "ondition-" + index] = item[keyPrefix + "ondition"];
							this.ruleForm[keyPrefix + "onditionVal-" + index] = item[keyPrefix + "onditionVal"];
						})
						delete this.ruleForm[keyPrefix + "ondition-" + rulesData.length];
						delete this.ruleForm[keyPrefix + "onditionVal-" + rulesData.length];
						break;
					case "4":
						keyPrefix = param == "1" ? "inC" : "c";//判断是直接推荐或者间接推荐
						rulesData = param == "1" ? this.inRebateRules : this.rebateRules;
						rulesData.forEach((item,index) => {
							this.ruleForm[keyPrefix + "ondition-" + index] = item[keyPrefix + "ondition"];
							this.ruleForm[keyPrefix + "onditionVal-" + index] = item[keyPrefix + "onditionVal"];
						})
						break;
				}
				
			},
			// 新增规则
			addRule(isIndirect){
				/**
				 * isIndirect 是否是间接推荐
				 * 0 不是
				 * 1 是
				 */
				if(isIndirect == 1){
					this.inRebateRules.push({
						inCondition:"",
						inConditionVal:""
					});
				}else{
					this.rebateRules.push({
						condition:"",
						conditionVal:""
					});
				}
			},
			// 删除规则
			deleteRule(index,isIndirect){
				/**
				 * isIndirect 是否是间接推荐
				 * 0 不是
				 * 1 是
				 */
				if(isIndirect == 1){
					this.inRebateRules.splice(index,1);
					this.evaluate("3","1")
				}else{
					this.rebateRules.splice(index,1);
					this.evaluate("3","0")
				}	
			},
			// 获取会员列表
			getMemberList(){
				this.$api("member.getLevelList").then((result) => {
					this.memberList = result;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
                    	this.memberList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			// 参与会员选中状态变化时
			handleCheckItemChange(){
				console.log(this.checkMember)
			},
			/*--------原需求-------*/ 
			getOptions() {
				this.isLoading = true;
				// 获取配置信息
				this.$api("rebate.getRebateUseRule",{}).then((result) => {
					console.log(result)
					let data = result;
					this.isLoading = false;
					this.ruleForm = {
						rebateNode:data.provide_node+"",
						day:data.rebate_day,
						type:data.rebate_use_type+"",
						percent:data.rebate_use_type == 1 ? data.rebate_use_num+"" : '70',
						limit:data.rebate_use_type == 2 ? data.rebate_use_num+"" : '100',
						recommendation_rule_id:data.recommendation_rule_id,
						isUse:data.rebate_is_enabled+"",
						examination:data.qualification_examination+"",
						checkMember:data.user_level_id ? data.user_level_id.split(",") : [],
						hierarchy:data.rebate_level+"",
						directRebateNum:"1",
						indirectRebateNum:"1",
						ladderVal:"1",
						inLadderVal:"1",
						directDay:"",
						indirectDay:"",
						directTimes:"",
						indirectTimes:""
					}

					let rebate_order_rule,rebate_user_rule;
					// 非初次加载时
					if(data.rebate_order_rule != "" && data.rebate_order_rule){
						// 返利规则
						this.rebateOrderRule = rebate_order_rule = JSON.parse(data.rebate_order_rule);

						// 返利次数或期限
						rebate_user_rule = JSON.parse(data.rebate_user_rule);
						// 选择返利次数或期限
						this.ruleForm.directRebateNum = rebate_user_rule.direct_referee.rebate_num_rule+"";
						// 返利次数
						this.ruleForm.directTimes = rebate_user_rule.direct_referee.rebate_num;
						// 自注册之日起多少天内交易返利
						this.ruleForm.directDay = rebate_user_rule.direct_referee.rebate_reg_day;
						
						// 订单百分比阶梯值
						this.ruleForm.ladderVal = rebate_order_rule.direct_referee.rebate_order_rule_type+"";

						// 直接推荐人返利规则
						this.rebateRules = [];
						(rebate_order_rule.direct_referee.rebate_order || []).forEach((item) => {
							this.rebateRules.push({
								condition:item.full_money,
								conditionVal:item.rebate_rercentage
							})
						})
						this.evaluate("4","0")
						// 间接推荐人返利规则
						if(data.rebate_level == 2){
							// 选择返利次数或期限
							this.ruleForm.indirectRebateNum = rebate_user_rule.indirect_referee.rebate_num_rule+"";
							// 返利次数
							this.ruleForm.indirectTimes = rebate_user_rule.indirect_referee.rebate_num;
							// 自注册之日起多少天内交易返利
							this.ruleForm.indirectDay = rebate_user_rule.indirect_referee.rebate_reg_day;

							// 订单百分比阶梯值
							this.ruleForm.inLadderVal = rebate_order_rule.indirect_referee.rebate_order_rule_type+"";

							this.inRebateRules = [];
							(rebate_order_rule.indirect_referee.rebate_order || []).forEach((item) => {
								this.inRebateRules.push({
									inCondition:item.full_money,
									inConditionVal:item.rebate_rercentage
								})
							})
							this.evaluate("4","1")
						}	
						
					}
					
				},(result) => {
					this.isLoading = false;
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			confirm(formName){
				let submitData = {
					provide_node:this.ruleForm.rebateNode,
					rebate_day:this.ruleForm.day,
					rebate_use_type:this.ruleForm.type,
					rebate_use_num:this.ruleForm.type == 1 ? this.ruleForm.percent : this.ruleForm.limit
				};

				let directRules = [],indirectRules = [];
				// 直接推荐人返利规则
				this.rebateRules.forEach((item) => {
					directRules.push({
						"full_money":item.condition,
                		"rebate_rercentage":item.conditionVal
					})
				})
				// 间接推荐人返利规则
				this.inRebateRules.forEach((item) => {
					indirectRules.push({
						"full_money":item.inCondition,
                		"rebate_rercentage":item.inConditionVal
					})
				})

				let newSubmitData = {
					data:submitData,
					recommendation_rule_id:this.ruleForm.recommendation_rule_id,
					rebate_is_enabled:this.ruleForm.isUse,
					qualification_examination:this.ruleForm.examination,
					user_level_id:this.ruleForm.checkMember.join(","),
					rebate_level:this.ruleForm.hierarchy,
					rebate_user_rule:{
						"direct_referee":{
					        "rebate_num_rule":this.ruleForm.directRebateNum,
					        "rebate_num":this.ruleForm.directTimes,
					        "rebate_reg_day":this.ruleForm.directDay
					    },
					    "indirect_referee":{
					        "rebate_num_rule":this.ruleForm.indirectRebateNum,
					        "rebate_num":this.ruleForm.indirectTimes,
					        "rebate_reg_day":this.ruleForm.indirectDay
					    }
					},
					rebate_order_rule:{
						"direct_referee":{
							"rebate_order_rule_type":this.ruleForm.ladderVal,
							"rebate_order":directRules
						},
						"indirect_referee":{
							"rebate_order_rule_type":this.ruleForm.inLadderVal,
							"rebate_order":indirectRules
						}
					}
				}
				
				console.log(newSubmitData)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$api("rebate.rebateUseSet",newSubmitData).then((result) => {
							this.$message({
								message: '设置成功！',
								type: 'success'
							});
						},(result) => {
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			}
		},
		components: {
			pageTitle,
			pages,
			operation
		}
	}
</script>
<style scoped>
.ce-content-style{
/*	border: 1px solid #eaeefb;*/
	padding: 10px 0;
}
.ruleBox{
	height: 60px;
}
</style>