<template>
	<div>
		<quill-editor v-model="content"
                      :options="editorOption"
                      :ref="refname"
                      @change="onChange">
	        <div :id="refname" slot="toolbar">
	           	<span class="ql-formats">
	           		<button type="button" class="ql-bold"></button>
	           		<button type="button" class="ql-italic"></button>
	           		<button type="button" class="ql-underline"></button>
	           		<button type="button" class="ql-strike"></button>
                </span>
                <span class="ql-formats">
                	<button type="button" class="ql-blockquote"></button>
                	<button type="button" class="ql-code-block"></button>
                </span>
                <span class="ql-formats">
                	<button type="button" class="ql-header" value="1"></button>
                	<button type="button" class="ql-header" value="2"></button>
                </span>
                <span class="ql-formats">
                	<button type="button" class="ql-list" value="ordered"></button>
                	<button type="button" class="ql-list" value="bullet"></button>
                </span>
                <span class="ql-formats">
                	<button type="button" class="ql-script" value="sub"></button>
                	<button type="button" class="ql-script" value="super"></button>
                </span>
                <span class="ql-formats">
                	<button type="button" class="ql-indent" value="-1"></button>
                	<button type="button" class="ql-indent" value="+1"></button>
                </span>
                <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>
                <span class="ql-formats">
                	<select class="ql-size">
				        <option value="small"></option>
				        <option selected></option>
				        <option value="large"></option>
				        <option value="huge"></option>
		      		</select>
		      	</span>
		      	<span class="ql-formats">
			      	<select class="ql-header">
				        <option value="1"></option>
				        <option value="2"></option>
				        <option value="3"></option>
				        <option value="4"></option>
				        <option value="5"></option>
				        <option value="6"></option>
				        <option selected="selected"></option>
			      	</select>
		      	</span>
		      	<span class="ql-formats">
			      	<select class="ql-color">
				        <option selected="selected"></option>
				        <option value="#e60000"></option>
				        <option value="#ff9900"></option>
				        <option value="#ffff00"></option>
				        <option value="#008a00"></option>
				        <option value="#0066cc"></option>
				        <option value="#9933ff"></option>
				        <option value="#ffffff"></option>
				        <option value="#facccc"></option>
				        <option value="#ffebcc"></option>
				        <option value="#ffffcc"></option>
				        <option value="#cce8cc"></option>
				        <option value="#cce0f5"></option>
				        <option value="#ebd6ff"></option>
				        <option value="#bbbbbb"></option>
				        <option value="#f06666"></option>
				        <option value="#ffc266"></option>
				        <option value="#ffff66"></option>
				        <option value="#66b966"></option>
				        <option value="#66a3e0"></option>
				        <option value="#c285ff"></option>
				        <option value="#888888"></option>
				        <option value="#a10000"></option>
				        <option value="#b26b00"></option>
				        <option value="#b2b200"></option>
				        <option value="#006100"></option>
				        <option value="#0047b2"></option>
				        <option value="#6b24b2"></option>
				        <option value="#444444"></option>
				        <option value="#5c0000"></option>
				        <option value="#663d00"></option>
				        <option value="#666600"></option>
				        <option value="#003700"></option>
				        <option value="#002966"></option>
				        <option value="#3d1466"></option>
			      	</select>
			      	<select class="ql-background">
				        <option value="#000000"></option>
				        <option value="#e60000"></option>
				        <option value="#ff9900"></option>
				        <option value="#ffff00"></option>
				        <option value="#008a00"></option>
				        <option value="#0066cc"></option>
				        <option value="#9933ff"></option>
				        <option selected="selected"></option>
				        <option value="#facccc"></option>
				        <option value="#ffebcc"></option>
				        <option value="#ffffcc"></option>
				        <option value="#cce8cc"></option>
				        <option value="#cce0f5"></option>
				        <option value="#ebd6ff"></option>
				        <option value="#bbbbbb"></option>
				        <option value="#f06666"></option>
				        <option value="#ffc266"></option>
				        <option value="#ffff66"></option>
				        <option value="#66b966"></option>
				        <option value="#66a3e0"></option>
				        <option value="#c285ff"></option>
				        <option value="#888888"></option>
				        <option value="#a10000"></option>
				        <option value="#b26b00"></option>
				        <option value="#b2b200"></option>
				        <option value="#006100"></option>
				        <option value="#0047b2"></option>
				        <option value="#6b24b2"></option>
				        <option value="#444444"></option>
				        <option value="#5c0000"></option>
				        <option value="#663d00"></option>
				        <option value="#666600"></option>
				        <option value="#003700"></option>
				        <option value="#002966"></option>
				        <option value="#3d1466"></option>
			      	</select>
		      	</span>
		      	<span class="ql-formats">
			      	<select class="ql-font">
				        <option selected="selected"></option>
				        <option value="serif"></option>
				        <option value="monospace"></option>
			      	</select>
		      	</span>
		      	<span class="ql-formats">
			        <select class="ql-align">
				        <option selected="selected"></option>
				        <option value="center"></option>
				        <option value="right"></option>
				        <option value="justify"></option>
			      	</select>
		      	</span>
		      	<span class="ql-formats"><button type="button" class="ql-clean"></button></span>
		      	<span class="ql-formats">
		      		<button type="button" class="ql-link"></button>
		      		<add-img @confirm="getSrc" :multiple='multiple'>
    					<button type="button" @click="getIndex()">
    						<svg viewBox="0 0 18 18">
    							<rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
    							<circle class="ql-fill" cx="6" cy="7" r="1"></circle>
    							<polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
    						</svg>
  						</button>
  					</add-img>
					 <add-img @confirm="getSrc" :multiple='multiple'>
    					<button type="button" @click="getIndex()">
    						<svg viewBox="0 0 18 18"> 
								<rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect> 
								<rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>
								<rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>
								<rect class="ql-fill" height="2" width="8" x="5" y="8"></rect> 
								<rect class="ql-fill" height="1" width="3" x="3" y="5"></rect> 
								<rect class="ql-fill" height="1" width="3" x="3" y="7"></rect> 
								<rect class="ql-fill" height="1" width="3" x="3" y="10"></rect> 
								<rect class="ql-fill" height="1" width="3" x="3" y="12"></rect> 
								<rect class="ql-fill" height="1" width="3" x="12" y="5"></rect> 
								<rect class="ql-fill" height="1" width="3" x="12" y="7"></rect> 
								<rect class="ql-fill" height="1" width="3" x="12" y="10"></rect> 
								<rect class="ql-fill" height="1" width="3" x="12" y="12"></rect> 
							</svg>
  						</button>
  					</add-img>
					<!-- <span @click="code">code</span> -->
		      		<!-- <add-img @confirm="getSrc">
    					<el-button type="text" icon="el-icon-delete"></el-button>
  					</add-img> -->
		      	</span>
	        </div>
		</quill-editor>
		<!-- <div class="quill-code">
          <div class="title">Code</div>
          <code class="hljs xml" v-html="contentCode"></code>
        </div> -->
	</div>
