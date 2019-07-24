<template>
    <el-dialog title="添加水印" :visible.sync="visible" :before-close="closeProps" class="addWaterMark">
        <water-part ref="submitChildFn" :markIds="ids"></water-part>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">确 定</el-button>
            <el-button @click="closeProps">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import waterPart from '@components/waterPart';
    export default {
        data(){
            return{
                visible:true,
                // 爷爷辈传来的id
                ids:''
            }
        },
        mounted () {
            this.getParentData();
        },
        methods: {
            //获取父组件数据
            getParentData(){
                this.ids=this.markIds;
            },
            closeProps(){
                this.visible = false;
                this.$emit("hideMarkProp");
            },
            submit(){
                this.$refs.submitChildFn.onSubmit();
                this.closeProps();
            }
        },
        components: {
            waterPart
        },
        props: ["markIds"]
    }
</script>

<style>
    .addWaterMark .el-dialog{
        position: relative;
        width: 70%;
        overflow: hidden;
    }
    .addWaterMark .dialog-footer{
        position: absolute;
        padding: 10px;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .addWaterMark .fixedItem{
        display: none;
        position: absolute;
        width: 100%;
        margin: 0;
        padding-left: 0 !important;
        
    }
</style>

