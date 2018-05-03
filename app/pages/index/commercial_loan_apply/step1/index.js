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
  /* 自定义事件绑定 */
  nexStep() {
    let params = {
      token: this.data.userInfo.token
    }
    wx.showLoading()
    app.api
      .businessLoanCheck(params)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.code === 0) {
          wx.navigateTo({
            url: '../step2/index'
          })
        } else {
          wx.navigateTo({ url: '../has_apply/index' })
        }
      })
      .catch(e => {
        wx.hideLoading()
        console.error(e)
      })
  }
})
