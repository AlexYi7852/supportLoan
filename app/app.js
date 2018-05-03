import { Toast } from './utils/util'
import { API_DOMAIN } from './utils/api.config'
const api = require('./utils/api_list')
const wxFaceId = require('./utils/wx_faceid')
App({
  data: {
    version: '0.1.0',
    currentCity: 'shenzhen'
  },
  api: api,
  wxFaceId: wxFaceId,
  domain: API_DOMAIN,
  Toast: Toast,
  globalData: {
    msg: '全局数据',
    userInfo: wx.getStorageSync('userInfo') || {},
    proxy: 'https://proxy.sinosafe.com.cn/xbapp-ms-apiRest_HAXB/view/',
    service_protocol:
      'https://proxytest.sinosafe.com.cn/stuapp-sit/hastudy-cluster/html/service-protocol.html',
    // 终端类型
    deviceType: ''
  },
  getSystemInfo() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.deviceType = res.model
      }
    })
  },
  onLaunch: function() {
    this.getSystemInfo()
  }
})
