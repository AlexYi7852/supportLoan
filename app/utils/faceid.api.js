const API_DOMAIN = 'https://api.megvii.com/faceid/lite/raw/validate_video'
const APIKEY = {
  api_key: 'FHQX3TFCJbbdZGl_y7niwxsfkw5ZJG-B',
  api_secret: 'esqRwenDAbwR86TOjnL-bn-oxUrHBleC'
}
const checkCode = res => {
  switch (res) {
    case 'INVALID_TOKEN':
      wx.showModal({
        showCancel: false,
        content: '参数不存在、或格式错误、或已过期'
      })
      break
    case 'VIDEO_FACE_NOT_FOUND':
      wx.showModal({
        showCancel: false,
        content: '上传的视频中没有检测到人脸'
      })
      break
    case 'VIDEO_LOW_FACE_QUALITY':
      wx.showModal({
        showCancel: false,
        content: '上传的视频中人脸质量太差'
      })
      break
    case 'VIDEO_INVALID_DURATION':
      wx.showModal({
        showCancel: false,
        content: '上传的视频时长不对'
      })
      break
    case 'VIDEO_MULTIPLE_FACES':
      wx.showModal({
        showCancel: false,
        content: '上传的视频中有多张人脸'
      })
      break
    case 'VIDEO_NO_AUDIO':
      wx.showModal({
        showCancel: false,
        content:
          '上传视频中没有音轨，通常是由于手机的录音权限没有打开或者受到阻止'
      })
      break
    case 'VIDEO_UNSUPPORTED_FORMAT':
      wx.showModal({
        showCancel: false,
        content: '视频无法解析，不支持的格式或视频有破损'
      })
      break
    default:
  }
}

module.exports = function(filePath, formData = {}) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_DOMAIN}`,
      filePath: filePath,
      name: 'video',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      formData: Object.assign(APIKEY, formData),
      success: function(res) {
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.token_video) {
          resolve(data)
        } else {
          checkCode(data.error_message)
        }
      },
      fail: function(err) {
        console.llog(err)
        wx.showModal({
          title: '',
          content: '视频识别超时',
          showCancel: false
        })
        reject(err)
      },
      complete: function() {
        console.log('complete')
        wx.hideLoading()
      }
    })
  })
}
