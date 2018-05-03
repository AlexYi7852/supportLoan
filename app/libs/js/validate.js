/*
 * @Author: ecitlm 
 * @Date: 2018-04-01 18:52:33 
 * @Last Modified by: ecitlm
 * @Last Modified time: 2018-04-19 20:54:34
 */

import { checkID } from './idCard'
const validate = {
  email: res => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(res)
  },
  mobile: res => {
    return /^1[3|4|5|7|8][0-9]{9}$/.test(res)
  },
  isNull: res => {
    let reg = /^\s*$/g
    return reg.test(res)
  },
  qq: res => {
    return /^[1-9][0-9]{4,10}$/.test(res)
  },
  english: res => {
    return /^[a-zA-Z]+$/.test(res)
  },
  chinese: res => {
    return /^[\u4E00-\u9FA5]+$/.test(res)
  },
  chineseName: res => {
    if (res.length < 2) {
      return false
    }
    return /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/.test(res)
  },
  number: res => {
    return /^[0-9]$/.test(res)
  },
  idCard: res => {
    return checkID(res)
  },
  code: res => {
    return /^[0-9]{4}/.test(res)
  },
  url: res => {
    return /http/.test(res)
  },
  has4Chinese: res => {
    let reg = /[\u4E00-\u9FA5]/g
    return reg.test(res) && 4 <= res.match(reg).length ? true : false
  },
  wechat: res => {
    return /^[a-zA-Z0-9_-]{5,19}$/.test(res)
  },
  compareAge: (age1, age2) => {
    let Age1 = parseInt(age1.substr(6, 8))
    let Age2 = parseInt(age2.substr(6, 8))
    if (Age1 > Age2) {
      return false
    }
  },
  password: res => {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(res)
  },
  relationShip(urgentRelation, guarderRelation) {
    let shipStr = '601010,601011' //不能同时为父母关系
    if (
      urgentRelation == guarderRelation &&
      0 <= shipStr.indexOf(guarderRelation)
    ) {
      console.log(urgentRelation, guarderRelation)
      return false
    }
  }
}

module.exports = {
  validate
}
