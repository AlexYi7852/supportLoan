/**学历 组织字典 */
const educationData = [
  {
    label: '专科',
    value: '2'
  },
  {
    label: '本科',
    value: '3'
  },
  {
    label: '硕士',
    value: '4'
  },
  {
    label: '博士',
    value: '5'
  }
]

const educationList = {
  '2': [
    {
      value: 3,
      label: '3年'
    }
  ],

  '3': [
    {
      value: 4,
      label: '4年'
    },
    {
      value: 5,
      label: '5年'
    }
  ],

  '4': [
    {
      value: 2,
      label: '2年'
    },
    {
      value: 3,
      label: '3年'
    }
  ],

  '5': [
    {
      value: 1,
      label: '1年'
    },
    {
      value: 2,
      label: '2年'
    },
    {
      value: 3,
      label: '3年'
    }
  ],

  '6': [
    {
      value: 5,
      label: '1+4年'
    },
    {
      value: 6,
      label: '1+5年'
    }
  ],

  '7': [
    {
      value: 5,
      label: '1+4年'
    },
    {
      value: 6,
      label: '1+5年'
    }
  ]
}

module.exports = {
  educationData,
  educationList
}
