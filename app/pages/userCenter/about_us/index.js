//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    msg: app.globalData.msg
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
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
  linkWebSite() {
    wx.navigateTo({
      url: '../../h5/index?url=' + 'https://m.sinosafe.com.cn'
    })
  }
})
