/*
 * @Author: ecitlm 
 * @Date: 2018-03-07 10:53:08 
 * @Last Modified by: ecitlm
 * @Last Modified time: 2018-04-18 18:53:30
 */
import Promise from '../libs/js/bluebird'
/**
 * 验证返回的的code码问题
 * @param {*} resolve
 * @param {*} res 返回的data
 */
const checkCode = (resolve, res) => {
  console.log(res)
  switch (+res.code || +res.status) {
    case 0:
      resolve(res)
      break
    case 1: //参数错误
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 404: //服务器异常
      wx.showToast({
        title: 'Server 404',
        image: '/images/others/icon-error.png',
        duration: 1500,
        mask: true
      })
      break
    case 500: //服务器异常
      wx.showToast({
        title: '服务器开小差啦',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2000:
      wx.showToast({
        title: res.message || '',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2001: //token失效
      wx.showToast({
        title: '登录状态已失效',
        image: '/images/others/icon-error.png',
        duration: 1500,
        mask: true
      })
      //清除所有登录信息
      wx.removeStorageSync('userInfo')
      wx.clearStorageSync()
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/login_regist/login/index' })
      }, 1500)
      break
    case 2003:
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2007: //安心签授权过
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2008: //密码错误
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2009: //账号未设置手机号码
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2010: //加上账号检测
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      resolve(res)
      break
    case 2011: //回执已经上传
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    case 2012: //无贷款数据
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
        mask: true
      })
      break
    default:
      resolve(res)
  }
}

const urlParam = function(obj) {
  var arr = []
  for (var k in obj) {
    if (obj[k] != null && obj[k] != '') {
      arr.push(k + '=' + obj[k])
    }
  }
  return arr.join('&')
}

/**
 * 请求API接口
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function(methods, path, params, header = {}) {
  //wx.showLoading()
  console.log(path + urlParam(params))
  console.log(params)
  return new Promise((resolve, reject) => {
    wx.request({
      url: path,
      data: Object.assign({}, params),
      method: methods,
      header: Object.assign({}, header),
      success: function(res) {
        wx.hideLoading()
        checkCode(resolve, res.data)
      },
      fail: function(err) {
        wx.showToast({
          title: '网络请求异常',
          image: '/images/others/icon-error.png',
          duration: 1500,
          mask: true
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 2000)
        reject(err)
      }
    })
  })
}
