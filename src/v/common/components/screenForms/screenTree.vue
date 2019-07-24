<template>
    <div class="el-select" style="position:relative" >
        <div class="el-input el-input--small" @click="showTreeCon" >
            <i v-if="!currentData" class="el-input__icon el-icon-caret-top" :class="{'is-reverse':showTree}"></i>
            <i v-else class="el-input__icon el-icon-circle-close is-show-close" :class="{'is-reverse':showTree}" @click="clearData"></i>
            <input autocomplete="off" :placeholder="placeholder" v-model="currentData" readonly="readonly" icon="caret-top" type="text" rows="2" class="el-input__inner">
        </div>
        <div class="el-select-dropdown treeContent" v-show="showTree" x-placement="bottom-start">
            <div class="el-scrollbar">
                <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
                    <el-tree :data="treeData" accordion ref="tree" node-key="id" highlight-current :props="defaultProps" @node-click="nodeClick">
                    </el-tree>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {
                placeholder: "请选择",
                currentData: this.$route.query.treeName,
                currentValue: this.$route.query[this.config.key],
                showTree: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            nodeClick(obj, node) {
                if (obj.children && obj.children.length > 0 && !this.config.isParent) {
                    return
                } //父级选择
                this.currentData = obj.name;
                this.currentValue = obj.id;
                this.showTree = false;
                this.$emit("input", obj.id)
                this.$emit("name", obj.name)
            },
            showTreeCon(e) {
                this.showTree = this.showTree == false ? true : false;
                e.stopPropagation();
            },
            clearData(e) {
                this.currentData = '';
                this.showTree = false;
                this.$emit("input", '')
                this.$emit("name", '')
                e.stopPropagation();
            },
            init() {
                if (this.config.api && this.config.handleData && typeof(this.config.handleData) == 'function') {
                    let params = this.config.params || {}
                    if (typeof params === 'function') {
                        params = params.call(this)
                    }
                    this.$api(this.config.api, params).then((response) => {
                        let data = this.config.handleData(response)
                        let treeData = this.formatTreeData(data).find((n) => n.name == '0')
                        if (treeData) {
                            this.treeData = treeData.children
                        }
                        if (this.currentValue && this.currentData) {
                            this.$refs.tree.setCheckedKeys([this.currentValue]);
                        }
                    })
                }
            },
            formatTreeData(data) {
                let TypeArr = ['HQ', 'AREA', 'SUB', 'DEPT'];
                let setTypeIndex = TypeArr.findIndex((n) => n == this.config.nodeType);
                if (!data) return

                function getParents(data) {
                    let parents = {}
                    data.forEach(v => {
                        let pId = v.parentId
                        parents[pId] || (parents[pId] = [])
                        let vTypeIndex = TypeArr.findIndex((n) => n == v.type);
                        if (setTypeIndex < vTypeIndex) {
                            return
                        }
                        parents[pId].push(v)
                    })
                    return parents
                }

                function each(parents, keys) {
                    if (!keys.length) return parents
                    format(parents[keys.shift()], parents, keys)
                    return each(parents, keys)
                }

                function format(current, parents, keys) {
                    current && current.forEach(v => {
                        let id = v.id
                        if (parents[id]) {
                            let children = [...parents[id]]
                            delete parents[id]
                            keys.splice(keys.indexOf(id), 1)
                            v.children = format(children, parents, keys)
                        }
                    })
                    return current
                }
                let obj = each(getParents(data), Object.keys(getParents(data)))
                return Object.keys(obj).map(v => {
                    let x = {}
                    x.name = v
                    x.children = obj[v]
                    return x
                })
            }
        },
        mounted() {
            this.placeholder = this.config.placeholder ? this.config.placeholder : this.placeholder;
            document.addEventListener('click', (e) => {
                this.showTree = false
            });
            //this.init();
        },
        props: ['config'],
}
</script>
<style>
.treeContent {
    min-width: 173px;
    transform-origin: center top 0px;
    z-index: 2037;
    position: absolute;
    top: 30px;
    left: 0;
}
</style>