</template>
<script>
	// import hljs from 'highlight.js'
	import {quillEditor} from 'vue-quill-editor';
	import addImg from '@components/addImg'
	export default {
		data() {
			return {
				multiple:true,
				editorOption: {
                    modules: {
                        toolbar: '#' + this.refname
                    }
				},
				jiaodian:0,
				isCode:true
			}
		},
		props: {
			value: {
				type: String,
				required: true
			},
			refname: {
				type: String,
				default: 'editorToolBar'
			}
		},
		computed: {
            editor() {
                return this.$refs[this.refname].quill;
            },
            content: {
            	get() {
            		return this.value;
            	},
            	set(v) {
					if(this.isCode){
						this.$emit('input', v);
					}else{
						this.$emit('input', v.replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					}
            		
            	}
			},
			// contentCode() {
			// 	return hljs.highlightAuto(this.content).value
			// }
		},
		mounted() {
			console.log(this.editorOption)
		},
		methods: {
			code(){
				this.isCode = !this.isCode;
				if(this.isCode){
					debugger
					this.$emit('input', this.content.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
				}else{
					debugger
					this.$emit('input', this.content.replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
				}
				
			},
			getIndex(){
				// 获取光标位置 并记录
				let length = this.editor.getSelection().index || 0;	
				this.jiaodian = length
			},
			getSrc(src){
				let Arr=src
				if(!this.multiple){
					Arr = [src]
				}
				Arr.forEach((e,i)=>{
					let imgSrc = e.imgUrl
					if(imgSrc.indexOf('http://')==-1 && imgSrc.indexOf('https://')==-1){
						// imgSrc = __ce.imgURL + imgSrc
						imgSrc = imgSrc
					}
					// 插入到光标
					this.editor.insertEmbed(this.jiaodian+i, 'image', imgSrc);
				})
				// this.editor.focus();
			},
			onChange(){
				this.$nextTick(() => {
                	this.$emit('change', this.content);
				})
            }
		},
		components: {
			quillEditor,
			addImg
		}
	}
</script>
<style>

</style>