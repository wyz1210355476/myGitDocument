import { Message } from 'element-ui'
export default {
  transformResponse: [function(data) {
    if (data.status != 101 && data.status != 102) {
      // Message({
      //   type: 'error',
      //   message: data.msg
      // })
      // console.log(data);
    }
    return data
  }]
}
