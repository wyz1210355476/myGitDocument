<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="设置客户返利" :visible.sync="dialogVisible" width="640px" :append-to-body="true">
			<div style="height:300px; overflow-y:auto">
				<div class="topOp">
					返利条件：
				    <el-radio-group v-model="rebateCondition" size="small">
					    <el-radio size="small" :label="1">按订货金额</el-radio>
					    <el-radio size="small" :label="2">按订货数量</el-radio>
					    <el-radio size="small" :label="3">不返利</el-radio>
					</el-radio-group>
				</div>
				<div v-if="rebateCondition!=3">
				<span class="formPrompt">批量设置返利规则：
				<set-member-cut-rule @change="getRule($event,'all')" :condition="rebateCondition" :rule="allSet">
					<el-button type="text">统一设置</el-button>
				</set-member-cut-rule></span>
				<el-table :data="memberData" size="mini" height="234" class="table-one-line">
      				<el-table-column label="客户分组" width="100">
      					<template slot-scope="scope">
							<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
      					</template>
      				</el-table-column>
      				<el-table-column label="返利规则">
      					<template slot-scope="scope">
      						<div class="one-line" v-if="scope.row.rebateRuleList">
								<span v-for="item in scope.row.rebateRuleList" :key="item.id">满{{item.num}}返{{item.money}}； </span>
      						</div>
      					</template>
      				</el-table-column>
      				<el-table-column label="操作" width="80">
      					<template slot-scope="scope">
							<set-member-cut-rule @change="getRule($event,scope.row.memberLevelId)" :condition="rebateCondition" :rule="scope.row.rebateRuleList">
								<el-button type="text" size="small">编辑</el-button>
							</set-member-cut-rule>
      					</template>
      				</el-table-column>
      			</el-table>
      			</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click=" dialogVisible = false ">取 消</el-button>
				<el-button size="small" type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</span>
</template>
<script>
	import setMemberCutRule from './setMemberCutRule'
	export default {
		data() {
			return {
				dialogVisible:false,
				rebateCondition:3,
				memberData:[],
				allSet:[]
			}
		},
		mounted(){

		},
		methods: {
			getRule(val,key){
				if(key=='all'){
					this.allSet = JSON.parse(JSON.stringify(val))
					this.memberData.forEach( (el, index) => {
						el.rebateRuleList = JSON.parse(JSON.stringify(val))
					});
				}else{
					let memberRule = this.memberData.find((n)=>n.memberLevelId==key)
					memberRule.rebateRuleList = JSON.parse(JSON.stringify(val))
				}
			},
			getMemberLevel(){
				this.$api("member.getLevelList").then((result) => {
					let result1 = result || []
					this.memberData = []
					this.rebateCondition = this.rebate && this.rebate[0] ? this.rebate[0].rebateCondition : 3
					result1.forEach( (el, index) => {
						let rebateRuleList = []
						if(this.rebate && this.rebate.length>0){
							let tmp = this.rebate.find((n)=>n.memberLevelId==el.id)
							if(tmp){
								rebateRuleList = tmp.rebateRuleList
							}
						}
						this.memberData.push({
							memberLevelId:el.id,
							name:el.name,
							rebateRuleList:rebateRuleList
						})
					});
				}, (error) => {
					if(error.status!='102'){
						this.$message({type: 'error',message: '获取客户分组列表出错'})
					}
				});
			},
			showDialog(){
				this.dialogVisible = true
				this.getMemberLevel()
			},
			confirm(){
				let finalArr = []
				this.memberData.forEach( (el, index) => {
					finalArr.push({
						rebateCondition:this.rebateCondition,
						memberLevelId:el.memberLevelId,
						rebateRuleList:this.rebateCondition==3 ? [] : el.rebateRuleList
					})
				})
				this.$emit("change",finalArr);
				this.dialogVisible = false
			},
		},
		components: {
			setMemberCutRule
		},
		props: ['rebate'],
	}
</script>
<style>

</style>
