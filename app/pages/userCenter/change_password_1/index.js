//获取应用实例
const app = getApp()
const util = require('../../../utils/util')
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    code: '',
    last_time: '60', //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */

  //发送验证码接口
  getMsgCode() {
    if (this.data.userInfo.mobile.length != 11) {
      return false
    }
    let params = {
      mobile: this.data.userInfo.mobile
    }
    let that = this
    wx.showToast({
      icon: 'loading',
      duration: 2000,
      mask: true
    })
    app.api
      .sendCode(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          util.getSms.settime(that)
          that.setData({
            is_show: !that.data.is_show //false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  checkMobileCode() {
    if (this.data.code.length != 4) {
      app.Toast.warn('请输入4位数验证码')
      return false
    }
    let params = {
      mobile: this.data.userInfo.mobile,
      code: this.data.code
    }
    app.api
      .checkMobileCode(params)
      .then(res => {
        if (res.code == 0) {
          wx.navigateTo({
            url: '../change_password_2/index?code=' + params.code
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  linkFaceId() {
    let username = this.data.userInfo.userName
    let certCode = this.data.userInfo.certCode
    app.wxFaceId
      .verify(username, certCode)
      .then(res => {
        wx.navigateTo({
          url: '../../face/forget_password/forget_password_1/index'
        })
      })
      .catch(res => {
        wx.showModal({ showCancel: false, content: res })
      })
  }
})
