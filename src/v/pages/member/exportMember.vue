<template>
	<div>
		<el-dialog
		  	title="导出"
		  	:visible.sync="visible"
            width="600px"
			custom-class="import-member-dialog">
            <div>
                <el-form ref="form" :rules="rules" :model="form" label-width="80px" size="small" class="order-form">
	    			<el-form-item label="选择分组：" prop="" class="item-input-inline">
					     <el-select v-model="value" placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
					</el-form-item>
                    <el-form-item label="注册时间：" prop="" class="item-input-inline">
                        <el-radio-group v-model="registrationTime" size="mini">
                            <el-radio-button label="1">全部</el-radio-button>
                            <el-radio-button label="2">最近三天</el-radio-button>
                            <el-radio-button label="3">本周</el-radio-button>
                            <el-radio-button label="4">本月</el-radio-button>
                            <el-radio-button label="5">自定义</el-radio-button>
                        </el-radio-group>
					</el-form-item>
                    <el-form-item v-if="registrationTime == 5" label="" prop="timeFrame" class="item-input-inline">
                        <el-date-picker
                        v-model="form.timeFrame"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
					</el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button size="small" @click="close">关闭</el-button>
                <el-button size="small" type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dialogVisibility from '@c/mixins/dialogVisibility';
    // import xlsx from '@static/客户导入数据模板.xlsx';

    export default {
        data() {
            let checkTime = (rule, value, callback) => {
                if(this.registrationTime == 5 && value == ""){
                    return callback(new Error('请输入自定义时间'));
                }else{
                    callback();
                }
            }
            return {
                form:{
                    timeFrame:"",
                },
                rules:{
                    timeFrame: [
                        { validator: checkTime, trigger: 'blur' }
                    ],
                },
                registrationTime:'1',
                options:[],
                value:""
            }
        },
        mixins: [dialogVisibility],
        mounted() {
            this.getLevelList()
        },
        methods: {
           //客户分组列表
			getLevelList() {
				this.$api("member.getLevelList").then((result) => {
					result.unshift({
                        id:'',
                        name: "全部"
                    });
                    this.options = result;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
                    	this.options = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
            confirm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                         //初始化快速日期选择的日期
                        let todayDate = new Date(),//今日
                        yesterdayDate = new Date(new Date().setDate(todayDate.getDate()-1)),//昨日
                        
                        thisDay = todayDate.getDay() == 0 ? 7 : todayDate.getDay(),//本周当前天（周几）

                        thisWeekFirstDayDate = new Date(todayDate-(thisDay-1)*86400000),//本周第一天

                        thisMonthFirstDayDate = new Date(new Date().setDate(1));//本月第一天

                        let timeFrame;
                        switch(this.registrationTime){
                            case "1":
                                timeFrame = {
                                    timeStart:"",
                                    timeEnd:""
                                }
                                break;
                            case "2":
                                timeFrame = {
                                    timeStart:new Date(new Date().setDate(todayDate.getDate()-3)),
                                    timeEnd:todayDate
                                }
                                break;
                            case "3":
                                timeFrame = {
                                    timeStart:thisWeekFirstDayDate,
                                    timeEnd:todayDate
                                }
                                break;
                            case "4":
                                timeFrame = {
                                    timeStart:thisMonthFirstDayDate,
                                    timeEnd:todayDate
                                }
                                break;
                            case "5":
                                timeFrame = {
                                    timeStart:this.form.timeFrame[0],
                                    timeEnd:this.form.timeFrame[1]
                                }
                                break;
                        }
                        // console.log(this.timeFrame[0].toLocaleDateString())
                        for(let key in timeFrame){
                            if(timeFrame[key] != ""){
                                timeFrame[key] = timeFrame[key].toLocaleDateString().replace(/\//g,"-");
                            }
                        }
                        let url =  __ce.baseURL + "/pmanager/account/exportUser?level_id=" + this.value + "&start_time=" + timeFrame.timeStart + "&end_time=" + timeFrame.timeEnd;
                        // window.open(url);
                        location.href = url;
                        this.$message({
                            type: 'success',
                            message: '导出成功'
                        });
                        this.visible = false;
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //关闭弹窗
            close() {
                this.visible = false;
                this.$emit('exportSuccess');
            }
        }
    }
</script>
<style>
    .import-member-dialog .el-dialog__body {padding-top: 5px;}
    .import-member-dialog .el-alert {padding: 3px 10px;}
    .import-member-dialog .instruction-box {margin-top: 15px;}
    .import-member-dialog .instruction-steps {margin: 5px 0; padding-left: 10px; font-size: 12px; list-style: none; line-height: 21px;}
    .import-member-dialog .upload-box {margin-top: 15px; overflow: hidden; height: 65px;}
    .import-member-dialog .upload-title {float: left; margin-top: 3px;}
    .import-member-dialog .upload-demo {overflow: hidden;}
    /* .import-member-dialog .el-upload-list {} */
    .import-member-dialog .el-upload-list__item {font-size: 12px;}
</style>


