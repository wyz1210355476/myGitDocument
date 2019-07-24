<template>
    <div>
        <el-dialog
        title="编辑"
        :visible.sync="visible"
        class="innerDialog"
        :modal-append-to-body="true"
        append-to-body
        :before-close="cancels"
        width="90%"
        :key="random">
		  	<maintain-imgs :apIdss="apIdss" :selectionData="selectionData" :fileData="fileData" @cancels="cancels" :sendDatas="sendDatas"></maintain-imgs>
            <!-- <div class="btn-area" style="margin-top: 20px">
                <el-button type="primary" size="small" @click="submit" style="float:left;">保存</el-button>
                <el-button size="small" @click="cancel" plain>取消</el-button>
            </div> -->
		</el-dialog>
    </div>
</template>
<script>
    import maintainImgs from './maintainImgs'
    export default {
        data(){
            return{
                visible:true,//弹窗的显示隐藏
                selectionData:this.selection,
                fileData:this.fileList,
                apIdss:'',
                random:Math.random(),
            }
        },
        beforeCreate() {
            this.$options.components.batchAddimgs = () => import('./batchAddimgs')
            this.$options.components.maintainImgs = () => import('./maintainImgs')
            this.$options.components.pictureProp = () => import('./pictureProp')
        },
        mounted () {
            // console.log(this.selectionData)
            this.apIdss=this.apIds;
        },
        methods: {
            cancels(){//右上角叉号关闭弹窗
                this.visible=false;//将弹窗隐藏
                this.$emit('closeBacthProps');//调用父组件关闭弹窗方法
                this.$emit('cancel');//调用父组件关闭弹窗方法
            },
            sendDatas(data){
                console.log(data)
            }
        },
        // watch: {
        //     formData: {
        //         handler(v) {
        //             this.getParentData();
        //         },
        //         deep: true
        //     }
        // },
        components: {
            maintainImgs,//注册编辑组件
        },
        props: ['selection','apIds','fileList'],//接收上个页面传递的参数
    }
</script>
<style>
    .innerDialog .el-dialog{
        height: auto;
    }
    .innerDialog .el-input{
        display: inline-table;
    }
    .innerDialog .editColumn{
        height: 500px;
        overflow-y: auto;
    }
</style>
