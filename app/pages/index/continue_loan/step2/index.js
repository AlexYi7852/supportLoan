//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    loanData: null
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.myLoan()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  /**
   * 我的贷款接口数据
   */
  myLoan() {
    let params = { cmd: 'studentLoan', token: this.data.userInfo.token }
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        this.setData({ loanData: res.data[0] })
      })
      .then(err => {})
  }
})
