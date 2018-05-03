import { educationData1, educationData2, educationList } from './education'
import { cityJson } from '../../../../libs/js/city'
/*educationData 攻读学历 当选择是当前年份的时候  学历数组里面没有 预科  和预科本 */
//获取展期申请的入学年份时间
let currentYear = new Date().getFullYear()
let yearArr = []
for (let i = 0; i < 6; i++) {
  yearArr.unshift(currentYear - i)
}
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cityCodes: {},
    ProList: {}, //过滤后的省市区数组
    list: cityJson,

    loanType: 'S',
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    collegeDetail: '', //学校数据从上一个页面过来的
    loanLatestData: {},
    applyData: {},
    collegeAddrProvId: '',
    collegeAddrCityId: '',
    collegeAddrAreaId: '',

    addressMenuIsShow: false,
    year: yearArr,
    yearIndex: 5, //入学年份索引

    //攻读学历
    educationData: educationData1,
    educationIndex: 0,

    //学制
    schoolingArr: [], //学制
    schoolingIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loanType: options.loanType
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo
    })
    this.loanLatest()
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

  //数据反选方法  //数据反选方法
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
    //入学年份是当前年份 则有预科
    if (this.data.applyData.enrollmentYear == currentYear) {
      var educationData = educationData1
      this.setData({ educationData: educationData1 })
    } else {
      var educationData = educationData2
      this.setData({ educationData: educationData2 }) //如果不是2018年没有 预科
    }

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
        schoolingArr: educationList[education]
      })
    }
  },

  /**
   * 判断上一笔贷款
   * 判断是否隐藏 高考所在地
   */
  loanLatest() {
    let params = {
      token: this.data.userInfo.token || 'token',
      loanType: this.data.loanType
    }
    let that = this
    app.api
      .loanLatest(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          that.setData({
            loanLatestData: res.data
          })
          //if (res.data.apply === true) {}
          that.getCollegeAddressArr()
          that.userDetail()
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
        console.log(res)
        app.Toast.hideLoading()
        if (res.code === 0) {
          let cityCodes = {
            proCode: res.data.collegeAddrProvId ||"230000",
            cityCode: res.data.collegeAddrCityId || "230100",
            countyCode: res.data.collegeAddrAreaId || "230101",
            loanType: res.data.loanType
          }
          this.setData({
            cityCodes: cityCodes,
            applyData: res.data,
            collegeAddrProvId: res.data.collegeAddrProvId || '',
            collegeAddrCityId: res.data.collegeAddrCityId || '',
            collegeAddrAreaId: res.data.collegeAddrAreaId || ''
          })
          console.log(this.data.cityCodes, 'this.data.cityCodes')
          this.renderingSelect()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 获取全国省市区地址信息
   */
  queryArea() {
    app.Toast.showLoading('数据加载中')
    app.api
      .queryArea()
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setData({
            list: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 根据后台返回获取高校所在地的省市区数组
   */
  getCollegeAddressArr() {
    let list = this.data.list
    //获取省市区的地址的字符串
    let currentPro = this.data.loanLatestData.hasSchoolProv
    console.log(currentPro)
    let ProList = []
    for (let i in list) {
      if (0 <= currentPro.indexOf(list[i].value)) {
        ProList.push(list[i])
      }
    }
    this.setData({
      list: ProList,
      ProList: ProList
    })
  },
  /**
   * 入学年份
   * 滑动年份时候初始化 学历 学制 毕业年份 输入框数据
   */
  enrollmentYeahPicker(e) {
    if (parseInt(this.data.year[e.detail.value]) == parseInt(currentYear)) {
      this.setData({ educationData: educationData1 })
    } else {
      this.setData({ educationData: educationData2 })
    }
    console.log(typeof this.data.year[e.detail.value])
    this.setData({
      yearIndex: e.detail.value,
      'applyData.enrollmentYear': this.data.year[e.detail.value],
      educationIndex: 0,
      schoolingArr: [],
      schoolingIndex: null,
      educationPickerShow: true, //不允许学制picker 下拉
      'applyData.graduationYear': '' //清空毕业年份
    })
  },
  /**
   * 攻读学历
   */
  educationPicker(e) {
    this.getSchooling(this.data.educationData[e.detail.value].value)
    this.setData({
      educationIndex: e.detail.value,
      'applyData.education': this.data.educationData[e.detail.value].value
    })
    this.graduationYear()
  },
  alertError() {
    app.Toast.warn('请先选择攻读学历')
  },
  /**
   * 根据攻读学历获取学制显示的数组
   */
  getSchooling(value) {
    this.setData({
      schoolingArr: educationList[value],
      schoolingIndex: 0,
      educationPickerShow: false,
      'applyData.enrollmentYear': this.data.year[this.data.yearIndex],
      'applyData.schooling': educationList[value][0].value,
      'applyDatag.raduationYear':
        educationList[value][0].value + this.data.year[this.data.yearIndex]
    })
    console.log(
      educationList[value][0].value,
      this.data.year[this.data.yearIndex]
    ) //输出学制
  },
  graduationYear() {
    //毕业时间=入学时间+学制
    this.setData({
      'applyData.graduationYear':
        +this.data.applyData.enrollmentYear + +this.data.applyData.schooling
    })
  },
  /**
   * 学制
   */
  schoolingArrPicker(e) {
    console.log('选择学历')
    console.log(e)
    this.setData({
      schoolingIndex: e.detail.value,
      'applyData.schooling': this.data.schoolingArr[e.detail.value].value
    })
    this.graduationYear()
  },
  /**
   *学院名称
   */
  academyInput(e) {
    this.setData({
      'applyData.academy': e.detail.value
    })
  },
  /**
   * 专业
   */
  professionInput(e) {
    this.setData({
      'applyData.profession': e.detail.value
    })
  },
  /**
   * 学生学号 */
  stuNumberInput(e) {
    this.setData({
      'applyData.stuNumber': e.detail.value
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
        loanType
    })
  },
  /**
   * 下一步数据 先提交当前内容
   */
  nextStep() {
    let params = {}
    params.token = this.data.userInfo.token
    //生源地校园地贷款
    params.loanType = this.data.loanType
    //高校省市区
    params.collegeAddrAreaId = this.data.collegeAddrAreaId
    params.collegeAddrCityId = this.data.collegeAddrCityId
    params.collegeAddrProvId = this.data.collegeAddrProvId
    params.academy = this.data.applyData.academy //所属院校名称
    params.profession = this.data.applyData.profession //专业
    params.education = this.data.applyData.education //学历
    params.schooling = this.data.applyData.schooling //学制
    params.stuNumber = this.data.applyData.stuNumber //学号
    params.enrollmentYear = this.data.year[this.data.yearIndex] //入学年份
    params.collegeAddr = this.data.applyData.collegeAddr //大学地址
    params.collegeCode = this.data.applyData.collegeCode //大学代码
    params.college = this.data.applyData.college //
    params.graduationYear = this.data.applyData.graduationYear
    console.log(params)

    if (!params.collegeCode) {
      app.Toast.warn('请选择高校地址及高校名称')
      return
    }
    if (!params.education) {
      app.Toast.warn('请选择学历')
      return
    }
    if (!params.schooling) {
      app.Toast.warn('请选择学制')
      return
    }

    if (!params.enrollmentYear) {
      app.Toast.warn('请选择入学时间')
      return
    }

    if (parseInt(params.graduationYear) <= parseInt(currentYear)) {
      app.Toast.warn('你已毕业了、不能申请贷款')
      return
    }

    if (!params.academy) {
      app.Toast.warn('请填写学院名称')
      return
    }

    if (!params.profession) {
      app.Toast.warn('请填写你的专业')
      return
    }
    //校验毕业年份
    //毕业时间

    if (!params.graduationYear) {
      app.Toast.warn('请选择学制')
      return
    }
    /**如果入学年份不是当前年份 学号必填 */
    if (params.enrollmentYear != currentYear && !params.stuNumber) {
      app.Toast.warn('请填写你的学号')
      return
    }

    console.log(params)
    app.Toast.showLoading()
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
            url: '../step4/index?loanType=' + this.data.loanType
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
