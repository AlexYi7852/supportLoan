//获取应用实例
const app = getApp()
var WxParse = require('../../component/wxParse/wxParse')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getSysInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  //获取系统消息接口
  getSysInfo() {
    let that = this
    app.api
      .getSysInfo()
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            sysInfo: res.data,
            accountProtocol: res.data.accountProtocol
          })
          WxParse.wxParse(
            'accountProtocol',
            'html',
            res.data.accountProtocol,
            that
          )
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
