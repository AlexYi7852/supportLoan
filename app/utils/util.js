/*
 * @Author: ecitlm 
 * @Date: 2018-04-18 18:54:22 
 * @Last Modified by:   ecitlm 
 * @Last Modified time: 2018-04-18 18:54:22 
 */
/**
 * 验证码倒计时特效
 */
const getSms = {
  countdown: 60,
  settime: function(that) {
    clearTimeout(timer)
    let _this = this
    if (_this.countdown === 0) {
      that.setData({
        is_show: true
      })
      _this.countdown = 60
      clearTimeout(timer)
      return
    } else {
      that.setData({
        is_show: false,
        last_time: _this.countdown
      })
      _this.countdown--
    }

    var timer = setTimeout(function() {
      getSms.settime(that)
    }, 1000)
  }
}

const getSms2 = {
  countdown: 60,
  settime: function(that) {
    clearTimeout(timer)
    let _this = this
    if (_this.countdown === 0) {
      that.setData({
        is_show: true
      })
      _this.countdown = 60
      clearTimeout(timer)
      return
    } else {
      that.setData({
        is_show: false,
        last_time: _this.countdown
      })
      _this.countdown--
    }

    var timer = setTimeout(function() {
      getSms2.settime(that)
    }, 1000)
  }
}

const Toast = {
  warn: function(val) {
    wx.showToast({
      title: val,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  loading: function() {
    wx.showToast({
      icon: 'loading',
      duration: 2000,
      mask: true
    })
  },
  success: function(val) {
    wx.showToast({
      title: val,
      icon: 'success',
      duration: 1500,
      mask: true
    })
  },
  error: function(val) {
    wx.showToast({
      title: val,
      image: '/images/others/icon-error.png',
      duration: 1500,
      mask: true
    })
  },
  alert: function(param) {
    wx.showModal({
      content: param,
      title: '提示',
      showCancel: false
    })
  },
  showLoading: function(param = 'Loading') {
    wx.showLoading({
      title: param,
      mask: true
    })
  },
  hideLoading: function() {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
  },
  showModal: function(param = 'msg') {
    wx.showModal({
      title: '',
      content: param,
      showCancel: false
    })
  }
}

/*
 *通过城市代码获取城市名称
 list 城市JSON
 params 城市省市区代码对象
 callback 回调方法
 */
function getCityNameByCityCode(list, params, callback) {
  let data = {}
  if (!params.proCode) {
    data.proCode = ''
    data.cityName = ''
    data.countyName = ''
    callback(data)
    return
  }
  console.log(params)
  const proJson = list.find(v => {
    return v.value == params.proCode
  })

  const cityJson = proJson.children.find(v => {
    console.log()
    return v.value == params.cityCode
  })
  //判断区为空的情况
  if (params.countyCode) {
    var countyJson = cityJson.children.find(v => {
      return v.value == params.countyCode
    })
  } else {
    var countyJson = cityJson.children[0]
  }

  const datas = {
    proName: proJson.label,
    cityName: cityJson.label,
    countyName: countyJson.label
  }
  callback(datas)
}
module.exports = {
  getSms,
  getSms2,
  Toast,
  getCityNameByCityCode
}
