<template>
    <div class="contents" v-loading="loading">
        <page-title :title=" isEdit ? '编辑赠品' : '新增赠品'" goback></page-title>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small">

                <el-form-item label="赠品名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入赠品名称" class="formInput"></el-input>
                    <span class="formPrompt">最长128个字</span>
                </el-form-item>
                <el-form-item label="赠品编号："  prop="code">
                    <el-input v-model="ruleForm.code" placeholder="赠品编号" class="formInput" :disabled="isEdit"></el-input>
                    <!-- <span class="formPrompt"></span> -->
                </el-form-item>
                <el-form-item label="价格："  prop="price">
                    <el-input v-model="ruleForm.price" placeholder="请输入价格" class="formInput" ></el-input>元
                    <span class="formPrompt"></span>
                </el-form-item>

                <el-form-item label="图片：">
				<add-img @confirm="getSrc" :multiple='true'><el-button size="small">添加图片</el-button></add-img>
				<div class="imgCon">
					<span class="imgItem" v-for="(item,index) in imageListStr" :key="item.id">
						<img :src="item.url" alt="" @error="onImgError">
						<el-button type="text" class="delImg" icon="el-icon-circle-close" @click="delImg(index)"></el-button>
					</span>
				</div>

				</el-form-item>

                <el-form-item label="库存："  prop="stock">
                    <el-input v-model="ruleForm.stock" placeholder="请输入库存" class="formInput" ></el-input>件
                    <span class="formPrompt"></span>
                </el-form-item>
                <el-form-item label="重量："  prop="weight">
                    <el-input v-model="ruleForm.weight" placeholder="请输入重量" class="formInput" ></el-input>克
                    <span class="formPrompt"></span>
                </el-form-item>
                <el-form-item label="赠品描述：" prop="des">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="ruleForm.des"
					class="areaWidth"
				>
				</el-input>
			</el-form-item>

        </el-form>
        <div class="promotion_button">
		<el-button type="primary" size="small" @click="savePromtion('ruleForm')" :loading="btnLoading" >保存</el-button>
		</div>
    </div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import addImg from '@components/addImg'
