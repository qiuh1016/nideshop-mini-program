// pages/plan/add/add.js
const api = require('../../../config/api.js');

Page({

  /**
   * Page initial data
   */
  data: {
    planid: '',
    styles: ['简约', '休闲', '轻时尚'],
    name: '',
    style: '',
    fit_group: '',
    fit_scene: '',
    desc: '',
    v: '',
    tempFilePath: '',
    btnDisable: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let planid = options.planid;
    let style = options.style == '' ? this.data.styles[0] : options.style ;
    // 有planid 就是修改 没有就是新建
    if (planid) {
      let pages = getCurrentPages();
      let canvasPage = pages[pages.length - 2];
      let planDetail = canvasPage.data.planDetail;
      this.setData({
        planid: planid,
        name: planDetail.name,
        style: planDetail.style,
        fit_group: planDetail.fit_group,
        fit_scene: planDetail.fit_scene,
        desc: planDetail.desc,
        v: planDetail.v
      })
      this.checkBtnValidation();
    }

    if (style) {
      this.setData({
        style: style
      })
    }
    this.setData({
      tempFilePath: options.tempFilePath
    });
  },

  handleNameChange({ detail = {} }) {
    this.setData({
      name: detail.detail.value
    });
    this.checkBtnValidation()
  },

  handleStylePickChange({ detail = {} }) {
    let style = this.data.styles[detail.value]
    this.setData({
      style: style
    });
    this.checkBtnValidation()
  },

  handlefitGroupChange({ detail = {} }) {
    this.setData({
      fit_group: detail.detail.value
    });
    this.checkBtnValidation()    
  },

  handlefitSceneChange({ detail = {} }) {
    this.setData({
      fit_scene: detail.detail.value
    });
    this.checkBtnValidation()
  },

  handleDescChange({ detail = {} }) {
    this.setData({
      desc: detail.detail.value
    });
    this.checkBtnValidation()
  },

  checkBtnValidation() {
    if (this.data.name != '' &&
      this.data.style != '' &&
      this.data.fit_group != '' &&
      this.data.fit_scene != '' &&
      this.data.desc != ''
    ) {
      this.setData({
        btnDisable: false
      })
    } else {
      this.setData({
        btnDisable: true
      })
    }
  },

  savePlan() {
    if (this.data.btnDisable) return
    wx.showLoading({
      title: '保存中...',
    })
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2] // canvas page
    let _this = this;
    wx.uploadFile({
      url: api.PlanSave,
      filePath: this.data.tempFilePath,
      name: 'image',
      formData: {
        goodsArr: JSON.stringify(prePage.data.goodsArr), //带上参数
        name: _this.data.name,
        style: _this.data.style,
        fit_group: _this.data.fit_group,
        fit_scene: _this.data.fit_scene,
        desc: _this.data.desc
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode === 200) {
          let planListPage = pages[pages.length - 3];
          planListPage.getPlanDataByStyle();
          wx.navigateBack({
            delta: 2
          })
        }
        wx.hideLoading();
      }
    })
  },

  updatePlan() {
    if (this.data.btnDisable) return
    wx.showLoading({
      title: '更新中...',
    })
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2] // canvas page
    let _this = this;
    wx.uploadFile({
      url: api.PlanUpdate,
      filePath: this.data.tempFilePath,
      name: 'image',
      formData: {
        goodsArr: JSON.stringify(prePage.data.goodsArr), //带上参数
        name: _this.data.name,
        style: _this.data.style,
        fit_group: _this.data.fit_group,
        fit_scene: _this.data.fit_scene,
        desc: _this.data.desc,
        id: _this.data.planid,
        v: _this.data.v
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode === 200) {
          let planListPage = pages[pages.length - 4]
          planListPage.onPullDownRefresh();
          let planDetailPage = pages[pages.length - 3]
          planDetailPage.getPlanDetail(planDetailPage.data.planDetail.id);
          wx.navigateBack({
            delta: 2
          })
        }
        wx.hideLoading();
      }
    })
  },

  addItem() {
    if (this.data.btnDisable) return

    wx.navigateTo({
      url: `../canvas/canvas?name=${this.data.name}&style=${this.data.style}&fit_group=${this.data.fit_group}&fit_scene=${this.data.fit_scene}&desc=${this.data.desc}`,
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