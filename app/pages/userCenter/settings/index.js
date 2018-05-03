//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
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
          userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
        })
      },
      fail: res => {
        this.setData({
          userInfo: res.data || wx.getStorageSync('userInfo')
        })
      }
    })
  },
  onShow: function() {
    /*     //判断用户是否登录
    if (!this.data.userInfo.token) {
      wx.redirectTo({
        url: '../../login_regist/login/index'
      })
    } */
  },
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  loginOut() {
    wx.clearStorageSync()
    wx.clearStorage()
    app.globalData.userInfo = null
    wx.redirectTo({
      url: '../../login_regist/login/index'
    })
  },
  //跳转到
  changePhone() {
    wx.navigateTo({
      url: '../change_phone_1/index'
    })
  },
  feedBackEvent() {
    wx.navigateTo({
      url: '../feedback/index'
    })
  },
  linkWeb() {
    console.log(app.globalData.service_protocol)
    wx.navigateTo({
      url: '../../h5/index?url=' + app.globalData.service_protocol
    })
  }
})
