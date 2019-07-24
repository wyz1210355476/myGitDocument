<template>
    <div>
        <el-dialog :visible.sync="visible" :fullscreen="true" :show-close="true" :modal-append-to-body="true" :close-on-click-modal="false" :before-close="closeProps" class="viewPics">
		  	<img :class="statusObj" :src="picSrc" alt="">
            <!-- closeProps -->
		</el-dialog>
        <div class="botItem">
            <ul>
                <li>{{this.rowInfo.name}}.{{this.rowInfo.extName}}</li><!--
                --><li>{{this.rowInfo.appName}}</li><!--
                --><li>{{this.rowInfo.width}}X{{this.rowInfo.height}}</li><!--
                --><li>{{this.rowInfo.displaySize}}</li><!--
                --><li>{{this.rowInfo.updateDate}}</li><!--
                --><li class="lastChild" @click="picSize" v-show="statusObj.original">原始尺寸</li><!--
                --><li @click="full" v-show="statusObj.fullHide">完整显示</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            visible: true,
            picSrc: "",
            statusObj:{
                fullHide: false,
                original:true,
            }
        }
    },
    mounted () {
        console.log(this.rowInfo)
        if(this.rowInfo.imgUrl.indexOf("http") > -1){
            this.picSrc = this.rowInfo.imgUrl
        }else{
            this.picSrc = __ce.baseURL+this.rowInfo.imgUrl
        }
    },
    props:['rowInfo'],
    methods: {
        closeProps(){
            this.visible = false;
            this.$emit("hiddenProps");
        },
        picSize(){
            this.statusObj.fullHide=true;
            this.statusObj.original=false;
        },
        full(){
            this.statusObj.original=true;
            this.statusObj.fullHide=false;
        }
    }
}
</script>
<style>
    .viewPics .el-dialog{
        background: transparent;
        box-shadow: none;
    }
    .viewPics .el-dialog__headerbtn .el-dialog__close{
        background: #000;
        padding: 8px;
        font-size: 20px;
        font-weight: bold;
    }
    .viewPics .el-dialog__headerbtn:hover .el-dialog__close{
        background: #f00;
        color: #fff;
    }
    .viewPics .original{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        max-width: 80%;
        max-height: 80%;
    }
    .viewPics .fullHide{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: auto;
        height: auto;
    }
    .viewPics .el-icon-close{
        color: #fff;
    }
    .botItem{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 50px;
        background: #1b1b1b;
        color: #fff;
        opacity: 1;
        z-index: 9999;
        text-align: center;
    }
    .botItem ul,
    .botItem li{
        list-style: none;
        padding: 0;
        margin: 0;
        line-height: 50px;
    }
    .botItem li{
        display: inline-block;
        border-right: 1px solid #383838;
        padding: 0 20px;
    }
    .botItem li:last-child,
    .botItem li.lastChild{
        border:0;
        cursor: pointer;
        color: #3987c7;
    }
</style>
