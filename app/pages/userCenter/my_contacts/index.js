//获取应用实例
const app = getApp()
import { checkID } from '../../../libs/js/idCard'
import { validate } from '../../../libs/js/validate'
import {
  relationshipData1,
  relationshipData2
} from '../../../libs/js/relationship'
Page({
  /* 页面数据 */
  data: {
    isEditable: false,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    token: '',
    list: {},
    editData: {}, //原始的用于存载修改的原始数据对象
    relationshipData1: relationshipData1,
    relationshipData2: relationshipData2,
    index: 0, //监护人索引
    index1: 0 //紧急联系人索引
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    this.setData({
      token: options.token
    })
  },
  onReady: function() {
    app.Toast.showLoading()
    this.queryContactor()
  },
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  enterEditState() {
    this.setData({
      isEditable: true
    })
  },

  //查询我的联系人
  queryContactor() {
    let params = {
      token: this.data.token || 'token'
    }
    var that = this
    app.api
      .queryContactor(params)
      .then(res => {
        app.Toast.hideLoading()
        that.setData({
          list: res.data,
          editData: res.data,
          index: that.getRelationShipIndex(res.data.guarderRelation) || 0,
          index1: that.getRelationShipIndex2(res.data.urgentRelation) || 0
        })
      })
      .catch(e => {
        console.error(e)
      })
  },
  //获取父母亲属关系的缩索引
  getRelationShipIndex(value = 601010) {
    for (var i = 0; i <= 3; i++) {
      if (value == relationshipData1[i]['value']) {
        return i
      }
    }
  },
  //获取紧急联系人关系索引
  getRelationShipIndex2(value = 601018) {
    for (var i = 0; i <= 3; i++) {
      if (value == relationshipData2[i]['value']) {
        return i
      }
    }
  },
  //修改联系人  保存编辑信息 */
  editContactor() {
    let that = this
    let params = this.data.editData
    params['token'] = this.data.token || 'token'
    console.log(params)

    if (!validate.chineseName(params.guarderName)) {
      app.Toast.warn('请输入正确的父母/监护人姓名')
      return
    }

    //监护人身份证校验
    if (!validate.idCard(params.guarderCertCode)) {
      app.Toast.warn('父母/监护人身份证证件号有误')
      return
    }

    //选择监护人关系
    if (!params.guarderRelation) {
      params.guarderRelation = relationshipData1[0]['value']
    }

    //监护人联系手机
    if (!validate.mobile(params.guarderMobile)) {
      app.Toast.warn('请输入正确的父母/监护人手机号')
      return
    }

    //紧急联系人
    if (!validate.chineseName(params.urgentName)) {
      app.Toast.warn('请输入正确的紧急联系人')
      return
    }

    //紧急联系人关系
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
      return false
    }

    if (params.guarderName == params.urgentName) {
      app.Toast.warn('父母/监护人姓名与紧急联系人不能相同')
      return
    }

    if (params.guarderMobile == params.urgentMobile) {
      app.Toast.warn('父母/监护人手机号不能与紧急联系人手机号一致')
      return false
    }

    if (
      validate.compareAge(
        params.guarderCertCode,
        this.data.userInfo.certCode
      ) == false
    ) {
      //比较年龄 参数1 监护人年龄 参数二 申请人的年纪
      app.Toast.warn('父母/监护人年龄不能小于申请人年龄')
      return
    }
    app.api
      .editContactor(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          app.Toast.success('修改成功')
          that.setData({
            list: that.data.editData,
            editData: that.data.editData,
            isEditable: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },

  /* 取消编辑信息 */
  cancleEditContent() {
    this.setData({
      isEditable: false
    })
  },
  /**=======表单键值输入事件集合========== */

  //父母的姓名
  guarderNameInput(e) {
    this.setData({
      'editData.guarderName': e.detail.value
    })
  },
  //父母身份证
  guarderCertCodeInput(e) {
    this.setData({
      'editData.guarderCertCode': e.detail.value
    })
  },
  //选择监护人关系
  bindGuarderRelation(e) {
    console.log(e.detail)
    this.setData({
      index: e.detail.value,
      'editData.guarderRelation': relationshipData1[e.detail.value]['value']
    })
  },
  //监护人手机号码
  guarderMobileInput(e) {
    this.setData({
      'editData.guarderMobile': e.detail.value
    })
  },
  /* ===紧急联系人=== */
  urgentName: function(e) {
    this.setData({
      'editData.urgentName': e.detail.value
    })
  },
  //选择紧急人关系
  urgentRelation(e) {
    console.log('选择紧急联系人')
    console.log(e.detail)
    this.setData({
      index1: e.detail.value,
      'editData.urgentRelation': relationshipData2[e.detail.value]['value']
    })
  },
  urgentMobile(e) {
    console.log(e)
    this.setData({
      'editData.urgentMobile': e.detail.value
    })
  }
})
