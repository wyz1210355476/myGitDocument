<template>
    <div>
        <el-dialog title="编辑" :visible.sync="visible" class="editProp" :before-close="cancel">
		  	<div class="order-form">
		  		<el-form size="small">
                    <el-form-item prop="title" class="editFormItem">
                        Banner名称：<el-input v-model="adsName" placeholder="请输入内容"></el-input>
                    </el-form-item>
				</el-form>
				<div class="btn-area bottom" style="margin-top: 20px">
					<el-button type="primary" size="small" @click="submit" style="float:left;">保存</el-button>
					<el-button size="small" @click="cancel" plain>取消</el-button>
				</div>
		  	</div>
		</el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                visible:true,//弹窗显示隐藏变量
                id:'',//接收上个页面传递的ID
                adsName:'',//被编辑项的name
            }
        },
        mounted () {
            this.id=this.ADId;
            this.getAdvert(this.id);
        },
        methods: {
            getAdvert(appId){//获取单条广告,appId参数为获取某条广告的id
                this.$api("advert.getAdvert",{id:appId}).then((result)=>{
                    this.adsName=result.name;
                },(error)=>{
                    if(error&&error.data&&error.data.status==102){
                    }else{
                        this.$message({//错误提示
                            type:'error',
                            message:'加载出错'
                        })
                    }
                })
            },
            submit(){//保存弹窗
                this.$api("advert.update",{
                    id:this.id,
                    name:this.adsName
                }).then((result)=>{
                    this.$message({
                        type:'success',
                        message:'保存成功！'
                    })
                    this.visible=false;
                    this.$emit("closeProps");
                },(error)=>{
                    this.$message({
                        type:'error',
                        message:'保存失败！'
                    })
                });
            },
            cancel(){//取消弹窗
                this.visible=false;
                this.$emit("closeProps");
            },
        },
        props: ['ADId'],//接收上个页面传递的ID
    }
</script>
<style>
    .advertList .editProp .el-dialog{
        height: 300px;
    }
    .advertList .editProp .editFormItem{
        padding-left: 40px;
    }
    .advertList .editProp .el-input{
        display: inline-block;
        vertical-align: middle;
        width: auto;
    }
</style>
