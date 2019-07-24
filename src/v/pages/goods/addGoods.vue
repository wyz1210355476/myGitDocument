<template>
	<div class="contents">
		<page-title :title="(id!=''?'编辑':'新增')+'商品'" goback></page-title>
		<el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
		<el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="140px" size="small" v-show="steps == 0">
			<el-form-item label="商品分类：" prop="categoryId">
				<!-- <el-select placeholder="请选择商品分类" class="formInput" v-model="basicForm.categoryId" @change="changeCat">
				    <el-option v-for="item in categoryData" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
				</el-select> -->
				<!-- 分类树形多选 -->
				<el-cascader
					:options="categoryData"
					:props="defaultProps"
					clearable>
				</el-cascader>
		    </el-form-item>
		    <el-form-item label="商品类型：" prop="templateId">
				<el-select placeholder="请选择商品类型" class="formInput" :disabled="id!=''" v-model="basicForm.templateId" @change="changeType">
				    <el-option v-for="item in typeData" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
				</el-select>
		    </el-form-item>
		    <el-form-item label="商品名称：" prop="name">
				<el-input placeholder="请输入商品名称" class="formInput" v-model="basicForm.name"></el-input>
		    </el-form-item>
		    <el-form-item label="商品编号：" prop="code">
				<el-input placeholder="请输入商品编号" class="formInput" v-model="basicForm.code"></el-input>
			    <span class="formPrompt">支持数字、英文、-、_，最多15位</span>
		    </el-form-item>
			<el-form-item label="品牌：" prop="brandIds">
				<el-select placeholder="请选择商品类型" class="formInput" v-model="basicForm.brandIds">
				    <el-option v-for="item in brandData" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
		    </el-form-item>
			<el-form-item label="型号：" prop="marque">
				<el-input placeholder="请输入型号" class="formInput" v-model="basicForm.marque"></el-input>
			    <span class="formPrompt">支持数字，最多6位</span>
		    </el-form-item>
			<el-form-item label="排序码：" prop="sequence">
				<el-input placeholder="请输入排序码" class="formInput" v-model="basicForm.sequence"></el-input>
			    <span class="formPrompt">支持数字，最多6位</span>
		    </el-form-item>
		    <el-form-item label="商品关键词：" prop="keywords">
				<el-input placeholder="请输入商品关键词" class="formInput" v-model="basicForm.keywords"></el-input>
		    </el-form-item>
		    <el-form-item label="商品摘要：" prop="bigFieldStr.summary">
				<el-input placeholder="请输入商品摘要" class="formInput" v-model="basicForm.bigFieldStr.summary"></el-input>
		    </el-form-item>
		    <!-- <el-form-item label="立即上架：" prop="status">
				<el-radio-group v-model="basicForm.status">
				    <el-radio label="1">是</el-radio>
				    <el-radio label="0">否</el-radio>
			    </el-radio-group>
		    </el-form-item> -->
		    <el-form-item label="商品标签：">
				<el-checkbox-group v-model="markIdStr">
			      	<el-checkbox v-for="item in labelData" :label="item.id" :key="item.id" name="type">{{item.markName}}</el-checkbox>
			    </el-checkbox-group>
		    </el-form-item>
		    <el-form-item label="添加图片：">
				<add-img @confirm="getSrc" :multiple='true'><el-button size="small">添加图片</el-button></add-img>
				<div class="imgCon">
					<!-- <span class="imgItem" v-for="(item,index) in imageListStr" :key="item.id">
						<img :src="item.url" alt="" @error="onImgError">
						<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="delImg(index)"></el-button>
					</span> -->
					<vuedraggable class="wrapper" v-model="imageListStr">
						<transition-group name="list">
						<span class="imgItem" v-for="(item,index) in imageListStr" :key="item.id">
							<img :src="item.url" alt="" @error="onImgError">
							<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="delImg(index)"></el-button>
						</span>
						</transition-group>
					</vuedraggable>
				</div>

		    </el-form-item>
		    <el-form-item label="列表图片：">
				<el-radio-group v-model="listImg">
				    <el-radio label="0">用商品相册默认图</el-radio>
				    <el-radio label="1">自定义商品图片</el-radio>
			    </el-radio-group>
			    <div v-if="listImg=='1'">
			    	<add-img @confirm="addListImg"><el-button size="small">添加图片</el-button></add-img>
			    	<div class="imgCon" v-if="listImageStr.url">
			    		<span class="imgItem">
							<img :src="listImageStr.url" alt="" @error="onImgError">
							<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="listImageStr = {}"></el-button>
						</span>
			    	</div>
			    </div>
		    </el-form-item>
		    <!-- <el-form-item label="选择视频：">
				<add-video @confirm="getVideo"><el-button size="small">选择视频</el-button></add-video>
				<div class="imgCon">
					<span class="imgItem" v-for="(item,index) in imageListStr">
						<img :src="item.url" alt="">
						<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="delImg(index)"></el-button>
					</span>
				</div>
		    </el-form-item> -->
		    <div v-if="specData.length==0">
		    	<el-form-item label="计量单位：" prop="unitId">
					<el-select placeholder="请选择计量单位" class="formInput" v-model="basicForm.unitId">
					    <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status!=1"></el-option>
					</el-select>
			    </el-form-item>
			    <!-- <el-form-item label="销售价：" prop="retailPrice">
					<set-retail-price class="mr10" :price="retailPrice" :sscprice="basicForm.price" @change="getRetailPrice">
						<el-button type="primary">设置价格</el-button>
					</set-retail-price>
					<set-member-discount class="mr10" :discount="memberDiscount" @change="getMemberDiscount">
						<el-button type="primary">客户折扣</el-button>
					</set-member-discount>
					<set-member-cut class="mr10" :rebate="memberCut" @change="getMemberCut" v-if="$appList.CESHOP_RETURN">
						<el-button type="primary">客户返利</el-button>
					</set-member-cut>
					<div class="formPrompt">
						<span v-for="item in retailPrice" :key="item.id">{{item.minNumber}}
						<span v-if="(item.maxNumber!='' && item.maxNumber!=null) && item.maxNumber!=item.minNumber">- {{item.maxNumber}}</span>
						件<span v-if="item.maxNumber=='' || item.maxNumber==null">以上</span>
						 {{item.price}}元； </span>
					</div>
			    </el-form-item> -->
			    <!-- <el-form-item label="货号：" prop="skuNumber">
					<el-input placeholder="请输入货号" class="formInput" :disabled="id!=''" v-model="basicForm.skuNumber"></el-input>
			    </el-form-item> -->
			    <el-form-item label="重量：" prop="weight">
					<el-input placeholder="请输入重量" class="formInput" v-model="basicForm.weight"></el-input>
					<span class="formPrompt">克</span>
			    </el-form-item>
			    <!-- <el-form-item label="库存：" prop="stock">
					<el-input placeholder="请输入库存" class="formInput" v-model="basicForm.stock"></el-input>
			    </el-form-item> -->
		    </div>
		    <div v-if="attrData.length!=0">
		    	<el-form-item :label="item.attributeName" v-for="(item,index) in attrData" :key="item.id">
					<span v-if="item.attributeType == '2' && item.attributeTypeDetail == 'checkbox'">
						<el-checkbox-group v-model="attributeValueListStrExpand[index].attributeValue">
					      	<el-checkbox v-for="item1 in item.attributeOptionList" :label="item1.id" :key="item1.id" name="type">{{item1.attributeOption}}</el-checkbox>
					    </el-checkbox-group>
					</span>
					<span v-if="item.attributeType == '2' && item.attributeTypeDetail == 'select'">
						<el-select placeholder="请选择" class="formInput" v-model="attributeValueListStrExpand[index].attributeValue">
						    <el-option v-for="item2 in item.attributeOptionList" :key="item2.id" :label="item2.attributeOption" :value="item2.id"></el-option>
						</el-select>
					</span>
					<span v-if="item.attributeType == '0' && item.attributeTypeDetail == 'text'">
						<el-input placeholder="请输入" class="formInput" v-model="attributeValueListStrExpand[index].attributeValue"></el-input>
					</span>
			    </el-form-item>
		    </div>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 1">
			<el-form-item label="商品规格：" v-if="specData.length==0">
				<span class="promptspan">所选商品类型暂无规格项</span>
			</el-form-item>
			<el-form-item :label="item.name+':'" v-if="specData.length!=0" v-for="item in specData" :key="item.id">
				<el-checkbox-group v-model="specConfigListStr[item.id]">
			      	<el-checkbox v-for="item1 in item.specValueList" :label="item1.id" :disabled="checkCanntoSpec(item.id,item1.id)" :key="item1.id" name="type" @change="setSkus(item1)">{{item1.name}}</el-checkbox>
			    </el-checkbox-group>
			    <el-table :data="specConfigListStr[item.id]" size="mini" class="xtggtable">
      				<el-table-column label="系统规格项">
      					<template slot-scope="scope">{{getSpecValueName(item.id,scope.row)}}</template>
      				</el-table-column>
      				<el-table-column :label="item.imageFlag == '1' ? '规格图片' : ''">
      					<template slot-scope="scope">
      						<span v-if="item.imageFlag == '1'">
								<add-img @confirm="addImgs($event,item.id,scope.$index)" ><el-button size="mini" type="text">上传图片</el-button></add-img>
								<span v-if="specConfigListImg[item.id] && specConfigListImg[item.id][scope.$index]"><img :src="specConfigListImg[item.id][scope.$index]" style="width:20px; height:20px; vertical-align:middle"></span>
      						</span>
      					</template>
      				</el-table-column>
      			</el-table>
			</el-form-item>
			<el-form-item label="货品:" v-if="specData.length!=0" >
				<div><span class="promptspan">请务必填写货品快递重量，此数用于计算快递运费，货品重量用于前台的展示</span></div>
				<el-form label-width="90px" size="mini">
					<el-form-item label="计量单位：">
						<el-select placeholder="请选择" class="smallInput mr10" v-model="basicForm.unitId">
						    <el-option v-for="item in unitData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.status!=1"></el-option>
						</el-select>
						<!-- <set-retail-price class="mr10" :price="retailPrice" :sscprice="basicForm.price" @change="getRetailPrice">
							<el-button type="primary">设置价格</el-button>
						</set-retail-price>
						<set-member-discount class="mr10" :discount="memberDiscount" @change="getMemberDiscount">
							<el-button type="primary">客户折扣</el-button>
						</set-member-discount>
						<set-member-cut class="mr10" :rebate="memberCut" @change="getMemberCut" v-if="$appList.CESHOP_RETURN">
							<el-button type="primary">客户返利</el-button>
						</set-member-cut> -->

					</el-form-item>
				</el-form>
				<el-table :data="skuListStr" size="mini" max-height="862" ref="skuTable" :span-method="objectSpanMethod" border @selection-change="handleSkuList">
					<el-table-column type="selection" width="35"></el-table-column>
      				<el-table-column label="货品编号" width="130">
      					<template slot-scope="scope">
      						<el-input placeholder="请输入" size="mini" class="xsmallInput" @blur="validateCode(scope.row,scope.$index)" :class="{ codeError: scope.row.isError }" v-model="scope.row.code"></el-input>
      					</template>
      				</el-table-column>
					<el-table-column label="型号" width="130">
      					<template slot-scope="scope">
      						<el-input placeholder="请输入" size="mini" class="xsmallInput" v-model="scope.row.marque"></el-input>
      					</template>
      				</el-table-column>
      				<el-table-column v-for="item in specData" :key="item.id" :label="item.name">
						<template slot-scope="scope">
      						{{getSkuSpecValueName(item.id,scope.row.goodsSkuSpecList)}}
      					</template>
      				</el-table-column>
      				<!-- <el-table-column label="库存数量" width="100">
      					<template slot-scope="scope">
      						<el-input placeholder="请输入" size="mini" class="miniInput" v-model="scope.row.stock"></el-input>
      					</template>
      				</el-table-column> -->
      				<!-- <el-table-column label="销售价" >
      					<template slot-scope="scope">
      						<div>
								<div v-for="item in retailPrice" :key="item.id">{{item.minNumber}}
									<span v-if="(item.maxNumber!='' && item.maxNumber!=null) && item.maxNumber!=item.minNumber">- {{item.maxNumber}}</span>
									件<span v-if="item.maxNumber=='' || item.maxNumber==null">以上</span>
									 {{item.price}}元；
								</div>
							</div>
      					</template>
      				</el-table-column> -->
      				<el-table-column label="货品重量(g)" width="100">
      					<template slot-scope="scope">
      						<el-input placeholder="请输入" size="mini" class="miniInput" v-model="scope.row.weight"></el-input>
      					</template>
      				</el-table-column>
      				<!-- <el-table-column label="启用" width="60">
      					<template slot-scope="scope">
      						<el-checkbox v-model="scope.row.status"></el-checkbox>
      					</template>
      				</el-table-column> -->
      				<el-table-column label="默认" width="60">
      					<template slot-scope="scope">
      						<el-checkbox v-model="scope.row.defaultFlag" @change="setSkuDefault(scope.$index)"></el-checkbox>
      					</template>
      				</el-table-column>
      			</el-table>
      			<div class="pl10">
	      			<el-checkbox @change="seleceAllsku" size="small" :indeterminate="skuSelection.length!=0&&skuSelection.length!=skuListStr.length" v-model="skuselectStatus" class="mr10">全选</el-checkbox>
					<span class="op_project">
						<!-- <el-button type="text" size="small" :disabled="skuSelection.length==0" @click="plSetSkuStock()" >批量设置货品库存</el-button> -->
						<el-button type="text" size="small" :disabled="skuSelection.length==0" @click="plSetSkuWeight()" >批量设置货品重量</el-button>
					</span>
				</div>
			</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 2">
			<el-form-item label="PC端详细信息：">
				<custom-editor refname="pcContent" v-model="basicForm.bigFieldStr.content"></custom-editor>
			</el-form-item>
			<el-form-item label="" v-if="showMoc()">
				<el-checkbox v-model="showMobileContent">显示移动端详情</el-checkbox>
			</el-form-item>
			<el-form-item label="移动端详细信息：" v-show="showMobileContent">
				<custom-editor refname="mContent" v-model="basicForm.bigFieldStr.mobileContent"></custom-editor>
				<!-- <quill-editor v-model="basicForm.bigFieldStr.mobileContent" ></quill-editor> -->
			</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 3">
			<el-form-item label="相关产品：">
				<select-goods :selectids="relatedListStr" :goodsids="[id]" @change="getSelect"></select-goods>
			</el-form-item>
			<el-form-item label="">
				<el-table size="mini" :data="relatedListStr">
			    	<el-table-column prop="name" label="商品名称"></el-table-column>
			    	<el-table-column label="商品相关">
			    		<template slot-scope="scope">
			    			<el-radio-group v-model='scope.row.relatedType' size="mini">
							    <el-radio label="0">单向相关</el-radio>
							    <el-radio label="1">双向相关</el-radio>
						    </el-radio-group>
			    		</template>
			    	</el-table-column>
			    	<el-table-column label="商品相关">
			    		<template slot-scope="scope">
							<el-button type="text" size="mini" @click="deleteRelatedGoods(scope.$index)">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
			</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 4">
			<el-form-item label="标题：">
				<el-input placeholder="请输入标题" class="formInput" style="width:500px" disabled v-model="seoData.seoTitle"></el-input>
			</el-form-item>
			<el-form-item label="搜索关键词：">
				<el-input placeholder="请输入搜索关键词" class="formInput" style="width:500px" disabled v-model="seoData.seoKeywords"></el-input>
			</el-form-item>
			<el-form-item label="搜索描述：">
				<el-input type="textarea" :rows="4" placeholder="请输入搜索描述" class="formInput" style="width:500px" disabled v-model="seoData.seoDescription"></el-input>
			</el-form-item>
		</el-form>

		<div class="promotion_button">
			<el-button size="small" plain v-if="steps != 0" @click="prevStep">上一步</el-button>
			<el-button type="primary" size="small" v-if="steps != (stepsData.length-1)" @click="nextStep">下一步</el-button>
			<el-button type="primary" size="small"  @click="saveProduct" :disabled="saveDisabled">保存</el-button><!-- v-if="steps == (stepsData.length-1)" -->
		</div>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle'
	import { quillEditor } from 'vue-quill-editor'
	import selectGoods from './selectGoods'
	import setMemberPrice from './setMemberPrice'
	import setRetailPrice from './setRetailPrice'
	import setMemberDiscount from './setMemberDiscount'
	import setMemberCut from './setMemberCut'
	import addImg from '@components/addImg'
	import addVideo from '@components/addVideo'
	import customEditor from '@components/customEditor'
	import imgerror from '@v/common/images/imgerror.jpg'
	import Vue from 'vue'
	import vuedraggable from 'vuedraggable';

	export default {
		data() {
			let code = Math.floor(Math.random()*90000000+10000000)
			let checkCode = (rule, value, callback) => {
				let reg = /^([a-zA-Z0-9_-]){1,15}$/
		        if (!reg.test(value)) {
		          callback(new Error('支持数字、英文、-、_，最多15位'));
		        } else {
		          callback();
		        }
			};
			let checkSequence = (rule, value, callback) => {
				let reg = /^\d{1,6}$/
		        if (!reg.test(value)) {
		          callback(new Error('只能输入数字,最多6位'));
		        } else {
		          callback();
		        }
			}
		    let max999999999 = (rule, value, callback) => {
				let reg = /^\d{1,6}$/
		        if (!reg.test(value)) {
		          callback(new Error('库存最大限制999999'));
		        } else {
		          callback();
		        }
		    };
			return {
				id:'',
				saveDisabled:false,
				listImg:'0',
				showMobileContent:false,
				steps:0,
				stepsData:[
					{id:1,label:'基本信息'},
					{id:2,label:'商品规格'},
					{id:3,label:'详细信息'},
					{id:4,label:'相关产品'},
					// {id:5,label:'SEO设置'},
				],
				categoryData:[],
				defaultProps: {
				  multiple: true, 
				  checkStrictly: false, 
		          children: 'childrenList',
		          label: 'categoryName'
				},
				typeData:[],
				brandData:[],//品牌列表
				unitData:[],
				labelData:[],
				markIdStr:[],
				basicForm:{
					categoryId:'',
					templateId:'',
					name:'',
					code:code,
					marque:"",
					sequence:100,
					keywords:'',
					status:'0',
					markIdStr:[],
					unitId:'',
					retailPrice:'',
					price:'',
					// skuNumber:code+'01',
					weight:'',
					stock:0,
					bigFieldStr:{
						summary:'',
						content:'',
						mobileContent:''
					},
					memberPriceListStr:[],
				},
				basicRules:{
					categoryId: [
			            { required: true, message: '请选择商品分类', trigger: 'blur' },
			        ],
			        templateId: [
			            { required: true, message: '请选择商品类型', trigger: 'blur' },
			        ],
			        name: [
						{ required: true, message: '请输入商品名称', trigger: 'blur' },
						{ max: 128, message: '商品名称最长128', trigger: 'blur' },
			        ],
			        code: [
			            { required: true, message: '请输入商品编号', trigger: 'blur' },
			            { validator: checkCode , trigger: 'blur' }
					],
					// brandIds:[
					// 	{ required: true, message: '请选择商品品牌', trigger: 'blur' },
					// ],
					marque:[
						// { required: true, message: '请输入商品型号', trigger: 'blur' },
						{ max: 50, message: '商品型号最长50', trigger: 'blur' },
					],
					sequence: [
			            { validator: checkSequence , trigger: 'blur' }
					],
			        status: [
			            { required: true, message: '请输入商品状态', trigger: 'blur' },
			        ],
			        unitId: [
			            { required: true, message: '请选择计量单位', trigger: 'blur' },
			        ],
			        // skuNumber: [
			        //     { required: true, message: '请输入商品货号', trigger: 'blur' },
			        // ],
			        price: [
			            { required: true, message: '请输入商品市场价', trigger: 'blur' },
			        ],
			        stock: [
			            { required: true, message: '请输入商品库存', trigger: 'blur' },
			            { validator:max999999999 , trigger: 'blur' },
			        ],
			        keywords: [
			        	{ max: 200, message: '最长长度200字符', trigger: 'blur' },
			        ],
			        "bigFieldStr.summary": [
			        	{ max: 200, message: '最长长度200字符', trigger: 'blur' },
			        ],
				},
				imageListStr:[],
				listImageStr:{},
				attrData:[],
				specData:[],

				attributeValueListStr:[],
				attributeValueListStrExpand:[],
				specConfigListStr:[],
				specConfigListImg:{},
				skuListStr:[],

				relatedListStr:[],

				seoData:{
					seoTitle:'',
					seoKeywords:'',
					seoDescription:''
				},
				goodsOwnSpec:[],
				///////////////////////////////////////
				retailPrice:[],
				memberDiscount:[],
				memberCut:[],

				skuSelection:[],
				skuselectStatus:false,


			}
		},
		mounted() {
			this.id = this.$route.query.id || ''
			if(this.id!=''){
				this.getGoods(this.$route.query.id)
			}
			this.getCategory()
			this.getType()
			this.getBrand()//查询品牌
			this.getLabel()
			// this.getSeo()
			this.getUnit()
		},
		methods: {

			// 校验货品编码是否重复
			validateCode(obj,$index){
				// 先校验货品编号是否符合规范
				if(!/^([a-zA-Z0-9_-]){1,15}$/.test(obj.code)){
					obj.isError = true;
					this.$message({ message: '支持数字、英文、-、_，最多15位', type: 'error' });
					return;
				}else{
					obj.isError = true;
				}
				// debugger
				let itemObj = this.skuListStr.find((item,index) => index != $index && item.code == obj.code);
				if(itemObj){
					obj.isError = true;
					// itemObj.isError = true;
					this.$message({ message: '货品编码重复', type: 'error' });
				}else{
					obj.isError  = false;
					// itemObj.isError = false;
				}
				
			},
			showMoc(){
				if(Vue.prototype.$siteInfo){
					return Vue.prototype.$siteInfo.hasMo
				}else{
					this.getSite();
				}
			},
			//获取当前网站数据信息
			getSite(){
				this.$api("home.getSite",{siteTenantId:this.$nowSite.tenantId}).then((result) => {
					Vue.prototype.$siteInfo = result
					return Vue.prototype.$siteInfo.hasMo
				}, (error) => {
					this.$message({ message: '查询网站数据出错', type: 'error' });
				});
			},
			//图片出错
			onImgError(event) {
				event.srcElement.src = imgerror;
			},
			//批量设置货品库存
			plSetSkuStock(){
				this.$prompt(' ', '批量设置货品库存', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          inputPattern: /^\d+$/,
		          inputErrorMessage: '货品库存格式不正确',
		          customClass:'promptClass'
		        }).then(({ value }) => {
		          this.skuSelection.forEach( (element, index) => {
		          	element.stock = parseFloat(value)
		          });
		        }).catch(() => {});
			},
			//批量设置货品重量
			plSetSkuWeight(){
				this.$prompt(' ', '批量设置货品重量', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          inputPattern: /^\d+$/,
		          inputErrorMessage: '货品重量格式不正确',
		          customClass:'promptClass'
		        }).then(({ value }) => {
		          this.skuSelection.forEach( (element, index) => {
		          	element.weight = parseFloat(value)
		          });
		        }).catch(() => {});
			},
			//全选货品
			seleceAllsku(val){
				if(val && this.skuListStr.length > 0){
					this.skuListStr.forEach(row => {
			            this.$refs.skuTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.skuTable.clearSelection();
				}
			},
			//选择货品复选框
			handleSkuList(val){
				 this.skuSelection = val;
				 if(val.length == this.skuListStr.length){
		        	this.skuselectStatus = true
		        }else{
		        	this.skuselectStatus = false
		        }
			},
			//获取视频文件地址
			getVideo(val){
				console.log(val)
			},
			//规格合并单元格
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
		        if (column.label == '销售价') {
		          if (rowIndex  === 0) {
		            return {
		              rowspan: this.skuListStr.length,
		              colspan: 1
		            };
		          } else {
		            return {
		              rowspan: 0,
		              colspan: 0
		            };
		          }
		        }
			},
			//规格合并单元格
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
		        if (column.label == '销售价') {
		            return [2, 1];
		        }else {
		            return [1,1];
		        }
			},
			//设置阶梯价格
			getRetailPrice(val){
				this.retailPrice = val.retailPrice
				this.basicForm.price = val.price
			},
			//设置客户折扣
			getMemberDiscount(val){
				this.memberDiscount = val
				console.log(this.memberDiscount)
			},
			//设置客户返利
			getMemberCut(val){
				this.memberCut = val
				console.log(this.memberCut)
			},
			//判断不能取消选中规格
			checkCanntoSpec(specId,specValueId){
				let tmpspec = this.goodsOwnSpec.find((n)=>n.specId==specId&&n.specValueId==specValueId)
				return tmpspec ? true : false
			},
			//设置货品会员价格
			getSkuMemberPrice(val,index){
				this.skuListStr[index].goodsMemberPriceList = val.data
			},
			//设置会员价格
			getMemberPrice(val){
				this.basicForm.memberPriceListStr = val.data
			},
			//获取seo数据
			getSeo(){
				this.$api("goods.getSeo").then((result) => {
					for(let i in result.seoTitle){
						if(i!=0){
							this.seoData.seoTitle+=result.seoTitleSign
						}
						this.seoData.seoTitle+=result.seoTitle[i].name
					}
					for(let i in result.seoKeywords){
						if(i!=0){
							this.seoData.seoKeywords+=result.seoKeywordsSign
						}
						this.seoData.seoKeywords+=result.seoKeywords[i].name
					}
					for(let i in result.seoDescription){
						if(i!=0){
							this.seoData.seoDescription+=result.seoDescriptionSign
						}
						this.seoData.seoDescription+=result.seoDescription[i].name
					}
				}, (error) => {
					this.$message({ message: '查询SEO出错', type: 'error' });
				});
			},
			//添加列表图片
			addListImg(val){
				this.listImageStr = val
				this.listImageStr.listImageFlag = 1
				this.listImageStr.imageName = this.listImageStr.name
				this.listImageStr.url = this.listImageStr.imgUrl//path
				this.listImageStr.imgId = this.listImageStr.id
			},
			//添加商品图片
			getSrc(val){
				for(let i in val){
					let img = this.imageListStr.find((n)=>n.imgId == val[i].id)
					if(!img){
						val[i].imageName = val[i].name
						val[i].url = val[i].imgUrl
						val[i].imgId = val[i].id
						this.imageListStr.push(val[i])
					}
				}
				this.imageListStr[0].covered=1
			},
			//移除图片
			delImg(index){
				this.imageListStr.splice(index,1)
			},
			//根据id获取商品数据
			getGoods(id){
				this.$api("goods.getGoodsById",{id:id}).then((result) => {
					console.log(result)
					this.basicForm={
						id:result.id,
						categoryId:result.categoryId,
						templateId:result.templateId,
						name:result.name,
						code:result.code,
						brandIds:result.brandList && result.brandList.length != 0 ? result.brandList[0].id : "",
						marque:result.marque,
						sequence:result.sequence,
						keywords:result.keywords,
						status:result.status,
						retailPrice:result.retailPrice,
						price:result.price,
						// skuNumber:result.skuNumber,
						weight:result.weight,
						unitId:result.unitId,
						stock:result.stock,
						bigFieldStr:result.goodsBigField,
						memberPriceListStr:result.memberPriceList || []
					}
					this.markIdStr = result.markIds || []
					this.attributeValueListStr = result.goodsAttributeValueList || []
					this.imageListStr = result.goodsImageList || []
					if(result.listImage){
						this.listImageStr= result.listImage
						this.listImg = '1'
					}

					this.specData = result.attributeTemplate.specList || []
					this.attrData = result.attributeTemplate.attributeDetailList || []
					
					if(this.attributeValueListStr && this.attributeValueListStr.length > 0){
						for(let i in this.attributeValueListStr){
							let attrItem = this.attrData.find((n)=>n.id == this.attributeValueListStr[i].attributeId)
							if(attrItem.attributeType == '2' && attrItem.attributeTypeDetail == 'checkbox'){
								if(this.attributeValueListStr[i].attributeValue!=''){
									this.attributeValueListStr[i].attributeValue = this.attributeValueListStr[i].attributeValue.split(",")
								}
								for(let j in this.attributeValueListStr[i].attributeValue){
									this.attributeValueListStr[i].attributeValue[j] = Number(this.attributeValueListStr[i].attributeValue[j])
								}
							}else if(attrItem.attributeType == '2' && attrItem.attributeTypeDetail == 'select'){
								this.attributeValueListStr[i].attributeValue = Number(this.attributeValueListStr[i].attributeValue)
							}
						}
					}
					// 初始化拓展属性
					this.attributeValueListStrExpand = [];
					this.attrData.forEach( (el)=> {
						let attrItem = this.attributeValueListStr.find((n)=>n.attributeId == el.id)
						if(attrItem){
							if(el.attributeType == '2' && el.attributeTypeDetail == 'checkbox' && attrItem.attributeValue === ""){
								attrItem.attributeValue = [];
							}
							this.attributeValueListStrExpand.push(attrItem);
						}else{
							this.attributeValueListStrExpand.push({
								attributeId:el.id,
								attributeType:el.attributeType,
								attributeValue:el.attributeType == '2' && el.attributeTypeDetail == 'checkbox' ? [] : ''
							});
						}		
					} )

					this.specData.forEach( (el)=> {
						let tmpspec = this.goodsOwnSpec.find((n)=>n.specId==specId&&n.specValueId==specValueId)
						if(!tmpspec){
							this.specConfigListStr[el.id] = []
						}
					} )
					if(result.goodsSpecConfigList){
						this.goodsOwnSpec = result.goodsSpecConfigList
						for(let i in result.goodsSpecConfigList){
							if(!this.specConfigListStr[result.goodsSpecConfigList[i].specId]){
								this.specConfigListStr[result.goodsSpecConfigList[i].specId] = []
							}
							this.specConfigListStr[result.goodsSpecConfigList[i].specId].push(result.goodsSpecConfigList[i].specValueId)
							// 初始化规格图片列表
							if(!this.specConfigListImg[result.goodsSpecConfigList[i].specId]){
								this.$set(this.specConfigListImg,result.goodsSpecConfigList[i].specId,[]);
							}
							this.specConfigListImg[result.goodsSpecConfigList[i].specId].push(result.goodsSpecConfigList[i].imagePathList[0])
						}
					}
					(result.goodsSkuList || []).forEach((item) => {
						item.isError = false;
					});
					this.skuListStr = result.goodsSkuList || []
					for(let i in this.skuListStr){
						this.skuListStr[i].status = this.skuListStr[i].status == '1' ? true : false
						this.skuListStr[i].defaultFlag = this.skuListStr[i].defaultFlag == '1' ? true : false
						if(!this.skuListStr[i].goodsMemberPriceList){
							this.skuListStr[i].goodsMemberPriceList = []
						}
					}
					this.relatedListStr = result.goodsRelatedList || []



					/////////////////////////////////////////////////////
					this.retailPrice = result.wholesalePriceList || []
					this.memberDiscount = result.goodsDiscountList || []
					this.memberCut = result.goodsRebateList || []




				}, (error) => {
					this.$message({ message: '查询商品详情出错', type: 'error' });
				});
			},
			//删除相关商品
			deleteRelatedGoods(index){
				this.relatedListStr.splice(index,1)
			},
			//选择相关商品
			getSelect(val){
				val.forEach((e)=>{
					let index = this.relatedListStr.findIndex((n)=>n.relatedId == e.relatedId )
					console.log(index)
					if(index == -1){
						this.relatedListStr.push(e)
					}
				})
			},
			//设置为默认货品
			setSkuDefault(index){
				for(let i in this.skuListStr){
					this.skuListStr[i].defaultFlag = false
				}
				this.skuListStr[index].defaultFlag = true
			},
			//对比货品规格
			doExchange(doubleArrays){
		        var len = doubleArrays.length;
			    if (len >= 2) {
			        var len1 = doubleArrays[0].length;
			        var len2 = doubleArrays[1].length;
			        var newlen = len1 * len2;
			        var temp = new Array(newlen);
			        var index = 0;
			        for (var i = 0; i < len1; i++) {
			            for (var j = 0; j < len2; j++) {
		            		let arr1 = [];
		            		if(Array.isArray(doubleArrays[0][i])){
		            			for(let k in doubleArrays[0][i]){
		            				arr1.push(doubleArrays[0][i][k])
		            			}
		            		}else{
		            			arr1.push(doubleArrays[0][i])
		            		}
		            		arr1.push(doubleArrays[1][j])
		            		temp[index] = arr1
			                index++;
			            }
			        }
			        var newArray = new Array(len- 1);
			        newArray[0] = temp;
			        if (len > 2) {
			           var _count = 1;
			           for(var i=2;i<len;i++) {
			               newArray[_count] = doubleArrays[i];
			               _count ++;
			           }
			        }
			        return this.doExchange(newArray);
			    }
			    else {
			        return doubleArrays[0];
			    }
			},
			//设置货品数据
			setSkus(val){
				let flag = true
				let select = false
				console.log(this.specConfigListStr);
				for(let i in this.specConfigListStr){
					if(this.specConfigListStr[i].length == 0){
						flag = false
					}
					if(this.specConfigListStr[i].indexOf(val.id) > -1 ){
						select = true
					}
				}
				if(!flag){
					this.skuListStr = []
				}else{
					let arr = []
					for(let i in this.specConfigListStr){
						let tmparr=[]
						for(let j in this.specConfigListStr[i]){
							tmparr.push({
								specId:i,
								specValueId:this.specConfigListStr[i][j]
							})
						}
						arr.push(tmparr);
					}
				    let specList = this.doExchange(arr)
				    function dosomething(arr1,arr2){
				    	let flag = true
				    	for(let i in arr2){
				    		let tmp = arr1.find((n)=>n.specId == arr2[i].specId && n.specValueId == arr2[i].specValueId)
				    		if(!tmp){
				    			flag = false
				    		}
				    	}
				    	return flag
				    }
				    for(let i in specList){
				    	if(Object.prototype.toString.call(specList[i]) != '[object Array]'){
					    	specList[i] = [specList[i]]
					    }
				    	let skuItem = {
							"code":'',
							"stock":'0',
							"price":"",
							"retailPrice":"",
							"weight":0,
							"status":0,
							"defaultFlag":false,
							"goodsSkuSpecList":specList[i],
							"goodsMemberPriceList":[],
							"isError":false,
							"marque":""
						}
						let hasItem = this.skuListStr.find((n)=> dosomething(n.goodsSkuSpecList,specList[i]))
						if(!hasItem){
							this.skuListStr.push(skuItem)
						}
				    }
				    if(!select){
				    	for(let i in this.skuListStr){
				    		let index = this.skuListStr[i].goodsSkuSpecList.findIndex((n)=>n.specValueId==val.id)
				    		if(index>-1){
				    			this.skuListStr.splice(i,1)
				    		}
				    	}
				    	let newSkuListStr = this.skuListStr.filter((element) => {
				    		let index = element.goodsSkuSpecList.findIndex((n)=>n.specValueId==val.id)
							return index == -1
						})
						this.skuListStr = newSkuListStr
				    }
				    this.skuListStr[0].defaultFlag = true
				    for(let i in this.skuListStr){
				    	if(!this.skuListStr[i].id){
				    		this.skuListStr[i].code = this.basicForm.code+i
				    	}
				    }
				}
			},
			//根据规格id，规格值id，获取规格名称
			getSpecValueName(specId,specValueId){
				let valueList = this.specData.find((n)=> n.id == specId).specValueList
				let valueItem = valueList.find((n)=> n.id == specValueId)
				return valueItem.name
			},
			//规格上传图片
			addImgs(val,id,index){
				if(!this.specConfigListImg[id]){
					this.$set(this.specConfigListImg,id,{})
					// this.specConfigListImg[id][index] = val.imgUrl
					this.$set(this.specConfigListImg[id],index,val.imgUrl)
				}else{
					this.$set(this.specConfigListImg[id],index,val.imgUrl)
				}
			},
			//根据规格id，规格值id，获取规格值名称
			getSkuSpecValueName(specId,goodsSkuSpecList){
				let specValue = goodsSkuSpecList.find((n)=>n.specId == specId)
				return this.getSpecValueName(specId,specValue.specValueId)
			},
			//点击上一步
			prevStep(){
				this.steps-=1
			},
			//点击下一步
			nextStep(){
				switch (this.steps) {
					case 0:
						this.$refs.basicForm.validate((valid) => {
				        	if (valid) {
				        		if(this.specData.length == 0){
				        			if(!this.checkStepPrice()){return}
								}
								if(this.imageListStr == 0){
									this.$message({ message: '请至少添加一张图片', type: 'error' });
									return
								}
					            this.steps += 1
				        	}else{
				        		console.log('error validate');return
				        	}
				        });
						break;
					case 1:
						if(!this.checkSpec()){return}
						if(!this.checkStepPrice()){return}
						this.steps+=1
						break;
					case 2:
						this.steps+=1
						break;
					case 3:
						this.steps+=1
						break;
				}

			},
			//切换商品分类
			changeCat(val){
				let cat = this.categoryData.find( (n) => n.id ==val )
				// if(cat.templateId){
				// 	this.basicForm.templateId = cat.templateId
				// }
			},
			//切换商品类型
			changeType(val){
				this.getTypeById(val)
			},
			//根据id查询商品类型详情
			getTypeById(id){
				const loading = this.$loading();
				this.$api("goods.getGoodsTypeAllById",{id:id}).then((result) => {
					loading.close();
					this.attrData = result.attributeDetailList || []
					this.specData = result.specList || []
					this.skuListStr = []
					this.attributeValueListStr = []
					this.attrData.forEach( (el)=> {
						this.attributeValueListStr.push({
							attributeId:el.id,
							attributeType:el.attributeType,
							attributeValue:el.attributeType == '2' && el.attributeTypeDetail == 'checkbox' ? [] : ''
						})
					} )
					this.attributeValueListStrExpand = this.attributeValueListStr;
					this.specConfigListStr = []
					this.specData.forEach( (el)=> {
						this.specConfigListStr[el.id] = []
					} )
				}, (error) => {
					loading.close();
					this.$message({ message: '查询商品类型出错', type: 'error' });
				});
			},
			//查询商品单位
			getUnit(){
				this.$api("goods.getUnitList").then((result) => {
					this.unitData = result.list
					console.log(result.list)
					let defaultid = this.unitData.find((n)=>n.defaulted == 1)
					if(defaultid){
						this.basicForm.unitId = defaultid.id
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品计量单位出错', type: 'error' });
					}
				});
			},
			//查询商品分类
			getCategory(){
				this.$api("goods.getGoodsCategory").then((result) => {
					this.categoryData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品分类出错', type: 'error' });
					}
				});
			},
			//查询商品类型
			getType(){
				this.$api("goods.getGoodsType").then((result) => {
					this.typeData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品类型出错', type: 'error' });
					}
				});
			},
			// 查询品牌
			getBrand(){
				this.$api("goods.getBrandList").then((result) => {
					this.brandData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询品牌出错', type: 'error' });
					}
				});
			},
			//查询商品标签
			getLabel(){
				this.$api("goods.getGoodsLabel").then((result) => {
					this.labelData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品标签出错', type: 'error' });
					}
				});
			},
			//校验商品规格
			checkSpec(){
				let flag = true
				if(this.specData.length != 0 && this.skuListStr.length == 0){
					this.$message({ message: '请填写商品规格', type: 'error' });return
				}
				return flag
			},
			//校验阶梯价格
			checkStepPrice(){
				let flag = true
				// if(this.retailPrice.length == 0 ){
				// 	this.$message({ message: '请填写阶梯价格', type: 'error' });return
				// }
				return flag
			},
			//点击保存商品
			saveProduct(){
				this.$refs.basicForm.validate((valid) => {
		        	if (!valid) {
		        		console.log('error validate');return
		        	}else{
						
						if(this.imageListStr == 0){
							this.$message({ message: '请至少添加一张图片', type: 'error' });
							return
						}
		        		if(!this.checkSpec()){return}
						if(!this.checkStepPrice()){return}
						//校验商品编号是否重复
		        		this.$api("goods.checkCodeExist",{code:this.basicForm.code,id:this.id}).then((result) => {
							if(result.existFlag == '1'){
								this.$message({ message: '商品编号重复', type: 'error' });return
							}else{
								console.log(this.skuListStr)
								let flag = false;//货品编号校验标识
								let skuParamList = [];
								this.skuListStr.forEach((item) => {
									skuParamList.push({
										"id":item.id,
										"code":item.code
									})
									if(item.isError){
										flag = true;
									}
								})
								if(flag){
									this.$message({ message: "货品编码支持数字、英文、-、_，最多15位", type: 'error' });
									return;
								}
								if(skuParamList.length == 0){
									this.getProductParams();
									return;
								}
								this.$api("goods.codeIsExist",{skuParamList:skuParamList}).then((result) => {
									if(result.status === "error"){
										this.$message({ message: result.msg, type: 'error' });
										return;
									}
									let existAry = [];
									for(let key in result){
										if(result[key] === "true"){
											existAry.push(key)
										}
									}
			
									if(existAry.length == 0){
										this.getProductParams()
									}else{
										this.skuListStr.forEach((item) => {
											if(existAry.find((e) => e == item.code)){
												item.isError = true;
											}else{
												item.isError = false;
											}
										})
										this.$message({ message: '货品编号已存在，请重新输入', type: 'error' });
									}
									
								},(error) => {
									this.saveDisabled = false;
									this.$message({ message: '校验货品编号重复出错', type: 'error' });
								});
								
							}
						}, (error) => {
							this.saveDisabled = false;
							this.$message({ message: '网络错误', type: 'error' });
						});
		        	}
		        });

			},
			//组装商品参数，并保存
			getProductParams(){
				this.attributeValueListStr = this.attributeValueListStrExpand;
				let tmpSpec = []
				for(let i in this.specConfigListStr){
					for(let j in this.specConfigListStr[i]){
						let imgList = []
						if(this.specConfigListImg[i] && this.specConfigListImg[i][j]){
							imgList.push(this.specConfigListImg[i][j])
						}
						tmpSpec.push({
							specId:i,
							specValueId:this.specConfigListStr[i][j],
							imagePathList:imgList,
						})
					}
				}
				for(let i in this.skuListStr){
					let numReg = /^\d+$/
					let stockReg = /^\d{1,6}$/
					let floatReg = /^(\d){1,11}$|^(\d){1,11}\.(\d){1,2}$/
					let codeReg = /^[a-zA-Z0-9_-]*$/
					if(!codeReg.test(this.skuListStr[i].code)){
						this.$message({ message: '请正确填写货品编号', type: 'error' });return
					}
					// if(!stockReg.test(this.skuListStr[i].stock)){
					// 	this.$message({ message: '请正确填写货品库存,最多999999', type: 'error' });return
					// }
					// if(!floatReg.test(this.skuListStr[i].price)){
					// 	this.$message({ message: '请正确填写货品市场价', type: 'error' });return
					// }
					// if(!floatReg.test(this.skuListStr[i].retailPrice)){
					// 	this.$message({ message: '请正确填写货品销售价', type: 'error' });return
					// }
					if(!numReg.test(this.skuListStr[i].weight)){
						this.$message({ message: '请正确填写货品重量', type: 'error' });return
					}
					this.skuListStr[i].status = this.skuListStr[i].status == true ? '1' : '0'
					this.skuListStr[i].defaultFlag = this.skuListStr[i].defaultFlag == true ? '1' : '0'
					this.skuListStr[i].price = this.basicForm.price
				}
				for(let i in this.attributeValueListStr){
					if(typeof this.attributeValueListStr[i].attributeValue == "object" ){
						this.attributeValueListStr[i].attributeValue = this.attributeValueListStr[i].attributeValue.join(",")
					}
				}
				if(this.listImg == '0'){
					this.listImageStr = ''
				}

				this.basicForm.specConfigListStr = tmpSpec
				this.basicForm.attributeValueListStr = this.attributeValueListStr
				this.basicForm.skuListStr  = this.skuListStr
				this.basicForm.relatedListStr = this.relatedListStr
				this.basicForm.markIdStr = this.markIdStr.join(",")
				this.basicForm.imageListStr = this.imageListStr
				this.basicForm.listImageStr = this.listImageStr


				/////////////////////////////////////
				this.basicForm.wholesalePriceListStr = this.retailPrice
				this.basicForm.goodsRebateListStr = this.memberCut
				this.basicForm.goodsDiscountListStr = this.memberDiscount
				
				if(this.basicForm.price == 'null' || this.basicForm.price == null){
					this.basicForm.price = ''
				}
				if(this.basicForm.retailPrice == 'null' || this.basicForm.retailPrice == null){
					this.basicForm.retailPrice = ''
				}
				// 无规格商品把weight赋给货品
				if(this.specData.length == 0){
					if(this.basicForm.skuListStr.length > 0){
						this.basicForm.skuListStr[0].weight = this.basicForm.weight;
					}
				}
				console.log(this.basicForm)
				let api = "goods.addGoods"
				if(this.id!=''){
					api = "goods.updateGoods"
				}
				this.saveDisabled = true;
				this.$api(api,this.basicForm).then((result) => {
					this.$message({ message: '保存商品成功', type: 'success' });
					this.$router.push({name:"goodsList"})
				}, (error) => {
					this.saveDisabled = false;
					this.$message({ message: '保存商品出错', type: 'error' });
				});
			}
		},
		components: {
			pageTitle,
			quillEditor,
			selectGoods,
			setMemberPrice,
			setRetailPrice,
			setMemberDiscount,
			setMemberCut,
			addImg,
			addVideo,
			customEditor,
			vuedraggable
		}
	}
</script>
<style scoped="scoped">
.imgCon{overflow: hidden; padding-top: 10px}
.imgItem{display: block; float: left; width:100px; height: 100px; overflow: hidden; margin-right: 10px; margin-bottom: 10px; border:1px solid #efefef; border-radius: 4px; position: relative;}
.imgItem .delImg{position: absolute; right: 0px; top: 0px; z-index: 8; padding: 5px; color:#ddd; font-size: 16px}
.imgCon img{width:100%;}
</style>
<style>
.xtggtable .el-table__empty-block{display: none;}
.promptClass{width: 300px}
.codeError .el-input__inner{
	border:1px solid red;
}
</style>
