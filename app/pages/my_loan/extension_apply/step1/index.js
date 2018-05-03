//获取应用实例
import { cityJson } from '../../../../libs/js/city'
import { educationData, educationList } from './education'
import { vaildate } from '../../../../libs/js/validate'
import { getCityNameByCityCode } from '../../../../utils/util'

const app = getApp()
//获取展期申请的入学年份时间 往前推3年
let year = new Date().getFullYear()
let yearArr = []
for (let i = 0; i < 5; i++) {
  yearArr.unshift(year - i)
}

Page({
  /* 页面数据 */
  data: {
    cityCodes: {},
    list: cityJson,

    applyData: null,
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,

    collegeAddrProvId: '',
    collegeAddrCityId: '',
    collegeAddrAreaId: '',
    addressMenuIsShow: false,

    year: yearArr,
    yearIndex: 0, //入学年份

    educationArr: educationData, //学历数组
    educationIndex: 0,

    schoolingArr: [], //学制数组
    schoolingIndex: null,
    schoolingPickerShow: true, //true不显示 false 显示

    collegeAddr: '', //大学地址

    enrollmentYear: '',
    education: null,
    graduationYear: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.extensionData)
    let applyData = app.globalData.extensionData || null
    this.setData({ applyData: applyData })
    if (!this.data.applyData) {
      console.log('重新抓取数据')
      this.getExtensionData()
    } else {
      this.renderingSelect()
    }
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
  bindtap(e) {
    let data = e.detail
    this.clearCollege()
    console.log(e.detail)
    this.setData({
      collegeAddrProvId: data.addrProvId,
      collegeAddrCityId: data.addrCityId,
      collegeAddrAreaId: data.addrAreaId
    })
  },
  //数据反选方法
  renderingSelect() {
    //渲染入学日期
    let enrollmentYear = this.data.applyData.enrollmentYear
    if (enrollmentYear) {
      let year = this.data.year
      for (let i in year) {
        if (enrollmentYear == year[i]) {
          this.setData({ yearIndex: i })
        }
      }
    }
    //渲染学历
    let education = this.data.applyData.education
    if (education) {
      console.log(education)
      let educationIndex = educationData.findIndex(function(v, index) {
        if (v.value == education) {
          console.log(index)
          return index
        }
      })
      console.log(educationIndex)
      if (educationIndex > 0) {
        this.setData({
          educationIndex: educationIndex
        })
      }
    }

    //学制数据渲染
    let schooling = this.data.applyData.schooling
    if (schooling) {
      let schoolingIndex = educationList[education].findIndex(function(
        v,
        index
      ) {
        return v.value == schooling
      })
      this.setData({
        schoolingIndex: schoolingIndex,
        schoolingPickerShow: false,
        schoolingArr: educationList[education]
      })
    }
    //省市区反选

    let cityCodes = {
      proCode: this.data.applyData.collegeAddrProvId,
      cityCode: this.data.applyData.collegeAddrCityId,
      countyCode: this.data.applyData.collegeAddrAreaId
    }
    //城市数据反选
    this.setData({
      cityCodes: cityCodes,
      collegeAddrProvId: this.data.applyData.collegeAddrProvId,
      collegeAddrCityId: this.data.applyData.collegeAddrCityId,
      collegeAddrAreaId: this.data.applyData.collegeAddrAreaId
    })
  },
  /**
   * 获取展期数据
   */
  getExtensionData() {
    wx.showLoading()
    let params = {
      cmd: 'defferLoanCheck',
      token: this.data.userInfo.token
    }
    app.api
      .interfaceApi(params)
      .then(res => {
        wx.hideLoading()
        if (res.code === 0) {
          console.log(res)
          //将展期申请数据设置全局
          app.globalData.applyData = res.data
          console.log(JSON.stringify(res.data))
          this.setData({
            applyData: res.data
          })
          //数据反选
          this.renderingSelect()
        }
      })
      .catch(err => {
        wx.hideLoading()
      })
  },
  /**
   * 入学年份
   * 滑动年份时候初始化 学历 学制 毕业年份 输入框数据
   */
  enrollmentYeahPicker(e) {
    this.setData({
      yearIndex: e.detail.value,
      'applyData.enrollmentYear': this.data.year[e.detail.value],
      educationIndex: 0,
      schoolingArr: [],
      schoolingIndex: null,
      schoolingPickerShow: true, //不允许学制picker 下拉
      'applyData.graduationYear': '' //清空毕业年份
    })
  },
  /**
   * 攻读学历
   */
  educationPicker(e) {
    console.log(e.detail.value, this.data.educationArr[e.detail.value].value)
    this.getSchooling(this.data.educationArr[e.detail.value].value)
    this.setData({
      educationIndex: e.detail.value,
      'applyData.education': this.data.educationArr[e.detail.value].value
    })
  },
  alertError() {
    if (this.data.schoolingPickerShow) {
      app.Toast.warn('请先选择攻读学历')
    }
  },
  /**
   * 根据攻读学历获取学制显示的数组
   */
  getSchooling(value) {
    this.setData({
      schoolingArr: educationList[value],
      schoolingIndex: 0,
      schoolingPickerShow: false,
      'applyData.enrollmentYear': this.data.year[this.data.yearIndex],
      'applyData.schooling': educationList[value][0].value,
      'applyData.graduationYear':
        educationList[value][0].value + this.data.year[this.data.yearIndex]
    })
    console.log(
      educationList[value][0].value,
      this.data.year[this.data.yearIndex]
    ) //输出学制
  },
  /**
   * 学制
   */
  schoolingPicker(e) {
    this.setData({
      schoolingIndex: e.detail.value,
      'applyData.schooling': this.data.schoolingArr[e.detail.value].value
    })
    this.graduationYear()
  },
  /**
   * 毕业时间计算
   * 毕业时间=入学时间+学制
   */
  graduationYear() {
    this.setData({
      'applyData.graduationYear':
        parseInt(this.data.applyData.enrollmentYear) +
        parseInt(this.data.applyData.schooling)
    })
    console.log('毕业时间:' + this.data.applyData.graduationYear)
  },

  /**
   * 学院输入
   */
  academyInput(e) {
    console.log(e)
    this.setData({
      'applyData.academy': e.detail.value
    })
  },
  /**
   * 专业输入
   */
  professionInput(e) {
    this.setData({
      'applyData.profession': e.detail.value
    })
  },

  openCollegeMenu() {
    this.setData({
      addressMenuIsShow: true
    })
  },
  /**
   * 查询高校
   */
  linkQueryCollege() {
    if (!this.data.collegeAddrProvId) {
      app.Toast.warn('请选择高校省市区')
      return
    }
    const cityCode = this.data.collegeAddrCityId
    const provCode = this.data.collegeAddrProvId
    const loanType = this.data.loanType
    if (!provCode) {
      app.Toast.warn('请选择高校地址')
      return
    }
    wx.navigateTo({
      url:
        '../../../common/query_college/index?cityCode=' +
        cityCode +
        '&provCode=' +
        provCode +
        '&loantype=' +
        this.data.applyData.loanType
    })
  },
  /**
   * 如果高校地址变了大学信息情况
   */
  clearCollege() {
    this.setData({
      'applyData.college': '',
      'applyData.collegeAddr': '',
      'applyData.collegeCode': ''
    })
  },

  /**
   * 保存数据并且下一步
   */
  nextStep() {
    let params = { cmd: 'defferLoanMsg', token: this.data.userInfo.token }
    params.graduationYear = this.data.applyData.graduationYear
    params.education = this.data.applyData.education
    params.enrollmentYear = this.data.applyData.enrollmentYear
    params.schooling = this.data.applyData.schooling

    params.collegeAddrProvId = this.data.collegeAddrProvId
    params.collegeAddrCityId = this.data.collegeAddrCityId
    params.collegeAddrAreaId = this.data.collegeAddrAreaId

    params.collegeAddr = this.data.applyData.collegeAddr //大学地址
    params.collegeCode = this.data.applyData.collegeCode //大学代码
    params.college = this.data.applyData.college // 大学名称
    params.academy = this.data.applyData.academy
    params.profession = this.data.applyData.profession

    if (!params.college) {
      app.Toast.warn('请选择高校')
      return
    }

    if (!params.academy) {
      app.Toast.warn('请填写学院名称')
      return
    }
    if (!params.profession) {
      app.Toast.warn('请填写专业')
      return
    }

    if (!params.education) {
      app.Toast.warn('请选择学历')
      return
    }

    if (!params.schooling) {
      app.Toast.warn('请选择专业')
      return
    }
    console.log(params)
    app.api
      .interfaceApi(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.navigateTo({
            url: '../step2/index'
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
