//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    random_number: '',
    token_random_number: '',
    face_type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      face_type: options.face_type
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading()
    this.faceRandomNumber()
    setTimeout(() => {
      wx.hideLoading()
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  nextStep() {
    wx.redirectTo({
      url: `../face_2/index?random_number=${
        this.data.random_number
      }&token_random_number=${this.data.token_random_number}&face_type=${
        this.data.face_type
      }`
    })
  },

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
  //获取随机数
  faceRandomNumber() {
    app.api
      .faceRandomNumber()
      .then(res => {
        if (res.code == 0) {
          this.setData({
            random_number: res.data.random_number,
            token_random_number: res.data.token_random_number
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
})
