//获取应用实例
const app = getApp()
import MD5 from '../../../libs/js/md5.min'
Page({
  /* 页面数据 */
  data: {
    type: 'password',
    certCode: '',
    code: '',
    password: '',
    eyeIcon: '/images/user_center/icon-bukejian@2x.png'
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    this.setData({
      certCode: options.certCode,
      code: options.code
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

  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
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
  //设置密码提交
  forgotPassword() {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
    if (!reg.test(this.data.password)) {
      wx.showModal({
        title: '',
        content: '密码格式不正确',
        showCancel: false
      })
      return false
    }
    let params = {
      newPassword: MD5.base64(this.data.password),
      code: this.data.code,
      certCode: this.data.certCode
    }
    app.api
      .forgotPassword(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          wx.navigateBack({
            delta: 3 // 回退前 delta(默认为1) 页面
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
