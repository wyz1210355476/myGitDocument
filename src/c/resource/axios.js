import Vue from 'vue'
import API from './api'
import axios from 'axios'
import merge from 'webpack-merge'
import { Message } from 'element-ui'

class Axios extends API {
  create({ plugins = [], ...defaultOptions } = {}) {
    let superClass = this
    let instance = axios.create(merge({}, ...plugins))

    return function(key, params = {}) {

      if(sessionStorage.getItem('token')){
        params.TOKEN=sessionStorage.getItem('token')
      }

      let module = superClass.loader(key)
      let api = module.api
      let config = module.config
      let isGet = superClass.isGet(api.method)
      let options = merge(defaultOptions, config, api)

      options[isGet ? 'params' : 'data'] = params
      return new Promise(function(resolve, reject) {
        instance.request(options).then(function(response) {
          if(response && response.data){
            if (response.data.status == 101) {
              resolve(response.data.data)
            }else if(response.data.status == 999){
                let locations = decodeURIComponent(response.data.location)
                let len = locations.split('?').length
                let connectSymbol = len > 2 ? '&backurl=' : '?backurl='
                let uri = response.data.location + encodeURIComponent(connectSymbol + encodeURIComponent(window.location.href))
                
                window.location.href = uri
                return
                let theRequest = {
                  service:locations.split("?service=")[1],
                  retjson:true,
                  isajax:true
                }
                Vue.api('home.testLogin',theRequest).then((result) => {
                    if(result.ticket==''){
                      window.location.href = uri
                    }else{
                      getApi(result.ticket)
                    }
                }, (error) => {
                    window.location.href = uri
                });
                function getApi(ticket){
                  if(!params){params={}}
                  params.ticket = ticket
                  console.log(params);
                  Vue.api(key,params).then((result) => {
                      resolve(result)
                  }, (error) => {
                      reject(error)
                  });
                }
            }else {
              reject(response)
            }
          }else{
            reject(response)
          }
          
        }).catch(function(err) {
          reject(err)
          __ce.debug ? __ce._.loadingBar.error() : setTimeout((v) => { __ce._.loadingBar.terminate() })
        })
      })
    }
  }
}

export default {
  install: function(Vue, { basePath, ...options } = {}) {
    let create = new Axios(basePath).create(options)
    Vue.prototype.$api = Vue.api = __ce._.api = create
  }
}
