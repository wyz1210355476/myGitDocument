import Vue from 'vue'
import { Message } from 'element-ui'
export default {
  transformResponse: [function(data) {
    if (data.status == 407) {
      Message({
        type: 'error',
        message: '没有权限'
      })
      return;
    }else{
      return data;
    }
    // return data;
  }],
  headers: {
    'X-Requested-With': 'XMLHttpRequest' ,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function (data) {
    let ret = ''
    for (let it in data) {
      let ddd = ''
      if(typeof(data[it]) == 'object'){
        ddd = encodeURIComponent(JSON.stringify(data[it]))
      }else{
        ddd = encodeURIComponent(data[it])
      }
      ret += encodeURIComponent(it) + '=' + ddd + '&'
    }
    return ret
  }],
}
