//获取应用实例
const app = getApp()
import { validate } from '../../../../libs/js/validate'
import {
  relationshipData1,
  relationshipData2
} from '../../../../libs/js/relationship'
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    replayData: {},
    index: '',
    index1: '',
    relationshipData1: relationshipData1,
    relationshipData2: relationshipData2
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    let replayData = app.globalData.replayData
    console.log(JSON.stringify(replayData))
    this.setData({
      replayData: replayData,
      index: this.getRelationShipIndex(replayData.guarderRelation) || 0,
      index1: this.getRelationShipIndex2(replayData.urgentRelation) || 0
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
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  /**
   * 监护人名称
   */
  guarderNameInput(e) {
    this.setData({
      'replayData.guarderName': e.detail.value
    })
  },
  /**
   * 监护人身份证
   */
  guarderCertCodeInput(e) {
    this.setData({
      'replayData.guarderCertCode': e.detail.value
    })
  },
  /**
   * 监护人手机号
   */
  guarderMobileInput(e) {
    this.setData({
      'replayData.guarderMobile': e.detail.value
    })
  },
  //选择监护人关系
  bindGuarderRelation(e) {
    console.log(e.detail, relationshipData1[e.detail.value]['value'])
    this.setData({
      index: e.detail.value,
      'replayData.guarderRelation': relationshipData1[e.detail.value]['value']
    })
  },
  /**
   * 紧急联系人名称
   */
  urgentNameInput(e) {
    this.setData({
      'replayData.urgentName': e.detail.value
    })
  },
  /**
   * 紧急联系人手机号
   */
  urgentMobileInput(e) {
    this.setData({
      'replayData.urgentMobile': e.detail.value
    })
  },
  //选择紧急人关系
  urgentRelation(e) {
    console.log('选择紧急联系人')
    console.log(e.detail, relationshipData2[e.detail.value]['value'])
    this.setData({
      index1: e.detail.value,
      'replayData.urgentRelation': relationshipData2[e.detail.value]['value']
    })
  },
  //获取父母亲属关系的
  getRelationShipIndex(value = 601010) {
    for (var i = 0; i < relationshipData1.length; i++) {
      if (value == relationshipData1[i]['value']) {
        return i
      }
    }
  },
  //获取紧急联系人关系索引
  getRelationShipIndex2(value = 601018) {
    for (var i = 0; i < relationshipData2.length; i++) {
      if (value == relationshipData2[i]['value']) {
        return i
      }
    }
  },
  /**
   * 保存数据
   */
  confirmRepayMsg() {
    let params = {}
    let replayData = this.data.replayData
    params.guarderName = replayData.guarderName
    params.guarderMobile = replayData.guarderMobile
    params.guarderCertCode = replayData.guarderCertCode
    params.guarderRelation = replayData.guarderRelation

    params.urgentName = replayData.urgentName
    params.urgentRelation = replayData.urgentRelation
    params.urgentMobile = replayData.urgentMobile
    params.cmd = 'confirmRepayMsg'
    params.token = this.data.userInfo.token

    if (!validate.chineseName(params.guarderName)) {
      app.Toast.warn('请填写正确的父母/监护人姓名')
      return
    }
    if (!validate.mobile(params.guarderMobile)) {
      app.Toast.warn('请输入正确的父母/监护人手机号')
      return
    }

    if (!validate.idCard(params.guarderCertCode)) {
      app.Toast.warn('请填写正确的父母/监护人身份证')
      return
    }

    if (!validate.chineseName(params.urgentName)) {
      app.Toast.warn('请填写正确的紧急联系人')
      return
    }

    if (!validate.mobile(params.urgentMobile)) {
      app.Toast.warn('请填写正确的紧急联系人手机号')
      return
    }

    //监护人 紧急联系人关系默认第一个
    if (!params.guarderRelation) {
      params.guarderRelation = relationshipData1[0]['value']
    }

    if (!params.urgentRelation) {
      params.urgentRelation = relationshipData2[0]['value']
    }

    if (
      validate.relationShip(params.urgentRelation, params.guarderRelation) ===
      false
    ) {
      app.Toast.warn('父母/监护人与紧急联系人关系不能相同')
      return
    }
    if (
      String(this.data.userInfo.certCode) === String(params.guarderCertCode)
    ) {
      app.Toast.warn('父母/监护人身份证不能与本人身份证一致')
      return false
    }

    if (params.guarderName == params.urgentName) {
      app.Toast.warn('父母/监护人姓名与紧急联系人不能相同')
      return
    }

    if (params.guarderName == params.urgentName) {
      app.Toast.warn('父母/监护人姓名与紧急联系人不能相同')
      return
    }

    //比较年龄 参数1 监护人年龄 参数二 申请人的年纪
    if (
      validate.compareAge(
        params.guarderCertCode,
        this.data.userInfo.certCode
      ) == false
    ) {
      app.Toast.warn('父母/监护人年龄不能小于申请人年龄')
      return
    }

    console.log(params)
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        wx.navigateTo({
          url: '../step3/index'
        })
      })
      .catch(err => {})
  }
})
