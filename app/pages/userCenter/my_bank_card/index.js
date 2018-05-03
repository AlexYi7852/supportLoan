//获取应用实例
const app = getApp()
Page({
  /* 页面数据 */
  data: {
    isAddCardPop: false,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    list: [],
    card_code: '',
    mobile: '',
    type: '',
    options: ['身份证', '临时身份证', '户口本']
  },
  /* 生命周期函数 */
  onLoad: function(options) {},
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.queryBankcard()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  showAddCardPop() {
    this.setData({
      isAddCardPop: true
    })
  },
  hideAddCardPop() {
    this.setData({
      isAddCardPop: false
    })
  },
  //查询银行卡
  queryBankcard() {
    let params = {
      token: this.data.userInfo.token || 'token'
    }
    wx.showLoading()
    app.api
      .queryBankcard(params)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.code == 0) {
          this.setData({
            list: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
        wx.hideLoading()
      })
  },
  bankCardInput(e) {
    this.setData({
      card_code: e.detail.value
    })
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      type: e.detail.value
    })
  },
  //添加银行卡
  addBankCard() {
    let params = {
      token: this.data.userInfo.token || 'token',
      //mobile: this.data.mobile,
      ifBinding: 0,
      card_code: this.data.card_code,
      type: this.data.options[this.data.type]
    }
    //表单校验
    if (!params.card_code || params.card_code.length < 11) {
      app.Toast.warn('请输正确的入银行卡')
      return false
    }
    // if (params.mobile.length != 11) {
    //   app.Toast.warn('手机号格式错误')
    //   return false
    // }
    if (!params.type) {
      app.Toast.warn('请选择证件类型')
      return false
    }
    wx.showLoading()
    app.api
      .saveBankcard(params)
      .then(res => {
        wx.hideLoading()
        if (res.code == 0) {
          wx.showToast({
            title: '银行卡添加成功',
            duration: 1500,
            mask: true
          })
          this.queryBankcard()
          //隐藏弹出层
          this.setData({
            isAddCardPop: false
          })
        }
      })
      .catch(e => {
        wx.hideLoading()
        console.error(e)
      })
  },
  slideDel(e) {
    console.log(e)
  }
})
