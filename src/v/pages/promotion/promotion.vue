<template>
	<div class="contents">
		<page-title :title="title" ></page-title>
		<tab-filter :options="options" @click="getFilterParam()" param="pageTag"></tab-filter>
		<div style="overflow:hidden">
			<el-button type="primary" size='small' @click="toEdit()">新增</el-button>
		  	<div class="search_con">
		  		<operation ref="operation" module="promotion_list" @search="getSearchParam"></operation>
			</div>
			<!-- <el-select class="floatR mr20" placeholder="请选择" size='small' v-model="state" @change="getPagesParam('state')">
			    <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		  	</el-select> -->
		</div>
		<div class="content-table">
			<el-table :data="discountData" size="mini" v-loading="loading">
			    <el-table-column label="活动名称">
			    	<template slot-scope="scope">
				        {{ scope.row.name | specCharacter}}
			      	</template>
			    </el-table-column>
				<el-table-column label="活动标签">
					<template slot-scope="scope">
				        {{ scope.row.label_name | specCharacter}}
			      	</template>
				</el-table-column>
				<el-table-column prop="create_date" label="活动创建时间"></el-table-column>
			    <el-table-column prop="start_date" label="活动开始时间"></el-table-column>
				<el-table-column prop="end_date" label="活动结束时间"></el-table-column>
				<el-table-column label="活动状态">
			    	<template slot-scope="scope">
				        {{ scope.row.state | promotionState}}
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作">
			      	<template slot-scope="scope">
			      		<el-button type="text" size="small" @click="toDetail( scope.row.id )">查看</el-button>
				        <el-button type="text" size="small" v-if="scope.row.state == 1 " @click="toEdit( scope.row.id )">编辑</el-button>

				        <el-popover
				        	class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover"
				        	v-if="scope.row.state == 1 || scope.row.state == 3 || scope.row.state == 4">
							<p>是否删除"{{ scope.row.name }}"这个促销活动？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperate(scope.row.id,'del')">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>

						<el-popover
							class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover1"
				        	v-if="scope.row.state == 2">
							<p>是否结束"{{ scope.row.name }}"这个促销活动？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover1 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperate(scope.row.id,'stop')">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">结束</el-button>
						</el-popover>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam('page')"></pages>

		<el-dialog :title=" '查看'+title" :visible.sync="detailVisible" >
			<detail :protype="pro_type" :detailid="detailid"></detail>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="detailVisible = false" size="small">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import detail from './detail'
	import operation from '@components/operation'
	import tabFilter from '@components/tabFilter'
	export default {
		data() {
			return {
				options: [{
                    label: "进行中",
                    name: "2"
                }, {
                    label: "未开始",
                    name: "1"
                }, {
                    label: "已结束",
                    name: "3"
                }, {
                    label: "全部",
                    name: "0"
                }],
				loading:true,
				detailVisible:false,
				detailid:0,
				state:2,
				key:'name',
				key_value:'',
				// options: [
				// 	{value: 0,label: '全部选项'},
				// 	{value: 1,label: '未开始'},
				// 	{value: 2,label: '进行中'},
			    //     {value: 3,label: '已结束'}
		        // ],
				totalCount: 0,
				page:1,
				pagesize:10,
				discountData:[],
				pro_type:1,
				title:''
			}
		},
		mounted() {
			switch(this.protype + ""){
				case "1":
					this.title = "订单折扣";
					break;
				case "2":
					this.title = "订单满减";
					break;
				case "4":
					this.title = "订单满赠";
					break;
			}
			this.pro_type = this.protype || 2;
			this.state = this.$route.query.pageTag;
			this.getPagesParam('page');
		},
		filters:{
			promotionState(value){
				switch (value) {
					case '0':
						return "已删除"
						break;
					case '1':
						return "未开始"
						break;
					case '2':
						return "进行中"
						break;
					case '3':
						return "已结束"
						break;
					case '4':
						return "已结束"
						break;
					default:
						return  "未知"
						break;
				}
			}
		},
		methods: {
			getFilterParam(val){
				this.state = this.$route.query.pageTag;
				this.getPagesParam('state');
			},
			getSearchParam(val){
				this.key = val.search_select
				this.key_value = val.search_value
				this.getPagesParam('search')
			},
			toOperate(id,type){//活动操作
				let api = '';
				switch (type) {
					case 'del':
						api = 'promotion.deletePromotion'
						break;
					case 'stop':
						api = 'promotion.stopPromotion'
						break;
				}
				this.$api(api,{id:id}).then((result) => {
					this.$message({message: '操作成功',type: 'success'});
					console.log(this.$route.query.pageTag)
					this.getDiscount({
						'proType':this.pro_type,
						'pageSize':this.pagesize,
						'page':this.page,
						'query': '[{"key":"state","logic":"eq","value":"' + this.state + '"}]'
					});
				}, (error) => {
					this.$message({message: '操作失败，请稍后再试',type: 'warning'});
				});
			},
			toEdit(id){//新增/编辑操作
				let add;
				switch(this.pro_type){
					case "1":
						add = 'addDiscount';
						break;
					case "2":
						add = 'addFullcut';
						break;
					case "4":
						add = 'addFullGift';
						break;
				}
				let params = {name:add}
				if(id){params.query = {id:id}}
				this.$router.push(params)
			},
			getPagesParam(key){//组合批量查询参数
				if(key == 'state'){
					this.key_value = ''
					this.pagesize = 10
					this.page = 1
					// this.$router.push({query:{}})
				}
				if(key == 'search'){
					if(this.key_value.trim() == ''){
						return
					}
					this.pagesize = 10
					this.page = 1
					this.$router.push({query:{}})
				}
				if(key == 'page'){
					this.pagesize = this.$route.query.pageSize
					this.page = this.$route.query.currentPage
					if(this.pagesize == undefined || this.page == undefined){
						this.pagesize = 10
						this.page = 1
					}
				}
				let params = {
					'pageSize':this.pagesize,
					'page':this.page,
				}
				let map=[];
				if(this.state != 0){
					let tmp = {
						key:'state',
						logic:'eq',
						value:this.state
					}
					map.push(tmp);
				}
				if(this.key_value.trim() != '' && this.key.trim() != ''){
					let tmp = {
						key:this.key,
						logic:'like',
						value:this.key_value.trim()
					}
					map.push(tmp);
				}
				params.query = JSON.stringify(map);
				console.log(params);
				// for(let i in map){
				// 	for(let j in map[i]){
				// 		let keyname = 'map['+i+']['+j+']';
				// 		params[keyname] = map[i][j]
				// 	}
				// }

				this.getDiscount(params);
			},
			//查看促销详情
			toDetail(id){
				this.detailVisible = true;
				this.detailid = id;
			},
			//批量查询促销数据
			getDiscount(obj){
				let params = {
					'proType':this.pro_type,
					'pageSize':this.pagesize,
					'page':this.page,
				}
				if(obj){Object.assign(params, obj)}
				this.loading = true;
				this.$api("promotion.getPromotion",params).then((result) => {
					this.loading = false
					this.discountData = result.list || [];
					this.totalCount = Number(result.page.total);
				}, (error) => {
					this.loading = false
					if(error.data.status != '102'){
						this.$message({ message: '查询活动数据出错', type: 'error' });
					}else{
						this.discountData = [];
						this.totalCount = 0;
					}
				});
			}
		},
		components: {
			pageTitle,
			pages,
			detail,
			operation,
			tabFilter
		},
		props:['protype']
	}
</script>
<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.dropdown-link{font-size: 12px; color: #409EFF; margin-left: 10px;}
</style>
