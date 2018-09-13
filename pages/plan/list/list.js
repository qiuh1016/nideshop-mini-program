// pages/plan/list/list.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * Page initial data
   */
  data: {
    stylist_id: 1,
    styles: ['简约', '休闲', '轻时尚'],
    stylePlans: [], // 搭配方案
    currentStyleBtnIndex: 0, // 当前风格按钮index
    keyword: '',
    showSearchResult: false, // 显示搜索结果的时候 把 tab隐藏
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '方案库'
    })
    this.getPlanDataByStyle();
  },

  getPlanDataByStyle() {
    let that = this;
    util.request(api.PlanList, {
        stylist_id: this.data.stylist_id,
        style: this.data.styles[this.data.currentStyleBtnIndex]
      })
      .then(function(res) {
        if (res.errno === 0) {
          that.setData({
            stylePlans: res.data,
            showSearchResult: false
          });
        }
      });
  },

  getPlanDataByKeyword() {
    let keyword = this.data.keyword;
    if (keyword == '') {
      this.getPlanDataByStyle();
      this.setData({
        showSearchResult: false
      })
      return;
    }

    let that = this;
    util.request(api.PlanSearch, {
        stylist_id: this.data.stylist_id,
        keyword: keyword
      })
      .then(function(res) {
        if (res.errno === 0) {

          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '未找到相关方案',
              showCancel: false
            })
          } else {
            that.setData({
              stylePlans: res.data,
              showSearchResult: true

            });
          }

        }
      });
  },

  getKeyword(e) {
    var val = e.detail.value;
    this.setData({
      keyword: val
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
    this.setData({
      currentStyleBtnIndex: e.target.dataset.index,
    })
    this.getPlanDataByStyle();
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