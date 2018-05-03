const checkCode = res => {
  switch (res) {
    case 10001:
      wx.showModal({
        showCancel: false,
        content: '参数错误'
      })
      break
    case 10002:
      wx.showModal({
        showCancel: false,
        content: '人脸特征检测失败'
      })
      break
    case 10003:
      wx.showModal({
        showCancel: false,
        content: '身份证号不匹配'
      })
      break
    case 10004:
      wx.showModal({
        showCancel: false,
        content: '公安比对人脸信息不匹配'
      })
      break
    case 10005:
      wx.showModal({
        showCancel: false,
        content: '正在检测中'
      })
      break
    case 10006:
      wx.showModal({
        showCancel: false,
        content: 'appid 没有权限(后台验证部分)'
      })
      break
    case 10007:
      wx.showModal({
        showCancel: false,
        content: '后台获取图片失败'
      })
      break
    case 10008:
      wx.showModal({
        showCancel: false,
        content: '公安系统失败'
      })
      break
    case 10009:
      wx.showModal({
        showCancel: false,
        content: '公安未查到身份证照片比对源'
      })
      break
    case 10010:
      wx.showModal({
        showCancel: false,
        content: '照片质量不满足公安比对要求'
      })
      break
    case 10011:
      wx.showModal({
        showCancel: false,
        content: '身份证信息未开通公安比对权限'
      })
      break
    case 10012:
      wx.showModal({
        showCancel: false,
        content: '征信验证失败'
      })
      break
    case 10013:
      wx.showModal({
        showCancel: false,
        content: '征信系统错误'
      })
      break
    case 10014:
      wx.showModal({
        showCancel: false,
        content: '公安系统失败，征信系统成功'
      })
      break
    case 10015:
      wx.showModal({
        showCancel: false,
        content: '公安服务暂时不可用'
      })
      break
    case 10016:
      wx.showModal({
        showCancel: false,
        content: '存储用户图片失败'
      })
      break
    case 10017:
      wx.showModal({
        showCancel: false,
        content: '非法 identify_id'
      })
      break
    case 10018:
      wx.showModal({
        showCancel: false,
        content: '用户信息不存在'
      })
      break
    case 10020:
      wx.showModal({
        showCancel: false,
        content: '认证超时'
      })
      break
    case 10021:
      wx.showModal({
        showCancel: false,
        content: '重复的请求，返回上一次的结果'
      })
      break
    case 10022:
      wx.showModal({
        showCancel: false,
        content: '用户信息错误，请检测 json 格式'
      })
      break
    case 10026:
      wx.showModal({
        showCancel: false,
        content: '用户身份证数据不在公安比对数据库中'
      })
      break
    case 10027:
      wx.showModal({
        showCancel: false,
        content: '语音识别失败'
      })
      break
    case 10028:
      wx.showModal({
        showCancel: false,
        content: '唇动检测失败'
      })
      break
    case 10029:
      wx.showModal({
        showCancel: false,
        content: '微警超时'
      })
      break
    case 10030:
      wx.showModal({
        showCancel: false,
        content: '绑定身份证失败'
      })
      break
    case 10031:
      wx.showModal({
        showCancel: false,
        content: '没有申请征信商户号或公众号/小程序没有设置昵称'
      })
      break
    case 10032:
      wx.showModal({
        showCancel: false,
        content: '用户身份证数据不再征信数据库中'
      })
      break
    case 10040:
      wx.showModal({
        showCancel: false,
        content: '请求数据编码不对，必须是 UTF8 编码'
      })
      break
    case 10041:
      wx.showModal({
        showCancel: false,
        content: '非法 user_id_key'
      })
      break
    case 10042:
      wx.showModal({
        showCancel: false,
        content: '请求过于频繁，稍后再重试'
      })
      break
    case 10045:
      wx.showModal({
        showCancel: false,
        content: '系统失败'
      })
      break
    case 10052:
      wx.showModal({
        showCancel: false,
        content: '请求数超时征信的限制'
      })
      break
    case 10057:
      wx.showModal({
        showCancel: false,
        content: '检测过程中人脸主体不一致'
      })
      break
    case 90100:
      wx.showModal({
        showCancel: false,
        content: '用户取消'
      })
      break
    case 90101:
      wx.showModal({
        showCancel: false,
        content: '用户未授权'
      })
      break
    case 90102:
      wx.showModal({
        showCancel: false,
        content: '底层库出错'
      })
      break
    case 90103:
      wx.showModal({
        showCancel: false,
        content: 'CDN 上传出错'
      })
      break
    case 90104:
      wx.showModal({
        showCancel: false,
        content: '获取配置信息出错'
      })
      break
    case 90105:
      wx.showModal({
        showCancel: false,
        content: '获取确认页信息失败'
      })
      break
    case 90106:
      wx.showModal({
        showCancel: false,
        content: '相机初始化失败'
      })
      break
    case 90107:
      wx.showModal({
        showCancel: false,
        content: '用户采集人脸超时'
      })
      break
    case 90108:
      wx.showModal({
        showCancel: false,
        content: '用户采集过程中都动态剧烈'
      })
      break
    case 90109:
      wx.showModal({
        showCancel: false,
        content: '设备不支持人脸采集'
      })
      break
    case 90199:
      wx.showModal({
        showCancel: false,
        content: '未知错误'
      })
      break
    default:
  }
}

function verify(name, idCardNumber) {
  return new Promise((resolve, reject) => {
    if (name == null || idCardNumber == null) {
      reject('缺失姓名或身份证数据')
      return
    }
    wx.checkIsSupportFacialRecognition({
      success() {
        console.log('支持人脸识别')
        wx.startFacialRecognitionVerifyAndUploadVideo({
          name: name,
          idCardNumber: idCardNumber,
          success(res) {
            resolve(res.verifyResult)
          },
          fail(res) {
            checkCode(res.errCode)
            reject(res.errMsg)
          }
        })
      },
      fail(res) {
        var errMessage = '不支持人脸识别'
        switch (res.errCode) {
          case 10001:
            errMessage = '不支持人脸采集:设备没有前置摄像头'
            break
          case 10001:
            errMessage = '不支持人脸采集:没有下载到必要模型'
            break
          case 10001:
            errMessage = '不支持人脸采集:后台控制不支持'
            break
          default:
            break
        }
        wx.showModal({
          showCancel: false,
          content: errMessage
        })
        reject(errMessage)
      }
    })
  })
}

module.exports.verify = verify
