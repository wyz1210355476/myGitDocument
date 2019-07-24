<template>
	<div class="contents">
		<page-title :title="'合同管理'"></page-title>
		<div class="topOp">
			<operation ref="operation" class="floatR" module="contract_manage" @search="getSearchParam"></operation>
		</div>
		<el-table :data="contractData" size="mini" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" class="table-one-line">
		  	<el-table-column type="selection" width="35" :selectable="checkBoxT"></el-table-column>
	      	<el-table-column label="订单编号" >
				<template slot-scope="scope">
		    		<div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
		    	</template>
	      	</el-table-column>
	      	<el-table-column prop="loginid" label="客户名称"> 
				  <template slot-scope="scope">
		    		<div class="one-line" :title="scope.row.loginid">{{scope.row.loginid}}</div>
		    	</template>
			</el-table-column>
			<el-table-column label="订单状态" width="150">
				<template slot-scope="scope">
		    		<div class="one-line" :title="scope.row | orderAllStatus">{{scope.row | orderAllStatus}}</div>
		    	</template>	
			</el-table-column>
			<el-table-column label="订单创建日期">
				<template slot-scope="scope">
		    		<div class="one-line" :title="scope.row.create_time">{{scope.row.create_time}}</div>
		    	</template>	
			</el-table-column>
			<el-table-column label="合同编号" width="80">
				<template slot-scope="scope">
		    		<div class="one-line" :title="scope.row.agreement_number">{{scope.row.agreement_number}}</div>
		    	</template>	
			</el-table-column>
	      	<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="create('0',scope.row)" :disabled="scope.row.agreement_status==2">生成合同</el-button>
                    <el-button type="text" size="small" @click="downLoad(scope.row)" :disabled="scope.row.agreement_status==1">查看</el-button>
				</template>
	      	</el-table-column>
	    </el-table>
	    <pages :total="totalCount" @change="getParams('page')">
			<div slot="leftop">
				<el-checkbox @change="seleceAll" size="small" :indeterminate="multipleSelection.length!=0&&multipleSelection.length!=canSelectedData.length" v-model="selectStatus">全选</el-checkbox>
				<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length==0" @click="create('1')">批量生成合同</el-button></span>
			</div>
		</pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'

	export default {
		data() {
			return {
				indeterList:[],
				checkList:[],
				selectStatus:false,
				loading:true,
				multipleSelection:[],
				totalCount:0,
				contractData:[],
				canSelectedData:[],
				page:1,
				pagesize:10,
				key:'',
				key_value:'',
			}
		},
		filters: {
            orderAllStatus(row) {
                let orderStatus,
                    payStatus,
                    shipStatus;

                if (row.order_status == '0') {
                    orderStatus = '正常';
                }
                if (row.order_status == '1') {
                    orderStatus = '已作废';
                }
                if (row.order_status == '2') {
                    orderStatus = '已完成';
                }
                if (row.order_status == '3') {
                    orderStatus = '已取消';
                }
                if (row.order_status == '4') {
                    orderStatus = '已删除';
                }

                if (row.received && row.received == '1') {
                    shipStatus = '已收货';
                } else {
                    if (row.shipments_status == '0') {
                        shipStatus = '待发货';
                    }
                    if (row.shipments_status == '1') {
                        shipStatus = '已发货';
                    }
                    if (row.shipments_status == '2') {
                        shipStatus = '部分发货';
                    }
                }

                payStatus = row.payment_status == '0' ? '未支付' : '已支付';

                return orderStatus + ',' + payStatus + ',' + shipStatus;
            }
        },
		mounted() {
			this.getContract()
		},
		methods: {
			// 禁止选择复选框
			checkBoxT(row, rowIndex){
				if(row.agreement_status == 2){
					return false;//禁用
				}else{
					return true;//不禁用
				}
			},
			// 查看下载合同
			downLoad(row){
				location.href = __ce.baseURL + "/pmanager/agreementDownload/download?uid=" + row.uid + "&order_no=" + row.no;
				// let downUrl = __ce.baseURL + "/pmanager/agreementDownload/download?uid=" + row.uid + "&order_no=" + row.no;
				// window.open(downUrl, "_blank")
			},
			// 生成合同
			create(isBatch,row){
				/**
				 * isBatch 是否是批量生成
				 * 0 不是批量生成
				 * 1 批量生成 */
				let params;
				switch(isBatch){
					case "0":
						console.log(row);
						params = {
							data:[{
								"order_no":row.no,
								"uid":row.uid
							}]
						}
						break;
					case "1":
						console.log(this.multipleSelection);
						let ary = [];
						this.multipleSelection.forEach((item) => {
							ary.push({
								"order_no":item.no,
								"uid":item.uid
							})
						})
						params = {
							data:ary
						}
						debugger
						break;
				}
				this.$api("contractManagement.createAgreement",params).then((result) => {
					this.$message({ message: '生成合同成功', type: 'success' });
					this.getContract();
				},(error) => {
					this.$message({ message: '生成合同出错', type: 'error' });
				})
			},
			setMarkSelect(){
				this.indeterList=[]
				this.checkList=[]
				let markArr = {}
				this.multipleSelection.forEach( (el, index) => {
					if(el.goodsMarkList){
						el.goodsMarkList.forEach( (ele, index) => {
							if(markArr[ele.id]){
								markArr[ele.id] += 1
							}else{
								markArr[ele.id] = 1
							}
						});
					}
				});
				let len = this.multipleSelection.length
				for(var i in markArr){
					if(markArr[i] < len){
						this.indeterList.push(Number(i))
					}else{
						this.checkList.push(Number(i))
					}
				}
			},
			checkIndeter(id){
				return this.indeterList.findIndex((n)=>n==id) > -1 ? true : false
			},
			getContract(obj){
				this.loading = true
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				if(obj){Object.assign(params, obj)}
				this.$api("contractManagement.getContractList",params).then((result) => {
					this.totalCount = result.page.total
					this.contractData = result.list

					this.canSelectedData = [];
					this.contractData.forEach((item) => {
						if(item.agreement_status != 2){
							this.canSelectedData.push(item);
						}
					})
					this.loading = false
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询合同列表出错', type: 'error' });
					}else{
						this.totalCount = 0
						this.contractData = []
					}
				});
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        if(val.length == this.canSelectedData.length){
		        	this.selectStatus = true
		        }else{
		        	this.selectStatus = false
		        }
		        this.setMarkSelect()
		    },
			seleceAll(val){
				if(val && this.canSelectedData.length > 0){
					this.canSelectedData.forEach(row => {
						// if(row.agreement_status != 2){
							this.$refs.multipleTable.toggleRowSelection(row,true);
						// }
			        });
				}else{
					this.$refs.multipleTable.clearSelection();
				}
			},
			getSearchParam(val){
				this.key = val.search_select
				this.key_value = val.search_value
				this.getParams('search')
			},
			getParams(key){
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				if(key == 'search'){
					debugger
					params.order_status = this.key;
					params.search_name = this.key_value;
					this.$router.push({query:{currentPage:this.page,pageSize:this.pagesize}})
					params.page = this.page
					params.pageSize = this.pagesize
				}
				this.getContract(params)
			}
		},
		components: {
			pageTitle,
			pages,
			operation
		}
	}
</script>
<style>

</style>
