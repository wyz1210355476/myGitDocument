<template>
    <div class="contents">
        <page-title title="订单列表"></page-title>
        <tab-filter :options="options" @click="getFilterParam()" param="pageTag" v-if="isFrame"></tab-filter>
        <operation ref="operation" module="after_sales" @search="getSearchParam">
        </operation>
        <div class="content-table">
            <!-- 有数据表格 -->
            <el-table :data="orderList" ref="orderListTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini" class="table-one-line" v-loading="isLoading">
                <el-table-column type="selection" width="35">
                </el-table-column>
                
                <el-table-column label="订单号" width="160">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
                    </template>
                </el-table-column>
                
                <el-table-column label="购买商品">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_name">{{scope.row.consignee_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="购买人" width="">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_mob">{{scope.row.consignee_mob}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_email">下单时间</div>
                    </template>
                </el-table-column>
               
                <el-table-column label="订单状态" v-if="$version == 'neimao'">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.consignee_province | tranToAddr(scope.row.consignee_city, scope.row.consignee_county) + ' ' + scope.row.consignee_addr">
                			<span>{{scope.row.consignee_province | tranToAddr(scope.row.consignee_city, scope.row.consignee_county)}}</span> <span>{{scope.row.consignee_addr}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="订单金额" v-if="$version == 'waimao'">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_state_name + ' ' + scope.row.consignee_addr">
                            <span>{{scope.row.consignee_state_name}}</span> <span>{{scope.row.consignee_addr}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实付金额">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.client_name">{{scope.row.client_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="运费金额">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.sum_payable | toFixed(2)">{{scope.row.sum_payable | toFixed(2)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="审核状态">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.payment_type_name">{{scope.row.payment_type_name}}</div>
                    </template>
                </el-table-column>
                
              
                <el-table-column label="操作" width="">
                    <template slot-scope="scope">
                        <div class="table-operation">
                            <el-button type="text" @click="" size="small">查看</el-button>
                            <el-button type="text" size="small">通过</el-button>
                            <el-button type="text" size="small">不通过</el-button>
                            <el-button type="text" size="small">退款</el-button>
                            <el-button type="text" size="small">退货</el-button>
                            <el-button type="text" size="small">发货</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pages :total="totalCount" @change="getFilterParam('page')">
            <div slot="leftop">
                <el-checkbox @change="seleceAll" :indeterminate="selection.length !== 0 && selection.length !== orderList.length" v-model="selectAllStatus" size="small">全选</el-checkbox>
                <!-- <span class="op_project"><el-button type="text" size="small" @click="exportOrder">导出</el-button></span> -->
            </div>
        </pages>
        <!-- <ce-pagination :total="totalCount"></ce-pagination> -->
        <custom-dialog :visibility.sync="customDialogParam.visibility" :id="activeId" :module="customDialogParam.module" class="custom-dialog" @update="getFilterParam"></custom-dialog>
        <online-pay :visibility.sync="payDialogVisible" :id="payOrderId" :amount="payAmount" v-if="payDialogVisible" @paid="getFilterParam"></online-pay>
    </div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import pages from '@components/pages';
import tabFilter from '@components/tabFilter';
import operation from '@components/operation';
import customDialog from './components/customDialog';
import onlinePay from './components/onlinePay';
import orderApi from '@c/mixins/orderApi';

export default {
    data() {
        return {
            orderList: [],
            totalCount: 0,
            options: [{
                label: "待审核",
                name: "0"
            }, {
                label: "未通过",
                name: "1"
            }, {
                label: "处理中",
                name: "2"
            }, {
                label: "已完成",
                name: "3"
            }],
            filterParam: {},
            activeId: '', //当前操作id
            customDialogParam: {
                visibility: false,
                module: 'view'
            },
            selection: [],
            selectAllStatus: false,
            payOrderId: '',
            payAmount: '',
            payDialogVisible: false,
            isLoading: false,
            // isFrame: window.top == window
            isFrame: true
        }
    },
    mixins: [orderApi],
    filters: {
        
    },
    mounted() {
        this.getFilterParam();
        // this.getPayTypeList();
    },
    methods: {
        getFilterParam(type) {
            if (!type) {
                this.filterParam = {};
                this.$refs.operation.clear();
            }
            // for (var i in this.$route.query) {
            // 	if (i == 'currentPage' || i == 'pageSize') {
            // 		continue;
            // 	}
            // 	this.filterParam[i] = this.$route.query[i];
            // }
            this.filterParam.pageTag = this.$route.query.pageTag ? parseInt(this.$route.query.pageTag) : 0;
            this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
            this.filterParam.pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
            this.getOrderList();
        },
        getSearchParam(msg) {
            this.$router.push({
                query: {
                    pageTag: this.filterParam.pageTag,
                    currentPage: 1,
                    pageSize: 10
                }
            });
            let where = [{
                key: msg.search_select,
                logic: 'like',
                value: msg.search_value
            }]
            this.filterParam.where = encodeURIComponent(JSON.stringify(where));
            this.getFilterParam('search');
        },
        getOrderList() {
            this.isLoading = true;
            let sort = [{
                "create_time":"desc"
            }]
            this.filterParam.sort = encodeURIComponent(JSON.stringify(sort));
            this.$api(this.orderApi[this.$version] + ".list", this.filterParam).then((result) => {
                this.isLoading = false;
                this.totalCount = result.page.total;
                this.orderList = result.list;
            }, (error) => {
                this.isLoading = false;
                if (error && error.data && error.data.status == 102) {
                    this.orderList = [];
                    this.totalCount = 0;
                } else {
                    this.$message({
                        type: 'error',
                        message: '加载数据出错'
                    });
                }
            });
        },
        
        //全选
        seleceAll(val) {
            if (val && this.orderList.length > 0) {
                this.orderList.forEach(row => {
                    this.$refs.orderListTable.toggleRowSelection(row, val);
                });
            } else {
                this.$refs.orderListTable.clearSelection();
            }
        },
        //勾选项
        handleSelectionChange(selection) {
            this.selection = selection;
            if (this.selection.length === this.orderList.length) {
                this.selectAllStatus = true;
            } else {
                this.selectAllStatus = false;
            }
        },
        //导出
        // exportOrder() {
        //     if (this.selection.length == 0) {
        //         this.$message.error('请选择要导出的数据');
        //         return;
        //     }
        //     let url = __ce.baseURL + '/pmanager/order/export?ids='
        //     this.selection.forEach((v, i) => {
        //         url += v.id;
        //         if (i != this.selection.length - 1) {
        //             url += ',';
        //         }
        //     });
        //     window.open(url);
        // }
    },
    components: {
        pageTitle,
        pages,
        tabFilter,
        operation,
        customDialog,
        onlinePay
    }
}
</script>
<style>
.order-btn-area+.el-button {
    margin-left: 5px;
}


</style>
