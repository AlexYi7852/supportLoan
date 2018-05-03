//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    alert: false,
    list: [],
    jProd: [],
    sProd: [],
    sysInfo: {},
    postRecentlyList: []
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onShow: function() {
    var userInfo = wx.getStorageSync('userInfo') || app.globalData.userInfo
    this.setData({ userInfo: userInfo })

    //如果已经登录才能下来刷新请求数据
    if (this.data.userInfo.token) {
      this.refeshUserInfo()
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
  onReady: function() {
    this.openLoanProducts() //开放产品
    this.getSysInfo() //系统消息
    this.postRecently() //消息公告
    /**
     * 判断是不是没有实名认证的用户
     */
    var userInfo = wx.getStorageSync('userInfo') || this.data.userInfo
    if (userInfo.cStatus !== 4) {
      wx.removeStorageSync('userInfo')
      wx.clearStorageSync()
    }
  },
  openLoanProducts() {
    wx.showLoading()
    let that = this
    app.api
      .openLoanProducts()
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          that.setData({
            jProd: res.data.jProd.split(';'),
            sProd: res.data.sProd.split(';')
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //获取系统消息接口
  getSysInfo() {
    let that = this
    app.api
      .getSysInfo()
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            sysInfo: res.data
          })
          app.globalData.sysInfo = res.data
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //获取首页公告列表接口
  postRecently() {
    app.Toast.hideLoading()
    let that = this
    let params = {
      page: 1,
      pageSize: 2,
      type: 1
    }
    app.api
      .postRecently(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          that.setData({
            postRecentlyList: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //url跳转
  linkUrl(e) {
    const content = e.currentTarget.dataset.txt

    if (this.data.userInfo['token']) {
      app.Toast.warn(content)
    } else {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
    }
    if (this.data.userInfo['token']) {
      app.Toast.warn(content)
      return
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      wx.navigateTo({
        url: '../../login_regist/login/index'
      })
    }
  },
  alertLoanType() {
    if (this.data.userInfo['token']) {
      //app.Toast.warn('未开放')
      // return
      this.setData({
        alert: !this.data.alert
      })
    } else {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
    }
  },
  linkLoan(e) {
    const loanType = e.currentTarget.dataset.loantype
    this.setData({
      alert: false
    })
    this.loanLatest(loanType)
  },
  /**
   * 判断上是否存在上一笔贷款
   * 判断是否隐藏 高考所在地
   */
  loanLatest(loanType) {
    let params = {
      token: this.data.userInfo.token || 'token',
      loanType: loanType
    }
    wx.showLoading()
    app.api
      .loanLatest(params)
      .then(res => {
        wx.hideLoading()
        if (res.code === 0) {
          if (res.data.apply === true) {
            wx.navigateTo({
              url: '../../apply_loan/apply/step1/index?loanType=' + loanType
            })
          } else {
            console.log('不能申请')
            app.Toast.warn(res.data.applyMsg)
          }
        }
      })
      .catch(e => {
        console.error(e)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '足不出户,在家就可以申请国家贷款！'
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    //如果已经登录才能下来刷新请求数据
    if (this.data.userInfo.token) {
      this.refeshUserInfo()
    } else {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
  /**
   * 回执确认
   */
  interfaceApi(e) {
    if (!this.data.userInfo['token']) {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
      return
    }
    let params = {
      cmd: 'receiptCheck',
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.navigateTo({
            url: '../reply_confirm_1/index'
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 回执确认逻辑处理
   */
  confirmReply() {
    let loanStatus =
      this.data.userInfo.loanStatus || app.globalData.userInfo.loanStatus
    if (!this.data.userInfo.token) {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
      return
    }
    switch (loanStatus) {
      //S05:高校回执待上传
      case 'S05':
        wx.navigateTo({ url: '../reply_confirm/college_reply/index' })
        break
      //S06:高校回执审核中
      case 'S06':
        app.Toast.warn('高校回执审核中')
        break
      //S07:在学情况待确认
      case 'S07':
        wx.navigateTo({ url: '../reply_confirm/sure_in_college/index' })
        break
      //S08:待上传手持身份证
      case 'S08':
        wx.navigateTo({ url: '../reply_confirm/idcard_reply/index' })
        break
      default:
        app.Toast.warn('你暂不需要回执确认')
        break
    }
  },
  /**
   * 续贷申请点击事件
   */
  continueLoan() {
    if (!this.data.userInfo.token) {
      wx.showModal({
        title: '',
        content: '你还未登录，前去登录',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../login_regist/login/index'
            })
          }
        }
      })
      return
    }

    this.checkContinueLoan()
  },
  /**
   * 判断是否去续贷的操作
   */
  checkContinueLoan() {
    let loanStatus =
      this.data.userInfo.loanStatus || app.globalData.userInfo.loanStatus
    console.log(loanStatus)
    let params = { cmd: 'creditCheck', token: this.data.userInfo.token }
    if (loanStatus != 'S11' && loanStatus != 'S1101' && loanStatus != 'S1102') {
      app.Toast.warn('你暂不能申请续贷')
      return
    }
    app.Toast.showLoading()
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          switch (loanStatus) {
            //S11:续贷申请
            case 'S11':
              wx.navigateTo({ url: '../continue_loan/step1/index' })
              break
            //续贷回执审核中
            case 'S1101':
              wx.navigateTo({ url: '../continue_loan/step2/index' })
              break
            //续贷回执待上传人证合照
            case 'S1102':
              wx.navigateTo({ url: '../continue_loan/step3/index' })
              break
            default:
              app.Toast.warn('你暂不能申请续贷!')
              break
          }
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 商业助学贷入口
   */
  commercialApply() {
    wx.navigateTo({
      url: '../commercial_loan_apply/step1/index'
    })
  }
})
