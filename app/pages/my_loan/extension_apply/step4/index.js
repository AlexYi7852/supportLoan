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
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
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
  linkUrl() {
    console.log(1)
    wx.switchTab({
      url: '../../../repayment_plan/index/index'
    })
  }
})
