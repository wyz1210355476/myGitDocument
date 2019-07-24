<template>
	<div class="contents">
		<page-title title="商品返利"></page-title>
		<tab-filter :options="options" @click="getFilterParam('tab')" param="type"></tab-filter>
		<choose-goods @select="getGoodsList()">
			<el-button type="primary" size="small">新增返利商品</el-button>
		</choose-goods>
		<div class="content-table">
			<el-table :data="goodsList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
				<el-table-column label="商品名称">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.name">{{scope.row.name}}</div>
                	</template>
                </el-table-column>
                <el-table-column label="商品编号" prop="code">
                </el-table-column>
                <el-table-column label="销售价">
                	<template slot-scope="scope">
                		{{scope.row.price | toFixed(2)}}
                	</template>
                </el-table-column>
                <el-table-column label="库存" prop="stock">
                </el-table-column>
                <el-table-column label="累计返利" prop="rebate_money">
                </el-table-column>
                <el-table-column label="订单总额" prop="total_price">
                </el-table-column>
                <el-table-column label="订单货品数量" prop="num">
                </el-table-column>
				<el-table-column label="返利状态">
					<template slot-scope="scope">
						{{scope.row.rebate_condition | getStatus}}
					</template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                    	<el-button type="text" @click="viewDetail(scope.row.goods_id)" size="small" style="margin-right: 8px;">查看明细</el-button>
						<el-button type="text" @click="setRebate(scope.row.goods_id)" size="small">返利设置</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getFilterParam('page')"></pages>
		<goods-rebate-detail :visibility.sync="showGoodsRebateDetail" :id.sync="activeId" v-if="showGoodsRebateDetail"></goods-rebate-detail>
		<set-member-cut :id="setDialog.id" :visibility.sync="setDialog.show" @change="getGoodsList()" v-if="$appList.CESHOP_RETURN && setDialog.show"></set-member-cut>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import goodsRebateDetail from './goodsRebateDetail';
	import pages from '@components/pages';
	import tabFilter from '@components/tabFilter';
	import setMemberCut from './setMemberCut';
	import chooseGoods from './chooseGoods';
	export default {
		data() {
			return {
				goodsList: [],
				totalCount: 0,
				type: this.$route.query.type ? this.$route.query.type : 0,
				filterParam: {
					page_index: this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1,
					page_size: this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10
				},
				isLoading: false,
				activeId: '',
				showGoodsRebateDetail: false,
				options: [{
					label: "全部",
                    name: "0"
				}, {
					label: "返利中",
                    name: "1"
				}, {
					label: "无返利",
                    name: "2"
				}],
				setDialog: {
					id: '',
					show: false
				}
			}
		},
		filters: {
			getStatus(v) {
				if (v == 3) {
					return '不返利';
				}
				if (v == 2) {
					return '按订货数量';
				}
				if (v == 1) {
					return '按订单金额';
				}
			}
		},
		mounted() {
			this.getGoodsList();
		},
		methods: {
			getFilterParam(type) {
				if (type == 'tab') {
					this.$router.push({
						query: {
							type: this.$route.query.type,
							pageSize: 10,
							currentPage: 1
						}
					})
				}
				this.type = this.$route.query.type ? parseInt(this.$route.query.type) : 0;
                this.filterParam.page_index = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
                this.filterParam.page_size = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.getGoodsList();
			},
			getGoodsList() {
				let data = {
					page: this.filterParam.page_index,
					pagesize: this.filterParam.page_size,
					type: this.type
				}
				this.isLoading = true;
				this.$api("rebate.getRebateGoods", data).then((result) => {
					this.goodsList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.goodsList = [];
                    this.totalCount = 0;
					if (error && error.data && error.data.status == 102) {
                    	
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//设置返利
			setRebate(id) {
				this.setDialog.id = id;
				this.setDialog.show = true;
			},
			//查看明细
			viewDetail(id) {
				this.activeId = id;
				this.showGoodsRebateDetail = true;
			}
		},
		components: {
			pageTitle,
			goodsRebateDetail,
			pages,
			tabFilter,
			setMemberCut,
			chooseGoods
		}
	}
</script>
<style>

</style>