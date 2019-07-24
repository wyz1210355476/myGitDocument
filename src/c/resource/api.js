 class API {
   constructor(basePath = './') {
     this.basePath = basePath
   }

   parseKey(key) {
     let arr = key.split('.')
     return {
       name: arr.pop(),
       path: arr.join('/')
     }
   }

   loader(key) {
     let { name, path } = this.parseKey(key)
     try {
       let module = require('../../apis/' + path)
       return {
         key,
         module,
         api: module[name],
         config:module['$CONFIG']
       }
     } catch (e) {
       throw new Error(e)
     }
   }

  isGet(method = 'GET') {
     return !~'PUT,POST,PATCH'.indexOf(method.toUpperCase())
   }
 }

 export default API
