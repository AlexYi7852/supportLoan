//获取应用实例
const app = getApp()
const FACE = require('../../../utils/faceid.api')
var cameraContext = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVideoDone: false,
    btnTxt: "开始",
    random_number: "",
    viewSrc: "",
    countDown: "",
    userInfo: "",
    face_type: "1", // 人脸识别来的类型 1、修改密码 2、修改手机号 3、贷款 4、 实名认证验证手机号
    time: 5,
    timeShow: false,
    clock: null,
    mobile: wx.getStorageSync('userInfo').mobile,
    userInfo: wx.getStorageSync('userInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSettingAuth()
    console.log(options)
    this.setData({
      random_number: options.random_number,
      token_random_number: options.token_random_number,
      face_type: options.face_type || 1
    })
    if (options.face_type == 2) {
      this.setData({
        mobile: wx.getStorageSync('userInfo').mobile,
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (wx.createCameraContext()) {
      this.cameraContext = wx.createCameraContext('myCamera')
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    let userInfo = wx.getStorageSync("userInfo") || {}
    this.setData({
      userInfo: userInfo,
      mobile: userInfo.mobile,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showModal({
      title: '使用说明',
      content: '请保证网络畅通，点击开始按钮进行人脸识别',
      showCancel: false,
      confirmText: "准备好了"

    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  countDown() {
    let that = this
    var interval = setInterval(function () {
      if (that.data.time == 0) {
        clearInterval(interval);
        that.setData({
          btnTxt: "正在识别",
        })
        that.finishRecord()
      } else {
        that.setData({
          time: that.data.time - 1
        })
      }
    }, 1000);
  },
  takeRecord() {
    var that = this
    that.setData({
      isVideoDone: false,
      btnTxt: "正在录像",
      time: 5
    })
    if (cameraContext == null) {
      cameraContext = wx.createCameraContext(this);
    }
    cameraContext.startRecord({
      success: res => {
        this.countDown()
      }
    })
  },
  //结束拍摄API 并且执行上传接口
  finishRecord: function () {
    var that = this
    cameraContext.stopRecord({
      success: function (res) {
        console.log(res)
        that.setData({
          viewSrc: res.tempVideoPath,
          isVideoDone: true,
        })
        console.log(res.tempVideoPath)
        wx.getFileInfo({
          filePath: res.tempVideoPath,
          success(res) {
            console.log(res.size/1000)
          }
        })
        that.rawValidateVideo(res.tempVideoPath)
      },
      fail: function (e) {
        that.setData({
          isVideoDone: false,
        })
      },
      complete: function (res) {
        cameraContext = null;
      },
    })
  },

  //语音识别活体验证
  rawValidateVideo(path) {
    let that = this;
    FACE(path, {
      token_random_number: this.data.token_random_number
      })
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          this.videoRawVerify(res.token_video)
        } else {
          wx.showModal({
            title: "错误信息",
            content: res.message,
            showCancel: false,
            success: function () {
              wx.redirectTo({
                url: '../face_1/index?face_type=' + that.data.face_type
              })
            }
          });
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  //语音识别活体结果验证、人脸比对、攻击判断等
  videoRawVerify(tokenVideo) {
    let that = this;
    let params = {
      certCode: this.data.userInfo.certCode,
      username: this.data.userInfo.userName || this.data.userInfo.username,
      tokenVideo: tokenVideo
    }
    wx.request({
      url: `${app.domain}/external/videoRawVerify`,
      data: params ,
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          console.log("人脸识别OK")
          wx.showToast({
            title: '验证通过成功',
            icon: 'success', // loading
            duration: 1000,
            mask: true
          })
          setTimeout(() => {
            that.faceSuccessLink();
            console.log("人脸识别OK")
          }, 1000);
        } else {
          console.log(res);
          wx.showModal({
            title: '',
            content: res.data.message,
            success: function (res) {
              wx.redirectTo({
                url: '../face_2/index?face_type=' + that.data.face_type,
              })
            }
          })
        }
      },
      fail: function () {
        wx.showModal({
          title: '',
          content: "识别失败",
          success: function (res) {
            wx.redirectTo({
              url: '../face_2/index?face_type=' + that.data.face_type,
            })
          }
        })
      },
      complete: function () {
        // complete
      }
    })
  },
  //人脸识别之后跳转 1、修改密码 2、修改手机 3、贷款
  faceSuccessLink() {
    const face_type = this.data.face_type;
    const mobile = this.data.mobile
    console.log(mobile, face_type)
    switch (+face_type) {
      case 1: //修改密码
        wx.redirectTo({
          url: '../forget_password/forget_password_1/index',
        })
        break;
      case 2: //修改手机号
        wx.redirectTo({
          url: '../../userCenter/change_phone_2/index?mobile=' + mobile,
        })
        break;
      case 4: //实名认证验证绑定手机号
        wx.redirectTo({
          url: '../../login_regist/real_name_check_2/index?mobile='+"" ,
        })
        break;
      default:
        break;
    }
  },
  getSettingAuth() {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {

            },
            fail() {
              wx.showModal({
                title: '是否授权使用摄像头',
                content: '需要获取您的摄像头的权限，请确认授权，否则将无法申请',
                success: res => {
                  if (res.cancel) {
                    console.info("摄像头授权失败");
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        console.log(data);
                        if (data.authSetting["scope.record"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 2000
                          })
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }
})