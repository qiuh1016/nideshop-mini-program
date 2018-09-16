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
    currentStyleBtnIndex: -1, // 当前风格按钮index
    keyword: '',
    showSearchResult: false, // 显示搜索结果的时候 把 tab隐藏
    editRowIndex: -1, // 编辑条目前所在的方案index，-1则都不显示
    cdnImgUrl: '',
    page: 1,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.setData({
      cdnImgUrl: api.cdnImgUrl
    })
    wx.setNavigationBarTitle({
      title: '方案库'
    })
    if (this.data.keyword == '') {
      this.getPlanDataByStyle();
    } else {
      this.getPlanDataByKeyword();
    }
  },

  searchBtnTapped() {
    this.setData({
      page: 0,
      stylePlans: []
    })
    let keyword = this.data.keyword;
    if (keyword == '') {
      this.getPlanDataByStyle();
    } else {
      this.getPlanDataByKeyword()
    }
  },

  getPlanDataByStyle() {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    let that = this;
    util.request(api.PlanList, {
        stylist_id: this.data.stylist_id,
        style_id: this.data.currentStyleBtnIndex,
        page: this.data.page
      })
      .then(function(res) {
        if (res.errno === 0) {
          if (res.data.length != 0) {
            let stylePlans = that.data.stylePlans;
            stylePlans = stylePlans.concat(res.data);
            that.setData({
              stylePlans: stylePlans,
              showSearchResult: false,
              page: that.data.page + 1
            });
          }
          wx.stopPullDownRefresh()
        }
        // wx.hideLoading()
      });
  },

  getPlanDataByKeyword() {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    let that = this;
    util.request(api.PlanSearch, {
        stylist_id: this.data.stylist_id,
        keyword: this.data.keyword,
        page: this.data.page + 1
      })
      .then(function(res) {
        if (res.errno === 0) {
          if (res.data.length != 0) {
            let stylePlans = that.data.stylePlans;
            stylePlans = stylePlans.concat(res.data);
            that.setData({
              stylePlans: stylePlans,
              showSearchResult: true,
              page: that.data.page + 1
            });
          } else {
            that.setData({
              showSearchResult: true,
            });
          }
        }
        wx.stopPullDownRefresh()
        // wx.hideLoading()
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
      currentStyleBtnIndex: e.currentTarget.dataset.index,
      page: 0,
      stylePlans: []
    })
    this.getPlanDataByStyle();
  },

  itemTapped(e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.editRowIndex) {
      this.setData({
        editRowIndex: -1
      })
    } else {
      let planid = e.currentTarget.dataset.planid;
      this.enterPlanDetail(planid);
    }
  },

  enterPlanDetail(planid) {
    wx.navigateTo({
      url: `../detail/detail?planid=${planid}&forCustomer=0`,
    })
    this.setData({
      editRowIndex: -1
    })
  },

  editPlan(e) {
    let planid = e.currentTarget.dataset.planid;
    wx.navigateTo({
      url: `../canvas/canvas?planid=${planid}`,
    })
  },

  planLongPressed(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      editRowIndex: this.data.editRowIndex == index ? -1 : index
    })
  },

  copyPlan() {
    let index = this.data.editRowIndex
    if (index == -1) return
    wx.showLoading({
      title: '复制中...',
    })
    let stylePlans = this.data.stylePlans
    let plan = stylePlans[index];
    let planid = plan.id
    util.request(api.PlanCopy, { planid }).then((res) => {
      if (res.errno === 0) {
        stylePlans.splice(0, 0, res.data);
        this.setData({
          stylePlans: stylePlans,
          editRowIndex: -1
        })
      }
      wx.hideLoading()
    })
  },

  deletePlan() {
    let index = this.data.editRowIndex
    if (index == -1) return
    wx.showLoading({
      title: '删除中...',
    })
    let stylePlans = this.data.stylePlans
    let planid = stylePlans[index].id
    util.request(api.PlanDelete, { planid }).then((res) => {
      if (res.errno === 0) {
        stylePlans.splice(index, 1);
        this.setData({
          stylePlans: stylePlans,
          editRowIndex: -1
        })
      }
      wx.hideLoading()
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
    console.log('onPullDownRefresh')
    this.setData({
      page: 0,
      stylePlans: []
    })
    this.onLoad();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {
    console.log('onReachBottom')
    let keyword = this.data.keyword;
    if (keyword == '') {
      this.getPlanDataByStyle()
    } else {
      this.getPlanDataByKeyword()
    }
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})