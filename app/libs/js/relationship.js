/*
 * @Author: ecitlm 
 * @Date: 2018-04-18 11:52:40 
 * @Last Modified by:   ecitlm 
 * @Last Modified time: 2018-04-18 11:52:40 
 */

const relationshipData1 = [
  {
    label: '父',
    value: '601010'
  },
  {
    label: '母',
    value: '601011'
  },
  {
    label: '兄 (姐)',
    value: '601012'
  },
  {
    label: '其他监护人',
    value: '601015'
  }
]

/**
 * 与申请人紧急关系数据
 */
const relationshipData2 = [
  {
    label: '父',
    value: '601010'
  },
  {
    label: '母',
    value: '601011'
  },
  {
    label: '兄 (姐)',
    value: '601012'
  },
  {
    label: '其他亲属',
    value: '601015'
  },
  {
    label: '朋友',
    value: '601021'
  },
  {
    label: '同学',
    value: '601018'
  },
  {
    label: '同乡',
    value: '601019'
  }
]

module.exports = {
  relationshipData1,
  relationshipData2
}
