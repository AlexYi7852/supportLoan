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
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    userMaterialDetail: '',
    is_show: true,
    last_time: 60,
    code: '',
    feeData: {}
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    this.startTimer()
    console.log(app.globalData.feeData)
  },
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
      feeData: app.globalData.feeData
    })
    this.businessLoanCheck()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
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
   * 用户影像内容、资助中心
   * 主要用来获取经办银行、资助中心的信息地址
   */
  businessLoanCheck() {
    let params = {
      token: this.data.userInfo.token
    }
    app.api
      .businessLoanCheck(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setData({ userMaterialDetail: res.data })
        }
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
    app.Toast.loading()
    app.api.httpPdf(url).then(response => {
      wx.downloadFile({
        url: response.data.url,
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
    this.linkFaceId()
  },
  /**
   * 首页返回
   */
  backHome() {
    wx.switchTab({
      url: '../../../index/index/index'
    })
  },

  /**
   * 获取签署的文件types 集合
   */
  getPdfTypes() {
    const pdf = this.data.userMaterialDetail.pdf
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
      cLoanId: this.data.userMaterialDetail.cLoanId,
      types: this.getPdfTypes()
    }
    app.Toast.loading()
    app.api
      .signElectronic(Object.assign(par, params, this.data.feeData))
      .then(res => {
        console.log(res)
        getSms.settime(this)
      })
      .catch(e => {
        console.error(e)
      })
  },
  getMobileCode() {
    if (!this.data.isAgree) {
      app.Toast.warn('请阅读以上文本')
      return false
    }
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
      cLoanId: this.data.userMaterialDetail.cLoanId,
      cmd: 'applySign',
      code: this.data.code || '888888',
      types: this.getPdfTypes()
    }
    app.Toast.showLoading('正在提交')
    app.api
      .signElectronic(Object.assign(params, this.data.feeData))
      .then(res => {
        console.log(res)
        app.Toast.success(res.message)
        wx.redirectTo({ url: '../step4_success/index' })
      })
      .catch(e => {
        console.error(e)
      })
  },

  /**
   * 人脸识别
   */
  linkFaceId() {
    let username = this.data.userInfo.userName
    let certCode = this.data.userInfo.certCode
    app.wxFaceId
      .verify(username, certCode)
      .then(res => {
        this.setData({
          isPhonePop: true,
          isAgreePop: false
        })
      })
      .catch(res => {
        wx.showModal({
          showCancel: false,
          content: res
        })
      })
  }
})
