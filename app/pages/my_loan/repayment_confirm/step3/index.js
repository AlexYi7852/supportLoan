//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {},
  /* 生命周期函数 */
  onLoad: function(options) {
    let replayData = app.globalData.replayData
    this.setData({
      replayData: replayData
    })
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
  nexStep() {
    wx.navigateTo({
      url: '../step4/index'
    })
  }
})
