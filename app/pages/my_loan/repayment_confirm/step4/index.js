//获取应用实例
const app = getApp()
import { getSms } from '../../../../utils/util'

Page({
  /* 页面数据 */
  data: {
    seconds: 6,
    enabledClick: false,
    isAgreePop: true,
    isPhonePop: false,
    isAgree: false,
    userInfo: wx.getStorageSync('userInfo'),
    is_show: true,
    last_time: 60,
    replayData: {},
    code: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    let replayData = app.globalData.replayData
    console.log(JSON.stringify(replayData))
    this.setData({
      replayData: replayData
    })
    this.startTimer()
  },
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  startTimer() {
    const timer = setInterval(() => {
      this.setData({
        seconds: (this.data.seconds -= 1)
      })
      if (this.data.seconds == 0) {
        this.setData({
          enabledClick: true
        })
        clearInterval(timer)
      }
    }, 1000)
  },
  hidePop() {
    this.setData({
      isAgreePop: false
    })
  },
  agreeEvent() {
    this.setData({
      isAgree: !this.data.isAgree
    })
  },
  /* 自定义事件绑定 
  /**
   * 打开pdf文档
   */
  openDocument(e) {
    const url = e.currentTarget.dataset.url
    app.Toast.loading()
    wx.downloadFile({
      url: url,
      success: function(res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fail: res => {
            app.Toast.warn('文档打开失败')
          }
        })
      }
    })
  },
  /**
   * 签署文档
   */
  signDocument() {
    if (!this.data.isAgree) {
      app.Toast.warn('请阅读以上文本')
      return false
    }
    this.setData({
      isPhonePop: true
    })
  },
  backHome() {
    wx.switchTab({
      url: '../../../index/index/index'
    })
  },

  /**
   * 获取签署的文件types 集合
   */
  getPdfTypes() {
    const pdf = this.data.replayData.pdf
    let arr = pdf.map(function(item, key) {
      return item.type
    })
    return arr.toString()
  },
  /**
   * 前端使用电子签署
   */
  signElectronic(par) {
    let params = {
      token: this.data.userInfo.token,
      cLoanId: this.data.replayData.cLoanId,
      types: this.getPdfTypes()
    }
    app.Toast.loading()
    app.api
      .signElectronic(Object.assign(par, params))
      .then(res => {
        console.log(res)
        getSms.settime(this)
      })
      .catch(e => {
        console.error(e)
      })
  },
  getMobileCode() {
    this.signElectronic({ cmd: 'applySendCode' })
  },
  codeInput(e) {
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value
    })
  },

  sendApply() {
    let params = {
      token: this.data.userInfo.token,
      cLoanId: this.data.replayData.cLoanId,
      cmd: 'applySign',
      code: this.data.code || '888888',
      types: this.getPdfTypes()
    }
    app.Toast.showLoading('正在提交')
    app.api
      .signElectronic(params)
      .then(res => {
        console.log(res)
        app.Toast.success(res.message)
        wx.redirectTo({
          url: '../step5_success/index'
        })
      })
      .catch(e => {
        console.error(e)
      })
  }
})
