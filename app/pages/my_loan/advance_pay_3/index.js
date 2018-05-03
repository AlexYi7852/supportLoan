//获取应用实例
const app = getApp()

Page({
  /* 页面数据 */
  data: {
    msg: app.globalData.msg

  },
  /* 生命周期函数 */
  onLoad: function (options) {
    console.log(app.globalData.msg)
  },
  onReady: function () {

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
  comfirmBtn: function () {

    var name = app.globalData.userInfo.userName || app.globalData.userInfo.username
    var idCardNumber = app.globalData.userInfo.certCode

    app.wxFaceId.verify(name, idCardNumber).then(res => {
      wx.showToast({
        title: res,
        icon: 'success',
        duration: 2000
      })
    }).catch(res => {
      wx.showModal({
        showCancel: false,
        content: res,
      });
    });
    // wx.startFacialRecognitionVerifyAndUploadVideo({
    //   name:'梁杰凯',
    //   idCardNumber:'440981198909260257',
    //   mobile:'18675686168',
    //   success() { console.log("人脸识别成功")},
    //   fail(res){console.log(res)}
    // })

    // wx.checkIsSupportFacialRecognition({
    //   success(){
    //     console.log("人脸识别成功")
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
  }


})