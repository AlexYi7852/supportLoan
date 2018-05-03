//获取应用实例
const app = getApp()
import { validate } from '../../../../libs/js/validate'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bankName: '',
    tip: '贷款发放卡',
    isAddCardPop: false,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    list: [],
    card_code: '',
    mobile: '',
    type: '',
    options: ['身份证', '临时身份证', '户口本']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bankName: options.bankName,
      tip: options.tip
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.queryBankcard()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  /**
   * 弹窗银行卡添加模块
   */
  showAddCardPop() {
    this.setData({
      isAddCardPop: true
    })
  },
  /**
   * 隐藏
   */
  hideAddCardPop() {
    this.setData({
      isAddCardPop: false
    })
  },
  /**
   * 输入银行卡信息
   */
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
  //查询银行卡
  queryBankcard() {
    let params = {
      token: this.data.userInfo.token || 'token'
    }
    wx.showLoading()
    let that = this
    app.api
      .queryBankcard(params)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.code == 0) {
          that.setData({
            list: res.data
          })
        }
      })
      .catch(e => {
        wx.hideLoading()
        console.error(e)
      })
  },
  //添加银行卡
  addBankCard() {
    let params = {
      token: this.data.userInfo.token || 'token',
      // mobile: this.data.mobile,
      ifBinding: 1,
      savePeriod: 'changeBinding',
      card_code: this.data.card_code,
      type: this.data.options[this.data.type]
    }
    //表单校验
    if (!params.card_code || params.card_code.length < 11) {
      app.Toast.warn('请输正确的入银行卡')
      return false
    }

    // if (!validate.mobile(params.mobile)) {
    //   app.Toast.warn('请填写正确的手机号')
    //   return
    // }
    if (!params.type) {
      app.Toast.warn('请选择证件类型')
      return false
    }
    app.Toast.showLoading()
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
          this.queryBankcard()
          //隐藏弹出层
          this.setData({
            isAddCardPop: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 改绑银行卡
   */
  bindingBankcard(e) {
    let index = e.currentTarget.dataset.index
    let cardData = this.data.list[index]
    let parmas = {
      cLoanId: this.data.userInfo.cLoanId,
      token: this.data.userInfo.token || 'token',
      cardId: cardData.cardId
    }
    console.log(parmas, cardData)
    console.log(this.data.userInfo.cLoanId)
    wx.showLoading()
    app.api
      .bindingBankcard(parmas)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.code === 0) {
          //如果有一个为真
          if (res.data.resign || res.data.signProtocol) {
            app.globalData.bindCardData = res.data
            wx.navigateTo({
              url: `../bank_card_signature/index`
            })
          } else {
            app.Toast.warn(res.data.msg)
          }
        }
      })
      .catch(err => {
        wx.hideLoading()
      })
  }
})
