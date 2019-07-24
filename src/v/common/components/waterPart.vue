<template>
    <el-form ref="form" :model="form" label-width="100px" style="float:left;width:100%;" v-loading="isLoading">
        <div class="formItem formLeft">
            <el-form-item label="水印排列：" class="waterSort">
                <el-radio-group v-model="form.layout" @change="waterSortEvents">
                    <el-radio :label="1" border><img src="../../common/images/water.png" /></el-radio>
                    <el-radio :label="2" border><img src="../../common/images/water1.png" /></el-radio>
                    <el-radio :label="3" border><img src="../../common/images/water2.png" /></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="logo：">
                <el-switch
                style="display: block"
                v-model="form.logoFlag"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                class="switchLogo"
                @change="logoStatus">
                </el-switch>
                <div class="changeImg" @mouseover="uploads=true" @mouseout="uploads=false">
                    <!-- 显示默认图片图片 -->
                    <div class="changeBox">
                        <span style="display:block;width:135px !important;height:135px !important;">
                            <img :src="form.path" alt="">
                        </span>
                    </div>
                    <!-- 显示本地上传图片 -->
                    <div class="changeBox" v-show="localImgs">
                        <span class="imgItem" style="display:block;width:135px !important;height:135px !important;">
                            <img :src="imageListStr.url" alt="">
                        </span>
                    </div>
                    <!-- 显示图片库图片 -->
                    <div class="changeBox">
                        <span><img :src="listImageStr.url" alt="" style="display:block;width:135px !important;height:135px !important;"></span>
                    </div>
                    <div class="uploadBox" v-show="uploads">
                        <div v-show="isShowLib">
                            <div class="uploadLocal"><add-img @confirm="updataLocalImgs"><el-button size="small" type="primary">上传图片</el-button></add-img></div>
                            <div class="uploadLib"><add-img @confirm="updataLibImgs"><el-button size="small" type="primary">图片库</el-button></add-img></div>
                        </div>
                        <div v-show="isShowDel">
                            <div class="uploadLocal"><add-img @confirm="updataLibImgs"><el-button size="small" type="primary">更换图片</el-button></add-img></div>
                            <div class="dels" @click="delImgs"><el-button size="small" type="primary">移除</el-button></div>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="文字：">
                <el-switch
                style="display: block"
                v-model="form.wordFlag"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                class="switchText"
                @change="wordStatus">
                </el-switch>
                <water-editor :formData="form" v-if="isShowData" type="wordFlag"></water-editor>
            </el-form-item>
            <el-form-item label="网址：">
                <el-switch
                style="display: block"
                v-model="form.urlFlag"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                class="switchUrl"
                @change="urlStatus">
                </el-switch>
                <water-editor :formData="form" v-if="isShowData" type="urlFlag"></water-editor>
            </el-form-item>
            <el-form-item label="透明度：">
                <el-slider v-model="form.opacityScale" show-input @change="sliderChange"></el-slider>
            </el-form-item>
            <el-form-item label="位置：" class="changeRadio">
                <el-radio-group  v-model="form.pos" @change="positionsEvent">
                    <el-radio :label="1" border >左上角</el-radio>
                    <el-radio :label="2" border>顶部居中</el-radio>
                    <el-radio :label="3" border>右上角</el-radio>
                    <el-radio :label="4" border>左侧</el-radio>
                    <el-radio :label="5" border>居中</el-radio>
                    <el-radio :label="6" border>右侧</el-radio>
                    <el-radio :label="7" border>左下角</el-radio>
                    <el-radio :label="8" border>底部居中</el-radio>
                    <el-radio :label="9" border>右下角</el-radio>
                </el-radio-group>
            </el-form-item>
        </div>
        <div class="formItem formRight">
            <div class="pictureBox">
                <img :src="viewPics+'layout='+form.layout+'&logoFlag='+form.logoFlag+'&wordFlag='+form.wordFlag+'&word='+form.word+'&urlFlag='+form.urlFlag+'&url='+form.url+'&opacityScale='+form.opacityScale+'&pos='+form.pos+'&wordB='+form.wordB+'&wordI='+form.wordI+'&wordU='+form.wordU+'&wordFamilyName='+form.wordFamilyName+'&wordSize='+form.wordSize+'&wordColor='+form.wordColor+'&urlB='+form.urlB+'&urlI='+form.urlI+'&urlU='+form.urlU+'&urlFamilyName='+form.urlFamilyName+'&urlSize='+form.urlSize+'&urlColor='+form.urlColor+'&imageId='+form.imageId" alt="">
            </div>
        </div>
        <el-form-item style="clear:both;" class="fixedItem">
            <el-button type="primary" @click="onSubmit" size="medium">保存</el-button>
            <el-button size="medium" @click="reSet">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import waterEditor from '@components/waterEditor';
	import addImg from '@components/addImg'
    export default {
        data(){
			return{
				isLoading:false,// loading层
				form: {
                    id:'',
					layout: '',// 水印布局
					logoFlag: '',// logo开关
					path: '',// logo图片地址
					wordFlag: '',// 启用文字标识
					word: '',//文字编辑器内容
					imageId:0,//图片id
					urlFlag: '',// 启用网址标识
					url: '', //网址编辑器内容
					opacityScale: 0, //水印透明度
					pos: 0,//水印位置
					position: '',//水印位置
					wordB:0,//文字加粗
					wordI:0,//文字斜体
					wordU:0,//文字下划线
					wordFamilyName:'' || '微软雅黑',//文字字体，微软雅黑，宋体，黑体
					wordSize:0,//文字字号
					wordColor:'',//文字颜色
					urlB:0,//网址加粗
					urlI:0,//网址斜体
					urlU:0,//网址下划线
					urlFamilyName:'' || '微软雅黑',//网址字体，微软雅黑，宋体，黑体
					urlSize:0,//网址字号
					urlColor:'',//网址颜色
				},
				logoText:"",//logo文字
				logoUrl:"",//logo网址文字
				uploads: false,//鼠标移入显示浮层
				isShowDel: false,//显示更换图片和删除按钮
				isShowLib: true,//显示上传图片和图片库按钮
				imageListStr: {},//本地上传图片
				listImageStr: {},//图片库图片
				localImgs: false,//显示本地上传图片
				viewPics:__ce.baseURL+'manager/ceshopimgrepository/imgwatermark/preView?t='+new Date().getTime()+'&',//预览图片接口
				isShowData: false,//子组件渲染数据判断
			}
		},
		mounted() {
			this.getWaterMark();
		},
		methods: {
			//获取水印设置
			getWaterMark(){
				this.isLoading = true;
				let params={};
				let imageWatermark = "";
				let logoImageInfo = "";
				this.$api("waterMark.waterMarkConfig",params).then((result)=>{
					this.isLoading = false;
                    imageWatermark =  result.imageWatermark;//水印数据
                    this.form.id = imageWatermark.id;//获取水印id
					this.form.layout = imageWatermark.layout; //水印设置赋值
					this.form.logoFlag = imageWatermark.logoFlag; //logo开关赋值
					this.form.wordFlag = imageWatermark.wordFlag;//文字开关
					this.form.urlFlag = imageWatermark.urlFlag;//网址开关
					this.logoText = this.form.word = imageWatermark.word;//文字内容
					this.logoUrl = this.form.url = imageWatermark.url;//网址文字内容
					this.form.opacityScale = Number(imageWatermark.opacityScale);//透明度
					this.form.pos = imageWatermark.pos;//位置标识
					this.form.imageId = imageWatermark.imageId;//图片ID
					this.form.wordB = imageWatermark.wordB;//文字加粗
					this.form.wordI = imageWatermark.wordI;//文字斜体
					this.form.wordU = imageWatermark.wordU;//文字下划线
					this.form.wordSize = imageWatermark.wordSize;//文字字号
					this.form.wordColor = imageWatermark.wordColor;//文字颜色
					this.form.urlB = imageWatermark.urlB;//文字加粗
					this.form.urlI = imageWatermark.urlI;//文字斜体
					this.form.urlU = imageWatermark.urlU;//文字下划线
					this.form.urlSize = imageWatermark.urlSize;//网址字号
					this.form.urlColor = imageWatermark.urlColor;//网址颜色
					//显示隐藏上传图片、更换图片、图片库、移除
					if(this.listImageStr.url != ''){
						this.isShowDel=true;
						this.isShowLib=false;
					}else{
						this.isShowDel=false;
						this.isShowLib=true;
					}
                    logoImageInfo = result.logoImageInfo || [];//logo数据
                    if(logoImageInfo.imgUrl.indexOf("http")>-1){
                        this.form.path = logoImageInfo.imgUrl//logo图片地址
                    }else{
					    this.form.path = __ce.baseURL+logoImageInfo.imgUrl//logo图片地址
                    }
					this.listImageStr.url = logoImageInfo.imgUrl//获取logo图片地址
					this.paramsView = this.form;
					this.isShowData = true;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.$message(
							{type:"error",message:"submit Error!"}
						)
					} else {
						this.$message({
							type: 'error',
							message: '加载数据出错'
						});
					}
				})
			},
			//水印排列
			waterSortEvents(val){
				this.form.layout=val;
			},
			//透明度
			sliderChange(val){
				this.form.opacityScale=val;
			},
			//位置
			positionsEvent(val){
				this.form.pos=val;
			},
			//logo的显示隐藏
			logoStatus(val){
				this.form.logoFlag=val;
			},
			//文字的显示隐藏
			wordStatus(val){
				this.form.wordFlag=val;
			},
			//网址的显示隐藏
			urlStatus(val){
				this.form.urlFlag=val;
			},
			//上传本地图片
			updataLocalImgs(val){
				this.imageListStr=val
				// this.imageListStr.listImageFlag = 1
				// this.imageListStr.imageName = this.imageListStr.name
				this.imageListStr.url = this.imageListStr.imgUrl//path
				this.imageListStr.imgId = this.imageListStr.id
				if(this.listImageStr.url != ''){
					this.isShowDel=true;
					this.isShowLib=false;
				}else{
					this.isShowDel=false;
					this.isShowLib=true;
				}
				this.form.path = this.imageListStr.url;
				this.form.imageId = this.imageListStr.id
			},
			//上传图片库图片
			updataLibImgs(val){
				this.listImageStr = val
				// this.listImageStr.listImageFlag = 1
				// this.listImageStr.imageName = this.listImageStr.name
				this.listImageStr.url = this.listImageStr.imgUrl//path
				this.listImageStr.imgId = this.listImageStr.id
				if(this.listImageStr.url != ''){
					this.isShowDel=true;
					this.isShowLib=false;
				}else{
					this.isShowDel=false;
					this.isShowLib=true;
				}
				this.form.path = this.listImageStr.url;
				this.form.imageId = this.listImageStr.id
			},
			// 删除图片
			delImgs(){
				this.listImageStr={}
				this.imageListStr={}
				this.form.path = "";
				this.isShowDel=false;
				this.isShowLib=true;
				this.form.imageId = ''
			},
			// 保存水印设置
			onSubmit() {
				let params = this.form;
				params.urlColor = this.form.urlColor
				params.wordColor = this.form.wordColor
				if(this.listImageStr.id != undefined){
					params.imageId=this.listImageStr.id
				}
				if(this.imageListStr.id != undefined){
					params.imageId=this.imageListStr.id
                }
                if(this.markIds){
                    params.ids=this.markIds;
                }
				this.$api("waterMark.waterMarkSave",params).then((result)=>{
					this.$message(
						{type:"success",message:"保存成功!"}
					)
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.$message({
							type:"error",
							message:"submit Error!"
						})
					} else {
						this.$message({
							type: 'error',
							message: '保存水印出错'
						});
					}
				})
			},
			//重置
			reSet(){
				this.$router.go(0)
			}
		},
		components: {
			waterEditor,
			addImg
        },
        props: ['markIds']
	}
