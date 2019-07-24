<template>
    <div class="waterMarkSelect">
        <div class="waterTop">
            <div class="ckecks">
                <el-checkbox label="B" v-model="fontStyleB" border :true-label='1' :false-label='0' @change="changeStyle($event,flag=0)"></el-checkbox>
                <el-checkbox label="I" v-model="fontStyleI" border :true-label='1' :false-label='0' @change="changeStyle($event,flag=1)"></el-checkbox>
                <el-checkbox label="U" v-model="fontStyleU" border :true-label='1' :false-label='0' @change="changeStyle($event,flag=2)"></el-checkbox>
            </div>
            <div class="words">
                <span>字体</span>
                <el-select v-model="fontValue" placeholder="请选择" size="mini" class="fontSelect" @change="selectValues($event,flag=1)">
                    <el-option
                    v-for="item in fontOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <span>字号</span>
                <el-select v-model="fontSizeValue" size="mini" class="fontSizeSelect" @change="selectValues($event,flag=2)">
                    <el-option
                    v-for="item in fontSizeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <div class="chonseColors">
                    <el-color-picker v-model="fontColoors" @change="selectValues($event,flag=3)"></el-color-picker>
                </div>
            </div>
        </div>
        <div class="waterBottom">
            <el-input v-model="inputVal" placeholder="请输入内容" @input="selectValues($event,flag=4)" :clearable="true"></el-input>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                parentData: {},
                parentType:'',
                checkOptions:[
                    {label:"B"},
                    {label:"I"},
                    {label:"U"}
                ],
                fontOptions: [
                    {value: '微软雅黑',label: '微软雅黑'},
                    {value: '宋体',label: '宋体'},
                    {value: '黑体',label: '黑体'}
                ],
                fontValue: '',
                fontSizeOptions: [
                    {value: '14',label: '14'},
                    {value: '16',label: '16'},
                    {value: '18',label: '18'},
                    {value: '20',label: '20'},
                    {value: '22',label: '22'},
                    {value: '24',label: '24'},
                    {value: '26',label: '26'},
                    {value: '28',label: '28'},
                    {value: '30',label: '30'},
                    {value: '32',label: '32'},
                    {value: '34',label: '34'},
                    {value: '36',label: '36'},
                    {value: '38',label: '38'},
                    {value: '40',label: '40'},
                    {value: '42',label: '42'},
                    {value: '44',label: '44'},
                    {value: '46',label: '46'},
                    {value: '48',label: '48'},
                    {value: '50',label: '50'},
                    {value: '52',label: '52'},
                    {value: '54',label: '54'},
                    {value: '55',label: '55'}
                ],
                fontSizeValue: '',
                fontColoors: '#4d90cb',
                inputVal:'',
                fontStyleB:'',
                fontStyleI:'',
                fontStyleU:'',
            }
        },
        // watch: {
        //     formData: {
        //         handler(v) {
        //             this.getParentData();
        //         },
        //         deep: true
        //     }
        // },
        mounted () {
            this.getParentData();
        },
        methods: {
            getParentData(){
                this.parentType = this.type;
                this.parentData = this.formData;
                switch(this.parentType){
                    case 'wordFlag':
                        this.fontValue = this.parentData.wordFamilyName || '';
                        this.fontSizeValue = this.parentData.wordSize;
                        this.fontColoors = '#'+this.parentData.wordColor;
                        this.inputVal = this.parentData.word.replace(/<[^>]+>/g,"");
                        this.fontStyleB = this.parentData.wordB;
                        this.fontStyleI = this.parentData.wordI;
                        this.fontStyleU = this.parentData.wordU;
                        break;
                    case 'urlFlag':
                        this.fontValue = this.parentData.urlFamilyName || '';
                        this.fontSizeValue = this.parentData.urlSize;
                        this.fontColoors = '#'+this.parentData.urlColor;
                        this.inputVal = this.parentData.url.replace(/<[^>]+>/g,"");
                        this.fontStyleB = this.parentData.urlB;
                        this.fontStyleI = this.parentData.urlI;
                        this.fontStyleU = this.parentData.urlU;
                        break;
                }
            },
            //选择字体样式
            changeStyle($event,val){
                switch(this.parentType){
                    case 'wordFlag':
                        switch(val){
                            case 0:
                                this.parentData.wordB=$event;
                                break;
                            case 1:
                                this.parentData.wordI=$event;
                                break;
                            case 2:
                                this.parentData.wordU=$event;
                                break;
                        }
                        break;
                    case 'urlFlag':
                        switch(val){
                            case 0:
                                this.parentData.urlB=$event;
                                break;
                            case 1:
                                this.parentData.urlI=$event;
                                break;
                            case 2:
                                this.parentData.urlU=$event;
                                break;
                        }
                        break;
                }
            },
            selectValues($event,val){
                switch(this.parentType){
                    case 'wordFlag':
                        switch(val){
                            case 1:
                                this.parentData.wordFamilyName = $event;
                                break;
                            case 2:
                                this.parentData.wordSize = $event;
                                break;
                            case 3:
                                this.parentData.wordColor = $event.replace("#","");
                                break;
                            case 4:
                                this.parentData.word = $event;
                                break;
                        }
                        break;
                    case 'urlFlag':
                        switch(val){
                            case 1:
                                this.parentData.urlFamilyName = $event;
                                break;
                            case 2:
                                this.parentData.urlSize = $event;
                                break;
                            case 3:
                                this.parentData.urlColor = $event.replace("#","");
                                break;
                            case 4:
                                this.parentData.url = $event;
                                break;
                        }
                        break;
                }
            },
        },
		props: ["formData","type"]
    }
