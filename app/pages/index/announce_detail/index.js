//获取应用实例
const app = getApp()
var WxParse = require('../../../component/wxParse/wxParse')
Page({
  /* 页面数据 */
  data: {
    announce: {}
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
    this.postRecently(options.id)
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},

  /* 自定义事件绑定 */
  //获取首页公告列表接口
  postRecently(id) {
    let that = this
    let params = {
      page: 1,
      pageSize: 1,
      postId: id
    }
    app.api
      .postRecently(params)
      .then(res => {
        console.log(res.data[0])
        if (res.code == 0) {
          //  WxParse.wxParse('article', 'html', res.data.body, that, 5);
          that.setData({
            announce: res.data[0],
            content: res.data[0].content
          })
          WxParse.wxParse('content', 'html', that.data.content, that)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
