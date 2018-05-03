//获取应用实例
const app = getApp()
import {validate} from '../../../../libs/js/validate'
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    receiptData: '',
    url: '',
    email: '',
    loanData: null
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
      email: this.data.userInfo.email
    })
    this.interfaceApi()
    this.myLoan()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  interfaceApi(e) {
    app.Toast.showLoading()
    let params = {
      cmd: 'creditCheck',
      token: this.data.userInfo.token
    }
    wx.showLoading()
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setData({ receiptData: res.data, url: res.data.img[0].url })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 发送邮件
   */
  sendUploadEmail() {
    const content = this.data.receiptData.img[0]
    if(!validate.email(this.data.email)){
      app.Toast.warn('邮箱号格式错误')
      return
    }
    console.log(content)
    let params = {
      type: '2',
      token: this.data.userInfo.token,
      toEmail: this.data.email,
      content: `${content.addr},${content.materialName}`
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
  },
  /**
   * 打开pdf文档
   */
  openDocument(e) {
    let url = this.data.receiptData.img[0].addr
    console.log(this.data.receiptData)
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
   * 图片影像上传
   */
  uploadImage(e) {
    //如果有图片 不能再次上传 必须先删除
    if (e.currentTarget.dataset.url) {
      return
    }
    let img = this.data.receiptData.img[0]
    let formData = {
      fileAbbr: img.materialCode,
      fileSize: '100000',
      fileType: img.fileType,
      serno: this.data.receiptData.cLoanId,
      token: this.data.userInfo.token
    }
    let that = this
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length) {
          const src = tempFilePaths
          console.log(src)
          app.api
            .imgUpload(src, '', formData)
            .then(res => {
              if (res.code == 0) {
                //更新视图数据
                this.setData({
                  url: res.data.URL1
                })
              }
            })
            .catch(e => {
              console.error(e)
            })
        }
      }.bind(this)
    })
  },
  /**
   * 删除图片
   */
  deleteImage(e) {
    const url = e.currentTarget.dataset.url //delImgByUrl
    //如果上面存在照片删除照片
    if (url) {
      app.api
        .delImgByUrl({ url: url })
        .then(res => {
          if (res.code == 0) {
            console.log(res)
            this.setData({
              url: ''
            })
            app.Toast.warn(res.message)
          }
        })
        .catch(e => {
          console.error(e)
        })
    }
  },
  interfaceApiCallBack() {
    if (!this.data.url) {
      app.Toast.warn('请上传回执照片')
      return
    }
    wx.showLoading()
    let params = { cmd: 'creditCallBack', token: this.data.userInfo.token }
    app.api
      .interfaceApi(params)
      .then(res => {
        if (res.code === 0) {
          console.log(res)
          wx.redirectTo({ url: '../success/index' })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  emailInput(e) {
    this.setData({ email: e.detail.value })
  },
  /**
   * 我的贷款接口数据
   */
  myLoan() {
    let params = { cmd: 'studentLoan', token: this.data.userInfo.token }
    wx.showLoading()
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        this.setData({ loanData: res.data[0] })
      })
      .then(err => {})
  }
})
