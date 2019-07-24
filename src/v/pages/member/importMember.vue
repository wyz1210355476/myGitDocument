<template>
	<div>
		<el-dialog
		  	title="导入客户"
		  	:visible.sync="visible"
            width="600px"
			custom-class="import-member-dialog">
            <div>
                <el-alert
                    title=""
                    type="warning"
                    :closable="false">
                    <div><i class="el-icon-warning"></i> 请先下载客户模板文件：<el-button type="text" size="small" @click="downloadMould('xlsx')">xlsx格式</el-button><el-button type="text" size="small" @click="downloadMould('csv')">csv格式</el-button></div>
                </el-alert>
                <div class="instruction-box">
                    <div class="instruction-title">模板表格使用说明：</div>
                    <ul class="instruction-steps">
                        <li class="instruction-step">1、导入文件仅支持 xls、xlsx 及 csv 格式</li>
                        <li class="instruction-step">2、客户名称、手机号不允许为空，如果为空或者重复，则本行数据不允许导入</li>
                        <li class="instruction-step">3、密码允许为空，如果为空则此客户的密码为手机号码后六位</li>
                        <li class="instruction-step">4、客户分组默认导入为系统默认分组，导入用户默认停用</li>
                        <li class="instruction-step">5、邮箱允许为空，但不允许重复，否则本行数据不允许导入</li>
                        <li class="instruction-step">6、一次最多上传 2000 条数据</li>
                    </ul>
                </div>
                <div class="upload-box">
                    <div class="upload-title">导入文件：</div>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        name="file"
                        accept=".xls,.xlsx,.csv"
                        :action="uploadUrl"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :on-exceed="handleExceed"
                        :with-credentials="true"
                        :headers="headerOption"
                        :auto-upload="false"
                        :file-list="fileList"
                        :limit="1">
                        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload" :disabled="fileList.length === 0">上传</el-button>
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </div>
            </div>
            <div slot="footer">
                <el-button plain size="small" @click="close">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dialogVisibility from '@c/mixins/dialogVisibility';
    // import xlsx from '@static/客户导入数据模板.xlsx';

    export default {
        data() {
            return {
                fileList: [],
                uploadUrl: __ce.baseURL + '/pmanager/account/importUser',
                headerOption: {
					// common: {
						'X-Requested-with': 'XMLHttpRequest'
					// }
                },
                rightCount: 0
            }
        },
        mixins: [dialogVisibility],
        methods: {
            downloadMould(format) {
                let origin = window.location.origin;
                let baseRoute = this.$router.options.base;
                let url = (window.location.port == '8080' || !baseRoute) ? (origin + '/' + 'static/客户导入数据模板.' + format) : (origin + baseRoute + 'static/客户导入数据模板.' + format);
                window.open(url);
            },
            //上传成功回调
            handleSuccess(res, file, fileList) {
                if (res.status == 101) {
                    if (res.data.rightCount != 0) {
                        this.rightCount = res.data.rightCount;
                        this.$message({
                            type: 'success',
                            message: '导入成功' + res.data.rightCount + '条，失败' + res.data.wrongCount + '条'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '导入成功' + res.data.rightCount + '条，失败' + res.data.wrongCount + '条'
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg ? res.msg : '导入失败'
                    });
                }
                this.$refs.upload.clearFiles();
            },
            //添加文件回调
            handleChange(file, fileList) {
                this.fileList = fileList;
            },
            //移除文件
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            //超出添加个数(现允许个数为1)
            handleExceed(file, fileList) {
                this.fileList = [...file];
            },
            //确认上传
            submitUpload() {
                this.$refs.upload.submit();
            },
            //关闭弹窗
            close() {
                this.visible = false;
                if (this.rightCount !== 0) {
                    this.$emit('importSuccess');
                }
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


