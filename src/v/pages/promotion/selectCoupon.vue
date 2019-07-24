<template>
    <el-dialog
    title="选择优惠券"
    :visible.sync="visible">
    <div v-loading="loading">
        <el-table :data="gridData" ref="gridData" class="table-one-line" @selection-change="handleCheck" height="520">
             <el-table-column type="selection" width="35"></el-table-column>
            <!-- <el-table-column width="30">
                <template slot-scope="scope">
                    <el-radio v-model="radio" :label="scope.row.coupon_id">&nbsp;</el-radio>
                </template>
            </el-table-column> -->
            <el-table-column property="coupon_name" label="优惠券名称">
                <template slot-scope="scope">
                    <div class="one-line" :title="scope.row.coupon_name">{{scope.row.coupon_name}}</div>
                </template>
            </el-table-column>
            <el-table-column property="coupon_value" label="面值(元)"></el-table-column>
            <el-table-column property="limit" label="限制条件">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.coupon_type_rule == 1 ? "无限制" : "满"+scope.row.coupon_use_money+"元"}}
                    </div>
                </template>   
            </el-table-column>
            <el-table-column prop="start_date" label="有效期" >
                <template slot-scope="scope">
                    <div class="one-line" :title="scope.row.coupon_start_time + '至' + scope.row.coupon_end_time">
                        {{scope.row.coupon_start_time}} 至 {{scope.row.coupon_end_time}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="coupon_start_num" label="库存"></el-table-column>
            <el-table-column property="ruleNum" label="赠送数量">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.ruleNum" class="miniInput" size="mini" placeholder="请输入"></el-input>
                </template>    
            </el-table-column>
        </el-table>
        
    </div>
    <pages :total="totalCount" @change="getPagesParam('page')"></pages>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
import dialogVisibility from '@c/mixins/dialogVisibility';
import * as utilFun from '@c/util/index.js';
import pages from '@components/pages'
export default {
    data(){
        return{
            gridData: [],
            // radio:'',
            selection:[],
            selectData:{},
            loading:false,
            totalCount:0,
            pro_page:1
        }
    },
    watch:{
        visibility:function(val){
            if(val){
                this.getCoupon({
                    status:4,
                    pageSize:10,
                    page:1,
                    endTime:this.endTime
                });
            }
        }
    },
    mixins: [dialogVisibility],
    props: ['backShow','endTime'],
    mounted(){
        // 
        // this.radio = this.backShow.radio;
        console.log(this.backShow)
    },
    methods: {
        //翻页
        handlePro(val){
            this.pro_page = val;
        },
        //复选框
        handleCheck(val) {
            this.selection = val;
           
            console.log(this.selection)
        },
        getPagesParam(){
            this.selectData[this.pro_page] = this.selection;
            // this.pro_page = val;
            let params = {
                status:4,
                endTime:this.endTime
            };
            console.log(this.$route.query)
            params.pageSize = this.$route.query.pageSize
            this.pro_page = params.page = this.$route.query.currentPage
            if(!params.pageSize || !params.page){
                params.pageSize = 10;
                params.page = 1;
            }
            this.getCoupon(params);
            // this.getCoupon({
            //         status:4,
            //         pageSize:this.$route.query.pageSize,
            //         page:this.$route.query.currentPage,
            //         endTime:this.endTime
            //     });
                
        },
        getCoupon(obj){
            console.log(this.backShow)
            this.loading = true;
            this.$api("promotion.getCouponList",obj).then((result) => {
      
                let selectedIds,selectedNums;

                if(!this.selectData[this.pro_page] || this.selectData[this.pro_page].length == 0){
                    selectedIds = this.backShow.radio.split(",");
                    selectedNums = this.backShow.send_num.split(",");
                }else{
                    selectedIds = [];
                    selectedNums = [];
                    (this.selectData[this.pro_page] || []).forEach((item,index) => {
                        selectedIds.push(item.coupon_id);
                        selectedNums.push(item.ruleNum);
                    })
                }
                 setTimeout(() => {
                    selectedIds.forEach((item,index) => {
                        console.log(this.gridData)
                        let gift = this.gridData.find((n) => n.coupon_id == item);
        
                        if(gift){
                            console.log(2)
                            console.log(gift)
                            gift.ruleNum = selectedNums[index]
                            this.$refs.gridData.toggleRowSelection(gift);
                        }    
                    })
                },0)

                this.loading = false;
                this.gridData = [];
                let couponList = result.list || [];
  
                couponList.forEach((item,index) => {
                    if(item.coupon_status != 3){
                        // if(this.backShow != "" && item.coupon_id == this.backShow.radio ){
                        //     item.ruleNum = this.backShow.send_num;
                        //     this.radio = Number(this.backShow.radio);
                        // }
                        item.coupon_start_time = utilFun.formatDate(item.coupon_start_time*1000,'yyyy-MM-dd hh:mm:ss');
                        item.coupon_end_time = utilFun.formatDate(item.coupon_end_time*1000,'yyyy-MM-dd hh:mm:ss');
                        this.gridData.push(item);
                    }
                   
                })
                this.totalCount = Number(result.page.total);
            }, (error) => {
                this.loading = false
                if(error.data.status != '102'){
                    this.$message({ message: '查询优惠券数据出错', type: 'error' });
                }else{
                    this.discountData = [];
                    this.totalCount = 0;
                }
            });
        },
        confirm(){
            // if(this.radio == ""){
            //     this.$message({ message: '请选择优惠券', type: 'warning' });
            //     return;
            // }
            // let coupon = this.gridData.find((n) => n.coupon_id == this.radio);
            // if(/^[1-9]\d*$/.test(coupon.ruleNum)){
            //     if(Number(coupon.ruleNum) > Number(coupon.coupon_start_num)){
            //         this.$message({ message: '赠送优惠券的数量不能超过优惠券库存', type: 'warning' });
            //         return;
            //     }
            // }else{
            //     this.$message({ message: '赠送数量请输入正整数', type: 'warning' });
            //     return;
            // }
            this.selectData[this.pro_page] = this.selection;
            let flag = true; 
            let ids = [],nums = [],selections = [];
            for(let key in this.selectData){
                selections = selections.concat(this.selectData[key]);
                this.selectData[key].forEach((item,index) => {
                    ids.push(item.coupon_id);
                    nums.push(item.ruleNum);
                });
            }
            if(ids.length == 0){
                this.$message({ message: '请选择优惠券', type: 'warning' });
                return;
            }
            for(var i = 0;i < nums.length;i++){
                if(!nums[i] || nums == ""){
                    this.$message({ message: '请输入选择优惠券的数量', type: 'warning'});
                    flag = false
                    break; 
                }else if(/^[1-9]\d*$/.test(nums[i])){
                    if(Number(selections.find((n) => n.coupon_id == ids[i]).coupon_start_num) < Number(nums[i])){
                        flag =false;
                        this.$message({ message: '所选优惠券数量不能大于优惠券的库存数', type: 'warning' });
                        break;
                    }
                }else{
                    flag =false;
                    this.$message({ message: '赠送数量请输入正整数', type: 'warning' });
                    break;
                }
            }
            if(flag){
                let selectedIds = this.backShow.radio == "" ? [] : this.backShow.radio.split(",");
                let selectedNums = this.backShow.send_num == "" ? [] : this.backShow.send_num.split(",");
                selectedIds.forEach((item,index) => {
                   if(!ids.includes(Number(item))){
                       ids.push(Number(item));
                       nums.push(selectedNums[index])
                   }   
                })
                this.visible = false;
                this.$emit('callBack', {id:ids,num:nums});
            }  
        }
    },
    components: {
        pages
    }
}
</script>
<style scoped>
   
</style>
