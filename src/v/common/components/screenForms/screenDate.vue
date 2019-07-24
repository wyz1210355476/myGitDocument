<template>
    <el-date-picker v-model="currentData" type="datetime" :placeholder="placeholder" :picker-options="pickerOptions" @change="setValue" size="small"></el-date-picker>
</template>
<script>
    export default {
        data() {
            return {
                placeholder:"请选择",
                minDate:'',
                currentData: this.$route.query[this.config.key] > 0 ? new Date(Number(this.$route.query[this.config.key])) : this.$route.query[this.config.key],
                pickerOptions: {
                    disabledDate:this.disabledDate
                },
            }
        },
        methods: {
            setValue(){
                if(this.currentData){
                    this.$emit('input', this.config.handleData(this.currentData));
                }else{
                    this.$emit('input', '');
                }
            },
            disabledDate(time) {
                return time.getTime() < this.minDate - 8.64e7;
            },
        },
        mounted() {
            this.placeholder = this.config.placeholder ? this.config.placeholder : this.placeholder;
            this.minDate = !isNaN(+this.config.minDate) ? +this.config.minDate : '';
        },
        props: ['config'],
    }
</script>