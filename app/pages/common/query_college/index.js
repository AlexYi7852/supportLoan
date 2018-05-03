const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loanType: '',
    cityCode: '',
    provCode: '',
    list: [],
    inputShowed: false,
    inputVal: '',
    page: 1,
    pullDown: true,
    collegeData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      loanType: options.loantype,
      cityCode: options.cityCode,
      provCode: options.provCode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  onReachBottom: function() {
    var that = this
    that.setData({
      page: that.data.page + 1
    })
    if (that.data.pullDown === true) {
      that.querySchool()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  showInput: function() {
    this.setData({
      inputShowed: true
    })
  },
  hideInput: function() {
    this.setData({
      inputVal: '',
      inputShowed: false
    })
  },
  clearInput: function() {
    this.setData({
      inputVal: ''
    })
  },
  /**
   * 输入键值 查询请求接口 大学
   */
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
      list: []
    })
    this.querySchool()
  },
  /**
   * 获取学校详情地址
   */
  getCollegeDetail(e) {
    const index = e.currentTarget.dataset.index
    const collegeDetail = this.data.list[index]

    let pages = getCurrentPages() //当前页面
    let prevPage = pages[pages.length - 2] //上一页面

    //直接给上移页面赋值
    prevPage.setData({
      'applyData.collegeAddr': collegeDetail.addr, //大学地址
      'applyData.collegeCode': collegeDetail.cClientCde, //大学代码
      'applyData.college': collegeDetail.cClientNme
    })
    wx.setStorageSync('collegeDetail', collegeDetail)
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 学校查询
   */
  querySchool() {
    let params = {
      cityCode: this.data.cityCode,
      provCode: this.data.provCode,
      loanType: this.data.loanType,
      pageSize: 15,
      page: this.data.page,
      clientName: this.data.inputVal
    }
    app.api
      .querySchool(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
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
