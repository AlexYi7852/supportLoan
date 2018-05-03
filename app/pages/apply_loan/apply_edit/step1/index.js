const app = getApp()
import { cityJson } from '../../../../libs/js/city'
import { validate } from '../../../../libs/js/validate'

Page({
  /* 页面数据 */
  data: {
    cityCodes: {},
    gkCityCodes: {}, //高考所在地数据代码 传给组件的

    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    loanLatestData: {}, //上一笔贷款的数据是否能贷款
    loanType: null,
    applyData: {},

    addressMenuIsShow: false,
    list: cityJson, //城市数据省市区

    houseAddrProvId: '', //家庭地址省的代码
    houseAddrCityId: '', //家庭地址市的代码
    houseAddrAreaId: '', //家庭地址区对应代码
    houseAddr: '', //家庭详细地址

    //高考所在城市
    gaoKaoProList: [],
    examProvId: '',
    examCityId: '',
    examAreaId: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    const loanType = options.loanType || 'S'
    this.setData({
      loanType: loanType
    })
  },
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.loanLatest()
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {},

  /**
   * 组件传回来的值
   */
  bindtap(e) {
    console.log(e.detail)
    let data = e.detail
    this.setData({
      houseAddrProvId: data.addrProvId,
      houseAddrCityId: data.addrCityId,
      houseAddrAreaId: data.addrAreaId
    })
  },
  /**
   * 高考省市区渲染的组件事件
   */
  gkBindtap(e) {
    console.log(e.detail)
    let data = e.detail
    this.setData({
      examProvId: data.addrProvId,
      examCityId: data.addrCityId,
      examAreaId: data.addrAreaId
    })
  },
  /* =======================输入框事件绑定=================================== */
  //家庭地址
  houseAddrInput(e) {
    this.setData({
      'applyData.houseAddr': e.detail.value
    })
  },
  //邮箱
  emailInput(e) {
    this.setData({
      'applyData.email': e.detail.value
    })
  },
  //个人qq
  QQInput(e) {
    console.log(e.detail)
    this.setData({
      'applyData.qq': e.detail.value
    })
  },
  //个人微信
  wechatInput(e) {
    this.setData({
      'applyData.wechat': e.detail.value
    })
  },
  //家庭地址省市区
  //家庭地址详细地址

  /* =======================输入框事件绑定=================================== */
  /**
   * 判断上是否存在上一笔贷款
   * 判断是否隐藏 高考所在地
   */
  loanLatest() {
    let params = {
      token: this.data.userInfo.token || 'token',
      loanType: this.data.loanType
    }
    wx.showLoading()
    app.api
      .loanLatest(params)
      .then(res => {
        if (res.code === 0) {
          this.setData({
            loanLatestData: res.data
          })
          // if (res.data.apply === true)
          this.userDetail()
          this.getGaoKaoAddressArr()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 获取用户申请信息 根据上一个接口判断能不能申请
   */
  userDetail() {
    let params = {
      token: this.data.userInfo.token || 'token'
    }
    app.api
      .userDetail(params)
      .then(res => {
        if (res.code == 0) {
          let cityCodes = {
            proCode: res.data.houseAddrProvId || '',
            cityCode: res.data.houseAddrCityId || '',
            countyCode: res.data.houseAddrAreaId || ''
          }
          let gkCityCodes = {
            proCode: res.data.examProvId || '',
            cityCode: res.data.examCityId || '',
            countyCode: res.data.examAreaId || ''
          }
          this.setData({
            cityCodes: cityCodes,
            gkCityCodes: gkCityCodes,
            applyData: res.data,
            houseAddrProvId: res.data.houseAddrProvId || '',
            houseAddrCityId: res.data.houseAddrCityId || '',
            houseAddrAreaId: res.data.houseAddrAreaId || '',
            examProvId: res.data.examProvId || '',
            examCityId: res.data.examCityId || '',
            examAreaId: res.data.examAreaId || ''
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //高考所在地查询
  getGaoKaoAddressArr() {
    let list = this.data.list
    let currentPro = this.data.loanLatestData.showProv
    let gaoKaoProList = []
    for (let i in list) {
      if (0 <= currentPro.indexOf(list[i].value)) {
        gaoKaoProList.push(list[i])
      }
    }
    this.setData({
      gaoKaoProList: gaoKaoProList
    })
  },
  //获取全国省市区地址信息
  queryArea() {
    let that = this
    app.api
      .queryArea()
      .then(res => {
        if (res.code == 0) {
          const key = this.data.value[0]
          that.setData({
            list: res.data,
            citys: res.data[key].children
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
    params.token = this.data.userInfo.token || 'token'
    params.loanType = this.data.loanType
    //家庭住址 省市区id
    params.houseAddrProvId = this.data.houseAddrProvId
    params.houseAddrCityId = this.data.houseAddrCityId
    params.houseAddrAreaId = this.data.houseAddrAreaId
    params.houseAddr = this.data.applyData.houseAddr //家庭详细地址
    params.email = this.data.applyData.email //邮箱
    params.qq = this.data.applyData.qq //QQ号码
    params.wechat = this.data.applyData.wechat //Weixin

    //判断是都需要高考所在地
    if (this.data.loanLatestData.showExam) {
      params.examProvId = this.data.examProvId
      params.examAreaId = this.data.examAreaId
      params.examCityId = this.data.examCityId
    }

    if (!params.houseAddrProvId) {
      app.Toast.warn('请选择家庭住址省市区')
      return
    }

    if (!validate.has4Chinese(params.houseAddr)) {
      app.Toast.warn('请输入家庭详细地址')
      return
    }
    if (!params.email) {
      app.Toast.warn('请输入邮箱号')
      return
    }
    if (!params.qq) {
      app.Toast.warn('请输入qq号')
      return
    }
    app.Toast.showLoading()
    app.api
      .clientBaseMsg(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success', // loading
            duration: 1500,
            mask: true
          })
          wx.navigateTo({
            url: '../step2/index?loanType=' + this.data.loanType
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
