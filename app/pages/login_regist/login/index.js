import MD5 from '../../../libs/js/md5.min'
import { checkID } from '../../../libs/js/idCard'
import { getSms } from '../../../utils/util'
//获取应用实例
var app = getApp()

Page({
  /* 页面数据 */
  data: {
    type: 'password',
    pwdFocus: false,
    eyeIcon: '/images/user_center/icon-bukejian@2x.png',
    loginWay: 1,
    codeImage: '/images/index/imgcode.png',
    certCode: '',
    code: '',
    mobile: '',
    mobileType: '3',
    password: '',
    buildModel: '',
    last_time: '60', //剩余时间
    is_show: true //显示验证码倒计时
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.getCodeImage() //进入获取图片验证码
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '华安助学'
    }
  },
  //身份证号码输入
  certCodeInput: function(e) {
    this.setData({
      certCode: e.detail.value
    })
  },
  //验证码
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  //手机号
  mobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },

  //用户密码输入
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 用户登录接口
   */
  userLogin() {
    let header = {
      mobileType: '3',
      appVersion: '0.1.1'
    }
    const loginWay = this.data.loginWay
    //身份证账号登录
    if (loginWay == 1) {
      var params = {
        certCode: this.data.certCode,
        code: this.data.code,
        mobileType: '3',
        password: MD5.base64(this.data.password),
        buildModel: ''
      }

      /** */
      if (!params.certCode || !checkID(params.certCode)) {
        app.Toast.warn('请输入正确的身份证号码')
        return false
      }
      //password
      if (!this.data.password) {
        app.Toast.warn('请输入密码')
        return false
      }
    }

    if (loginWay == 2) {
      var params = {
        mobile: this.data.mobile,
        code: this.data.code,
        mobileType: '3',
        buildModel: ''
      }

      if (!params.mobile || params.mobile.length != 11) {
        app.Toast.warn('请输入正确的手机号')
        return false
      }
    }
    if (params.code.length != 4) {
      app.Toast.warn('请输入验证码')
      return false
    }
    console.log(params)
    app.Toast.showLoading()
    app.api
      .Login(params, header)
      .then(res => {
        app.Toast.hideLoading()
        if (res.code == 0) {
          wx.setStorage({
            key: 'userInfo',
            data: res.data
          })
          app.globalData.userInfo = res.data
          console.log(res.data.cStatus)
          //0 初始状态 1 只是没有实名认证 2、需要手机验证码 3、实名以及手机验证 4是正常
          if (res.data.cStatus == 1) {
            wx.showModal({
              title: '您尚未实名认证,请验证身份信息',
              image: '/images/others/icon-error.png',
              duration: 1500,
              mask: true,
              success: function() {
                wx.reLaunch({
                  url: '../real_name_check_1/index'
                })
              }
            })
          }
          //
          if (res.data.cStatus == 2) {
            wx.showModal({
              title: '',
              content: res.message,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  // wx.reLaunch({
                  //   url: '../../face/face_1/index?face_type=4'
                  // })
                  app.wxFaceId
                    .verify(
                      app.globalData.userInfo.userName ||
                        app.globalData.userInfo.username,
                      app.globalData.userInfo.certCode
                    )
                    .then(res => {
                      wx.redirectTo({
                        url:
                          '../../login_regist/real_name_check_2/index?mobile='
                      })
                    })
                    .catch(res => {
                      wx.showModal({
                        showCancel: false,
                        content: res
                      })
                    })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.removeStorageSync('userInfo')
                  wx.clearStorageSync()
                }
              }
            })
          }

          if (res.data.cStatus == 3) {
            wx.showModal({
              title: '',
              content: res.message,
              success: function(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../real_name_check_1/index'
                  })
                } else if (res.cancel) {
                  wx.removeStorageSync('userInfo')
                  wx.clearStorageSync()
                }
              }
            })
          }
          if (res.data.cStatus == 4) {
            wx.setStorage({
              key: 'userInfo',
              data: res.data
            })
            try {
              wx.setStorageSync('userInfo', res.data)
              wx.switchTab({
                url: '../../index/index/index'
              })
            } catch (e) {
              wx.showModal({
                title: '',
                showCancel: false,
                content: '登录异常'
              })
            }
          }
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //发送手机验证码
  sendMsgCode() {
    let that = this
    let params = {
      mobile: this.data.mobile
    }
    if (params.mobile.length != 11) {
      app.Toast.warn('请输入正确的手机号')
      return false
    }
    app.Toast.loading()
    app.api
      .sendCode(params)
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

  /* 自定义事件绑定 */
  togglePassword() {
    this.setData({
      // pwdFocus: true,
    })
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
  switchLoginWay(e) {
    const loginWay = parseInt(e.currentTarget.dataset.loginway)
    this.setData({
      loginWay: loginWay
    })
    //1 位身份证登录 2、手机号登录
    if (loginWay == 1) {
      this.setData({
        mobile: ''
      })
    } else {
      this.setData({
        certCode: ''
      })
    }
  },
  //获取图片验证码
  getCodeImage() {
    app.api
      .validateImageCode({
        width: 90,
        height: 36
      })
      .then(res => {
        var base64 = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res.data)
        this.setData({
          codeImage: base64
        })
      })
      .catch(e => {
        console.error(e)
      })
  }
})
