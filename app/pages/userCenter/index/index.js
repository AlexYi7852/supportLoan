//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
  },
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
  },
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  linkUrl(e) {
    let that = this
    var url = e.currentTarget.dataset.url
    if (this.data.userInfo.token) {
      wx.navigateTo({
        url: `${url}?token=${that.data.userInfo.token}`
      })
    } else {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
    }
  },
  downAPP() {
    wx.showModal({
      title: '',
      showCancel: false,
      content: '敬请期待'
    })
  }
})
