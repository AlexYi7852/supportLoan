//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    // 学费、住宿费
    timer1: null,
    price1: 1000,
    // 生活费
    timer2: null,
    price2: 1000,
    total: 2000,

    sysInfo: null
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    wx.showLoading('数据请求中')
    let sysInfo = app.globalData.sysInfo
    if (sysInfo) {
      this.setData({
        sysInfo: sysInfo
      })
    } else {
      this.getSysInfo()
    }
    this.calcJRLoan()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  backHome(e) {
    wx.switchTab({
      url: '../../index/index'
    })
  },
  changeAmount(e) {
    if (e.currentTarget.dataset.type === 'add1') {
      this.setData({
        price1: (this.data.price1 += 100)
      })
    }
    if (e.currentTarget.dataset.type === 'reduce1') {
      this.setData({
        price1: (this.data.price1 -= 100)
      })
    }
    if (e.currentTarget.dataset.type === 'add2') {
      this.setData({
        price2: (this.data.price2 += 100)
      })
    }
    if (e.currentTarget.dataset.type === 'reduce2') {
      this.setData({
        price2: (this.data.price2 -= 100)
      })
    }
    this.calcJRLoan()
  },
  changeAmountFast(e) {
    if (e.currentTarget.dataset.type === 'add1') {
      const timer = setInterval(() => {
        this.setData({
          price1: (this.data.price1 += 100)
        })
      }, 100)
      this.setData({
        timer1: timer
      })
    }
    if (e.currentTarget.dataset.type === 'reduce1') {
      const timer = setInterval(() => {
        this.setData({
          price1: (this.data.price1 -= 100)
        })
      }, 100)
      this.setData({
        timer1: timer
      })
    }
    if (e.currentTarget.dataset.type === 'add2') {
      const timer = setInterval(() => {
        this.setData({
          price2: (this.data.price2 += 100)
        })
      }, 100)
      this.setData({
        timer2: timer
      })
    }
    if (e.currentTarget.dataset.type === 'reduce2') {
      const timer = setInterval(() => {
        this.setData({
          price2: (this.data.price2 -= 100)
        })
      }, 100)
      this.setData({
        timer2: timer
      })
    }

    this.calcJRLoan()
  },
  cancleChangeAmountFast(e) {
    if (
      e.currentTarget.dataset.type === 'add1' ||
      e.currentTarget.dataset.type === 'reduce1'
    ) {
      clearInterval(this.data.timer1)
      this.setData({
        timer1: null
      })
    }
    if (
      e.currentTarget.dataset.type === 'add2' ||
      e.currentTarget.dataset.type === 'reduce2'
    ) {
      clearInterval(this.data.timer2)
      this.setData({
        timer2: null
      })
    }
    this.calcJRLoan()
  },
  msgTips() {
    wx.showModal({
      title: '保险费说明',
      content:
        '根据银行要求，你申请本贷款的同时需向华安保险投保《商业个人助学贷款保证险》。保险费计入贷款本金，无需额外支付',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  validateInput() {
    //生活费住宿费最高
    let lifeFee = parseInt(this.data.sysInfo.businessLifeAmount)
    let dormFee = parseInt(this.data.sysInfo.businessDormAmount)

    if (this.data.price1 < 0) {
      this.setData({ price1: 0 })
      return
    }
    if (this.data.price2 < 0) {
      this.setData({ price2: 0 })
      return
    }
    //price1 price1
    if (this.data.price1 > dormFee) {
      this.setData({ price1: dormFee })
      app.Toast.warn(`学费住宿费上限:${dormFee}元`)
      return
    }
    //price1 price1
    if (this.data.price2 > lifeFee) {
      this.setData({ price2: lifeFee })
      app.Toast.warn(`生活费上限:${lifeFee}元`)
      return
    }
  },
  /**
   * 计算保费接口
   */
  calcJRLoan() {
    this.validateInput()
    let total = this.data.price1 + this.data.price2
    console.log(total)
    this.setData({
      total: total
    })
    if (total <= 0) {
      app.Toast.warn('请输入正确的金额')
      return
    }

    app.api
      .calcJRLoan({ totalAmount: total })
      .then(res => {
        if (res.code === 0) {
          console.log(res)
          this.setData({ feeData: res.data })
          let Amount =
            parseInt(this.data.total) +
            parseFloat(res.data.coverFee) +
            parseFloat(res.data.platFee)
          console.log(Amount)
          this.setData({ total: Amount.toFixed(2) })
        }
      })
      .then(err => {
        console.log(err)
      })
  },
  //获取系统消息接口
  getSysInfo() {
    app.api
      .getSysInfo()
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          this.setData({
            sysInfo: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //下一步电子签署
  nextStep() {
    let total = this.data.total
    if (total <= 0) {
      app.Toast.warn('贷款金额不能为0')
      return
    }
    let feeData = {
      totalAmount: String(total),
      docmFee: String(this.data.price1),
      lifeFee: String(this.data.price2),
      platFee: String(this.data.feeData.platFee),
      coverFee: String(this.data.feeData.coverFee)
    }
    app.globalData.feeData = feeData
    wx.navigateTo({
      url: `../step3/index`
    })
  }
})
