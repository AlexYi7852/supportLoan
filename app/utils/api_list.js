/*
 * @Author: ecitlm 
 * @Date: 2018-03-11 18:14:26 
 * @Last Modified by: ecitlm
 * @Last Modified time: 2018-04-17 11:07:24
 */
import fetch from './fetch'
import { API_DOMAIN } from './api.config'
/**
 * @param {string} action  接口请求地址
 * @param {object} [params={}]
 * @param {object} [header={}]
 * @returns
 */
function fetchApi(action, params = {}, header = {}) {
  return fetch('POST', `${API_DOMAIN}/${action}?`, params, header)
}
/**
 * @param {string} action  接口请求地址
 * @param {object} [params={}]
 * @param {object} [header={}]
 * @returns
 */
function fetchGetApi(action, params = {}, header = {}) {
  return fetch('GET', `${API_DOMAIN}/${action}?`, params, header)
}
/**
 *查看pdf
 */
function httpPdf(url) {
  return fetch('GET', url)
}

//账号登录
function Login(params, header) {
  return fetchApi('account/login', params, header).then(res => res)
}

function loginAfterReg(params, header) {
  return fetchApi('account/loginAfterReg', params, header).then(res => res)
}

function queryContactor(params) {
  return fetchApi('account/queryContactor', params).then(res => res)
}

function editContactor(params) {
  return fetchApi('account/editContactor', params).then(res => res)
}

function modifyCommunication(params) {
  return fetchApi('account/modifyCommunication', params).then(res => res)
}

function queryBankcard(params) {
  return fetchApi('common/queryBankcard', params).then(res => res)
}
//保存银行卡
function saveBankcard(params) {
  return fetchApi('common/saveBankcard', params).then(res => res)
}
//首页开放产品接口
function openLoanProducts(params) {
  return fetchGetApi('loan/openLoanProducts', params).then(res => res)
}

//获取系统信息
function getSysInfo(params) {
  return fetchGetApi('common/getSysInfo', params).then(res => res)
}
//获取公告列表
function postRecently(params) {
  return fetchGetApi('common/postRecently', params).then(res => res)
}

//忘记密码发送验证码
function sendPwdCode(params) {
  return fetchApi('account/sendPwdCode', params).then(res => res)
}
//忘记密码设置密码
function forgotPassword(params) {
  return fetchApi('account/forgotPassword', params).then(res => res)
}
//校验手机验证码
function checkMobileCode(params) {
  return fetchApi('account/checkMobileCode', params).then(res => res)
}
//
//纯发送短信验证码
function sendCode(params) {
  return fetchGetApi('account/sendCode', params).then(res => res)
}
//忘记密码设置密码
function forgotPassword(params) {
  return fetchApi('account/forgotPassword', params).then(res => res)
}

//身份证或手机认证
function saveByCertification(params) {
  return fetchApi('account/saveByCertification', params).then(res => res)
}
//影像上传

//获取户籍所在地接口
function queryAreaCounty(params) {
  return fetchApi('account/queryAreaCounty', params).then(res => res)
}
// 检查账号是否存在
function checkAccount(params) {
  return fetchApi('account/checkAccount', params).then(res => res)
}
//获取省市区的数据
function queryArea(params) {
  return fetchGetApi('common/queryArea', params).then(res => res)
}

//用户注册
function register(params) {
  return fetchApi('account/register', params).then(res => res)
}
//常见问题
function questions(params) {
  return fetchGetApi('common/questions', params).then(res => res)
}
// 获取图片验证码
function validateImageCode(params) {
  return fetchGetApi('account/validateCode', params).then(res => res)
}

