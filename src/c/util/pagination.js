/*
 * @Author: liqiang@300.cn 
 * @Date: 2018-08-28 16:20:10 
 * @Last Modified by: liqiang@300.cn
 * @Last Modified time: 2018-08-31 11:03:52
 */


import Params, { addRule } from './routerParams'
const componentName = 'P'

addRule(componentName, function (currentPage, pageSize) {
  return {
    currentPage,
    pageSize
  }
})

function createBaseProp(prop, event) {
  return {
    get() {
      return this.$options.propsData[prop] || +this.params.parse(this.$route.query)[prop] || this[prop]
    },
    set(value) {
      this.$emit(event, value)
      this.$emit(`update:${prop}`, value)
      this.emitChange(prop, value)
    }
  }
}


export default function (elementUI) {
  if (!elementUI || !elementUI.Pagination) {
    throw new Error('missing parameters')
  }

  const props = { ...elementUI.Pagination.props, ...{ data: { type: Array }, uid: { default: 0 } } }

  return {
    data() {
      return {
        params: new Params(componentName, this.uid, '.'),
        timer: null,
        emitParams: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        }
      }
    },
    props,
    computed: {
      _pageSize: createBaseProp('pageSize', 'size-change'),
      _currentPage: createBaseProp('currentPage', 'current-change')
    },
    render(createElement, context) {
      let props = {}

      Object.keys(this.$options.propsData).forEach(key => {
        props[key] = this._self[key]
      })

      props.currentPage = this._currentPage
      props.pageSize = this._pageSize

      return createElement('div',
        {
          class: 'ce-pagination clearfix'
        }, [
          this.$slots.default,
          createElement('el-pagination',
            {
              props,
              class: 'r',
              on: {
                'size-change': this.sizeChange,
                'current-change': this.currentChange,
              }
            }
          )
        ])
    },
    methods: {
      emitChange(type, value) {
        this.emitParams[type] = value
        const query = { ...this.$route.query, ...this.params.componentization(this.emitParams) }
        this.$router.push({
          query
        })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$emit('change', this.emitParams)
        }, 30)
      },
      sizeChange(pageSize) {
        this._pageSize = pageSize
      },
      currentChange(currentPage) {
        this._currentPage = currentPage
      },
    },
    created() {
      console.log(this)
    }
  }
}



