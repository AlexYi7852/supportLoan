//获取应用实例
const app = getApp()
const util = require('../../../utils/util')
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    code: '',
    mobile: '',
    newMobile: '',
    last_time: 60, //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
    this.setData({
      mobile: options.mobile
    })
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
    console.log(this.data.userInfo)
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  //校验这个身份证是否已经注册/如果是已经注册不能发验证码
  checkAccount() {
    if (this.data.newMobile.length != 11) {
      app.Toast.warn('请输入11位手机号')
      return false
    }
    let params = {
      mobile: this.data.newMobile
    }
    let that = this
    app.Toast.loading()
    app.api
      .checkAccount(params)
      .then(res => {
        console.log(res)
        //如果数据库不存在才不能发验证码
        if (res.data.exist == false) {
          console.log('手机号不存在')
          this.sendMsgCode()
        } else {
          wx.showModal({
            content: res.message,
            showCancel: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //发送验证码
  sendMsgCode() {
    var that = this

    app.api
      .sendCode({
        mobile: this.data.newMobile
      })
      .then(res => {
        if (res.code == 0) {
          util.getSms2.settime(that)
          that.setData({
            is_show: !that.data.is_show //false
          })
        } else {
          wx.showModal({
            content: res.message,
            showCancel: false
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
  newMobileInput(e) {
    this.setData({
      newMobile: e.detail.value
    })
  },
  changeMobile() {
    let params = {
      mobile: this.data.mobile,
      code: this.data.code,
      newMobile: this.data.newMobile,
      token: this.data.userInfo.token || 'token'
    }
    if (params.newMobile.length != 11) {
      return false
    }
    app.api
      .changeMobile(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          let userInfo = wx.getStorageSync('userInfo')
          userInfo['mobile'] = params.newMobile
          wx.setStorage({
            key: 'userInfo',
            data: userInfo,
            success: function(res) {
              wx.redirectTo({
                url: '../settings/index'
              })
            }
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
