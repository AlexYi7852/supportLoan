//获取应用实例
const app = getApp()
var objects = [];
var returnDatas = [];
var cmd = 'settledAccount';
//var token = 'a82d6ef754b54564a3ffbc3ec942566dl1kpk6';
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    banks: {},
    choseItems: {},
    bankName: "哈尔滨银行",
    cardCode: "1236 **** **** 4567",
    debt: 0,
    msg: app.globalData.msg,
    time: "",
    bankName: "",
    uiObjects: [],
  },
  /* 生命周期函数 */
  onLoad: function (options) {
    this.setData({
      banks: JSON.parse(options.banks),
      choseItems: JSON.parse(options.choseItems),
      time: options.time,
      bankName: options.bankName,
    })
    console.log("banks : " + JSON.stringify(this.data.banks));
    console.log("choseItems : " + JSON.stringify(this.data.choseItems));

    var size = this.data.banks.length;
    var valueSize = 0;//选择的笔数
    for (var i = 0; i < size; i++) {
      if (this.data.choseItems[i]) {
        valueSize++;
        returnDatas.push(this.data.banks[i]);
      }
    }
    console.log("valueSize: " + valueSize);
    console.log("returnDatas : " + JSON.stringify(returnDatas));
    var bank = [];
    for (var i = 0; i < valueSize; i++) {
      var obj = this.data.banks[i].cardCode;
      bank.push(obj);
    }

    console.log("bank: " + JSON.stringify(bank));

    var uniqueBank = this.unique(bank);
    console.log("uniqueBank: " + JSON.stringify(uniqueBank));
    var s = uniqueBank.length;
    console.log("s: " + s);
    for (var i = 0; i < s; i++) {
      var obj = { bankName: "", cardCode: "", debt: 0, date: "" };
      objects.push(obj);
    }

    console.log("objects: " + JSON.stringify(objects));

    for (var j = 0; j < s; j++) {
      for (var i = 0; i < size; i++) {
        if (uniqueBank[j] == this.data.banks[i].cardCode) {
          objects[j].cardCode = this.data.banks[i].cardCode;
          objects[j].bankName = this.data.bankName;
          objects[j].debt = objects[j].debt + this.data.banks[i].delayAmount
            + this.data.banks[i].overdateAmount + this.data.banks[i].payAmount;
        }
      }
    }

    console.log("objects: " + JSON.stringify(objects));

    this.setData({
      uiObjects: objects,
    })

  },
  onReady: function () {

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
  confirmBtn: function () {
    var that = this;
    var params = {
      token: this.data.userInfo.token,
      cmd: cmd,
      param: JSON.stringify(returnDatas),
    }
    app.api.settledAccountCheck(params)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          wx.showModal({
            title: '预约成功',
            content: '期间请保证余额充足。',
            showCancel: false,
            confirmText: '返回首页',
            success: function (res) {
              wx.switchTab({
                url: '../../index/index/index'
              })
            }
          })
        } else {
          app.Toast.warn('网络不好，请稍后再试')
        }
      })
      .catch(e => {
        console.error(e)
        app.Toast.warn('网络不好，请稍后再试')
      });
  },

  unique: function (arr) {
    var tmp = new Array();
    for (var m in arr) {
      tmp[arr[m]] = 1;
    }
    //再把键和值的位置再次调换
    var tmparr = new Array();
    for (var n in tmp) {
      tmparr.push(n);
    }
    return tmparr;
  },


})