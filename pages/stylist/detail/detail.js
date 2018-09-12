// pages/stylist/detail/detail.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stylistInfo: {}, // 搭配师资料
    stylePlans: [], // 搭配方案
    currentStyleBtnIndex: 0, // 当前风格按钮index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStylistById(1);
    this.testData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 获取搭配师详情
   */
  getStylistById(id) {
    util.request(api.StylistDetail, { id }).then((res) => {
      if (res.errno === 0) {
        this.setData({
          stylistInfo: res.data,
        });
      }
    })
  },

  /**
   * 模拟数据
   */
  testData() {
    let planArr = [];
    for (let i = 0; i < 4; i++) {
      planArr.push({
        id: i,
        imgurl: 'https://g-search2.alicdn.com/img/bao/uploaded/i4/i3/3546430428/TB1NrIPlm8YBeNkSnb4XXaevFXa_!!0-item_pic.jpg_460x460Q90.jpg',
        text: '简约风格'
      });
    }
    this.setData({
      stylePlans: planArr
    })
  },

  styleBtnTapped(e) {
    // TODO: 请求服务器数据 刷新stylePlans
    this.setData({
      currentStyleBtnIndex: e.target.dataset.index,
    })
  }
})