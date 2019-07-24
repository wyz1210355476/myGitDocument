<template>
<el-autocomplete v-model="defaultData" :fetch-suggestions="querySearchAsync" popper-class="my-autocomplete" custom-item="my-item-zh" :placeholder="placeholder" @select="handleSelect" :trigger-on-focus="false" size="small">
</el-autocomplete>
</template>
<style>
.my-autocomplete li {
    line-height: normal;
}

.my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 12px;
    line-height: 24px;
}

.my-autocomplete .highlighted .addr {
    color: #ddd;
}
</style>
<script>
import Vue from 'vue'
Vue.component('my-item-zh', {
    functional: true,
    render: function(h, ctx) {
        var item = ctx.props.item;
        return h('li', ctx.data, [
            h('div', {
                attrs: {
                    class: 'name',
                    title: item.value
                }
            }, [item.value]),
        ]);
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    }
});
export default {
    data() {
        return {
            placeholder: "请输入",
            delayData: [],
            defaultData: this.$route.query.autoName,
            timeout: null,
            nowData: '',
        }
    },
    watch: {
        defaultData: {
            handler(v, c) {
                if (c != '' && v === '') {
                    // if (v === '') {
                    this.$emit('input', '');
                    this.$emit('name', '');
                    // }
                }
            },
            deep: true
        },
    },
    computed: {
        currentData: {
            get: function() {
                return this.defaultData;
            },
            set: function(val) {
                this.nowData = val;
                this.$emit('input', val);
            }
        }
    },
    methods: {
        querySearchAsync(queryString, cb) {
            this.$emit('input', this.defaultData);
            this.$emit('name', this.defaultData);
            if (this.config.api && this.config.handleData && typeof(this.config.handleData) == 'function') {
                if (this.defaultData) {
                    this.$api(this.config.api, {
                        custName: this.defaultData
                    }).then((response) => {
                        let restaurants = this.config.handleData(response);
                        clearTimeout(this.timeout);
                        cb(restaurants);
                    })
                }
            }

        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.indexOf(queryString.toLowerCase()) === 0);
            }
        },
        handleSelect(item) {
            console.log(11111, item)
            this.defaultData = item.value;
            this.$emit('input', item.id);
            this.$emit('name', item.value);
        }
    },
    mounted() {
        this.placeholder = this.config.placeholder ? this.config.placeholder : this.placeholder;
        //this.init();
    },
    props: ['config'],
};
</script>
