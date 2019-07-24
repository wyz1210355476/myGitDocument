//import { Object } from "core-js";

/*
 * @Author: liqiang@300.cn 
 * @Date: 2018-08-31 10:51:58 
 * @Last Modified by: liqiang@300.cn
 * @Last Modified time: 2018-08-31 11:05:23
 */


const rules = []

export const parse = (type, uid, hyphen, params) => {
  for (let i in params) {
    if (`${type}__${uid}` === i) {
      return rules[type].apply(this, params[i].split(hyphen))
    }
  }
  return Object.create(null)
}

export const componentization = (type, uid, hyphen, params) => {
  return {
    [`${type}__${uid}`]: Object.keys(params).map(v => params[v]).join(hyphen)
  }
}

export const addRule = (type, fn) => {
  let old = rules[type]
  rules[type] = function () {
    return fn.length === arguments.length ? fn.apply(this, arguments) : old.apply(this, arguments)
  }
}

export default class {
  constructor(type, uid, hyphen) {
    this.type = type
    this.uid = uid || 0
    this.hyphen = hyphen || '.'
  }
  parse(params) {
    return parse(this.type, this.uid, this.hyphen, params)
  }
  componentization(params) {
    return componentization(this.type, this.uid, this.hyphen, params)
  }
}


