const app = getApp()
import { validate } from '../../../../libs/js/validate'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    loanType: '',
    timer: null,
    sysInfo: null,
    maxAmount: 0,
    loanAmount: 1000, //学生每年贷款金额
    applyData: {}, //获取贷款申请信息
    education: null, //如果学历是预科 贷款年数只能是一年 其他为毕业年份-当前年份
    loanYear: null,
    loanYearArr: null,
    LoanPerAmount: 0,
    //银行卡相关
    needCardName: '----',
    isAddCardPop: false,
    card_code: '',
    mobile: '',
    type: 0,

    options: ['身份证', '临时身份证', '户口本'],
    BindCardInfo: null,
    userMaterialDetail: {},
    cLoanId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      loanType: options.loanType || 'J'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        this.setData({ userInfo: res.data })
        this.getSysInfo()
      }
    })
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
  changeAmount(e) {
    if (e.currentTarget.dataset.type === 'add') {
      if (this.data.loanAmount == this.data.maxAmount) {
        return
      }
      this.setData({ loanAmount: (this.data.loanAmount += 100) })
      this.getLoanPerAmount()
    }
    if (e.currentTarget.dataset.type === 'reduce') {
      //最低限制
      if (this.data.loanAmount <= 1000) {
        return
      }
      this.setData({
        loanAmount: (this.data.loanAmount -= 100)
      })
      this.getLoanPerAmount()
    }
  },
  changeAmountFast(e) {
    if (e.currentTarget.dataset.type === 'add') {
      const timer = setInterval(() => {
        if (this.data.loanAmount == this.data.maxAmount) {
          return
        }
        this.setData({
          loanAmount: (this.data.loanAmount += 100)
        })
        this.getLoanPerAmount()
      }, 100)
      this.setData({
        timer: timer
      })
    }
    if (e.currentTarget.dataset.type === 'reduce') {
      const timer = setInterval(() => {
        if (this.data.loanAmount <= 1000) {
          return
        }
        this.setData({
          loanAmount: (this.data.loanAmount -= 100)
        })
        this.getLoanPerAmount()
      }, 100)
      this.setData({
        timer: timer
      })
    }
  },
  cancleChangeAmountFast() {
    clearInterval(this.data.timer)
    this.setData({
      timer: null
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
        app.Toast.hideLoading()
        if (res.code === 0) {
          this.setData({
            applyData: res.data,
            BindCardInfo: res.data.card[0],
            //回填贷款金额、年数、总金额
            loanAmount: res.data.loanAmount,
            LoanPerAmount: res.data.loanPerAmount
          })

          this.setLoanYear()
          this.getLoanTypeAmount()
          this.getBankName()
          app.Toast.hideLoading()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 获取系统消息接口
   * 这里先获取系统消息的数据 各个学历的贷款额度 再根据userDetail 接口的学历来判断属于那种学历给出不同的额度
   */
  getSysInfo() {
    app.Toast.loading()
    app.api
      .getSysInfo()
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setData({
            sysInfo: res.data
          })
          this.userDetail()
          this.userMaterialDetail()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /** 判断贷款学年数、如果是预科 只能贷款一年、如果是其他 根据毕业时间-当前年份来计算* */
  setLoanYear() {
    //如果学历是预科只能贷款一年
    console.log(this.data.applyData.education)
    if (+this.data.applyData.education === 6) {
      this.setData({
        loanYearArr: [1],
        'applyData.loanYear': 1
      })
    } else {
      const currentYear = new Date().getFullYear()
      let arr = []
      for (
        let i = 1;
        i <= this.data.applyData.graduationYear - currentYear;
        i++
      ) {
        arr.push(i)
      }
      console.log(arr)
      this.setData({
        loanYearArr: arr,
        'applyData.loanYear': 1,
        loanYear: this.data.applyData.loanYear
          ? this.data.applyData.loanYear <= 0
            ? 0
            : this.data.applyData.loanYear - 1
          : null
      })
    }
  },
  /**
   * 贷款年数滑动
   */
  loanYearChange(e) {
    this.setData({
      loanYear: e.detail.value,
      'applyData.loanYear': +e.detail.value + 1
    })
    this.getLoanPerAmount()
  },
  /**
   * 计算贷款总金额
   * 根据贷款年限 x 每年贷款金额
   */
  getLoanPerAmount() {
    if (this.data.loanYear == null) {
      return
    }
    this.setData({
      LoanPerAmount:
        parseInt(this.data.loanAmount) * (parseInt(this.data.loanYear) + 1)
    })
  },
  /**
   * 根据学历判断最高贷款限额
   * 专科/本科/预科/预科(本)属于一类 value=2,3,6,7
   * 硕士属于一类 value=4
   * 博士属于一类 value=5
   */
  getLoanTypeAmount() {
    const education = parseInt(this.data.applyData.education)
    const sysInfo = this.data.sysInfo
    if (
      education === 2 ||
      education === 3 ||
      education === 6 ||
      education === 7
    ) {
      this.setData({
        maxAmount: +sysInfo.bachelorLimitAmount
        // LoanPerAmount: +sysInfo.bachelorLimitAmount
      })
    }
    if (education === 4) {
      this.setData({
        maxAmount: +sysInfo.masterLimitAmount
        //LoanPerAmount: +sysInfo.masterLimitAmount
      })
    }
    if (education === 5) {
      this.setData({
        maxAmount: +sysInfo.doctorLimitAmount
        //LoanPerAmount: +sysInfo.doctorLimitAmount
      })
    }
  },
  /**用户影像内容、资助中心
   * 主要用来获取经办银行、资助中心的信息地址
   */
  userMaterialDetail() {
    let params = {
      token: this.data.userInfo.token
    }
    app.api
      .userMaterialDetail(params)
      .then(res => {
        console.log(res)
        this.setData({
          userMaterialDetail: res.data
        })
        this.getBankName()
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
    //每期贷款金额
    params.loanAmount = this.data.loanAmount
    //贷款总金额
    params.loanPerAmount = String(this.data.LoanPerAmount)
    params.bankcardId = this.data.BindCardInfo.cardId
    if (!this.data.loanYear) {
      app.Toast.warn('请选择贷款年数')
      return
    }
    params.loanYear = this.data.applyData.loanYear
    if (!params.loanYear) {
      app.Toast.warn('请选择贷款年数')
      return
    }

    if (!this.data.LoanPerAmount) {
      return
    }
    if (!params.bankcardId) {
      app.Toast.alert('你还未添加银行卡，请添加银行卡')
      return
    }

    console.log(params)
    app.Toast.showLoading()
    app.api
      .clientBaseMsg(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          wx.navigateTo({
            url: '../step5/index?loantype=' + this.data.loanType
          })
          wx.showToast({
            title: '保存成功',
            icon: 'success', // loading
            duration: 1500,
            mask: true
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
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
      token: this.data.userInfo.token,
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

    // if (!validate.mobile(params.mobile)) {
    //   app.Toast.warn('请输入正确的手机号号码')
    //   return
    // }
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
          //隐藏弹出层
          that.setData({
            isAddCardPop: false,
            BindCardInfo: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 生成贷款编号
   *
   */
  generateCLoanId() {
    let params = {
      token: this.data.userInfo.token
    }
    app.api
      .generateCLoanId(params)
      .then(res => {
        console.log(res)
        this.setData({
          cLoanId: res.data.cLoanId
        })
        console.log(this.data.cLoanId)
      })
      .catch(e => {
        console.error(e)
      })
  },
  /**
   * 前往更换银行卡
   */
  linkUrl() {
    wx.navigateTo({
      url: '../../../common/change_bank_card/index?type=1'
    })
  },
  /**
   * 获取使用什么银行卡办理、
   * 校园地根据(J) 高校判断
   *  生源地(S) 根据高考地|| 户籍
   */
  getBankName() {
    let applyData = this.data.applyData
    let loanType = applyData.loanType
    switch (loanType) {
      case 'J':
        //如果是黑龙江
        if (applyData.collegeAddrProvId === '230000') {
          this.setData({ needCardName: '哈尔滨银行借记卡' })
        }

        if (applyData.collegeAddrProvId === '350000') {
          this.setData({ needCardName: '中国邮政储蓄银行借记卡' })
        }
        break
      case 'S':
        if (
          applyData.examProvId === '230000' ||
          applyData.cProvCode === '230000'
        ) {
          this.setData({ needCardName: '哈尔滨银行借记卡' })
        }

        if (
          applyData.examProvId === '350000' ||
          applyData.cProvCode === '35000'
        ) {
          this.setData({ needCardName: '中国邮政储蓄银行借记卡' })
        }
        break
      default:
        break
    }
  }
})
