import MD5 from '../../../libs/js/md5.min'
import { validate } from '../../../libs/js/validate'

//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    type: 'password',
    eyeIcon: '/images/user_center/icon-bukejian@2x.png',
    isAgree: false,
    password: '',
    regLatitude: '',
    registInfo: {}
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    this.getLocation()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  togglePassword() {
    if (this.data.type == 'password') {
      this.setData({
        type: 'text',
        eyeIcon: '/images/user_center/icon-kejian@2x.png'
      })
    } else {
      this.setData({
        type: 'password',
        eyeIcon: '/images/user_center/icon-bukejian@2x.png'
      })
    }
  },
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  toggleAgree() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  //获取经纬度
  getLocation() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(`${res.longitude},${res.latitude}`)
        that.setData({
          regLatitude: `${res.longitude},${res.latitude}`
        })
      }
    })
  },
  regist() {
    if (!validate.password(this.data.password)) {
      app.Toast.warn('密码格式不正确')
      return
    }
    if (!this.data.isAgree) {
      wx.showModal({
        content: '请勾选协议',
        showCancel: false
      })
      return false
    }

    let registInfo = wx.getStorageSync('registInfo')
    registInfo.password = MD5.base64(this.data.password)
    registInfo.deviceType = '3'
    registInfo.regLatitude = this.data.regLatitude
    console.log(registInfo)
    wx.showLoading()
    app.api
      .register(registInfo)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          this.setData({
            registInfo: registInfo
          })
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          })
          this.loginAfterReg()
        } else {
          wx.showModal({
            content: res.data.message,
            showCancel: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //注册成功之后自动登录
  loginAfterReg() {
    let header = {
      mobileType: '3',
      appVersion: '0.1.1'
    }
    let params = {
      certCode: this.data.registInfo.certCode,
      mobileType: '3',
      password: MD5.base64(this.data.password),
      buildModel: ''
    }

    app.api
      .loginAfterReg(params, header)
      .then(res => {
        wx.setStorageSync('userInfo', res.data)
        wx.switchTab({
          url: '../../index/index/index'
        })
      })
      .catch(e => {
        console.error(e)
      })
  },
  linkWeb() {
    wx.navigateTo({
      url: '../../h5/index?url=' + app.globalData.service_protocol
    })
  }
})
