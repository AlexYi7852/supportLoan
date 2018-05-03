//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    content: '',
    textLength: 0
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
  //
  contentInput(e) {
    let content = e.detail.value
    this.setData({
      textLength: content.length,
      content: content
    })
  },
  /* 自定义事件绑定 */
  feedback() {
    let params = {
      token: this.data.userInfo.token,
      versionCode: '1',
      content: this.data.content
    }
    app.api
      .feedback(params)
      .then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '留言成功',
            icon: 'success', // loading
            duration: 1500,
            mask: true
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }, 1500)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
