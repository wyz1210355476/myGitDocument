<template>
	<el-dialog title="优惠券详情" :visible.sync="visible">
        <div v-loading="isLoading">
            <div class="info-model">
                <h1 class="form_title">优惠券信息</h1>
                <div class="info-content">
                    <p class="basicinfo"><span>优惠券名称：</span>{{detail.coupon_name | specCharacter}}</p>
                    <p class="basicinfo"><span>面值：</span>{{detail.coupon_value}}元</p>
                    <p class="basicinfo"><span>发放总数：</span>{{detail.coupon_start_num}}张</p>
                    <p class="basicinfo"><span>优惠券开始时间：</span>{{detail.coupon_start_time | formatDate('yyyy-MM-dd hh:mm:ss',true)}}</p>
                    <p class="basicinfo"><span>优惠券结束时间：</span>{{detail.coupon_end_time | formatDate('yyyy-MM-dd hh:mm:ss',true)}}</p>
                </div>
            </div>
            <!-- <div>
                <h1 class="form_title">规则说明</h1>
                <div class="info-content">
                    <p class="basicinfo">{{detail.coupon_use_desc}}</p>
                </div>
                
            </div> -->
            <div class="info-model" v-if="detail.obj_type == '1'">
                <h1 class="form_title">活动商品<span>商品数量（{{productCount}}）</span></h1>
                <el-table :data="product" max-height="250" size="mini" class="dialogTable">
                    <el-table-column label="商品名称" >
                        <template slot-scope="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="市场价" >
                        <template slot-scope="scope">{{ scope.row.price }}</template>
                    </el-table-column>
                    <el-table-column label="零售价" >
                        <template slot-scope="scope">{{ scope.row.retailPrice }}</template>
                    </el-table-column>
                    <el-table-column label="库存" >
                        <template slot-scope="scope">{{ scope.row.stock }}</template>
                    </el-table-column>
                    <el-table-column label="是否在售">
                        <template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 全部商品 begin -->
            <div class="info-model" v-if="detail.obj_type == '3'">
                <h1 class="form_title">活动商品<span>全部商品</span></h1>
            </div>
            <!-- 全部商品 end -->
            <div class="info-model" v-if="detail.obj_type == '2'">
                <h1 class="form_title">活动分类<span>分类数量（{{productCount}}）</span></h1>
                <div class="catList"><span v-for="item in product" :key="item.id">{{item.categoryName}}</span></div>
            </div>

            <!-- <div class="info-model promotion_rule_detail">
                <h1 class="form_title">促销规则<span></span></h1>
                <div class="info-content">
                    <span>打折</span>
                </div>
            </div> -->
            <div class="info-model">
                <h1 class="form_title">
                    领用规则
                    <p class="useLimit">
                        每人限领：
                        <span>{{detail.limit_per_person}}张</span>
                    </p>
                    <p class="useLimit">
                        使用条件：
                        <span v-if="detail.coupon_type_rule == 1">无限制</span>
                        <span v-if="detail.coupon_type_rule == 2">满{{detail.coupon_use_money}}元可用</span>
                    </p>
                    <p class="useLimit">
                        使用说明：
                        <span> {{detail.coupon_use_desc == null ? "无" : detail.coupon_use_desc}}</span>
                    </p>
                   
                </h1>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import dialogVisibility from '@c/mixins/dialogVisibility';
import pages from '@components/pages'
export default {
    data() {
			return {	
                isLoading: false,
                type:'allGoods',
                productCount:0,
                detail:{},
                product:[]
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			}
		},
        mixins: [dialogVisibility],
        mounted() {
			this.getCouponDetail();
        },
        methods: {
            getCouponDetail(){
				this.isLoading = true;
                this.$api("promotion.getDetail",{coupon_id:this.id}).then((result) => {
                    this.isLoading = false;
                    this.detail = result;
                    switch(result.obj_type+""){
                        case "1":
                            this.getProducts(result.obj_id);
                            break;
                        case "2":
                            this.getCatgorys(result.obj_id);
                            break;
                    }
                    if(result.obj_type != 3){
                        this.productCount = result.obj_id.split(",").length
                    }
                },(err) => {
                    this.isLoading = false;
                    this.$message({
                            type: 'error',
                            message: '获取优惠券信息失败'
                        });
                });
            },
            getProducts(ids){
                this.$api("promotion.selectProductSkus",{ids:ids}).then((result) => {
                    this.pageloading = false
                    this.product = result.list;
                }, (error) => {
                    this.pageloading = false
                    this.$message({ message: '获取商品列表失败', type: 'warning'});
                });	
			},
			getCatgorys(ids){
				this.$api("promotion.findCategory",{ids :ids}).then((result) => {
					this.pageloading = false
					this.product = result.list;
				}, (error) => {
					this.pageloading = false
					this.$message({ message: '获取分类失败', type: 'warning'});
				});
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
    .info-model{margin-bottom:30px; overflow: hidden;}
    .info-content {overflow: hidden; color: #999;font-size: 12px;}
    .info-content p.basicinfo{display: inline-block; width: 50%; float: left; margin:0; font-size: 12px; color: #999;word-break: break-all;}
    .info-content p.basicinfo span{margin-right: 5px;}

    .form_title{font-size: 12px; line-height:20px; color: #333; font-weight: normal;}
    .form_title span{font-size:12px; color: #999; font-weight: normal; margin-left: 10px;}

    .promptspan{color: #999}
    .cutarea{line-height: 30px; overflow: hidden; padding-right: 60px; position: relative; text-align: justify;}
    .cutarea .areaBtn{position: absolute; right: 0; top:0;}
    .areaHeight{height: 30px;}
    .cutarea span{margin-right: 10px;}

    .catList{font-size:12px; color: #999}
    .catList span{margin-right: 10px;}

    .product-sku{margin-right: 8px;}
    .useLimit{
        color: #999;
    }
</style>
