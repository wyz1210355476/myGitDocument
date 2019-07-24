<template>
    <div>
        <el-dialog title="栏目转移" :visible.sync="visible" class="transfer" :before-close="beforeClose">
            <div class="subTitle">请确认转移目标栏目</div>
		  	<div class="treeBox">
                <el-tree
                :data="data"
                :props="defaultProps"
                @node-click="handleNodeClick"
		        @node-expand="handleNodeClick"
                :load="loadNode"
                :lazy="true"
                :expand-on-click-node="false"
                :check-strictly="true"
                node-key="id"
                highlight-current>
                </el-tree>
		  	</div>
            <div class="btn-area bottom" style="margin-top: 20px">
                <el-button type="primary" size="small" @click="submit" :disabled="saveFlag">保存</el-button>
                <el-button size="small" @click="cancel" plain>取消</el-button>
            </div>
		</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            visible:true,
            tranerId:'',
            saveFlag: true,
            tempId:''
        }
    },
    mounted () {
        this.getChildList()
    },
    methods: {
        //
        beforeClose(done){
            this.visible=false;
            this.$emit("switchTranfer");
        },
        // 获取子集数据
        getChildList(){
            this.$api("navigator.childList",{navId:this.fatherId}).then((result)=>{
                if(result.status != 102){
                    this.data = result.list;
                    this.data.unshift({
                        name:'顶级栏目',
                        id: 0,
                        children:[]
                    })
                }
            },(error)=>{
                if(error && error.data && error.data.status == 102){
                    this.data=[]
                }else{
                    this.$message({
                        type: 'error',
                        message: '获取导航失败！'
                    })
                }
            })
        },
        handleNodeClick(val){
            this.tempId = val.id;
            if(this.myId == val.id || this.myId ==  this.tempId || this.myId == val.parentId){
                this.saveFlag=true;
                this.isLoading = true;
                return false;
            }else{
                this.tranerId=val.id;
                this.saveFlag=false;
            }
        },
        // 懒加载tree数据
        loadNode(node, resolve){
            console.log(node)
            if(this.tempId == this.myId || this.myId == node.data.parentId){
                this.saveFlag=true;
                this.isLoading = true;
                this.$message({
                    type: 'error',
                    message: '禁止转移到同级及子目录中'
                })
                return false;
            }
            var data = [];
            if(node.data.childrenNum > 0){//点击树节点1的处理
                let param={};
                param.parentId=node.data.id;
                param.navId=node.data.navId;
                this.$api("navigator.childList",param).then((result)=>{
                    if(result.status != 102){
                        data = result.list;
                        resolve(data)
                    }
                },(error)=>{
                    if(error && error.data && error.data.status == 102){
                        data=[]
                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取导航失败！'
                        })
                    }
                })
            }else{
                resolve(data)
            }
        },
        // 取消
        cancel(){
            this.visible=false;
            this.$emit("switchTranfer");
        },
        // 确定
        submit(){
            let params={};
            params.id=this.myId;
            params.targetId=this.tranerId;
            // myId this.targetId  需要传的参数
            this.$api("navigator.transfer",params).then((result)=>{
                this.$message({
                    type: 'success',
                    message: '栏目转移成功！'
                });
                this.visible=false;
                this.$emit("switchTranfer");
                this.$emit("getList");

            },(error)=>{
                if(error && error.data && error.data.status == 102){
                    this.$message({
                        type: 'error',
                        message: '栏目转移失败！'
                    })
                }
            })
        }
    },
    props: ['fatherId','myId']
}
</script>
<style>
    .transfer .el-dialog{
        width: 440px;
    }
    .treeBox{
        height: 250px;
        overflow-y: auto;
    }
    .transfer .btn-area.bottom{
        position: static;
        width: 100%;
    }
    .transfer .btn-area.bottom .el-button:nth-child(1){
        float: left;
    }
</style>
