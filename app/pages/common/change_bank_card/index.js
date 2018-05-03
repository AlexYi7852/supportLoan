//获取应用实例
const app = getApp()
import { validate } from '../../../libs/js/validate'

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
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    console.log('我是onload')
  },
  onReady: function() {
    this.queryBankcard()
    console.log('我是onReady')
  },
  onShow: function() {
    console.log('onShow')
  },
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},
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
    let that = this
    app.api
      .queryBankcard(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            list: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
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
    let that = this
    let params = {
      token: this.data.userInfo.token || 'token',
     // mobile: this.data.mobile,
      ifBinding: 0,
      card_code: this.data.card_code,
      type: this.data.options[this.data.type]
    }
    //表单校验
    if (!params.card_code || params.card_code.length < 11) {
      app.Toast.warn('请输正确的入银行卡')
      return false
    }
	/*
    if (!validate.mobile(params.mobile)) {
      app.Toast.warn('请输入正确的手机号号码')
      return
    }
	*/
    if (!params.type) {
      app.Toast.warn('请选择证件类型')
      return false
    }
    app.api
      .saveBankcard(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: '银行卡添加成功',
            duration: 1500,
            mask: true
          })
          that.queryBankcard()
          //隐藏弹出层
          that.setData({
            isAddCardPop: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 选择银行卡 并且返回上一界面
   */
  selectCard(e) {
    let index = e.currentTarget.dataset.index
    let bankData = this.data.list[index]
    let pages = getCurrentPages() //当前页面
    let prevPage = pages[pages.length - 2] //上一页面

    //直接给上移页面赋值
    prevPage.setData({
      BindCardInfo: bankData
    })
    wx.navigateBack({ delta: 1 })
  }
})
