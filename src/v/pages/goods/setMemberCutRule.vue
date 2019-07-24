<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="设置返利规则" :visible.sync="dialogVisible" width="640px" :append-to-body="true">
			<div style="height:260px; overflow-y:auto">
				<span class="formPrompt">按订货{{condition=='1' ? '金额' : '数量'}}设置返利阶梯：</span>
				<el-table :data="priceData" size="mini" class="xtggtable" height="234">
      				<el-table-column :label="'订货' + (condition=='1' ? '金额' : '数量')">
      					<template slot-scope="scope">
							<span style="font-size:18px; line-height:100%" class="mr10">&ge;</span><el-input v-model="scope.row.num" class="miniInput" size="mini" placeholder="请输入"></el-input>
      					</template>
      				</el-table-column>
      				<el-table-column label="返利">
      					<template slot-scope="scope">
      						<el-input v-model="scope.row.money" class="smallInput" size="mini" placeholder="请输入"></el-input>
      					</template>
      				</el-table-column>
      				<el-table-column label="操作">
      					<template slot-scope="scope">
      						<el-button type="text" size="mini" @click="addRule(scope.$index)">增加</el-button>
      						<el-button type="text" size="mini" @click="delRule(scope.$index)" v-if="scope.$index!=0">删除</el-button>
      					</template>
      				</el-table-column>
      			</el-table>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click=" dialogVisible = false ">取 消</el-button>
				<el-button size="small" type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</span>
</template>
<script>

	export default {
		data() {
			return {
				dialogVisible:false,
				priceData:[
					{num:'',money:''}
				]
			}
		},
		methods: {
			showDialog(){
				this.dialogVisible = true
				if(this.rule && this.rule.length>0){
					this.priceData = JSON.parse(JSON.stringify(this.rule))
				}
			},
			isRepeat(arr){
				var hash = {};
				for(var i in arr) {
					if(hash[arr[i]])
						return true;
					hash[arr[i]] = true;
				}
				return false;
			},
			compare(prop) {
			    return function (obj1, obj2) {
			        var val1 = obj1[prop];
			        var val2 = obj2[prop];
			        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
			            val1 = Number(val1);
			            val2 = Number(val2);
			        }
			        if (val1 < val2) {
			            return -1;
			        } else if (val1 > val2) {
			            return 1;
			        } else {
			            return 0;
			        }
			    }
			},
			addRule(index){
				this.priceData.splice(Number(index) + 1, 0, {
					num:'',
					money:''
				})
			},
			delRule(index){
				this.priceData.splice(index, 1)
			},
			confirm(){
				let numberArr = []
				let numberFlag = true
				let priceFlag = true
				let numberReg = /^[1-9]\d*$/
				let priceReg = /^(\d){1,11}$|^(\d){1,11}\.(\d){1,2}$/
				this.priceData.forEach( (el, index) => {
					numberArr.push(el.num)
					if(!numberReg.test(el.num) || el.num == ''){numberFlag = false}
					if(!numberReg.test(el.money) || el.money == ''){priceFlag = false}
				})
				if(!numberFlag){
					this.$message({ message: '请正确填写订货'+ (this.condition=='1'?'金额':'数量') + ',格式为正整数', type: 'error' });return
				}
				if(this.isRepeat(numberArr)){
					this.$message({ message: '订货'+ (this.condition=='1'?'金额':'数量')+'不能重复', type: 'error' });return
				}
				if(!priceFlag){
					this.$message({ message: '请正确填写返利，格式为正整数', type: 'error' });return
				}
				this.priceData.sort(this.compare("num"))
				////////////////////////////////////////
				this.$emit("change",this.priceData);
				this.dialogVisible = false
			},
		},
		components: {

		},
		props: ['condition','rule'],
	}
</script>
<style>

</style>
