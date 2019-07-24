<template>
	<div>
		<!-- <span @click="showDialog"><slot></slot></span> -->

		<el-dialog title="设置客户返利" :visible.sync="visible" width="640px">
			<div style="height:300px; overflow-y:auto" v-loading="isLoading">
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
				<el-button size="small" @click=" visible = false ">取 消</el-button>
				<el-button size="small" type="primary" @click="confirm">保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility'
	import setMemberCutRule from './setMemberCutRule'
	export default {
		data() {
			return {
				// visible: false,
				rebateCondition: 3,
				memberData: [],
				allSet: [],
				rebate: [],
				isLoading: false
			}
		},
		mixins: [dialogVisibility],
		mounted(){
			this.isLoading = true
			this.getRebate()
		},
		methods: {
			getRule(val,key) {
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
			getMemberLevel() {
				this.$api("member.getLevelList").then((result) => {
					this.isLoading = false
					let result1 = result || []
					this.memberData = []
					console.log(this.rebate)
					this.rebateCondition = this.rebate && this.rebate[0] ? this.rebate[0].rebate_condition : 3
					result1.forEach( (el, index) => {
						let rebateRuleList = []
						if(this.rebate && this.rebate.length>0){
							let tmp = this.rebate.find((n)=>n.level_id==el.id)
							if(tmp){
								console.log(tmp);
								rebateRuleList = JSON.parse(tmp.rebate_rule)
								console.log(rebateRuleList)
							}
						}
						this.memberData.push({
							memberLevelId:el.id,
							name:el.name,
							rebateRuleList:rebateRuleList
						})
					});
				}, (error) => {
					this.isLoading = false
					if(error.status!='102'){
						this.$message({
							type: 'error',
							message: '获取客户分组列表出错'
						})
					}
				});
			},
			getRebate() {
				this.$api('rebate.getRebateDetailByGoodsId', {goods_id: this.id}).then((result) => {
					this.rebate = result
					this.getMemberLevel()
				}, (error) => {
					this.isLoading = false
					this.$message({
						type: 'error',
						message: '获取返利列表失败'
					})
				})
			},
			// showDialog() {
			// 	this.visible = true
			// 	this.getRebate()
			// },
			confirm() {
				let finalArr = []
				this.memberData.forEach( (el, index) => {
					finalArr.push({
						rebate_condition: this.rebateCondition,
						level_id: el.memberLevelId,
						goods_id: this.id,
						rebate_rule:this.rebateCondition==3 ? [] : JSON.stringify(el.rebateRuleList)
					})
				})
				this.$api('rebate.addOrSetRebateGoods', {data: finalArr}).then((result) => {
					this.$message({
						type: 'success',
						message: '保存成功'
					})
					this.$emit("change", finalArr)
					this.visible = false
				}, (error) => {
					this.$message({
						type: 'error',
						message: '保存失败'
					})
				})
			},
		},
		components: {
			setMemberCutRule
		},
		props: ['id'],
	}
</script>
<style>

</style>