import imgerror from '@v/common/images/imgerror.jpg'
import * as utilFun from '@c/util/index.js'; 
export default {
    data(){
        let code = Math.floor(Math.random()*90000000+10000000)
        let checkCode = (rule, value, callback) => {
            let reg = /^([a-zA-Z0-9_-]){1,8}$/
            if (!reg.test(value)) {
                callback(new Error('支持数字、英文、-、_，最多8位'));
            } else {
                callback();
            }
        };
        let checkNum = (rule, value, callback) => {
            let reg = /^\d*$/;
            if(!reg.test(value)){
                callback(new Error('请输入数字'));
            } else {
                callback();
            }
        }
        let checkPointNum = (rule, value, callback) => {
            value = String(value);
            if((/^(\d+|\d+\.\d+)$/).test(value)){
                let ary = value.match(/^(\d+)(?:\.([\d]+))?$/)
                if(ary && ary[1].length > 8){
                    if (!ary[2]) {
                        return callback(new Error('最多输入8位整数'));
                    }else{
                        return callback(new Error('小数点前不超过8位'));
                    }
                }else if(ary[2] && ary[2].length > 2){
                    return callback(new Error('小数点后不超过2位'));
                }else{
                    callback();
                }
            }else{
                if(value == ""){
                     callback();
                }else{
                    return callback(new Error('必须为数字值'));
                }
                
            }
        }
        return {
            isEdit:false,
            loading:false,
            btnLoading:false,
            id:"",
            // 货品id
            goods_id:"",
            imageListStr:[],
            ruleForm:{
                name:"",
                code:code,
                price:"",
                stock:"",
                weight:"",
                des:"",
            },
            rules: {
                name: [
                    { required: true, message: '请输入赠品名称', trigger: 'blur' },
                    { max: 128, message: '赠品名称最长128', trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入赠品编号', trigger: 'blur' },
                    { validator: checkCode , trigger: 'blur' }
                ],
                stock:[
                    {max: 8, message: '库存最长8位', trigger: 'blur'},
                    { validator: checkNum , trigger: 'blur' }
                ],
                weight:[
                    { validator: checkPointNum , trigger: 'blur' }
                ],
                price:[
                    { validator: checkPointNum , trigger: 'blur' }
                ],
                des:[
                    {max: 256, message: '最长256位', trigger: 'blur'},
                ]
            },
        }
    },
    mounted(){
        if(this.$route.query.id){
            this.isEdit = true;
            this.id = this.$route.query.id;
            this.goods_id = this.$route.query.goods_id;
            this.getGiftDetail();
        }
    },
    filters:{

    },
    methods: {
        //图片出错
        onImgError(event) {
            event.srcElement.src = imgerror;
        },
        //添加商品图片
        getSrc(val){
            for(let i in val){
                let img = this.imageListStr.find((n)=>n.imgId == val[i].id)
                if(!img){
                    val[i].imageName = val[i].name
                    val[i].url = val[i].imgUrl
                    val[i].imgId = val[i].id
                    this.imageListStr.push(val[i])
                }
            }
            this.imageListStr[0].covered=1
        },
        //移除图片
        delImg(index){
            this.imageListStr.splice(index,1)
        },
        getGiftDetail(){//获取赠品详情信息
            this.$api("promotion.getGift",{productId:this.id}).then((result) => {
                // debugger
                this.ruleForm = {
                name:result.name,
                code:result.code,
                price:"",
                stock:"",
                weight:result.weight,
                des:result.des,
            };
            // 获取赠品价格
            this.getPrice(this.id)
            // 获取赠品库存
            let productIds = [{"product_id":this.id}];
            // 批量获取商品库存
            this.$api("goods.plGetGoodsStock",{map:productIds}).then((result) => {
                this.ruleForm.stock = result[0].store;
                console.log(this.ruleForm)
            },(error) => {
                this.$message({
                    type: 'error',
                    message: '获取商品库存出错'
                });
                })
            this.goods_id = result.productSkuList[0].id;
            this.imageListStr = result.productImages;
            },(err) => {
                
            })
        },
        getPrice(goodsids){
            let params = {
                product_id:goodsids,
                minPrice:1
            }
            this.$api("goods.getRetailGoodsPrice",params).then((result) => {
                this.ruleForm.price = result[0].market_price+"";
            },(error) => {
                this.$message({
                    type: 'error',
                    message: '获取商品价格出错'
                });
            })
        },
        savePromtion(){
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    if(this.imageListStr.length == 0){
                        this.$message({
                        type: 'error',
                        message: '请至少添加一张图片'
                });
                        return;
                    }
                    this.btnLoading = true
                    let data = this.ruleForm,api;
                    data.productImages = this.imageListStr;
                    if(this.isEdit){//编辑时
                        api = "promotion.editGift";
                        data.productId = this.id;
                    }else{//新增时
                        api = "promotion.addGift";
                    }
                    let formData = JSON.parse(JSON.stringify(data));
                    delete formData.stock;
                    delete formData.price;
                    this.$api(api,formData).then((result) => {
                        let goods_id = result.productSkuList[0].id;
                        let id = result.productId;
                        let storeState = false;
                        let priceState = false;
                        // debugger
                        // 设置库存
                        let stockData = [];
                        stockData.push({
                                store:this.ruleForm.stock == "" ? 0 : this.ruleForm.stock,
                                goods_id:goods_id,
                                type:4,
                                product_id:id,
                                operator_id:2
                            })
                        let params = {
                            product_id:id,
                            map:stockData
                        }
                        let p2 = this.$api("goods.setGoodsStock",params).then((result) => {
                            storeState = true;
                        }, (error) => {
                            this.$message({ message: '保存商品库存出错,请返回列表页从新编辑', type: 'error' });
                            // this.$router.push({name:'giftManagement'})
                        });
                        // 设置价格
                        let priceData = [];
                        priceData.push({
                            sku_id:goods_id,
                            product_id:id,
                            market_price:this.ruleForm.price == "" ? 0 : this.ruleForm.price,
                            wholesale_price:[{"min":1,"max":"","price":0}]
                        })
                        let p3 = this.$api("goods.setGoodsPrice",{priceData:priceData,productId:id,product_type:2}).then((result) => {
                           priceState = true;
                        }, (error) => {
                            this.$message({ message: '保存商品价格出错,请返回列表页从新编辑', type: 'error' });
                        });
                        Promise.all([p2,p3]).then((result) => {
                            if(storeState && priceState){
                                 this.btnLoading = false
                                let msg = this.isEdit ? "编辑赠品成功" : '新增赠品成功';
                                this.$message({ message: msg, type: 'success' });
                                this.$router.push({name:'giftManagement'})
                            }  
                        }).catch((err) => {
                            this.btnLoading = false;
                        })
                    },(err) => {
                        this.btnLoading = false
                        this.$message({
                            type: 'error',
                            message: '保存失败'
                        });
                    })
                   
                }else{
                    console.log('error validate');return
                }
            });
        }
    },
    components: {
        pageTitle,
        addImg
    }
}
</script>
<style scoped>
    .time{
        display:inline-block;
    }
    .areaWidth{
        width: 500px;
    }
    .smallinput {width: 70px; margin:0 5px;}
    .imgCon{overflow: hidden; padding-top: 10px}
    .imgItem{display: block; float: left; width:100px; height: 100px; overflow: hidden; margin-right: 10px; margin-bottom: 10px; border:1px solid #efefef; border-radius: 4px; position: relative;}
    .imgItem .delImg{position: absolute; right: 0px; top: 0px; z-index: 8; padding: 5px; color:#ddd; font-size: 16px}
    .imgCon img{width:100%;}
</style>