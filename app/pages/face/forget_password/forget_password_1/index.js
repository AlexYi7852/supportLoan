//获取应用实例
import { getSms } from '../../../../utils/util'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    mobile: '',
    certCode: '',
    last_time: '60', //剩余时间
    is_show: true //显示验证码倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  /* 自定义事件绑定 */
  newMobileInput(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInput(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //校验这个身份证是否已经注册/如果是已经注册不能发验证码
  checkAccount() {
    let that = this
    if (this.data.mobile.length != 11) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      })
      return false
    }

    app.api
      .checkAccount({
        mobile: this.data.mobile
      })
      .then(res => {
        console.log(res)
        //如果数据库不存在才不能发验证码
        if (res.data.exist == false) {
          this.sendMsgCode()
        } else {
          wx.showModal({
            content: res.message,
            showCancel: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //发送验证码
  sendMsgCode() {
    var that = this
    app.api
      .sendCode({
        mobile: this.data.mobile
      })
      .then(res => {
        if (res.code == 0) {
          getSms.settime(that)
          // 将获取验证码按钮隐藏60s，60s后再次显示
          that.setData({
            is_show: !that.data.is_show //false
          })
        } else {
          wx.showModal({
            content: res.message,
            showCancel: false
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //下一步前往设置密码
  confirm() {
    let params = {
      mobile: this.data.mobile,
      code: this.data.code
    }
    if (params.mobile.length != 11) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      })
      return false
    }
    if (params.code.length != 4) {
      wx.showModal({
        content: '请输入4位数验证码',
        showCancel: false
      })
      return false
    }
    app.api
      .checkMobileCode(params)
      .then(res => {
        if (res.code == 0) {
          console.log(111)
          wx.navigateTo({
            url: `../forget_password_2/index?newMobile=${params.mobile}`
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  }
})
