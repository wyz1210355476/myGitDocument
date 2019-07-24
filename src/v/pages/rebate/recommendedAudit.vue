<template>
	<div class="contents">
		<page-title title="推荐审核"></page-title>
		<tab-filter :options="options" @click="getFilterParam()" param="pageTag"></tab-filter>
		<div style="overflow:hidden">
			<el-button type="primary" size='small' @click="toAdd('1')">新增</el-button>
		  	<div class="search_con">
		  		<operation ref="operation" module="recommended_audit" @search="getSearchParam"></operation>
			</div>
		</div>
		<div class="content-table">
			<el-table :data="auditData" size="mini" v-loading="loading">
			    <el-table-column label="客户名称">
			    	<template slot-scope="scope">
				        {{ scope.row.loginid | specCharacter}}
			      	</template>
			    </el-table-column>
				<el-table-column label="手机号码">
					<template slot-scope="scope">
				        {{ scope.row.mobile }}
			      	</template>
				</el-table-column>
				<el-table-column prop="truename" label="姓名"></el-table-column>
			    <el-table-column prop="name" label="分组"></el-table-column>
				<el-table-column prop="application_time" label="申请时间"></el-table-column>
                <el-table-column prop="last_operation_time" label="最后操作时间"></el-table-column>
                <el-table-column prop="recommendation_code" label="推荐码"></el-table-column>
                <el-table-column prop="parentcount" label="直接推荐人数"></el-table-column>
                <el-table-column prop="grandpacount" label="间接推荐人数"></el-table-column>
				<el-table-column label="状态">
			    	<template slot-scope="scope">
				        {{ scope.row.recommendation_user_status | auditState}}
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="200">
			      	<template slot-scope="scope">
			      		<el-button type="text" size="small" @click="toAdd('2',scope.row)">查看</el-button>

						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover1"
							v-if="scope.row.recommendation_user_status == 1 || scope.row.recommendation_user_status == 3">
							<p>确认允许该账号参与推荐返利吗?</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover1 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperateState(scope.row.recommendation_user_id,'2',scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">通过</el-button>
						</el-popover>

						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover2"
							v-if="scope.row.recommendation_user_status == 1">
							<p>确认驳回该推荐账号申请吗?</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover2 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperateState(scope.row.recommendation_user_id,'3',scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">驳回</el-button>
						</el-popover>
						
						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover3"
							v-if="scope.row.recommendation_user_status == 2">
							<p>请确认暂停该账号参与推荐返利！</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover3 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperateState(scope.row.recommendation_user_id,'4',scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">暂停</el-button>
						</el-popover>

						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover4"
							v-if="scope.row.recommendation_user_status == 2">
							<p>请确认终止该账号参与推荐返利！</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover4 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperateState(scope.row.recommendation_user_id,'5',scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">停止</el-button>
						</el-popover>
                        
						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover5"
							v-if="scope.row.recommendation_user_status == 4">
							<p>请确认重启该账号参与推荐返利！</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover5 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperateState(scope.row.recommendation_user_id,'2',scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">重启</el-button>
						</el-popover>
                     
				        <el-popover
				        	class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover6"
							 v-if="scope.row.recommendation_user_status == 3">
							<p>确认删除该推荐账号吗?</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover6 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="del(scope.row.uid,scope.row)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>

                        <el-button type="text" size="small" @click="showDetail(scope.row.uid)" v-if="scope.row.recommendation_user_status == 2 || scope.row.recommendation_user_status == 4 || scope.row.recommendation_user_status == 5">推荐明细</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam('page')"></pages>

        <el-dialog :title="recommendedMemberTitleState | toTitle" :visible.sync="recommendedMemberDialog" >
			<div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small" class="demo-ruleForm">
                    <el-form-item label="客户名称" prop="loginid" class="formInput" :key="ruleForm.key">
                        <el-input v-model="ruleForm.loginid" :disabled="recommendedMemberTitleState == 2"></el-input>
                    </el-form-item>
                         
                    <el-form-item label="手机号码" prop="mobile" class="formInput">
                        <el-input v-model="ruleForm.mobile" :disabled="true"></el-input>
                    </el-form-item>
            
                
                    <el-form-item label="姓名" prop="truename" class="formInput">
                        <el-input v-model="ruleForm.truename" :disabled="true"></el-input>
                    </el-form-item>
                     
                    <el-form-item label="分组" prop="name" class="formInput">
                        <el-input v-model="ruleForm.name" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="推荐码" prop="recommendation_code" class="formInput" :key="ruleForm.key">
                        <el-input v-model="ruleForm.recommendation_code" :disabled="recommendedMemberTitleState == 2"></el-input>
                    </el-form-item>
                </el-form>
            </div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="recommendedMemberDialog = false" size="mini">{{recommendedMemberTitleState == 1 ? "取消" : "关闭"}}</el-button>
                <el-button @click="save" size="mini" type="primary" v-if="recommendedMemberTitleState == 1">保存</el-button>
			</span>
		</el-dialog>
	
        <!-- 推荐明细 -->
        <recommended-detail :visibility.sync="showRecommendedDetail" :id="viewDetailId" v-if="showRecommendedDetail"></recommended-detail>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'
    import tabFilter from '@components/tabFilter'
    import recommendedDetail from './recommendedDetail'
	export default {
		data() {
			var checkLoginid = (rule, value, callback) => {
				this.$api("rebate.getUserInfoByLogin",{loginid:value}).then((result) => {
					this.ruleForm.mobile = result.mobile;
					this.ruleForm.name = result.name;
					this.ruleForm.truename = result.truename;
					this.ruleForm.uid = result.uid;
					callback();
				},(error) => {
					if(error.data.status == 102){
						callback(new Error('查询的客户不存在，请重新输入'));
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
						callback(new Error('查询的客户信息失败'));
					}
					
				})
			}
			var checkCode = (rule, value, callback) => {
				if(/^[\da-zA-Z]{0,30}$/.test(value)){
					callback();
				}else{
					callback(new Error('只能输入字母和数字,最长30个字符'));
				}
			}
			return {
                options: [{
                    label: "待审核",
                    name: "1"
                }, {
                    label: "已审核",
                    name: "2"
                }, {
                    label: "暂停中",
                    name: "4"
                }, {
                    label: "已驳回",
                    name: "3"
                }, {
                    label: "已停止",
                    name: "5"
                }, {
                    label: "全部",
                    name: "0"
				}],
                auditData:[],// 列表数据
                loading:false,
                totalCount:0,
                recommendedMemberDialog:false,
                ruleForm:{
                    loginid:"",
                    mobile:"",
                    recommendation_code:""
                },
                rules:{
                    loginid:[
						{ required: true, message: '请输入客户名称', trigger: 'blur' },
						{ validator: checkLoginid , trigger: 'blur' }
                    ],
                    recommendation_code:[
						{ required: true, message: '请输入推荐码', trigger: 'blur' },
						{ validator: checkCode , trigger: 'blur' }
                    ]
                },
                recommendedMemberTitleState:"",
				showRecommendedDetail:false,
				tag:"1"
			}
		},
		mounted() {
			if(this.$route.query.pageTag){
				this.tag = this.$route.query.pageTag
			}
			this.getDataList();	
		},
		filters:{
			auditState(value){
				switch (value+"") {
					case '1':
						return "待审核"
						break;
					case '2':
						return "已审核"
						break;
					case '4':
						return "暂停中"
						break;
					case '3':
						return "已驳回"
						break;
					case '5':
						return "已停止"
						break;
					default:
						return  "未知"
						break;
				}
            },
            toTitle(value){
                switch (value){
                    case '1':
						return "新增推荐会员"
						break;
					case '2':
						return "查看推荐会员"
						break;
                }
            }
		},
		methods: {
			//搜索查询
			getSearchParam(val){
				// 渲染列表
				this.getDataList({
					key:val.search_select,
					value:val.search_value
				});
			},
			// 标签切换
			getFilterParam(val){
				this.tag = this.$route.query.pageTag;
				// 渲染列表
				this.getDataList();
			},
			//分页
			getPagesParam(){
				// 渲染列表
				this.getDataList();
			},
			// 渲染推荐审核列表
			getDataList(obj){
				let params = {
					'status':this.tag,
					'pageSize':this.$route.query.pageSize ? this.$route.query.pageSize : 10,
					'page':this.$route.query.currentPage ? this.$route.query.currentPage : 1
				};
				if(obj){Object.assign(params, obj)}
				this.$api("rebate.getRecommendedAuditList",params).then((result) => {
					this.auditData = result.list;
                	this.totalCount = result.page.total;
				},(error) => {
					if(error.data.status == 102){
						this.auditData = [];
						this.totalCount = 0;
					}else{
						this.$message({
							message: error.data.msg,
							type: 'error'
						});
					}
				})
			},
			// 返利列表状态
			toOperateState(id,state,rowData){
				let params = {
					recommendation_user_status:state,
					recommendation_user_id:id
				}
				this.$api("rebate.upRecommendedAudit",params).then((result) => {
					this.$message({
						message: "操作成功！",
						type: 'success'
					});
					this.getDataList()
				},(error) => {
					this.$message({
						message: error.data.msg,
						type: 'error'
					});
				})
				
			},
			// 删除
			del(id){
				this.$api("rebate.delRecommendedAudit",{uid:id}).then((result) => {
					this.$message({
						message: "操作成功！",
						type: 'success'
					});
					this.getDataList()
				},(error) => {
					this.$message({
						message: error.data.msg,
						type: 'error'
					});
				})
			},
            // 新增推荐会员
            toAdd(type,data){
                /**
                 * type 为新增和查看的标识
                 * 1 为新增
                 * 2 为查看
                 * 
                 * id 为推荐会员的id
                 */
                this.recommendedMemberTitleState = type;
                if(type == "1"){
					this.ruleForm = {
						loginid:"",
						mobile:"",
						recommendation_code:"",
						key:Date.now()
					}
				}else if(type == "2"){
					this.ruleForm = {
						loginid:data.loginid,
						mobile:data.mobile,
						truename:data.truename,
						name:data.name,
						recommendation_code:data.recommendation_code
					}
				}
                this.recommendedMemberDialog = true;
			},
			// 推荐明细
            showDetail(uid){
				this.viewDetailId = uid;
                this.showRecommendedDetail = true;
			},
			// 保存
			save(){
				this.$refs.ruleForm.validate((valid) => {
					if(valid){
						let params = {
							recommendation_code:this.ruleForm.recommendation_code,
							uid:this.ruleForm.uid
						}

						this.$api("rebate.addRecommendedAudit",params).then((result) => {
							this.recommendedMemberDialog = false;
							this.getDataList();
						},(error) => {
							this.$message({
								message: error.data.msg,
								type: 'error'
							});
						})
					}
				})	
			}
		},
		components: {
			pageTitle,
			pages,
			operation,
            tabFilter,
            recommendedDetail
		}
	}
</script>
<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.dropdown-link{font-size: 12px; color: #409EFF; margin-left: 10px;}
</style>
