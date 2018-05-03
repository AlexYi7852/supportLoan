//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    userMaterialDetail: '',
    cLoanId: '',//贷款编号
  },
  /* 生命周期函数 */
  onLoad: function (options) { },
  onReady: function () {
    this.interfaceApi()
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {
    console.log('back home')
    wx.switchTab({
      url: '/pages/index/index/index'
    })
  },
  /* 内置事件绑定 */
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },

  //interfaceApi 信息补录
  interfaceApi() {
    let params = {
      cmd: 'loanAmend',
      token: this.data.userInfo.token,
      requestTypeTest: '1'
    }
    console.log(params)
    app.api.interfaceApi(params)
      .then((res) => {
        console.log(res)
        this.setData({
          userMaterialDetail:res.data,
          cLoanId: res.data.cLoanId
        })
      }).catch((err) => {

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
      fileSize: "100000",
      fileType: e.currentTarget.dataset.filetype,
      serno: this.data.cLoanId,
      token: this.data.userInfo.token
    }
    let index = e.currentTarget.dataset.index
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length) {
          const src = tempFilePaths;
          console.log(src)
          app.api.imgUpload(src, "", formData)
            .then(res => {
              if (res.code == 0) {
                //更新视图数据
                const delUrl = 'userMaterialDetail.img[' + index + '].url'
                this.setData({
                  [delUrl]: res.data.URL1,
                })
              }
            })
            .catch(e => {
              console.error(e)
            });
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
      app.api.delImgByUrl({ url: url })
        .then(res => {
          if (res.code == 0) {
            console.log(res)
            const delUrl = 'userMaterialDetail.img[' + index + '].url'
            this.setData({
              [delUrl]: "",
            })
            app.Toast.warn(res.message)
          }
        })
        .catch(e => {
          console.error(e)
        });
    }
  },
  //下一步
  nextStep() {
    //判断是都为空某一张照片没有上传
    let list = this.data.userMaterialDetail.img
    for (let i in list) {
      if (!list[i].url) {
        app.Toast.warn('请上传:' + list[i].materialName)
        return
      }
    }

    wx.navigateTo({
      url: '../info_collection_3/index'
    })
  }
})