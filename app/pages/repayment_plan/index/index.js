//获取应用实例
const app = getApp()
const Chart = require('../../../utils/chart')
//var token = '2381029ceef4435db737bb3f50c6b95d5ifgz6';
var banks = []
var index = 0 //repaymentPeriod 采用数组里的第几组传递给年度计划
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    show: false, //有无数据
    totalShouldPay: 0, //总计应还
    totalHasPay: 0, //总计实还
    totalOverdate: 0, //总计逾期金额
    lastPeriodDebt: 0, //当前上期应还
    currentHasPay: 0, //当前实还
    currentOverdate: 0, //当前逾期金额
    cumulativeDebt: 0, //当前累计逾期
    currentPreiodShouldPay: 0, //本期应还
    payDate: '----/--/--', //还款日
    bankname: '',
    bankcode: '',
    repaymentPeriods: [],
    currentBank: 0,
    list: [],
    showBank: false //是否显示多张银行卡
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    if (this.data.userInfo.token) {
      this.queryDatasHead()
    }
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  confirmBtn: function() {
    wx.navigateTo({
      url: '../detail/index?list=' + JSON.stringify(this.data.list[index])
    })
  },

  queryDatasHead() {
    var that = this
    var params = {
      token: this.data.userInfo.token
      //token: "6c1ee21bac924bec8cb4567cf5f8d5f2u1uhv6",
    }
    app.api
      .repaymentPeriod(params)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          that.setData({
            repaymentPeriods: res.data,
            show: true
          })
          that.queryDatasContent()
          // console.log("repaymentPeriods:" + JSON.stringif(that.data.repaymentPeriods))
          that.initUI()
        } else {
          that.showErrorDialog()
        }
      })
      .catch(e => {
        console.error(e)
        that.showErrorDialog()
      })
  },

  queryDatasContent() {
    var that = this
    var params = {
      //token: "6c1ee21bac924bec8cb4567cf5f8d5f2u1uhv6",
      token: this.data.userInfo.token
    }
    app.api
      .repaymentPlan(params)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          that.setData({
            list: res.data
          })
          that.initChartUI()
        } else {
          that.showErrorDialog()
        }
      })
      .catch(e => {
        console.error(e)
        that.showErrorDialog()
      })
  },

  initChartUI() {
    var currentCard = this.data.repaymentPeriods[this.data.currentBank].bankcode
    var size = this.data.list.length
    for (var i = 0; i < size; i++) {
      if (currentCard == this.data.list[i].cardCode) {
        index = i
        break
      }
    }
    this.setData({
      totalShouldPay: this.data.list[index].payCapitalTotal,
      totalHasPay: this.data.list[index].actualCapitalTotal,
      totalOverdate: this.data.list[index].overIrtTotal
    })

    const winW = wx.getSystemInfoSync().windowWidth
    const canvasWidth = winW / 750 * 250

    this.setData({
      canvasW: canvasWidth + 'px',
      canvasH: canvasWidth + 'px'
    })

    const ctx = wx.createCanvasContext('pie-chart')
    const chart = new Chart(ctx, 'pieChart', {
      width: canvasWidth,
      height: canvasWidth,
      ratio: this.data.totalHasPay / this.data.totalShouldPay,
      radius: canvasWidth / 2,
      colors: ['#12ba74', '#ff0000']
    })
    chart.draw()
  },

  initUI() {
    banks = []
    var size = this.data.repaymentPeriods.length
    for (var i = 0; i < size; i++) {
      var object =
        this.data.repaymentPeriods[i].bankname +
        '：' +
        this.data.repaymentPeriods[i].bankcode
      banks.push(object)
    }

    this.setData({
      lastPeriodDebt: this.data.repaymentPeriods[this.data.currentBank]
        .payCapitalLastMonth,
      currentHasPay: this.data.repaymentPeriods[this.data.currentBank]
        .actualCapitalLastMonth,
      currentOverdate: this.data.repaymentPeriods[this.data.currentBank]
        .overdueLastMonth,
      cumulativeDebt: this.data.repaymentPeriods[this.data.currentBank]
        .totalOverDay,
      currentPreiodShouldPay: this.data.repaymentPeriods[this.data.currentBank]
        .payCapital,
      payDate: this.data.repaymentPeriods[this.data.currentBank].payDay,
      bankname: this.data.repaymentPeriods[this.data.currentBank].bankname,
      bankcode: this.data.repaymentPeriods[this.data.currentBank].bankcode,
      showBank: banks.length > 1 ? true : false
    })
  },

  btnBankSwitch: function() {
    if (!this.data.showBank) {
      return
    }
    var that = this
    wx.showActionSheet({
      itemList: banks,
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          that.setData({
            currentBank: res.tapIndex
          })
          that.initUI()
          that.initChartUI()
        }
      }
    })
  },

  showErrorDialog() {
    wx.showModal({
      title: '提示',
      content: '暂无『还款』数据 ^_^ ',
      showCancel: false,
      success: function(res) {}
    })
  }
})
