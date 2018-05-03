//获取应用实例
const app = getApp()
const util = require('../../../utils/util')
Page({
  /* 页面数据 */
  data: {
    code: '',
    faceShow: false,
    mobile: '',
    last_time: 60, //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function (options) {
    let mobile = options.mobile
    if (mobile) {
      this.setData({
        faceShow: true,
        mobile: mobile
      })
    }
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  /* 内置事件绑定 */
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  /* 自定义事件绑定 */
  //再次获取验证码事件
  getMsgCode() {
    if (!this.data.mobile || this.data.mobile.length !== 11) {
      app.Toast.warn('请输入正确的手机号')
      return
    }
    app.Toast.loading()
    var that = this
    util.getSms.settime(that)
    // 将获取验证码按钮隐藏60s，60s后再次显示
    that.setData({
      is_show: !that.data.is_show //false
    })
    this.sendMsgCode()
  },
  //再次发送验证码接口
  sendMsgCode() {
    let params = {
      mobile: this.data.mobile
    }
    let that = this
    app.api
      .sendCode(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //保存
  saveByCertification() {
    let params = {
      code: this.data.code,
      mobile: this.data.mobile,
      token: wx.getStorageSync('userInfo').token
    }
    if (!this.data.mobile || this.data.mobile.length !== 11) {
      app.Toast.warn('请输入正确的手机号')
      return
    }
    if (!this.data.code || this.data.code.length !== 4) {
      app.Toast.warn('请输入4位数验证码')
      return
    }
    app.api
      .saveByCertification(params)
      .then(res => {
        console.log(res)
        if (res.code === 0 && res.data.mobile === params.mobile) {
          let userInfo = wx.getStorageSync('userInfo')
          userInfo.mobile = params.mobile
          userInfo.cStatus = 4
          wx.setStorage({
            key: 'userInfo',
            data: userInfo
          })
          wx.switchTab({
            url: '../../index/index/index'
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //验证码输入框校验
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  linkFaceId() {
    // wx.navigateTo({
    //   url: '../../face/face_1/index?face_type=4'
    // })
    app.wxFaceId.verify(app.globalData.userInfo.userName || app.globalData.userInfo.username, app.globalData.userInfo.certCode).then(res => {
      wx.redirectTo({ url: '../../login_regist/real_name_check_2/index?mobile=' })
    }).catch(res => {
      wx.showModal({
        showCancel: false,
        content: res,
      });
    });
  }
})
