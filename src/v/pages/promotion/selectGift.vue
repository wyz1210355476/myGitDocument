<template>
    <el-dialog
    title="选择赠品"
    :visible.sync="visible"
    width="800px">
    <div>
            <el-table :data="giftData" ref="productTable" @selection-change="handleCheck" height="520">
                <el-table-column type="selection" width="35"></el-table-column>
                <el-table-column property="name" label="赠品名称"></el-table-column>
                <el-table-column property="code" label="赠品编号"></el-table-column>
                <el-table-column property="price" label="市场价（元）"></el-table-column>
                <!-- <el-table-column property="address" label="库存"></el-table-column> -->
                <el-table-column property="stock" label="库存"></el-table-column>
                <el-table-column property="ruleNum" label="赠送数量">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.ruleNum" class="miniInput" size="mini" placeholder="请输入"></el-input>
                    </template>  
                </el-table-column>
            </el-table>
    </div>
    <pages :total="totalCount" @change="getPagesParam()"></pages>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
import dialogVisibility from '@c/mixins/dialogVisibility';
import pages from '@components/pages'
export default {
    data(){
        return{
            giftData: [],
            selection:[],
            selectData:{},
            totalCount:0,
            pro_page:1
        }
    },
    watch:{
        visibility:function(val){
            if(val){
                this.getPagesParam();
            }
        }
    },
    mixins: [dialogVisibility],
    props: ['backShow'],
    mounted(){

    },
    methods: {
        // //翻页
        // handlePro(val){
        //     this.pro_page = val;
        // },
         //复选框
        handleCheck(val) {
            this.selection = val;
           
            console.log(this.selection)
        },
        getPagesParam(val){
            this.selectData[this.pro_page] = this.selection;
            // this.pro_page = val;
            let params = {};
            // debugger
            params.pageSize = this.$route.query.pageSize
            this.pro_page = params.page = this.$route.query.currentPage
            if(!params.pageSize || !params.page){
                params.pageSize = 10;
                this.pro_page = params.page = 1;
            }
            this.getGift(params);
            
        },
        getGift(obj){
            this.$api("promotion.getGiftList",obj).then((result) => {
                let selectedIds,selectedNums;
                console.log(this.selectData)
                console.log(this.pro_page)
                if(!this.selectData[this.pro_page] || this.selectData[this.pro_page].length == 0){
                    selectedIds = this.backShow.radio.split(",");
                    selectedNums = this.backShow.send_num.split(",");
                }else{
                    selectedIds = [];
                    selectedNums = [];
                    (this.selectData[this.pro_page] || []).forEach((item,index) => {
                        selectedIds.push(item.productSkuList[0].id);
                        selectedNums.push(item.ruleNum);
                    })
                }
                this.loading = false
                this.giftData = result.list || [];
                // 获取赠品库存
                let productIds = [],goodsids = [];
                this.giftData.forEach((item,index) => {
                    goodsids.push(item.productId);
                    productIds.push({"product_id":item.productId})
                })
                // 批量获取商品库存
                this.$api("goods.plGetGoodsStock",{map:productIds}).then((result) => {
                    result.forEach((item,index) => {
                        this.giftData.find((n) => n.productId == item.product_id).stock = item.store;
                    })		
                },(error) => {
                    this.$message({
                        type: 'error',
                        message: '获取商品库存出错'
                    });
                })
                // 获取赠品价格
				this.getPrice(goodsids.join(","));
                setTimeout(() => {
                    // debugger
                    selectedIds.forEach((item,index) => {
                        console.log(this.giftData)
                        let gift = this.giftData.find((n) => n.productSkuList[0].id == item);
        
                        if(gift){
                            console.log(2)
                            console.log(gift)
                            gift.ruleNum = selectedNums[index]
                            this.$refs.productTable.toggleRowSelection(gift);
                        }    
                    })
                },0)
                this.totalCount = Number(result.totalCount);
				}, (error) => {
					this.loading = false
					if(error.data.status != '102'){
						this.$message({ message: '查询赠品数据出错', type: 'error' });
					}else{
						this.giftData = [];
						this.totalCount = 0;
					}
				});
        },
        getPrice(goodsids){
            let params = {
                product_id:goodsids,
                minPrice:1
            }
            this.$api("goods.getRetailGoodsPrice",params).then((result) => {
                result.forEach((item,index) => {
                    this.giftData.find((n) => n.productId == item.product_id).price = item.market_price;
                })	
            },(error) => {
                this.$message({
                    type: 'error',
                    message: '获取商品价格出错'
                });
            })
        },
        confirm(){
            this.selectData[this.pro_page] = this.selection;
            let flag = true; 
            let ids = [],nums = [],selections = [];
            for(let key in this.selectData){
                selections = selections.concat(this.selectData[key]);
                this.selectData[key].forEach((item,index) => {
                    ids.push(item.productSkuList[0].id);
                    nums.push(item.ruleNum);
                });
            }
            if(ids.length == 0){
                this.$message({ message: '请选择赠品', type: 'warning' });
                return;
            }
            for(var i = 0;i < nums.length;i++){
                if(!nums[i] || nums == ""){
                    this.$message({ message: '请输入选择赠品的数量', type: 'warning'});
                    flag = false
                    break; 
                }else if(/^[1-9]\d*$/.test(nums[i])){
                    if(Number(selections.find((n) => n.productSkuList[0].id == ids[i]).stock) < Number(nums[i])){
                        flag =false;
                        this.$message({ message: '所选赠品数量不能大于赠品的库存数', type: 'warning' });
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
