<template>
    <div class="contents">
        <page-title title="订单列表"></page-title>
        <tab-filter :options="options" @click="getFilterParam()" param="pageTag" v-if="isFrame"></tab-filter>
        <operation ref="operation" module="order_list" @search="getSearchParam">
            <div slot="btn">
                <el-button type="primary" size="small" @click="editOrder()">新增</el-button>
                <!-- <el-button size="small">打印样式</el-button>
				<el-button size="small">打印选定订单</el-button>
				<el-button size="small">标签</el-button> -->
                <!-- <router-link :to='downloadUrl' ><el-button size="small">导出</el-button></router-link> -->
                <!-- <el-button size="small"><a :href="downloadUrl" download="sdf">导出</a></el-button> -->
                <!-- <el-button size="small" @click="exportOrder">导出</el-button> -->
            </div>
        </operation>
        <div class="content-table">
            <!-- 空表格，用于无数据显示 -->
            <el-table :data="[]" style="width: 100%" size="mini" v-show="orderList.length == 0 " v-loading="isLoading">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="订单号">
                </el-table-column>
                <el-table-column label="收货人姓名">
                </el-table-column>
                <el-table-column label="收货人手机">
                </el-table-column>
                <el-table-column label="收货人邮箱" v-if="$version == 'waimao'">
                </el-table-column>
                <!-- <el-table-column label="收货人电话">
                </el-table-column> -->
                <el-table-column label="收货人地址">
                </el-table-column>
                <el-table-column label="客户名称">
                </el-table-column>
                <el-table-column label="订单金额">
                </el-table-column>
                <el-table-column label="支付类型">
                </el-table-column>
                <el-table-column label="订单状态">
                </el-table-column>
                <el-table-column label="订单创建时间">
                </el-table-column>
                <el-table-column label="操作">
                </el-table-column>
            </el-table>
            <!-- 有数据表格 -->
            <el-table :data="orderList" ref="orderListTable" style="width: 100%" @selection-change="handleSelectionChange" size="mini" v-show="orderList.length != 0 " class="table-one-line" v-loading="isLoading">
                <el-table-column type="selection" width="35">
                </el-table-column>
                <!-- <el-table-column label="查看" width="70">
                	<template slot-scope="scope">
                		<i class="el-icon-view" @click="showCustomDialog(scope.row.id, 'view')"></i>
                	</template>
            	</el-table-column> -->
                <el-table-column label="订单号" width="160">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="收货人姓名" prop="consignee_name" v-if="$version == 'neimao'">
                </el-table-column> -->
                <el-table-column label="收货人姓名">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_name">{{scope.row.consignee_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="收货人手机" width="100">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_mob">{{scope.row.consignee_mob}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="收货人邮箱" v-if="$version == 'waimao'">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_email">{{scope.row.consignee_email}}</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="收货人电话" prop="consignee_tel">
                </el-table-column> -->
                <el-table-column label="收货人地址" v-if="$version == 'neimao'">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.consignee_province | tranToAddr(scope.row.consignee_city, scope.row.consignee_county) + ' ' + scope.row.consignee_addr">
                			<span>{{scope.row.consignee_province | tranToAddr(scope.row.consignee_city, scope.row.consignee_county)}}</span> <span>{{scope.row.consignee_addr}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="收货人地址" v-if="$version == 'waimao'">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consignee_state_name + ' ' + scope.row.consignee_addr">
                            <span>{{scope.row.consignee_state_name}}</span> <span>{{scope.row.consignee_addr}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="客户名称">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.client_name">{{scope.row.client_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单金额">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.sum_payable | toFixed(2)">{{scope.row.sum_payable | toFixed(2)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="支付类型">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.payment_type_name">{{scope.row.payment_type_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row | orderAllStatus">{{scope.row | orderAllStatus}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单创建时间">
                    <template slot-scope="scope">
                        <div class="one-line" :title="scope.row.create_time">{{scope.row.create_time}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <div class="table-operation">
                            <el-button type="text" @click="showCustomDialog(scope.row.id, 'view')" class="btn-remark" size="small">查看</el-button>
                            <el-dropdown trigger="click">
                                <el-button type="text" size="small">
						        	更多<i class="el-icon-arrow-down el-icon--right"></i>
						      	</el-button>
                                <el-dropdown-menu slot="dropdown" class="table-operation-dropdown">
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '0' && scope.row.shipments_status == '0'">
                                        <el-button type="text" @click="editOrder(scope.row.id)" size="small">编辑订单</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '0'">
                                        <el-button type="text" @click="showCustomDialog(scope.row.id, 'pay')" size="small">确认收款</el-button>
                                    </el-dropdown-item>
                                    <!-- <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '0' && scope.row.payment_type != '1' && scope.row.sum_payable != '0.00'">
                                        <el-button type="text" @click="showPayDialog(scope.row.id, scope.row.sum_payable)" size="small">扫码支付</el-button>
                                    </el-dropdown-item> -->
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '1'">
                                        <el-button type="text" @click="showCustomDialog(scope.row.id, 'refund')" size="small">退款</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.shipments_status != '1' && (scope.row.payment_status == '1' || scope.row.payment_type == '1')">
                                        <el-button type="text" @click="showCustomDialog(scope.row.id, 'delivery')" size="small">发货</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.shipments_status == '1'">
                                        <el-button type="text" @click="showCustomDialog(scope.row.id, 'return')" size="small">退货</el-button>
                                    </el-dropdown-item>
                                    <!-- <el-dropdown-item v-if="scope.row.order_status == '0'">
                                        <el-button type="text" @click="showFinishDialog(scope.row.id)" size="small">完成</el-button>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '0' && scope.row.shipments_status == '0'">
                                        <el-button type="text" @click="showDelDialog(scope.row.id)" size="small">作废</el-button>
                                    </el-dropdown-item> -->
                                    <el-dropdown-item v-if="scope.row.order_status == '0'">
                                        <el-popover :ref="'popoverf'+scope.row.id" placement="top" width="200" trigger="click" v-model="scope.row.finish">
                                            <p>完成后该订单将不能有任何操作,确认要执行吗?</p>
                                            <div style="text-align: right; margin: 0">
                                                <el-button size="mini" type="text" @click="scope.row.finish = false">取消</el-button>
                                                <el-button type="primary" size="mini" @click="finishOrder(scope.row.id)">确定</el-button>
                                            </div>
                                            <el-button slot="reference" type="text" size="small">完成</el-button>
                                        </el-popover>
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.order_status == '0' && scope.row.payment_status == '0' && scope.row.shipments_status == '0'">
                                        <el-popover :ref="'popoverd'+scope.row.id" placement="top" width="200" trigger="click" v-model="scope.row.del">
											<p>作废后该订单将不能有任何操作,确认要执行吗?</p>
											<div style="text-align: right; margin: 0">
											    <el-button size="mini" type="text" @click="scope.row.del = false">取消</el-button>
											    <el-button type="primary" size="mini" @click="delOrder(scope.row.id)">确定</el-button>
											 </div>
											 <el-button slot="reference" type="text" size="small">作废</el-button>
										</el-popover>
                                    </el-dropdown-item>
                                    <el-dropdown-item>
                                        <el-button type="text" @click="showCustomDialog(scope.row.id, 'remark')" class="btn-remark" size="small">订单备注</el-button>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <pages :total="totalCount" @change="getFilterParam('page')">
            <div slot="leftop">
                <el-checkbox @change="seleceAll" :indeterminate="selection.length !== 0 && selection.length !== orderList.length" v-model="selectAllStatus" size="small">全选</el-checkbox>
                <span class="op_project"><el-button type="text" size="small" @click="exportOrder">导出</el-button></span>
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

// let allPayTypeList = [];
    export default {
        data() {
            return {
                orderList: [],
                totalCount: 0,
                options: [{
                    label: "待支付",
                    name: "0"
                }, {
                    label: "已支付",
                    name: "1"
                }, {
                    label: "货到付款",
                    name: "2"
                }, {
                    label: "待发货",
                    name: "3"
                }, {
                    label: "已发货",
                    name: "4"
                }, {
                    label: "已收货",
                    name: "10"
                }, {
                    label: "未完成",
                    name: "5"
                }, {
                    label: "已作废",
                    name: "6"
                }, {
                    label: "已完成",
                    name: "7"
                }, {
                    label: "全部",
                    name: "-1"
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
            //获取支付方式
            // getPayTypeList() {
            // 	this.$api(this.orderApi[this.$version] + ".getPayType").then((result) => {
            // 		allPayTypeList = result;
            // 	}, (error) => {

            // 	});
            // },
            //线上支付窗
            showPayDialog(id, amount) {
                this.payDialogVisible = true;
                this.payOrderId = id;
                this.payAmount = amount;
            },
            //自定义窗
            showCustomDialog(id, module) {
                this.customDialogParam.visibility = true;
                this.customDialogParam.module = module;
                this.activeId = id;
            },
            //添加/编辑
            editOrder(id) {
                this.$router.push({
                    name: 'order_add',
                    query: {
                        id: id || '-1',
                        step: id ? '1' : '0'
                    }
                });
            },
            //完成弹窗
            showFinishDialog(id) {
                this.$confirm('完成后该订单将不能有任何操作,确认要执行吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.finishOrder(id);
                });
            },
            //完成
            finishOrder(id) {
                this.$api(this.orderApi[this.$version] + ".modifyOrder", {orderInfo: {
                    order_id: id,
                    order_status: 2
                }}).then((result) => {
                    this.$message({
                        type: 'success',
                        message: '完成成功!'
                    });
                    this.getFilterParam();
                }, (error) => {
                    this.$message({
                        type: 'error',
                        message: '完成失败！'
                    });
                });
            },
            //作废弹窗
            showDelDialog(id) {
                this.$confirm('作废后该订单将不能有任何操作,确认要执行吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delOrder(id);
                });
            },
            //作废
            delOrder(id) {
                this.$api(this.orderApi[this.$version] + ".modifyOrder", {orderInfo: {
                    order_id: id,
                    order_status: 1
                }}).then((result) => {
                    this.$message({
                        type: 'success',
                        message: '作废成功!'
                    });
                    this.getFilterParam();
                }, (error) => {
                    this.$message({
                        type: 'error',
                        message: '作废失败！'
                    });
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
            exportOrder() {
                if (this.selection.length == 0) {
                    this.$message.error('请选择要导出的数据');
                    return;
                }
                let url = __ce.baseURL + '/pmanager/order/export?ids='
                this.selection.forEach((v, i) => {
                    url += v.id;
                    if (i != this.selection.length - 1) {
                        url += ',';
                    }
                });
                window.open(url);
                // window.location.href = url;
            }
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
