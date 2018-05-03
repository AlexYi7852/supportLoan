/*
 * @Author: ecitlm 
 * @Date: 2018-04-05 11:10:47 
 * @Last Modified by:   ecitlm 
 * @Last Modified time: 2018-04-18 18:53:47 
 */

import { API_DOMAIN } from './api.config'

/**
 * 文件上传图片
 * @param {object} path  文件地址
 * @param {function} callback 上传成功回调方法
 */
function upload(path, callback) {
  setTimeout(() => {
    wx.showToast({
      icon: 'loading',
      title: '正在上传'
    })
  }, 100)
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
      var data = JSON.parse(res.data)
      if (data.code == 0) {
        wx.showToast({
          title: '上传成功',
          icon: 'success', // loading
          duration: 1500,
          mask: true
        })
      }
      callback(data) //上传成功返回的信息
    },
    fail: function(e) {
      console.log(e)
      wx.showModal({
        title: '提示',
        content: '上传失败',
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
