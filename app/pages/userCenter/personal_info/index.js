//获取应用实例
const app = getApp()
import { validate } from '../../../libs/js/validate'

Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo') || app.globalData.userInfo,
    hiddenmodalput: true,
    type: '',
    content: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
  },
  onReady: function() {
    wx.getStorage({
      key: 'userInfo',
      success: res => {
        this.setData({
          userInfo: res.data || wx.getStorageSync('userInfo')
        })
      }
    })
  },
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  /* 内置事件绑定 */
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  /* 自定义事件绑定 */
  //点击按钮痰喘指定的hiddenmodalput弹出框
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function() {
    this.setData({
      hiddenmodalput: true
    })
  },
  //确认
  confirm: function() {
    this.modifyCommunication()
  },
  modifyCommunication() {
    let params = {
      token: this.data.userInfo.token || 'token',
      content: this.data.content,
      type: this.data.type
    }
    const that = this

    //验证QQ号码 是否正确
    if (this.data.type == 3 && !validate.qq(this.data.content)) {
      app.Toast.warn('请输入正确的QQ号码')
      return
    }

    if (this.data.type == 1 && !validate.email(this.data.content)) {
      app.Toast.warn('请输入正确邮箱号')
      return
    }

    if (this.data.type == 2 && !validate.wechat(this.data.content)) {
      app.Toast.warn('请输入正确微信号')
      return
    }

    this.setData({
      hiddenmodalput: true
    })
    app.api
      .modifyCommunication(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          app.Toast.success('修改成功')
          this.updateUserInfo(that.data.type)
          this.setData({
            content: ''
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  showModel(e) {
    this.setData({
      hiddenmodalput: false,
      type: e.currentTarget.dataset.type,
      content: ''
    })
  },
  //输入修改值
  contentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  updateUserInfo(type) {
    switch (+type) {
      case 1:
        this.setData({
          'userInfo.email': this.data.content
        })
        wx.setStorage({
          key: 'userInfo',
          data: this.data.userInfo
        })
        break
      case 2:
        this.setData({
          'userInfo.wechat': this.data.content
        })
        wx.setStorage({
          key: 'userInfo',
          data: this.data.userInfo
        })
        break
      case 3:
        this.setData({
          'userInfo.qq': this.data.content
        })
        wx.setStorage({
          key: 'userInfo',
          data: this.data.userInfo
        })
        break
      default:
        break
    }
  }
})
