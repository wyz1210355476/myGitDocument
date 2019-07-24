<template>
<span>
	<el-tabs v-model="activeName" @tab-click="handleTabChange">
	    <el-tab-pane label="从本地选择照片" name="local">
			<div class="popContent">
				<el-upload
				  class="upload"
				  :action="uploadUrl"
				  :on-success="handleSuccess"
				  :on-remove="handleRemove"
				  :file-list="fileList"
				  :with-credentials="true"
				  :before-upload="beforeUpload"
				  :headers="headerOption"
				  :data="dataParams"
				  :multiple="multiple"
				  list-type="picture">
				  <el-button size="small" type="primary">点击上传</el-button>
				</el-upload>
			</div>
	    </el-tab-pane>
	    <el-tab-pane label="从图片库选择照片" name="lib">
			<div class="popContent" v-loading="isLoading">
				<div class="nodata" v-if="libImgList.length == 0">暂无数据</div>
				<div v-if="libImgList.length != 0">
					<div class="imgList libImgList">
						<span v-for="(item, index) in libImgList" @click="handleLibImgClick(index)" :key="item.id">
							<img :src="item.imgUrl" :title="item.name" @error="onImgError">
							<label class="label-img-check" v-show="item.checked"><i class="el-icon-check"></i></label>
						</span>
					</div>
					<div class="floatL" v-if="multiple">
						<el-checkbox @change="selectAll" size="small" >全选</el-checkbox>
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
	    </el-tab-pane>
	    <!-- <el-tab-pane label="互联网上的照片" name="internet">
			<div class="popContent">
				<el-input v-model="input" placeholder="请输入网络图片链接" size="small" class="formInput"></el-input>
				<el-button size="small" @click="addInternetImg" :loading="isBtnLoading">添加</el-button>
				<div class="imgList internetImgList">
					<span v-for="(item, index) in internetImgList" :key="item.id">
						<img :src="item.path" @error="onImgError">
						<label class="label-img-check"><i class="el-icon-check"></i></label>
						<i class="el-icon-close" @click="removeInternetImg(index)"></i>
					</span>
				</div>
			</div>

	    </el-tab-pane> -->
	</el-tabs>
</span>
</template>

<script>
	import imgerror from '@v/common/images/imgerror.jpg'
	export default {
		data() {
			return {
				activeName:'local',
				dialogVisible:false,
				fileList: [],
				localImgList: [],
				libImgList: [],
				total: 0,
				internetImgList: [],
				input:'',
				uploadUrl: __ce.baseURL+'/manager/ceshopimgrepository/img/upload',
				headerOption: {
					// common: {
						'X-Requested-with': 'XMLHttpRequest'
					// }
				},
				isBtnLoading: false,
				isLoading: false,
				dataParams:{}
			}
		},
		props: {
			multiple: {
				type: [Boolean],
				default : false
			}
		},
		mounted() {
			this.getLibImgList();
			if(sessionStorage.getItem('token')){
				this.dataParams.TOKEN=sessionStorage.getItem('token')
			}
		},
		methods: {
			onImgError(event) {
				event.srcElement.src = imgerror;
			},
			//页签切换
			handleTabChange(tab, event) {
				this.getSelectImg()
		    },
		    beforeUpload(file){
		        const isLt5M = file.size / 1024 / 1024 < 5;
		        if (!isLt5M) {
		          this.$message.error('图片大小不能超过 5MB!');
		        }
		        return isLt5M;
		    },
		    //上传本地图片成功回调
		    handleSuccess(response, file, fileList) {
		    	if (response.status != 101) {
		    		this.$message({
                        type: 'error',
                        message: '上传失败！'
                    });
                    return;
		    	}
		    	let img = response.data;
		    	if (!this.multiple) {
					this.localImgList = [];
					fileList = [file];
		    	}
		    	this.localImgList.push(img);
		    	this.getLibImgList();
		    	this.getSelectImg();
		    },
		    //移除本地图片
			handleRemove(file, fileList) {
				let index = this.localImgList.findIndex(n => n.uid == file.uid);
				if (index > -1) {
					this.localImgList.splice(index, 1);
				}
				this.getSelectImg()
		    },
		    //图片库页面切换
		    handleCurrentChange(page) {
				this.getLibImgList(page);
			},
			//获取图片库
			getLibImgList(page=1) {
				this.isLoading = true;
				this.$api("imgLib.getImgList", {page: page, pageSize: 15}).then((result) => {
					result.list.forEach((v) => {
						v.checked = false;
					});
					this.libImgList = result.list;
					this.total = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
                    	this.libImgList = [];
                    	this.total = 0;
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
		    //图片库图片选中与取消选中
		    handleLibImgClick(index) {
		    	let checked = this.libImgList[index].checked;
		    	if (!this.multiple) {
		    		this.libImgList.forEach((v) => {
		    			v.checked = false;
		    		});
		    	}
		    	this.libImgList[index].checked = checked ? false : true;
		    	this.getSelectImg()
		    },
		    //全选
			selectAll(val) {
				this.libImgList.forEach((v) => {
					v.checked = val;
				});
				this.getSelectImg()
			},
		    //添加互联网图片
		    addInternetImg() {
		    	if (!/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?\.(jpg|gif|png|jpeg)$/.test(this.input)) {
		    		this.$message({
                        type: 'error',
                        message: '请输入正确的图片链接'
                    });
                    return;
		    	}
		    	this.isBtnLoading = true;
		    	this.$api("imgLib.addInternetImg", {path: this.input}).then((result) => {
		    		if (!this.multiple) {
						this.internetImgList = [];
			    	}
			    	this.internetImgList.push(result);
			    	this.input = '';
			    	this.getLibImgList();
			    	this.isBtnLoading = false;
			    	this.getSelectImg();
		    	}, (error) => {
		    		this.$message({
                        type: 'error',
                        message: '添加图片失败'
                    });
                    this.isBtnLoading = false;
		    	});
		    },
		    //移除互联网图片
		    removeInternetImg(index) {
		    	this.internetImgList.splice(index, 1);
		    	this.getSelectImg()
		    },
			//确定
			getSelectImg(){
				let selectedImgList = [];
				//本地图片
				if (this.activeName == 'local') {
					this.localImgList.forEach((v) => {
						selectedImgList.push(v);
					});
				}
				//图片库
				if (this.activeName == 'lib') {
					this.libImgList.forEach((v) => {
						if (v.checked) {
							selectedImgList.push(v);
						}
					});
				}
				//互联网图片
				if (this.activeName == 'internet') {
					this.internetImgList.forEach((v) => {
						selectedImgList.push(v);
					});
				}
				this.$emit("confirm", this.multiple ? selectedImgList : selectedImgList[0]);
			}
		},
		components:{

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