<template>
    <div>
        <el-dialog title="转移" :visible.sync="visible" class="transfer">
		  	<div class="order-form">
		  		<el-form size="small">
                    <el-form-item prop="title">
                        <el-table
                        :data="groupMenu"
                        height="300"
                        highlight-current-row
                        style="width: 100%">
                        <el-table-column
                        property="groupMenu"
                        label="请确认转移目标分类">
                            <template slot-scope="scope">
                                <div @click="getAppID(scope.row.id)">
                                    {{scope.row.name}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-form-item>
				</el-form>
				<div class="btn-area bottom" style="margin-top: 20px">
					<el-button size="small" @click="cancel" plain>取消</el-button>
					<el-button type="primary" size="small" @click="submit(picsIds,rowId)">保存</el-button>
				</div>
		  	</div>
		</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            visible: true,
            appID: "",
            ids: ""
        }
    },
    mounted () {
    },
    props:['picsIds','groupMenu','rowId'],
    methods: {
        getAppID(appID){
            this.appID=appID;
        },
        cancel() {
            this.visible = false;
            this.$emit("getPicsList");
            this.$emit("hiddenShow");
        },
        submit(arr,rowId){
            let idArr = [],
                params = {};
            for(let i=0;i<arr.length;i++){
                idArr.push(arr[i].id);
            }
            this.ids = idArr.join(",");
            params.ids = this.ids || rowId || "";
            params.appId = this.appID;
            if(!this.appID){
                this.$message(
                    {type:"error",message:"请选择目标分类!"}
                )
                return;
            }
            this.$api("pictureLib.transfer",params).then((result)=>{
                this.$message(
                    {type:"success",message:"转移成功!"}
                )
                this.visible = false;
                this.$emit("getPicsList");
                this.$emit("hiddenShow");
            }, (error) => {
                if (error && error.data && error.data.status == 102) {
                    this.$message(
                        {type:"error",message:"submit Error!"}
                    )
                    this.$emit("hiddenShow");
                } else {
                    this.$message({
                        type: 'error',
                        message: '加载数据出错'
                    });
                }
            })
        },
    }
}
</script>
<style>
    .transfer .current-row{
        color: #409EFF;
    }
    .transfer .el-icon-close{
        display: none;
    }
    .transfer .btn-area.bottom{
        text-align: center;
    }
    .transfer .el-button{
        margin: 0 10px;
    }
</style>
