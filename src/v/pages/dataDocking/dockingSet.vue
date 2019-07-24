<template>
    <div class="contents">
        <page-title :title="'数据对接设置'"></page-title>
        <div class="content-table ce-content-style">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="数据对接：" prop="synFlag">
					<el-radio-group v-model="ruleForm.synFlag" @change="dockingSwitch">
                        <el-radio :label="'open'">开启</el-radio>
                        <el-radio :label="'close'">关闭</el-radio>
                    </el-radio-group>
				</el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import pageTitle from '@components/pageTitle';
export default {
    data () {
        return {
            ruleForm:{
                "synFlag":"close"
            },
            rules:{
            }
        }
    },
    mounted() {
        this.getSet();
    },
    methods: {
        getSet(){
            this.$api("dataDocking.getSwitchSet",{}).then((result) => {
                this.ruleForm = {
                    synFlag:result.dataSynConfig.synFlag
                }
            },(error) => {
                if(error.data.status != '102'){
                    this.$message({ message: '获取配置出错', type: 'error' });
                } 
                
            })
        },
        dockingSwitch(val){ 
            this.$api("dataDocking.switchSet",{config:{"dataSynConfig":{"synFlag":this.ruleForm.synFlag}}}).then((result) => {
                let msg = this.ruleForm.synFlag == "open" ? "数据对接开启！" : "数据对接关闭！";
                this.$message({ message: msg, type: 'success' });
            },(error) => {
                this.$message({ message: '数据对接设置出错', type: 'error' });
            })
        }
    },
    components:{
        pageTitle,
    }
}
</script>
<style scoped>
   
</style>
