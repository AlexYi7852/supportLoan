const app = getApp()
const IDCARDOCR = require('../../../utils/idcard_ocr')
import { checkID } from '../../../libs/js/idCard'
Page({
  /* 页面数据 */
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    front: '', //身份证本地临时地址正面
    back: '', //反面
    idCardInfo: {},
    idCardInfoBack: {},
    areaCounty: {},

    list: [],
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: '',
    provName: '',
    cityName: '',
    countyName: '',
    provCode: '',
    cityCode: '',
    countyCode: ''
  },
  /* 生命周期函数 */
  onLoad: function(options) {
    console.log(app.globalData.msg)
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
  //选择身份证正面
  uploadFrontOcr: function() {
    var that = this
    //第一个回调设置临时图片，第二个回调设置上传成功回调
    IDCARDOCR.getCertInfoByImage(
      function(res) {
        console.log(res)
        that.setData({
          front: res[0] //身份证临时照片
        })

        that.imgFrontUpload(res, 'SFZZM')
      },
      function(res) {
        if (res.data.id_card_number && res.data.id_card_number.length === 18) {
          console.log(res)
          that.setData({
            idCardInfo: res.data //扫描的身份证正面信息
          })
          that.queryAreaCounty()
          that.checkAccount()
        } else {
          wx.hideLoading()
          wx.showModal({
            content: '请上传正确的身份证正面照片',
            showCancel: false
          })
        }
      }
    )
  },
  //选择身份证反面
  uploadBackOcr: function() {
    if (!this.data.idCardInfo.id_card_number) {
      wx.showModal({
        content: '请先上传身份证正面',
        showCancel: false
      })
      return false
    }
    var that = this
    //第一个回调设置临时图片，第二个回调设置上传成功回调
    IDCARDOCR.getCertInfoByImage(
      function(res) {
        console.log(res)
        that.setData({
          back: res[0] //身份证临时照片
        })
        that.imgBackUpload(res, 'SFZFM')
      },
      function(res) {
        console.log(res)
        that.setData({
          idCardInfoBack: res.data //扫描的身份证反面信息
        })
      }
    )
  },
  //检测账号是否是已存在的账号
  checkAccount() {
    let params = {
      certCode: this.data.idCardInfo.id_card_number
    }
    console.log(this.data.userInfo.certCode)
    console.log(params)
    if (!params.id_card_number) {
      return false
    }
    if (params.id_card_number !== this.data.userInfo.certCode) {
      console.log('上传的身份证与登录的身份证号不一致')
      return false
    }
    app.api
      .checkAccount(params)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          console.log('检查身份证')
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //查询户籍信息地址
  queryAreaCounty() {
    let params = {
      certCode: this.data.idCardInfo.id_card_number
    }
    app.api
      .queryAreaCounty(params)
      .then(res => {
        console.log(res.data)
        if (res.code === 0) {
          console.log('获取户籍省市区地址')
          this.setData({
            areaCounty: res.data
          })
        }
      })
      .catch(e => {
        console.error(e)
      })
  },

  //下一步之后缓2秒,这里是为防止身份证还么上传成功就提交了
  saveByCertification1() {
    app.Toast.loading()
    setTimeout(() => {
      this.saveByCertification()
    }, 2000)
  },

  //身份证认证保存信息
  saveByCertification() {
    let params = {
      certAddress: this.data.idCardInfo.address, //地址
      certBack: this.data.back, //正面身份证
      certFront: this.data.front, //身份证背面
      certCode: this.data.idCardInfo.id_card_number,
      cityCode: this.data.cityCode, //市区代码
      countyCode: this.data.countyCode, //县区代码
      provCode: this.data.provCode, //省份代码
      token: this.data.userInfo.token || 'token',
      userName: this.data.idCardInfo.name,
      nation: this.data.idCardInfo.race
    }
    if (!params.certFront || !params.certCode) {
      app.Toast.warn('请上传正确的身份证正面')
      return
    }
    if (params.certFront.indexOf('http') < 0) {
      app.Toast.warn('请重新上传身份证正面')
      return
    }
    //赋值身份证到期时间截取
    if (this.data.idCardInfoBack.valid_date) {
      params.certValidate = this.data.idCardInfoBack.valid_date
        .split('-')[1]
        .replace(/\./g, '') //身份证有效期
    } else {
      app.Toast.warn('请上传正确的身份证反面')
      return
    }
    if (params.certBack.indexOf('http') < 0) {
      app.Toast.warn('请确认是否上传身份证反面')
      return
    }

    if (!params.certFront) {
      return
    }

    if (!checkID(params.certCode)) {
      app.Toast.warn('身份证证件号有误')
      return
    }

    if (!params.userName) {
      app.Toast.warn('请填写姓名')
      return false
    }

    if (!params.provCode) {
      app.Toast.warn('请选择户籍地省份')
      return false
    }
    if (!params.cityCode) {
      app.Toast.warn('请选择户籍地城市')
      return
    }

    if (!params.countyCode) {
      app.Toast.warn('请选择户籍地区域')
      return
    }
    if (!params.certAddress) {
      app.Toast.warn('请填写详细地址')
      return false
    }

    console.log(params)
    app.api
      .saveByCertification(params)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          //如果有手机号则去修改手机下一页面 、或者去人脸识别
          if (res.data.mobile != null) {
            wx.redirectTo({
              url: '../real_name_check_2/index?mobile=' + res.data.mobile
            })
          }
          if (res.data.mobile == null || res.data.mobile == '') {
            //直接去人脸识别
            // wx.navigateTo({
            //   url: '../../face/face_1/index?face_type=4'
            // })
            app.wxFaceId
              .verify(
                app.globalData.userInfo.userName ||
                  app.globalData.userInfo.username,
                app.globalData.userInfo.certCode
              )
              .then(res => {
                wx.redirectTo({
                  url: '../../login_regist/real_name_check_2/index?mobile='
                })
              })
              .catch(res => {
                wx.showModal({
                  showCancel: false,
                  content: res
                })
              })
          }
        }
      })
      .catch(e => {
        console.error(e)
      })
  },

  //身份证正面图片上传影像
  imgFrontUpload(filePath, fileAbbr) {
    let formData = {
      fileAbbr: fileAbbr,
      fileSize: '100000',
      fileType: 'ZXD_00101',
      serno: this.data.userInfo.certCode,
      token: this.data.userInfo.token
    }
    let that = this
    app.api
      .imgUpload(filePath, fileAbbr, formData)
      .then(res => {
        console.log(res.data.URL1)
        that.setData({
          front: res.data.URL1 //身份照片上传地址
        })
      })
      .catch(e => {
        console.error(e)
      })
  },
  //身份证正面图片上传影像
  imgBackUpload(filePath, fileAbbr) {
    setTimeout(() => {
      wx.showToast({
        title: '正在处理文件',
        icon: 'loading',
        mask: true
      })
    }, 100)
    let formData = {
      fileAbbr: fileAbbr,
      fileSize: '100000',
      fileType: 'ZXD_00101',
      serno: this.data.userInfo.certCode,
      token: this.data.userInfo.token
    }
    let that = this
    app.api
      .imgUpload(filePath, fileAbbr, formData)
      .then(res => {
        console.log(res.data.URL1)
        that.setData({
          back: res.data.URL1 //身份照片上传地址
        })
      })
      .catch(e => {
        console.error(e)
      })
  },
  //输入框数据修改
  nameInput(e) {
    this.setData({
      'idCardInfo.name': e.detail.value
    })
  },
  certCodeInput(e) {
    this.setData({
      'idCardInfo.id_card_number': e.detail.value
    })
  },
  addressInput(e) {
    this.setData({
      'idCardInfo.address': e.detail.value
    })
    console.log(e.detail.value, this.data.idCardInfo)
  },
  ///*============省市区选择==================*/

  //查询户籍信息地址 省市区
  queryAreaCounty() {
    let params = {
      certCode: this.data.idCardInfo.id_card_number,
      certAddress: this.data.idCardInfo.address
    }
    app.api
      .queryAreaCounty(params)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          console.log('获取户籍省市区地址')
          this.setData({
            areaCounty: res.data,
            countyName: res.data.countyName,
            provName: res.data.provName,
            cityName: res.data.cityName
          })
          this.queryArea()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },

  //获取全国省市区地址信息
  queryArea() {
    wx.showLoading()
    let that = this
    app.api
      .queryArea()
      .then(res => {
        if (res.code == 0) {
          wx.hideLoading()
          console.log('获取省市区地址')
          const key = this.data.value[0]
          that.setData({
            list: res.data,
            citys: res.data[key].children
          })
          that.getCityCode()
        }
      })
      .catch(e => {
        console.error(e)
      })
  },
  //城市选择
  cityChange(e) {
    console.log(this.data.value)
    let value = e.detail.value
    console.log(value)
    let provinceNum = value[0] || 0
    let cityNum = value[1] || 0
    let countyNum = value[2] || 0
    //滑动省
    if (this.data.value[0] != provinceNum) {
      this.setData({
        citys: this.data.list[provinceNum].children, //设置某个省下面的所有城市集合
        areas: this.data.list[provinceNum].children[0].children,
        provName: this.data.list[provinceNum].label
      })
    } else if (this.data.value[1] != cityNum) {
      this.setData({
        areas: this.data.list[provinceNum].children[cityNum].children,
        cityName: this.data.list[provinceNum].children[cityNum].label
      })
    } else if (this.data.value[2] != countyNum) {
      this.setData({
        //areas: this.data.list[provinceNum].children[cityNum].children,
        countyName: this.data.list[provinceNum].children[cityNum].children[
          countyNum
        ].label
      })
    }

    this.setData({
      value: e.detail.value
    })
    //console.log(this.data.value)
  },
  //通过省市区的中文名称获取城市code
  getCityCode() {
    const list = this.data.list
    for (let i in list) {
      if (list[i].label == this.data.provName) {
        this.setData({
          provCode: list[i].value,
          'value[0]': i || 0,
          citys: this.data.list[i].children //设置市区的数据
        })
        //遍历反选市的code码
        for (let j in list[i].children) {
          if (list[i].children[j].label == this.data.cityName) {
            // console.log(list[i].children[j].label)
            this.setData({
              cityCode: list[i].children[j].value,
              'value[1]': j || 0,
              areas: this.data.list[i].children[j].children
            })
            //遍历区的码
            for (let k in list[i].children[j].children) {
              if (
                list[i].children[j].children[k].label == this.data.countyName
              ) {
                // console.log(list[i].children[j].children[k].value)
                this.setData({
                  countyCode: list[i].children[j].children[k].value,
                  'value[2]': k || 0
                })
              }
            }
          }
        }
      }
    }
  },
  closeCityMenu() {
    let provIndex = this.data.value[0]
    let cityIndex = this.data.value[1]
    let countyIndex = this.data.value[2]
    this.setData({
      addressMenuIsShow: false,
      provName: this.data.list[provIndex].label,
      cityName: this.data.list[provIndex].children[cityIndex].label,
      countyName: this.data.list[provIndex].children[cityIndex].children[
        countyIndex
      ].label
    })
    this.getCityCode() //获取省市区的code码
  },
  openCityMenu() {
    if (this.data.list.length == 0) {
      console.log('第一次加载城市api')
      this.queryArea()
    }
    this.setData({
      addressMenuIsShow: true
    })
  }
})
