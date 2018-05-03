//获取应用实例
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp()
var cacheCurrentChosen = {};  // 当前已选的有效的项
var size = 0;// 项的数目
Page({
  /* 页面数据 */
  data: {
    msg: app.globalData.msg,
    activeIndex: 0, //当前的选项
    sliderOffset: 0,
    sliderLeft: 0,
    list: [],
    cmd: 'settledAccountCheck',
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,

    //业务相关数据
    allOverdue: 0,//累计逾期
    allAdvance: 0,//提前还款
    allTotal: 0,//总计

    temporaryChoseItems: {},//统计
    isShowResultView: false,//是否显示统计的UI

    bankTime: "",//银行扣款时间
    time: "",//最迟还款时间
    bankName: "",
    statusType: 0, //状态：0：初始化，1：审核中，2：放款成功
    statusTips: "",//状态描述
    repayAmount: 0,//应还金额
  },
  /* 生命周期函数 */
  onLoad: function (options) {
    console.log(app.globalData.msg)
  },
  onReady: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    })
    if (this.data.userInfo.token) {
      this.queryDatas();
    } else {
      this.showErrorDialog();
    }
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  /* 内置事件绑定 */
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  /* 自定义事件绑定 */
  tabClick: function (e) {
    cacheCurrentChosen = {};
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,

      allOverdue: 0,//累计逾期
      allAdvance: 0,//提前还款
      allTotal: 0,//总计
      isShowResultView: false,
      temporaryChoseItems: {},
      bankName: this.data.list.banks[this.data.activeIndex].bankname,
    });
    this.initData();
  },

  queryDatas() {
    var that = this;
    var params = {
      token: this.data.userInfo.token,
      cmd: this.data.cmd,
    }
    app.api.settledAccountCheck(params)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          that.setData({
            list: res.data || '',
            bankTime: res.data.bankTime || '',
            time: res.data.time || '',
            statusType: res.data.statusType || '',
            statusTips: res.data.statusTips || '',
            repayAmount: res.data.repayAmount || '',
          })
          this.initData();
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                sliderLeft: (res.windowWidth / that.data.list.banks.length - sliderWidth) / 2,
                sliderOffset: res.windowWidth / that.data.list.banks.length * that.data.activeIndex
              });
            }
          });
        } else {
          that.showErrorDialog()
        }
      })
      .catch(e => {
        console.error(e)
        that.showErrorDialog()
      });
  },

  showErrorDialog() {
    wx.showModal({
      title: '提示',
      content: '暂无『还款』数据，请返回 ^_^ ',
      showCancel: false,
      success: function (res) {
        wx.navigateBack({

        })
      }
    })
  },

  initData() {
    // 初始化数组
    size = this.data.list.banks[this.data.activeIndex].bankData.length;
    if (size == 0) {
      this.showErrorDialog();
      return;
    }
    for (var i = i; i < size; i++) {
      var obj = { i: false };
      cacheCurrentChosen.assign(obj);
    }

    this.setData({
      bankName: this.data.list.banks[this.data.activeIndex].bankname || '',
    })
  },

  itemChosen: function (e) {
    var that = this;
    console.log(e.currentTarget.id);

    if (this.data.list.banks[this.data.activeIndex].bankData[e.currentTarget.id].complete == false) {
      cacheCurrentChosen[e.currentTarget.id] = !cacheCurrentChosen[e.currentTarget.id];
    }

    var cache_o = 0;
    var cache_a = 0;
    var cache_t = 0;

    for (var i = 0; i < size; i++) {
      if (cacheCurrentChosen[i]) {
        cache_o = cache_o + this.data.list.banks[this.data.activeIndex].bankData[i].overdateAmount;
        cache_a = cache_a + this.data.list.banks[this.data.activeIndex].bankData[i].delayAmount;
        cache_t = cache_o + cache_a;
      }
    }

    that.setData({
      allOverdue: cache_o,
      allAdvance: cache_a,
      allTotal: cache_t,
      isShowResultView: cache_t <= 0 ? false : true,
      temporaryChoseItems: cacheCurrentChosen,
    })

  },

  comfirmBtn: function () {
    // 用户测试伪造的数据
    var k = this.data.list.banks[this.data.activeIndex].bankData;
    var cardCodes = 55555;
    for (var i = 0; i < k.length; i++) {
      k[i].cardCode = 55555 + i;
    }

    wx.navigateTo({
      url: '../advance_pay_2/index?banks=' + JSON.stringify(k) + '&choseItems=' + JSON.stringify(this.data.temporaryChoseItems) + '&time=' + this.data.time + '&bankName=' + this.data.bankName
    })
  },

  comfirmBtnHome: function () {
    wx.switchTab({
      url: '../../index/index/index'
    })
  },

  comfirmBtnBook: function () {
    this.setData({
      statusType: 0,
    })
  },

})