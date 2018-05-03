import { getSms } from '../../../utils/util'

//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    mobile: '',
    code: '',
    last_time: '60', //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //校验这个身份证是否已经注册/如果是已经注册不能发验证码
  checkAccount() {
    let that = this
    if (this.data.mobile.length != 11) {
      app.Toast.warn('请输入正确的手机号')
      return false
    }

    app.api
      .checkAccount({
        mobile: this.data.mobile
      })
      .then(res => {
        console.log(res)
        //如果数据库不存在才不能发验证码
        if (res.data.exist == false) {
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
    wx.showToast({
      icon: 'loading',
      duration: 2000,
      mask: true
    })
    app.api
      .sendCode({
        mobile: this.data.mobile
      })
      .then(res => {
        if (res.code == 0) {
          getSms.settime(that)
          // 将获取验证码按钮隐藏60s，60s后再次显示
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

  //下一步前往设置密码
  confirm() {
    let params = {
      mobile: this.data.mobile,
      code: this.data.code
    }
    if (params.mobile.length != 11) {
      app.Toast.warn('请输入正确的手机号')
      return false
    }
    if (params.code.length != 4) {
      app.Toast.warn('请输入4位数验证码')
      return false
    }
    app.Toast.loading()
    app.api
      .checkMobileCode(params)
      .then(res => {
        if (res.code == 0) {
          let registInfo = wx.getStorageSync('registInfo')
          registInfo.mobile = params.mobile
          wx.setStorage({
            key: 'registInfo',
            data: registInfo,
            success: function(res) {
              wx.navigateTo({
                url: '../regist_3/index'
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
