// pages/plan/add/add.js
Page({

  /**
   * Page initial data
   */
  data: {
    styles: ['简约', '休闲', '轻时尚'],
    name: '',
    style: '',
    fit_group: '',
    fit_scene: '',
    desc: '',
    btnDisable: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.setData({
      style: options.style
    });
  },

  handleNameChange({
    detail = {}
  }) {
    this.setData({
      name: detail.detail.value
    });
    this.checkBtnValidation()
  },

  handleStylePickChange({
    detail = {}
  }) {
    let style = this.data.styles[detail.value]
    this.setData({
      style: style
    });
    this.checkBtnValidation()
  },

  handlefitGroupChange({
    detail = {}
  }) {
    this.setData({
      fit_group: detail.detail.value
    });
    this.checkBtnValidation()    
  },

  handlefitSceneChange({
    detail = {}
  }) {
    this.setData({
      fit_scene: detail.detail.value
    });
    this.checkBtnValidation()
  },

  handleDescChange({
    detail = {}
  }) {
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