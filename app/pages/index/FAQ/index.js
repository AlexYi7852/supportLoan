//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    list: [],
    page: 1,
    pullDown: true
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    this.questions()
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    var that = this
    that.setData({
      page: that.data.page + 1
    })
    if (that.data.pullDown == true) {
      that.questions(that.data.page)
    }
  },
  /* 自定义事件绑定 */
  toggleContent(e) {
    const index = e.currentTarget.dataset.index
    const key = 'list[' + index + '].isShown'
    const activeFlag = this.data.list[index].isShown
    this.setData({
      [key]: !activeFlag
    })
  },
  questions(page) {
    let params = {
      page: this.data.page,
      pageSize: 10
    }
    app.api
      .questions(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          this.setData({
            list: this.data.list.concat(res.data)
          })
          if (!res.data) {
            this.setData({
              pullDown: false
            })
          }
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
