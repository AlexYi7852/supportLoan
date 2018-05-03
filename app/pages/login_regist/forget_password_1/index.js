//获取应用实例
const app = getApp()
import { checkID } from '../../../libs/js/idCard'

Page({
  /* 页面数据 */
  data: {
    certCode: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  //根据账号发送验证码
  sendPwdCode() {
    let params = {
      certCode: this.data.certCode
    }
    let that = this
    if (!params.certCode || !checkID(params.certCode)) {
      app.Toast.warn('请输入正确的身份证号码')
      return false
    }
    app.Toast.loading()
    app.api
      .sendPwdCode(params)
      .then(res => {
        console.log(res)
        app.Toast.hideLoading()
        let userInfo = res.data
        userInfo.certCode = params.certCode
        wx.setStorageSync('userInfo', userInfo)
        if (res.code == 0 && res.data.type == 'mobile') {
          wx.setStorageSync('certCode', params.certCode)
          wx.navigateTo({
            url:
              '../forget_password_2/index?mobile=' +
              res.data.mobile +
              '&certCode=' +
              that.data.certCode
          })
        } else if (res.code == 0 && res.data.type == 'face') {
          //跳转到人脸识别
          wx.showModal({
            content: res.message,
            showCancel: false,
            success: function(res) {}
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //输入框绑定
  certCodeInput(e) {
    this.setData({
      certCode: e.detail.value
    })
  }
})
