//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    url: '',
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  /**
   * 图片影像上传
   */
  uploadImage(e) {
    //如果有图片 不能再次上传 必须先删除
    if (e.currentTarget.dataset.url) {
      return
    }
    let formData = {
      fileAbbr: 'RZHZ',
      fileSize: '100000',
      fileType: 'ZXD_001',
      serno: this.data.userInfo.cLoanId,
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
  /**
   * 认证合照回调
   */
  interfaceApiCallBack() {
    if (!this.data.url) {
      app.Toast.warn('请上传人证合照')
      return
    }
    let params = {
      cmd: 'certCodeCallback',
      cLoanId: this.data.userInfo.cLoanId,
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        if (res.code == 0) {
          console.log(res)
          wx.redirectTo({
            url: '../success/index'
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