</script>
<style>
    .waterMarkSelect{
        width: 447px;
        height: 87px;
        border: 1px solid #ccc;
        padding-top: 5px
    }
    .waterTop{
        height: 29px;
        overflow: hidden;
        padding: 0 5px;
        padding-bottom: 3px;
    }
    .waterTop > div{
        float: left;
    }
    .words > *{
        float: left;
        line-height: normal;
        margin-left: 10px;
        margin-top: 0;
    }
    .words > span{
        margin-top: 5px;
    }
    .words > .chonseColors{
        margin-top: 0;
    }
    .words > .chonseColors .el-color-picker__trigger{
        width: 26px;
        height: 26px;
    }
    .waterMarkSelect .el-checkbox__input{
        display: none;
    }
    .waterMarkSelect .el-checkbox.is-bordered {
        float: left;
        width: 40px;
        padding: 2px 10px 2px 0px;
        height: auto;
        text-align: center;
        border-radius: 0;
        margin-right: 3px;
    }
    .waterMarkSelect .el-checkbox.is-bordered+.el-checkbox.is-bordered{
        margin-left: 0;
    }
    .fontSelect{
        width: 102px;
    }
    .fontSizeSelect{
        width: 66px;
    }
    .ckecks label .el-checkbox__label{
        font-weight: bold;
    }
    .ckecks label:nth-of-type(2) .el-checkbox__label{
        font-style: italic;
        font-weight: bold;
    }
    .ckecks label:nth-of-type(3) .el-checkbox__label{
        border-bottom: 2px solid #ccc;
        padding: 0;
        margin-left: 10px;
        line-height: 14px;
    }
    .ckecks label:nth-of-type(3).is-checked .el-checkbox__label{
        border-bottom: 2px solid #409EFF;
    }
    .waterBottom{
        background: #e6e6e6;
        margin: 0 auto;
        text-align: center;
        vertical-align: middle;
        width: 447px;
        height: 57px;
        max-height: 57px;
        max-width: 448px;
    }
    .waterBottom input{
        background: transparent;
        border: 0;
        height: 57px;
    }
</style>
