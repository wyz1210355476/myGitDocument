<template>
<span>
	<span @click=" dialogVisible = true "><slot></slot></span>

	<el-dialog title="选择视频" :visible.sync="dialogVisible" width="640px" :append-to-body="true">
		<div style="height:440px">
			<div class="popContent" v-loading="isLoading">
				<div class="nodata" v-if="videoList.length == 0">暂无数据</div>
				<div v-if="videoList.length != 0">
					<div class="imgList libImgList">
						<span v-for="(item, index) in videoList" @click="handleLibImgClick(index)">
							<img :src="item.imgUrl" :title="item.name">
							<label class="label-img-check" v-show="item.checked"><i class="el-icon-check"></i></label>
						</span>
					</div>
					<el-pagination
						class="floatR"
					    @current-change="handleCurrentChange"
					    :current-page="1"
					    :page-size="15"
					    layout="total, prev, pager, next"
					    :total="total">
				    </el-pagination>
			    </div>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click=" dialogVisible = false ">取 消</el-button>
			<el-button size="small" type="primary" @click="confirm">确 定</el-button>
		</span>
	</el-dialog>

</span>
</template>

<script>
	import imgLib from '@components/imgLib'
	export default {
		data() {
			return {
				isLoading:false,
				dialogVisible:false,
				videoList:[],
				selectData:'',
				total:0,
			}
		},
		props: {
			multiple: {
				type: [Boolean],
				default : false
			}
		},
		mounted() {

		},
		methods: {
			//图片库图片选中与取消选中
		    handleLibImgClick(index) {
		    	let checked = this.videoList[index].checked;
		    	if (!this.multiple) {
		    		this.videoList.forEach((v) => {
		    			v.checked = false;
		    		});
		    	}
		    	this.videoList[index].checked = checked ? false : true;
		    },
			//图片库页面切换
		    handleCurrentChange(page) {
				console.log(page);
			},
			getImg(val){
				this.selectData = val
			},
			//确定
			confirm(){
				if(this.selectData == '' || this.selectData.length == 0){
					this.$message({
			          	message: '请选择图片',
			          	type: 'error'
			        });return
				}
				this.$emit("confirm", this.selectData);
				this.dialogVisible = false;
			}
		},
		components:{
			imgLib
        }
	}
</script>
<style>
.upload .el-upload-list{height: 335px; overflow-y:auto }
.upload .el-upload-list--picture .el-upload-list__item{width: 100px; height: 100px; border:1px solid #eee;
	float: left;
	box-sizing:border-box; margin:10px; overflow: hidden;
	padding: 0;
	position: relative;
}
.upload .el-upload-list--picture .el-upload-list__item:nth-child(5n+1){margin-left:0;}
.upload .el-upload-list--picture .el-upload-list__item:nth-child(5n){margin-right:0;}
.upload .el-upload-list--picture .el-upload-list__item-thumbnail{
	margin: 0;
    width: auto;
    height: auto;
	max-width: 100%;
	max-height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%,-50%);
      	-ms-transform: translate(-50%,-50%);
          	transform: translate(-50%,-50%);
}
.upload .el-upload-list__item-name{display: none}
.upload .el-upload-list--picture .el-upload-list__item-status-label{
	z-index: 9
}
.upload .el-upload-list__item .el-icon-close{z-index: 9;}
.popContent .imgList span .label-img-check .el-icon-check {
	color: #fff;
	font-size: 12px;
    margin-top: 12px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
.popContent .imgList span .el-icon-close {
	display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}
.popContent .imgList span:hover .el-icon-close {
	display: block;
}
</style>
<style scoped>
.popContent{height: 400px; overflow-y: auto }
.imgList{
	overflow-y: auto;
	height: 360px;
}
.nodata{line-height: 200px; text-align: center; color: #999}
.imgList span{
	border-radius:6px;
	display: inline-block;
	box-sizing:border-box;
	border:1px solid #ddd;
	float: left;
	width: 100px;
	height: 100px;
	margin:10px;
	overflow: hidden;
	position: relative;
}
.imgList span .label-img-check {
	position: absolute;
    right: -17px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 1px 1px #ccc;
    box-shadow: 0 1px 1px #ccc;
}
.internetImgList span:hover .label-img-check {
	display: none;
}
.imgList span:nth-child(5n+1){margin-left: 0}
.imgList span:nth-child(5n){margin-right: 0}
.imgList span img{
	max-width: 100%;
	max-height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%,-50%);
      	-ms-transform: translate(-50%,-50%);
          	transform: translate(-50%,-50%);
}
</style>