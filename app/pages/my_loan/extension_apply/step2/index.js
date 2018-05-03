//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    extensionData: null,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    let extensionData = app.globalData.extensionData || null
    this.setData({ extensionData: extensionData })
    if (!this.data.extensionData) {
      console.log('重新抓取数据')
      this.getExtensionData()
    }
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
  /**
   * 获取展期数据
   */
  getExtensionData() {
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
          console.log(JSON.stringify(res.data))
          this.setData({
            extensionData: res.data
          })
        }
      })
      .catch(err => {
        wx.hideLoading()
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
    let formData = {
      fileAbbr: e.currentTarget.dataset.materialcode,
      fileSize: '100000',
      fileType: e.currentTarget.dataset.filetype,
      serno: this.data.extensionData.cLoanId,
      token: this.data.userInfo.token
    }
    console.log(formData)
    let index = e.currentTarget.dataset.index
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
                const delUrl = 'extensionData.img[' + index + '].url'
                this.setData({
                  [delUrl]: res.data.URL1
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
    const index = e.currentTarget.dataset.index
    const url = e.currentTarget.dataset.url //delImgByUrl
    //如果上面存在照片删除照片
    if (url) {
      app.api
        .delImgByUrl({ url: url })
        .then(res => {
          if (res.code == 0) {
            console.log(res)
            const delUrl = 'extensionData.img[' + index + '].url'
            this.setData({
              [delUrl]: ''
            })
            app.Toast.warn(res.message)
          }
        })
        .catch(e => {
          console.error(e)
        })
    }
  },
  /**
   * 打开pdf文档
   */
  openDocument(e) {
    const url = e.currentTarget.dataset.url
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
  //下一步
  nextStep() {
    //判断是都为空某一张照片没有上传
    let list = this.data.extensionData.img
    for (let i in list) {
      if (!list[i].url) {
        app.Toast.warn('请上传:' + list[i].materialName)
        return
      }
    }
    //设置show_type  进入下一个页面 是为了 显示 电子签署公告通知
    //2 进入显示电子签署公告
    //3 显示人脸识别之后进入该页面
    wx.navigateTo({
      url: '../step3/index'
    })
  }
})
