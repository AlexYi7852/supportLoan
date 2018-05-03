/*
 * @Author: ecitlm 
 * @Date: 2018-04-14 18:15:49 
 * @Last Modified by: ecitlm
 * @Last Modified time: 2018-04-17 09:01:56
 */
//获取应用实例
const app = getApp()
import { cityJson } from '../../../../libs/js/city'
import { getCityNameByCityCode } from '../../../../utils/util'
import { validate } from '../../../../libs/js/validate'

Page({
  /* 页面数据 */
  data: {
    cityCodes: {}, //传给城市组件的家庭地址省市区数据代码

    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    replayData: {},

    addrAreaId: '',
    addrCityId: '',
    addrProvId: '',
    addrAreaName: '',
    addrCityName: '',
    addrProvName: '',
    list: cityJson, //省市区数据
    citys: cityJson[0].children,
    areas: [],
    value: [0, 0, 0],
    addressMenuIsShow: false
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.replayData)
    let replayData = app.globalData.replayData

    let cityCodes = {
      proCode: replayData.addrProvId || '',
      cityCode: replayData.addrCityId || '',
      countyCode: replayData.addrAreaId || ''
    }
    this.setData({
      cityCodes: cityCodes,
      replayData: replayData,
      addrAreaId: replayData.addrAreaId,
      addrCityId: replayData.addrCityId,
      addrProvId: replayData.addrProvId
    })
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
  /**
   * 组件传回来的值
   */
  bindtap(e) {
    console.log(e.detail)
    let data = e.detail
    this.setData({
      addrProvId: data.addrProvId,
      addrCityId: data.addrCityId,
      addrAreaId: data.addrAreaId
    })
  },
  /* 自定义事件绑定 */
  mobileInput(e) {
    this.setData({
      'replayData.mobile': e.detail.value
    })
  },
  emailInput(e) {
    this.setData({
      'replayData.email': e.detail.value
    })
  },
  qqInput(e) {
    this.setData({
      'replayData.qq': e.detail.value
    })
  },
  wechatInput(e) {
    this.setData({
      'replayData.wechat': e.detail.value
    })
  },
  addrInput(e) {
    this.setData({
      'replayData.addr': e.detail.value
    })
  },
  confirmRepayMsg() {
    let params = {}
    let replayData = this.data.replayData
    params.mobile = replayData.mobile
    params.email = replayData.email
    params.qq = replayData.qq
    params.wechat = replayData.wechat
    params.addr = replayData.addr
    params.addrAreaId = this.data.addrAreaId
    params.addrCityId = this.data.addrCityId
    params.addrProvId = this.data.addrProvId

    if (!validate.mobile(params.mobile)) {
      app.Toast.warn('请填写正确的手机号')
      return
    }
    if (!validate.email(params.email)) {
      app.Toast.warn('请填写邮箱号')
      return
    }
    if (!validate.qq(params.qq)) {
      app.Toast.warn('请填写正确的QQ号')
      return
    }

    if (!validate.wechat(params.wechat)) {
      app.Toast.warn('请填写正确微信号')
      return
    }
    if (!params.addrProvId) {
      app.Toast.warn('请选择毕业后通讯地址')
      return
    }

    if (!validate.has4Chinese(params.addr)) {
      app.Toast.warn('请输入真实的家庭详细地址')
      return
    }

    params.cmd = 'confirmRepayMsg'
    params.token = this.data.userInfo.token
    console.log(params)
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        wx.navigateTo({
          url: '../step2/index'
        })
      })
      .catch(err => {})
  }
})
