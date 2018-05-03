//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    isLogin: false,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    applyData: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    if (this.data.userInfo.token) {
      this.getShowData()
    }
  },
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    if (this.data.userInfo.token) {
      this.refeshUserInfo() //刷新贷款状态以及登录信息
      this.setData({
        isLogin: true
      })
    }
  },
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {
    //this.queryApply()
    //如果已经登录才能下来刷新请求数据
    if (this.data.userInfo.token) {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      this.getShowData()
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  linkUrl(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  queryApply() {
    let params = {
      token: this.data.userInfo.token
    }
    app.Toast.showLoading()
    app.api
      .queryApply(params)
      .then(res => {
        wx.stopPullDownRefresh()
        app.Toast.hideLoading()
        this.setData({
          applyData: res.data
        })
      })
      .catch(err => {
        wx.stopPullDownRefresh()
        app.Toast.hideLoading()
      })
  },
  //interfaceApi 信息补录
  interfaceApi() {
    let params = {
      cmd: 'loanAmend',
      token: this.data.userInfo.token,
      requestTypeTest: '1'
    }
    console.log(params)
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        switch (+res.data.amendType) {
          case 0: //只补录修改内容，
            wx.navigateTo({
              url: '../info_collection_1/index'
            })
            break
          case 1: //只补录图片
            wx.navigateTo({
              url: '../info_collection_2/index'
            })
            break
          case 2: //补录修改内容及图片
            wx.navigateTo({
              url: '../info_collection_1/index'
            })
            break
          default:
            break
        }
      })
      .catch(err => {})
  },
  /**
   * 我的贷款
   * 当状态在回执的 S05-S13 显示我的贷款的内容
   */
  myLoan() {
    let params = {
      cmd: 'studentLoan',
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        if (res.code === 0) {
          console.log(res)
          this.setData({
            loanList: res.data
          })
        }
      })
      .catch(err => {})
  },
  /**
   * 根据当前的loanStatus 判断是都显示数据
   *
   */
  getShowData() {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    const loanStatus =
      this.data.userInfo.loanStatus || app.globalData.userInfo.loanStatus
    switch (loanStatus) {
      case 'S0401':
      case 'S0402':
      case 'S0403':
      case 'S0404':
        this.queryApply()
        break
      case 'S05':
      case 'S06':
      case 'S07':
      case 'S08':
      case 'S09':
      case 'S10':
      case 'S11':
      case 'S12':
      case 'S13':
        this.myLoan()
        break
      default:
        break
    }
  },
  /**
   * 进入还款确认
   */
  repayMent() {
    let params = {
      cmd: 'confirmRepayCheck',
      token: this.data.userInfo.token || 'token'
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        if (res.code === 0) {
          console.log(res)
          app.globalData.replayData = res.data
          wx.navigateTo({
            url: '../repayment_confirm/step1/index'
          })
        }
      })
      .catch(err => {})
  },
  //展期申请检查
  extensionApply() {
    wx.showLoading()
    let params = {
      cmd: 'defferLoanCheck',
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        wx.hideLoading()
        if (res.code === 0) {
          console.log(res)
          //将展期申请数据设置全局
          app.globalData.extensionData = res.data
          wx.navigateTo({
            url: '../extension_apply/step1/index'
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
      })
  },
  /**
   * 刷新登录返回的信息
   */
  refeshUserInfo() {
    const params = {
      token: this.data.userInfo.token || app.globalData.userInfo.token
    }
    wx.showNavigationBarLoading() //在标题栏中显示加载
    app.api
      .Login(params)
      .then(res => {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.setStorage({
          key: 'userInfo',
          data: res.data
        })
        app.globalData.userInfo = res.data
        this.setData({
          userInfo: res.data
        })
      })
      .catch(e => {
        console.error(e)
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
  },
  /**
   * 校验提前结清
   */
  settlement() {
    let params = {
      cmd: 'settledAccountCheck',
      token: this.data.userInfo.token
    }
    console.log(params)
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.navigateTo({
            url: '../advance_pay_1/index'
          })
        }
      })
      .catch(err => {})
  }
})
