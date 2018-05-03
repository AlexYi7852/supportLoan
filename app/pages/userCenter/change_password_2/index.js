//获取应用实例
const app = getApp()
import MD5 from '../../../libs/js/md5.min'
import { validate } from '../../../libs/js/validate'
Page({
  /* 页面数据 */
  data: {
    type: 'password',
    eyeIcon: '/images/login_regist/icon-bukejian@2x.png',
    certCode: wx.getStorageSync('userInfo').certCode,
    token: wx.getStorageSync('userInfo').token,
    code: '',
    password: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      code: options.code
    })
  },
  onReady: function() {
    this.setData({
      certCode: wx.getStorageSync('userInfo').certCode,
      token: wx.getStorageSync('userInfo').token
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
  togglePassword() {
    if (this.data.type == 'password') {
      this.setData({
        type: 'text',
        eyeIcon: '/images/login_regist/icon-kejian@2x.png'
      })
    } else {
      this.setData({
        type: 'password',
        eyeIcon: '/images/login_regist/icon-bukejian@2x.png'
      })
    }
  },

  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  //设置密码提交
  changePassword() {
    if (!validate.password(this.data.password)) {
      app.Toast.warn('密码格式不正确')
      return
    }
    let params = {
      newPassword: MD5.base64(this.data.password),
      code: this.data.code,
      certCode: this.data.certCode,
      token: this.data.token
    }
    app.api
      .forgotPassword(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          wx.showModal({
            title: '',
            content: res.message,
            showCancel: false,
            success: function(res) {
              wx.clearStorage({
                key: 'userInfo'
              })
              wx.navigateBack({
                delta: 3 // 回退前 delta(默认为1) 页面
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
