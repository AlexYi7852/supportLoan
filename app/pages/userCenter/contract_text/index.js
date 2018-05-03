//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    list: null
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.myContract()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  myContract() {
    let params = {
      cmd: 'myContract',
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        this.setData({
          list: res.data
        })
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 打开pdf文档
   */
  openDocument(e) {
    let url = e.currentTarget.dataset.url
    wx.showLoading()
    wx.downloadFile({
      url: url,
      success: res => {
        wx.hideLoading()
        let filePath = res.tempFilePath
        console.log(filePath)
        wx.openDocument({
          filePath: filePath,
          fail: res => {
            wx.hideLoading()
            console.log(res)
            app.Toast.warn('你的设备不支持预览该文档，请发送至邮箱再查看！')
          }
        })
      },
      fail: function(err) {
        app.Toast.warn('文档读取失败')
        console.log(err)
      }
    })
  },
  /**
   * 发送邮件
   */
  sendUploadEmail() {
    const content = this.data.list
    let amendMsgStr = ''
    for (let i = 0; i < content.length; i++) {
      amendMsgStr += `${content[i].url},${content[i].type};`
    }
    let params = {
      type: '2',
      token: this.data.userInfo.token,
      toEmail: this.data.userInfo.email,
      content: amendMsgStr
    }
    app.Toast.showLoading()
    app.api
      .sendUploadEmail(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          app.Toast.warn('邮件发送成功')
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
