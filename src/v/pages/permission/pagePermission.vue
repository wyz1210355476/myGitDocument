<template>
	<div class="contents" v-loading="loading">
		<page-title :title="'页面访问权限设置'"></page-title>

		<div class="bar">
			<span>展示端：</span>
		    <el-radio-group v-model="equipment" size="mini" @change="equipmentChange">
		      <el-radio-button :label="1">PC站</el-radio-button>
		      <el-radio-button :label="2">移动站</el-radio-button>
		    </el-radio-group>
	    </div>
	    <div class="bar">
			<span>权限类型：</span>
		    <el-radio-group v-model="permissionType" size="mini" @change="permissionTypeChange">
		      <el-radio-button :label="-1">全部</el-radio-button>
		      <el-radio-button :label="1">全部访客</el-radio-button>
		      <el-radio-button :label="2">会员专享</el-radio-button>
		    </el-radio-group>
	    </div>

	    <div class="content-table">
	    	<el-table :data="pageList" style="width: 100%" size="mini" empty-text="没有相关信息" class="table-one-line">
                <el-table-column prop="pageName" label="页面名称" width="200">
                	<template slot-scope="scope">
            			<span class="one-line" :title="scope.row.pageName">{{scope.row.pageName}}</span>
            		</template>
            	</el-table-column>
            	<el-table-column prop="type" label="权限类型" width="200">
            		<template slot-scope="scope">
				        <span class="one-line" :title="scope.row.type | showType">{{ scope.row.type | showType}}</span>
			        </template>
            	</el-table-column>

            	<el-table-column prop="roles" label="权限详情">
            		<template slot-scope="scope">
				        <span class="one-line" :title="scope.row.roles | showDetail">{{ scope.row.roles | showDetail}}</span>
			        </template>
            	</el-table-column>

           		<el-table-column label="操作" prop="operation">
           			<template slot-scope="scope">
				        <el-button
				          @click.native.prevent="set(scope.row.pageName,scope.row.pageId)"
				          type="text"
				          size="small">
				          设置
				        </el-button>
			      </template>
            	</el-table-column>
			</el-table>
			<el-dialog title="页面访问权限设置" :visible.sync="dialog">
				<el-alert
				    title="设置前台页面的访问权限，设置会员专享则仅有有权限的登录会员才可访问对应页面。"
				    type="info"
				    :closable="false"
				    show-icon>
				</el-alert>
				<div class="rightBox">
					<span>权限：</span>
				    <el-radio-group v-model="right" size="mini" @change="getMemberInfo">
				      <el-radio-button :label="1">全部访客</el-radio-button>
				      <el-radio-button :label="3">会员专享</el-radio-button>
				    </el-radio-group>
					<div class="slectBox" v-if="right == 3">
						<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
						<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="checkedMembers" @change="handleCheckedMemberChange">
						    <el-checkbox v-for="memberLevel in memberLevels" :label="memberLevel.id" :key="memberLevel.id">{{memberLevel.name}}</el-checkbox>
						</el-checkbox-group>
					</div>   
			    </div>
				<div slot="footer" class="dialog-footer">
				    <el-button @click="dialog = false" size="small">取 消</el-button>
				    <el-button type="primary" @click="save" size="small">确 定</el-button>
			    </div>
			</el-dialog>
	    </div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	export default {
		data(){
			return{
				loading:false,
				/***展示端***/ 
				equipment:1,
				/***权限类型***/
				permissionType:-1,
				/***页面访问权限***/
				right:'',
				/***全选***/
				checkAll:false,
				/***选中的值***/
				checkedMembers:[],
				/***记录所有会员的id***/
				allMembers:[],
				/***半选的状态***/
				isIndeterminate:false,
				/***会员等级***/
				memberLevels:[],
				dialog:false,
				/***页面权限列表***/
				pageList:[],
				/***记录当前的页面id***/
				pageId:'',
				/***记录当前的页面name***/
				pageName:''
			}
		},
		mounted(){
			this.getPermissionList()
		},
		filters:{
			showDetail(val){
				let detail = [];
				if(val && val.length > 0){
					val.forEach(function(item,index){
						detail.push(item.name);
					})
				}
				return detail.join();
			},
			showType(val){
				let type;
				switch(val+""){
					case "1":
						type = "全部访客";
						break;
					case "2":
						type = "会员专享";
						break;
					case "3":
						type = "部分会员";
						break;
				}
				return type;
			}
		},
		methods:{
			equipmentChange(){//展示端改变
				this.getPermissionList()
			},
			permissionTypeChange(){//权限类型改变
				this.getPermissionList()
			},
			getPermissionList(){//获取页面权限列表
				let param = {
					viewType:this.equipment,
					permissionType:this.permissionType
				}
				this.$api("permission.pagePermissionList",param).then((result) => {
					this.pageList = result;
				},(err) => {
					this.$message({ message: '获取页面权限列表失败', type: 'error' });
				})
			},
			set(pageName,pageId){//设置
				this.pageId = pageId;
				this.pageName = pageName;
				this.dialog = true;
				let param = {
					pageId:pageId,
					pageName:pageName
				}
				this.checkedMembers = [];
				this.$api("permission.getPagePermission",param).then((result) => {
					this.right = result.type == 2 ? 3 : result.type;
					this.getMemberInfo(this.right);
					(result.roles || []).forEach((item,index) => {
						this.checkedMembers.push(item.id);
					})
				},(err) => {
					this.$message({ message: '获取网站页面权限详情失败', type: 'error' });
				})
			},
			getMemberInfo(val){//获取所有角色信息
				if(val == 1){
					return;
				}
				this.allMembers = [];
				this.$api("permission.findAllRoles",{}).then((result) => {
					this.memberLevels = result;
					result.forEach((item,index) => {
						this.allMembers.push(item.id)
					})
					this.handleCheckedMemberChange(this.checkedMembers)
				},(err) => {
					this.$message({ message: '获取所有角色信息列表失败', type: 'error' });
				})
			},
			handleCheckedMemberChange(value){//选择角色
				let checkedCount = value.length;
		        this.checkAll = checkedCount === this.allMembers.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.memberLevels.length;
			},
			handleCheckAllChange(val){//全选角色
				this.checkedMembers = val ? this.allMembers : [];
        		this.isIndeterminate = false;
			},
			save(){
				let type = this.right;
				if(this.checkedMembers.length == this.allMembers.length && type != 1){
					type = 2;
				}
				if(type == 3 && this.checkedMembers.length == 0){
					this.$message({ message: '请至少选择一个会员！', type: 'warning'});
					return;
				}
				let param = {
					pageId:this.pageId,
					pageName:this.pageName,
					roleIds:this.checkedMembers.join(','),
					type:type
				}
				this.$api("permission.savePagePermission",param).then((result) => {
					this.dialog = false;
					this.$message({ message: '设置成功！', type: 'success' });
					this.getPermissionList();
				},(err) => {
					this.$message({ message: '保存失败！', type: 'error' });
				})
			}
		},
		components:{
			pageTitle
		}
	}
</script>
<style scoped>
	.bar{
		display:inline-block;
		margin:0 20px 0 0;
	}
	.rightBox{
		margin:20px 0 15px 5px;
	}
	.slectBox{
		margin:20px 0 0 45px;
	}
</style>