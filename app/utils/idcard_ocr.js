/*
 * @Author: ecitlm 
 * @Date: 2018-04-18 18:53:40 
 * @Last Modified by:   ecitlm 
 * @Last Modified time: 2018-04-18 18:53:40 
 */

import { API_DOMAIN } from './api.config'

/**
 * 文件上传图片
 * @param {object} path  文件地址
 * @param {function} callback 上传成功回调方法
 */
function upload(path, callback) {
  /*wx.showToast({
      icon: "loading",
      title: "",
      duration: 5000
  })
  */
  wx.showLoading({
    title: '正在扫描信息'
  })
  wx.uploadFile({
    url: `${API_DOMAIN}/external/ocrIdCard`,
    filePath: path[0],
    name: 'file',
    file: 'file',
    header: {
      'Content-Type': 'multipart/form-data'
    },
    formData: {},
    success: function(res) {
      wx.hideLoading()
      let data = JSON.parse(res.data)
      if (data.code == 0) {
        console.log(data)
        callback(data) //上传成功返回的信息
      }
    },
    fail: function(e) {
      wx.showModal({
        title: '提示',
        content: '信息证扫描失败',
        showCancel: false
      })
    },
    complete: function() {}
  })
}

//图片选择
/**
 * @param {function} chooseImageCallback  图片选择成功回调
 * @param {function} uploadCallback   图片上传成功回调方法
 */
function getCertInfoByImage(chooseImageCallback, uploadCallback) {
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      var tempFilePaths = res.tempFilePaths
      chooseImageCallback(res.tempFilePaths)
      upload(res.tempFilePaths, uploadCallback)
    }
  })
}

module.exports = {
  upload,
  getCertInfoByImage
}
