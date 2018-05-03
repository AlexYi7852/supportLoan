const app = getApp()
import { cityJson } from '../../../../libs/js/city'
import { validate } from '../../../../libs/js/validate'
import {
  relationshipData1,
  relationshipData2
} from '../../../../libs/js/relationship'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityCodes: {},
    addressMenuIsShow: false,

    loanType: 'S',
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    applyData: {},
    index: '',
    index1: '',
    relationshipData1: relationshipData1,
    relationshipData2: relationshipData2,

    guarderAddrAreaId: '', //监护人省市区的代码
    guarderAddrCityId: '',
    guarderAddrProvId: '',
    guarderAddrAreaName: '',
    guarderAddrCityName: '',
    guarderAddrProvName: '',
    list: cityJson, //省市区数据
    citys: cityJson[0].children,
    areas: [],
    value: [0, 0, 0],
    addressMenuIsShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
      loanType: options.loanType
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.userDetail()
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

  /**
   * 组件传回来的值
   */
  bindtap(e) {
    console.log(e.detail)
    let data = e.detail
    this.setData({
      guarderAddrProvId: data.addrProvId,
      guarderAddrCityId: data.addrCityId,
      guarderAddrAreaId: data.addrAreaId
    })
  },
  /**=======表单键值输入事件集合========== */

  //父母的姓名
  guarderNameInput(e) {
    console.log(e)
    this.setData({
      'applyData.guarderName': e.detail.value
    })
  },
  //父母身份证
  guarderCertCodeInput(e) {
    this.setData({
      'applyData.guarderCertCode': e.detail.value
    })
  },
  //选择监护人关系
  bindGuarderRelation(e) {
    console.log(e.detail)
    this.setData({
      index: e.detail.value,
      'applyData.guarderRelation': relationshipData1[e.detail.value]['value']
    })
  },
  //监护人手机号码
  guarderMobileInput(e) {
    this.setData({
      'applyData.guarderMobile': e.detail.value
    })
  },
  /* ===紧急联系人=== */
  urgentName: function(e) {
    this.setData({
      'applyData.urgentName': e.detail.value
    })
  },
  //选择紧急人关系
  urgentRelation(e) {
    console.log('选择紧急联系人')
    console.log(e.detail)
    this.setData({
      index1: e.detail.value,
      'applyData.urgentRelation': relationshipData2[e.detail.value]['value']
    })
  },
  urgentMobile(e) {
    this.setData({
      'applyData.urgentMobile': e.detail.value
    })
  },
  //获取父母亲属关系的缩索引
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
  guarderAddrInput(e) {
    this.setData({
      'applyData.guarderAddr': e.detail.value
    })
  },
  /**
   * 获取用户申请信息 根据上一个接口判断能不能申请
   */
  userDetail() {
    let params = {
      token: this.data.userInfo.token
    }
    app.api
      .userDetail(params)
      .then(res => {
        if (res.code === 0) {
          const cityCodes = {
            proCode: res.data.guarderAddrProvId,
            cityCode: res.data.guarderAddrCityId,
            countyCode: res.data.guarderAddrAreaId
          }
          this.setData({
            cityCodes: cityCodes,
            applyData: res.data,
            guarderAddrProvId: res.data.guarderAddrProvId,
            guarderAddrCityId: res.data.guarderAddrCityId,
            guarderAddrAreaId: res.data.guarderAddrAreaId,
            index: this.getRelationShipIndex(res.data.guarderRelation) || 0,
            index1: this.getRelationShipIndex2(res.data.urgentRelation) || 0
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },

  /**
   * 下一步数据 先提交当前内容
   */
  nextStep() {
    let params = {}
    params.token = this.data.userInfo.token
    params.loanType = this.data.loanType
    //监护人
    params.guarderName = this.data.applyData.guarderName
    params.guarderCertCode = this.data.applyData.guarderCertCode
    params.guarderRelation = this.data.applyData.guarderRelation
    params.guarderMobile = this.data.applyData.guarderMobile
    params.guarderAddrProvId = this.data.guarderAddrProvId
    params.guarderAddrCityId = this.data.guarderAddrCityId
    params.guarderAddrAreaId = this.data.guarderAddrAreaId
    params.guarderAddr = this.data.applyData.guarderAddr

    //紧急联系人
    params.urgentName = this.data.applyData.urgentName
    params.urgentRelation = this.data.applyData.urgentRelation
    params.urgentMobile = this.data.applyData.urgentMobile

    if (!validate.chineseName(params.guarderName)) {
      app.Toast.warn('请输入正确的父母/监护人姓名')
      return
    }

    if (!validate.idCard(params.guarderCertCode)) {
      app.Toast.warn('父母/监护人身份证证件号有误')
      return
    }

    if (!params.guarderRelation) {
      params.guarderRelation = relationshipData1[0]['value']
    }

    //监护人联系手机
    if (!validate.mobile(params.guarderMobile)) {
      app.Toast.warn('请输入正确的父母/监护人手机号')
      return
    }

    if (!params.guarderAddrProvId) {
      app.Toast.warn('请选择家庭住址省市区')
      return
    }

    if (!validate.has4Chinese(params.guarderAddr)) {
      app.Toast.warn('请输入真实的详细家庭地址')
      return
    }

    //紧急联系人
    if (!validate.chineseName(params.urgentName)) {
      app.Toast.warn('请输入正确的紧急联系人')
      return
    }
    //
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
    //紧急联系手机
    if (!validate.mobile(params.urgentMobile)) {
      app.Toast.warn('请输入正确的紧急联系人手机号')
      return
    }

    //监护人身份证和本人身份证
    if (String(this.data.userInfo.certCode) == String(params.guarderCertCode)) {
      app.Toast.warn('父母/监护人身份证不能与本人身份证一致')
      return
    }
    if (params.guarderMobile == params.urgentMobile) {
      app.Toast.warn('父母/监护人手机号不能与紧急联系人手机号一致')
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

    app.Toast.showLoading()
    console.log(params)
    app.api
      .clientBaseMsg(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          wx.navigateTo({
            url: '../step3/index?loanType=' + this.data.loanType
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
