//获取应用实例
const util = require('../../../utils/util')
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    code: '',
    mobile: '',
    certCode: '',
    last_time: '60', //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      mobile: options.mobile,
      certCode: options.certCode
    })
    util.getSms.settime(this)
    // 将获取验证码按钮隐藏60s，60s后再次显示
    this.setData({
      is_show: !this.data.is_show //false
    })
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

  //验证码输入框校验
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //校验手机验证码 并跳转到下一步去设置密码
  checkMobileCode() {
    let params = {
      mobile: this.data.mobile,
      code: this.data.code
    }
    let that = this
    if (!params.code) {
      return false
    }
    app.api
      .checkMobileCode(params)
      .then(res => {
        if (res.code == 0) {
          wx.navigateTo({
            url:
              '../forget_password_3/index?code=' +
              params.code +
              '&certCode=' +
              that.data.certCode
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //再次获取验证码事件
  getMsgCode() {
    var that = this
    util.getSms.settime(that)
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: !that.data.is_show //false
    })
    this.sendMsgAgain()
  },

  //再次发送验证码接口
  sendMsgAgain() {
    let params = {
      certCode: this.data.certCode
    }
    let that = this
    wx.showToast({
      icon: 'loading',
      duration: 2000,
      mask: true
    })
    app.api
      .sendPwdCode(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  linkFaceId() {
    app.wxFaceId
      .verify(
        app.globalData.userInfo.userName || app.globalData.userInfo.username,
        app.globalData.userInfo.certCode
      )
      .then(res => {
        wx.redirectTo({
          url: '../../face/forget_password/forget_password_1/index'
        })
      })
      .catch(res => {
        wx.showModal({
          showCancel: false,
          content: res
        })
      })
  }
})
