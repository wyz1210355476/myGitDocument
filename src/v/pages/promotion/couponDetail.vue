<template>
    <div>
		<el-dialog
		  	title="优惠券明细"
		  	:visible.sync="visible">
		  	<div v-loading="isLoading">
                <div class="overviewBox">
                    <div class="overview">总数：{{coupon_total}}</div>
                    <div class="overview">已发放：{{granted}}</div>
                    <div class="overview">已使用：{{used}}</div>
                    <div class="overview">待使用：{{toBeUsed}}</div>
                </div>
                
		  		<el-table :data="dataList" style="min-width: 100%" size="mini" class="table-one-line" height="400">
    				<el-table-column label="优惠券券码" prop="coupon_generated_code" width="150">
                	</el-table-column>
                	<el-table-column label="发放时间">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.bapatype_name">{{scope.row.create_time}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="会员账号">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.history_balance">{{scope.row.uname}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="有效期">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.coupon_start_time + '至' + scope.row.coupon_end_time">
                                {{ scope.row.coupon_start_time }} 
                                至 
                                {{scope.row.coupon_end_time}}
                            </div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="是否使用">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.coupon_generated_status | couponStatus">{{scope.row.coupon_generated_status | couponStatus}}</div>
	                	</template>
                	</el-table-column>
                    <el-table-column label="关联订单">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.coupon_use_order_no">{{scope.row.coupon_use_order_no}}</div>
	                	</template>
                	</el-table-column>
		  		</el-table>
		  	</div>
            <pages :total="totalCount" @change="getPagesParam('page')"></pages>
		  	<div slot="footer">
			  	<el-button plain size="small" @click="cancel">关闭</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
import dialogVisibility from '@c/mixins/dialogVisibility';
import pages from '@components/pages'
export default {
    data() {
			return {
				dataList: [],
                isLoading: false,
				totalCount:0,
				coupon_total:0,
				granted:0,
				used:0,
				toBeUsed:0
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			}
		},
		mixins: [dialogVisibility],
		filters: {
			// 优惠券使用状态
			couponStatus(v){
				let show;
				switch(v+""){
					case "1": 
						show = "未使用";
						break;
					case "2":
						show = "已使用";
						break;
					case "3":
						show = "已失效";
						break;
				}
				return show;
			}
		},
        mounted() {
			this.getCouponDetail();
        },
        methods: {
            getCouponDetail(){
				this.isLoading = true;
				let param = {
					pageSize : this.$route.query.pageSize ? this.$route.query.pageSize : 10,
					page : this.$route.query.currentPage ? this.$route.query.currentPage : 1,
					coupon_id: this.id
				}
                this.$api("promotion.getCouponDetail", param).then((result) => {
					this.isLoading = false;
					this.dataList = result.list || [];

                    this.totalCount = Number(result.page.total);
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
						let result = error.data.data;
						this.dataList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '获取优惠券列表信息出错'
                        });
                    }
				});
				// 获取优惠券统计信息
				this.$api("promotion.getCouponCount",{coupon_id: this.id}).then((result) => {
					this.coupon_total = result.coupon_count;
					this.granted = result.grant_count;
					this.used = result.use_count;
					this.toBeUsed = result.no_use_count;
				},(error) => {
					if (error && error.data && error.data.status == 102) {
						let result = error.data.data;
						this.dataList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '获取优惠券统计信息据出错'
                        });
                    }
				})
            },
            //关闭
			cancel() {
				this.visible = false;
            },
            getPagesParam(){
				this.getCouponDetail()
            }
        },
		components: {
			pages
		}
}
</script>
<style scoped>
    .overviewBox{
        margin: 0 0 20px 20px;
    }
    .overview{
        display: inline-block;
        width: 20%;
        font-size: 20px;
    }
</style>
