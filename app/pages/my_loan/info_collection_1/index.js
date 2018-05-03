//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    userMaterialDetail: '',
    cLoanId: ''
  },
  /* 生命周期函数 */
  onLoad: function (options) {},
  onReady: function () {
    this.interfaceApi()
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  /* 内置事件绑定 */
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  /* 自定义事件绑定 */
  //interfaceApi 信息补录
  interfaceApi() {
    let params = {
      cmd: 'loanAmend',
      token: this.data.userInfo.token,
      requestTypeTest: '2'
    }
    app.api.interfaceApi(params)
      .then((res) => {
        this.setData({
          userMaterialDetail: res.data,
          cLoanId: res.data.cLoanId
        })
      }).catch((err) => {

      })
  },
  nextStep() {
    let v = parseInt(this.data.userMaterialDetail.amendType)
    console.log(v)
    switch (v) {
      case 0:
        wx.navigateTo({
          url: '../info_collection_3/index',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../info_collection_2/index',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../info_collection_2/index',
        })
        break;

      default:
        break;
    }

  }
})