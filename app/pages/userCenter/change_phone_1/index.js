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
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        this.setData({
          userInfo: res.data || wx.getStorageSync('userInfo')
        })
      },
      fail: res => {
        this.setData({
          userInfo: res.data || wx.getStorageSync('userInfo')
        })
      }
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
      app.Toast.warn('请输入正确的手机号')
      return false
    }
    let params = {
      mobile: this.data.userInfo.mobile
    }
    let that = this
    app.Toast.loading()
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
    console.log(e)
    this.setData({
      code: e.detail.value
    })
  },
  checkMobileCode() {
    if (this.data.code.length != 4) {
      wx.showModal({
        content: '请输入4位数验证码',
        showCancel: false
      })
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
          wx.redirectTo({
            url: '../change_phone_2/index?mobile=' + params.mobile
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //无法使用手机号跳转到人脸识别
  linkFaceId() {
    // wx.navigateTo({
    //   url: '../../face/face_1/index?face_type=2' //
    // })
    app.wxFaceId
      .verify(
        app.globalData.userInfo.userName || app.globalData.userInfo.username,
        app.globalData.userInfo.certCode
      )
      .then(res => {
        wx.redirectTo({
          url:
            '../../userCenter/change_phone_2/index?mobile=' +
            (wx.getStorageSync('userInfo').mobile ||
              app.globalData.userInfo.mobile)
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