//修改手机号
function changeMobile(params) {
  return fetchApi('account/changeMobile', params).then(res => res)
}
//实名认证修改密码
function forgotPasswordByValid(params) {
  return fetchApi('account/forgotPasswordByValid', params).then(res => res)
}
//意见反馈
function feedback(params) {
  return fetchApi('common/feedback', params).then(res => res)
}
//语音识别获取随机数
function faceRandomNumber(params) {
  return fetchApi('external/faceRandomNumber', params).then(res => res)
}
//语音识别活体结果验证、人脸比对、攻击判断等
function videoRawVerify(params) {
  return fetchApi('external/videoRawVerify', params).then(res => res)
}
///判断上一笔贷款
function loanLatest(params) {
  return fetchApi('loan/loanLatest', params).then(res => res)
}
//获取用户申请的内容
function userDetail(params) {
  return fetchApi('account/userDetail', params).then(res => res)
}
//贷款申请保存子页面数据
function clientBaseMsg(params) {
  return fetchApi('loan/clientBaseMsg', params).then(res => res)
}
//提前结清列表页
function settledAccountCheck(params) {
  return fetchApi('loan/interfaceApi', params).then(res => res)
}
//还款计划-头部数据
function repaymentPeriod(params) {
  return fetchApi('loan/repaymentPeriod', params).then(res => res)
}
//还款计划-扇形、年度
function repaymentPlan(params) {
  return fetchApi('loan/repaymentPlan', params).then(res => res)
}
//
function querySchool(params) {
  return fetchGetApi('common/querySchool', params).then(res => res)
}
//用户影像内容、资助中心
function userMaterialDetail(params) {
  return fetchApi('account/userMaterialDetail', params).then(res => res)
}
//生成贷款编号
function generateCLoanId(params) {
  return fetchApi('loan/generateCLoanId', params).then(res => res)
}
//删除影像资料
function delImgByUrl(params) {
  return fetchApi('common/delImgByUrl', params).then(res => res)
}
//电子签署
function signElectronic(params) {
  return fetchApi('loan/signElectronic', params).then(res => res)
}
//我的申请
function queryApply(params) {
  return fetchApi('loan/queryApply', params).then(res => res)
}
//贷款统一接口
function interfaceApi(params) {
  return fetchApi('loan/interfaceApi', params).then(res => res)
}
//邮件发送
function sendUploadEmail(params) {
  return fetchApi('account/sendUploadEmail', params).then(res => res)
}
//商业贷款服务费计算
function calcJRLoan(params) {
  return fetchGetApi('external/calcJRLoan', params).then(res => res)
}
//邮件发送
function businessLoanCheck(params) {
  return fetchApi('loan/businessLoanCheck', params).then(res => res)
}
//邮件发送
function bindingBankcard(params) {
  return fetchApi('common/bindingBankcard', params).then(res => res)
}

//续贷申请检查
function creditCheck(params) {
  return fetchApi('loan/creditCheck', params).then(res => res)
}

function validateImageCode(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_DOMAIN}/account/validateCode`,
      data: params,
      methods: 'GET',
      responseType: 'arraybuffer',
      success: res => {
        resolve(res)
      }
    })
  })
}

/**
 * 图片影像文件
 * @param {图片地址} filePath
 * @param {图片目录} fileAbbr
 * @param {接口参数} formData
 */
function imgUpload(filePath, fileAbbr = '', formData = {}) {
  console.log(formData)
  setTimeout(() => {
    wx.showLoading({
      title: '正在上传'
    })
  }, 100)
  console.log(formData)
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_DOMAIN}/common/uploadImg`,
      filePath: filePath[0],
      name: 'files',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      formData: formData,
      success: function(res) {
        wx.hideLoading()
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.code == 0) {
          resolve(data)
          wx.showToast({
            title: '图像上传成功',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        } else {
          wx.showModal({
            title: '',
            content: data.message || '证件上传失败、请再次上传',
            showCancel: false
          })
        }
      },
      fail: function(err) {
        wx.hideLoading()
        console.log('err')
        wx.showModal({
          title: '',
          content: '证件信息上传失败、请再次上传',
          showCancel: false
        })
        reject(err)
      },
      complete: function() {}
    })
  })
}

/**
 * 视频文件上传
 * @param {视频地址} filePath
 * @param {接口参数} formData
 */
function rawValidateVideo(filePath, formData = {}) {
  wx.showLoading({
    title: '正在上传识别'
  })
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${API_DOMAIN}/external/rawValidateVideo`,
      filePath: filePath,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      formData: formData,
      success: function(res) {
        console.log(res)
        if (res.statusCode == 413) {
          wx.showModal({
            title: '',
            content: '413 Request Entity Too Large',
            showCancel: false
          })
          return false
        }
        var data = JSON.parse(res.data)
        console.log(data)
        resolve(data)
      },
      fail: function(err) {
        console.llog(err)
        wx.showModal({
          title: '',
          content: '视频识别超时',
          showCancel: false
        })
        reject(err)
      },
      complete: function() {
        console.log('complete')
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  Login,
  loginAfterReg,
  register,
  queryContactor,
  editContactor,
  modifyCommunication,
  queryBankcard,
  saveBankcard,
  openLoanProducts,
  getSysInfo,
  postRecently,
  sendPwdCode,
  forgotPassword,
  checkMobileCode,
  sendCode,
  forgotPassword,
  queryAreaCounty,
  checkAccount,
  queryArea,
  saveByCertification,
  imgUpload,
  questions,
  validateImageCode,
  changeMobile,
  feedback,
  faceRandomNumber,
  rawValidateVideo,
  videoRawVerify,
  forgotPasswordByValid,
  loanLatest,
  userDetail,
  clientBaseMsg,
  querySchool,
  userMaterialDetail,
  generateCLoanId,
  delImgByUrl,
  settledAccountCheck,
  signElectronic,
  queryApply,
  interfaceApi,
  sendUploadEmail,
  httpPdf,
  calcJRLoan,
  businessLoanCheck,
  repaymentPlan,
  repaymentPeriod,
  bindingBankcard,
  creditCheck
}
