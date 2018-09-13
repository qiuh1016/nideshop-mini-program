// pages/plan/list/list.js
Page({

  /**
   * Page initial data
   */
  data: {
    stylePlans: [], // 搭配方案
    currentStyleBtnIndex: 0, // 当前风格按钮index
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '方案库'
    })
    // TODO 
    this.testData();
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
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})