</script>

<style>
	/* 表单 */
	.formItem{
		float: left;
		width: 50%;
	}
	.formLeft{
		margin-bottom: 60px;
	}
	.formItem:nth-of-type(2){
		float: right;
		width: 45%;
	}
	/* 水印排序 */
	.waterSort label.el-radio.is-bordered{
		float: left;
		display: table;
		height: 100px;
		padding: 0 20px;
	}
	.waterSort label.el-radio.is-bordered span:nth-of-type(2){
		display: table-cell;
		vertical-align: middle;
	}
	.waterSort .el-radio__inner{
		display: none;
	}
	.waterSort .el-radio__label{
		padding-left: 0;
	}
	/* logo */
	.switchLogo,
	.switchText,
	.switchUrl{
		margin: 10px 0;
	}
	.changeImg{
		display: inline-block;
		position: relative;
		width: 135px;
		height: 135px;
	}
	.changeImg img{
		width: 135px;
		height: 135px;
	}
	.changeBox{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}
	.uploadLocal,
	.uploadLib,
	.dels{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 70%;
		background: rgba(64, 158, 255, .5)
	}
	.uploadLocal:hover,
	.uploadLib:hover,
	.dels:hover{
		background: rgba(64, 158, 255, .7)
	}
	.uploadLocal .el-button,
	.uploadLib .el-button,
	.dels .el-button{
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%,-50%);
		background: none;
		border: 0;
	}
	.uploadLib,
	.dels{
		top: auto;
		bottom: 0;
		height: 30%;
	}
	.dels:hover .el-button{
		color: #f00;
	}
	/* 位置 */
	.positions{
		width: 240px;
	}
	.positions label span{
		width: 80px;
		padding: 5px 28px;
		margin-bottom: -1px;
		margin-right: -1px;
		border-left: 1px solid #dcdfe6;
		border-radius:0px !important;
	}
	.changeRadio .el-form-item__content{
		float: left;
		width: 300px;
		margin-left: 0 !important;
		margin-top: 10px;
	}
	.changeRadio label.el-radio{
		float: left;
		width: 100px;
		height: 26px;
		line-height: 26px;
		padding: 0;
		margin: 0;
		border-radius: 0;
		text-align: center;
	}
	.changeRadio .el-radio.is-bordered+.el-radio.is-bordered{
		margin: 0;
	}
	.changeRadio .el-radio__input{
		display: none;
	}
	.changeRadio .el-radio__label{
		padding-left: 0;
	}
	/* 右侧 */
	.pictureBox{
		position: relative;
		width: 500px;
		height: 430px;
		overflow: hidden;
	}
	.pictureBox>img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.logoInfo{
		position: absolute;
		bottom: 10px !important;
		width: 180px;
		text-align: center;
	}
	.logoInfo img{
		display: inline-block;
		width: 125px;
		height: 125px;
	}
	/* 底部按钮 */
	.waterContent{
		position: relative;
	}
	.fixedItem{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding-left: 200px !important;
		margin-bottom: 0px;
	}
	.fixedItem .el-form-item__content{
		margin-left: 0px !important;
		background: #fff;
		padding: 15px 30px;
		border-top: 1px solid #eee;
	}
	.fixedItem .el-button:nth-of-type(2){
		float: right;
	}
	.waterContent .ql-container{
		height: 50px;
	}
</style>
