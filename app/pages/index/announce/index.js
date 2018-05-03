//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    postRecentlyList: []
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    this.postRecently()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  //获取首页公告列表接口
  postRecently() {
    let that = this
    let params = {
      page: 1,
      pageSize: 10,
      type: 1
    }
    app.api
      .postRecently(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            postRecentlyList: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
