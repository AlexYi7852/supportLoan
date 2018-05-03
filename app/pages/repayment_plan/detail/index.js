//获取应用实例
const app = getApp()
//var token = 'ef9a2ebf5ccf427780121a3c771a9c95mvuovk';
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    msg: app.globalData.msg,
    list: [],
    year: [],
    currentYear: [],
    currentMonthsData: [],
    currentIndex: 0
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      list: JSON.parse(options.list)
    })
    console.log(JSON.stringify('list :' + this.data.list))
    var size = this.data.list.years.length
    console.log(JSON.stringify('size :' + size))
    var cacheYear = []
    for (var i = 0; i < size; i++) {
      cacheYear.push(this.data.list.years[i].year)
    }
    this.setData({
      year: cacheYear,
      currentYear: cacheYear[0],
      currentMonthsData: this.data.list.years[0].months
    })
    //console.log(JSON.stringify('months :' + this.data.currentMonthsData))
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
  open: function() {
    var that = this
    wx.showActionSheet({
      itemList: this.data.year,
      success: function(res) {
        if (!res.cancel) {
          that.setData({
            currentYear: that.data.year[res.tapIndex],
            currentMonthsData: that.data.list.years[res.tapIndex].months
          })
        }
      }
    })
  }
})
