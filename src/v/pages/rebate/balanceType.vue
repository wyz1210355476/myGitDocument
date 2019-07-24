<template>
	<div class="contents">
		<page-title :title="'收支类型'">
			<div slot="subtitle">勾选后即可在返利调整下拉选框中显示</div>
		</page-title>
		<div v-loading="isLoading">
			<div slot="btn">
				<el-button type="primary" size="small" @click="addType('add')">新增</el-button>
			</div>

			<div class="content-table">
				<el-table :data="balanceTypeList" style="width: 100%" size="mini" empty-text="没有相关信息">
	                <el-table-column prop="bapatype_name" label="类型名称">
	                	<template slot-scope="scope">
	                		<el-checkbox v-if="scope.row.isdefault == 0" v-model="scope.row.start_using" @change="change(scope.$index)"></el-checkbox>
	                		<el-input v-model="scope.row.bapatype_name" placeholder="请输入内容" v-if="scope.row.id === ''" size="small" style="width:50%;font-size:12px;"></el-input>
	                		<span v-else>{{scope.row.bapatype_name}}</span>
	                	</template>
	            	</el-table-column>
	           		<el-table-column label="操作" prop="operation">
	           			<template slot-scope="scope">
						        <el-button
						          @click.native.prevent="$edit(scope.$index)"
						          type="text"
						          size="small"
						          v-if="scope.row.id !== ''"
						          >
						          编辑
						        </el-button>
						        <div v-else>
						        	<el-button
						        	@click.native.prevent="$cancel(scope.$index)"
						        	size="small"
						        	>
						        	取消
						        	</el-button>

							        <el-button
							        @click.native.prevent="$save(scope.$index)"
							        type="primary"
							        size="small"
							        >
							        保存
							    	</el-button>
						        </div>
						        
				      </template>
	            	</el-table-column>
				</el-table>	
			</div>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import tabFilter from '@components/tabFilter';
	import operation from '@components/operation';
	import router from '@c/router';
	export default {
		data() {
			return {
				isLoading:false,
				type:this.$route.query.type,
				ruleForm:{
					enable:""
				},
				balanceTypeList: [],
				totalCount: 10,
				oldBalanceTypeList:[],
				isShowHandler:true
			}
		},
		mounted() {
			this.getTypeList();
		},
		methods: {
			// 获取返利收支类型
			getTypeList() {
				this.isLoading = true;
				this.$api("rebate.getBaccountBapatypeList", {}).then((result) => {
					this.isLoading = false;
					result.forEach((item) => {
						item.start_using = item.start_using == 1 ? true : false;
					})
					this.balanceTypeList = result;
					this.oldBalanceTypeList = JSON.parse(JSON.stringify(this.balanceTypeList));
				}, (result)=>{
					this.isLoading = false;
					if(result.data.status != '102'){
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				})
			},
			// 新增返利收支类型
			addType(){
				var lastItem = this.balanceTypeList[this.balanceTypeList.length-1];
				if (lastItem !== undefined && lastItem.id === '') {
					return;
				}
				this.balanceTypeList.push({
					id:'',
					bapatype_name:'',
					isdefault:0,
					start_using:true
				});
				this.oldBalanceTypeList.push({
					id:'',
					bapatype_name:'',
					isdefault:0,
					start_using:true
				});
			},
			// 是否启用
			change(index){
				let idVal = this.balanceTypeList[index].id;
				if(idVal != ""){
					this.$save(index);
				}
			},
			// 编辑
			$edit(index){
				this.oldBalanceTypeList.splice(index,1,{
					id:this.balanceTypeList[index].id,
					bapatype_name:this.balanceTypeList[index].bapatype_name,
					start_using:this.balanceTypeList[index].start_using
				})
				this.balanceTypeList[index].id = '';
			},
			// 保存
			$save(index){
				var pattern = /^[\u4e00-\u9fa5a-zA-Z0-9_\-]{1,30}$/;
				if(!pattern.test(this.balanceTypeList[index].bapatype_name)){
					this.$message({
						message: '请输入1-30以内的中文,英文,数字,-或_的组合',
						type: 'warning'
					});
				}else{
					let isRepeat,list = this.oldBalanceTypeList,length = list.length;
					for(let i = 0;i < length;i++){
						if(i != index){
							if(list[i].bapatype_name == this.balanceTypeList[index].bapatype_name){
								isRepeat = true;
								break;
							}else{
								isRepeat = false;
							}
						}
					}
					if(isRepeat){
						this.$message({
							message: '类型名称不能重复！',
							type: 'error'
						});
						return;
					}
					if(this.oldBalanceTypeList[index].id === ''){//新增保存
						this.$api("rebate.addBaccountBapatype", {bapatype_name:this.balanceTypeList[index].bapatype_name,isdefault:0,start_using:this.balanceTypeList[index].start_using ? 1 : 0}).then((result) => {
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							this.balanceTypeList[index].id = this.oldBalanceTypeList[index].id = result.id;
							this.oldBalanceTypeList[index].bapatype_name = this.balanceTypeList[index].bapatype_name;
						}, (result)=>{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					}else{//编辑保存
						this.$api("rebate.editBaccountBapatype", {bapatype_name:this.balanceTypeList[index].bapatype_name,isdefault:this.balanceTypeList[index].isdefault,start_using:this.balanceTypeList[index].start_using ? 1 : 0,id:this.oldBalanceTypeList[index].id}).then((result) => {
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							this.balanceTypeList[index].id = this.oldBalanceTypeList[index].id;
							this.oldBalanceTypeList[index].bapatype_name = this.balanceTypeList[index].bapatype_name;
						}, (result)=>{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					}
				}
			},
			// 取消
			$cancel(index){
				if (this.oldBalanceTypeList[index].id === '') {
					this.balanceTypeList.splice(index,1)
					this.oldBalanceTypeList.splice(index,1);
				}else{
					this.balanceTypeList[index].id = this.oldBalanceTypeList[index].id;
					this.balanceTypeList[index].bapatype_name = this.oldBalanceTypeList[index].bapatype_name;
					this.balanceTypeList[index].start_using = this.oldBalanceTypeList[index].start_using;
				}
			}
		},
		components: {
			pageTitle,
			operation,
			tabFilter
		}
	}
</script>
<style>
.ce-content-style{
	padding: 10px 0;
}
</style>