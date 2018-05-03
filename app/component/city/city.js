import { cityJson } from '../../libs/js/city'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressMenuIsShow: {
      type: Boolean,
      value: '',
      observer: function(newVal, oldVal) {
        this.value = newVal
      }
    },
    proJson: {
      type: Object,
      value: cityJson,
      observer: function(newVal, oldVal) {
        console.log('城市数据已更新')
        this.value = newVal
        this.data.proJson = newVal
      }
    },
    cityCodes: {
      type: Object,
      value: '',
      observer: function(newVal, oldVal) {
        var that = this;
        this.value = newVal
        // if (this.data.cityCodes.loanType == 'J') {
        //   this.setData({
        //     cityJson: that.data.proJson[0].children,
        //     countyJson: that.data.proJson[0].children[0].children
        //   })
        // }
        this.getcityNameByCityCode(cityJson, this.data.cityCodes)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    proJson: cityJson,
    cityJson: cityJson[0].children,
    countyJson: cityJson[7].children[0].children,
    value: [0, 0, 0],
    addressMenuIsShow: true,
    countyCodes: {},
    addrProvId: '',
    addrCityId: '',
    addrAreaId: '',
    provName: '',
    cityName: '',
    areaName: ''
  },
  ready() {
    this.setData({
      cityJson: this.data.proJson[0].children,
      countyJson: this.data.proJson[0].children[0].children
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
     *通过城市代码获取城市名称
     list 城市JSON
     params 城市省市区代码对象
     callback 回调方法
     */
    getcityNameByCityCode(list, params) {
      let data = {}
      //判断是否只只存在省的代码
      if (params.proCode) {
        var proJson = list.find(v => {
          console.log(v)
          return v.value == params.proCode
        })
        this.setData({
          provName: proJson.label
        })
      }
      //判断是否有存在市得到code码
      if (params.cityCode) {
        var cityJson = proJson.children.find(v => {
          console.log(v)
          return v.value == params.cityCode
        })

        //判断区为空的情况
        if (params.countyCode) {
          var countyJson = cityJson.children.find(v => {
            console.log(v)
            return v.value == params.countyCode
          })
        } else {
          var countyJson = cityJson.children[0]
        }
        console.log(proJson.label, cityJson.label, countyJson.label, 'hello')
        this.setData({
          provName: proJson.label,
          cityName: cityJson.label,
          areaName: countyJson.label || ''
        })
      }
    },
    addressChange(e) {
      let proJson = this.data.proJson
      let value = e.detail.value
      console.log(value)
      let provinceNum = value[0] || 0
      let cityNum = value[1] || 0
      let countyNum = value[2] || 0
      /* 滑动省  */
      if (this.data.value[0] !== provinceNum) {
        this.setData({
          'value[0]': provinceNum,
          'value[1]': 0,
          'value[2]': 0,
          cityJson: proJson[provinceNum].children, //设置某个省下面的所有城市集合
          countyJson: proJson[provinceNum].children[0].children,
          provName: proJson[provinceNum].label,
          addrProvId: proJson[provinceNum].value,
          cityName: proJson[provinceNum].children[0].label,
          addrCityId: proJson[provinceNum].children[0].value,
          areaName: proJson[provinceNum].children[0].children[0].label,
          addrAreaId: proJson[provinceNum].children[0].children[0].value
        })
      } else if (this.data.value[1] !== cityNum) {
        this.setData({
          'value[1]': cityNum,
          'value[2]': 0,
          countyJson: proJson[provinceNum].children[cityNum].children,
          cityName: proJson[provinceNum].children[cityNum].label,
          addrCityId: proJson[provinceNum].children[cityNum].value
        })
      } else if (this.data.value[2] !== countyNum) {
        this.setData({
          'value[2]': countyNum,
          areaName:
            proJson[provinceNum].children[cityNum].children[countyNum].label,
          addrAreaId:
            proJson[provinceNum].children[cityNum].children[countyNum].value
        })
      }

      let detail = {
        addrProvId: this.data.addrProvId,
        addrCityId: this.data.addrCityId,
        addrAreaId: this.data.addrAreaId,
        provName: this.data.provName,
        cityName: this.data.cityName,
        areaName: this.data.areaName
      }

      let myEventOption = {
        bubbles: false, //事件是否冒泡
        composed: false, //事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)
    },
    openMenu() {
      this.setData({
        addressMenuIsShow: true
      })
    },
    /**
     * 关闭省市区 并获取当前的省区市名称以及code码
     */
    closeMenu() {
      let proJson = this.data.proJson
      let provIndex = this.data.value[0]
      let cityIndex = this.data.value[1]
      let countyIndex = this.data.value[2]
      this.setData({
        addressMenuIsShow: false,
        addrProvId: proJson[provIndex].value, //家庭地址省的代码
        addrCityId: proJson[provIndex].children[cityIndex].value, //家庭地址市的代码
        addrAreaId:
          proJson[provIndex].children[cityIndex].children[countyIndex].value, //家庭地址区对应代码
        provName: proJson[provIndex].label,
        cityName: proJson[provIndex].children[cityIndex].label,
        areaName:
          proJson[provIndex].children[cityIndex].children[countyIndex].label
      })

      let detail = {
        addrProvId: this.data.addrProvId,
        addrCityId: this.data.addrCityId,
        addrAreaId: this.data.addrAreaId,
        provName: this.data.provName,
        cityName: this.data.cityName,
        areaName: this.data.areaName
      }

      let myEventOption = {
        bubbles: false, //事件是否冒泡
        composed: false, //事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)
    }
  }
})
