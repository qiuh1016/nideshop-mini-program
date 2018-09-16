// pages/plan/detail/detail.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planDetail: '',
    goodsArr: [],
    forCustomer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // todo： 如何确定入口是用户 还是搭配师
    let planid = parseInt(options.planid);
    this.setData({
      forCustomer: options.forCustomer == 1 ? true : false,
      cdnImgUrl: api.cdnImgUrl
    })
    this.getPlanDetail(planid);
  },

  getPlanDetail(planid) {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this;
    util.request(api.PlanGet, {
      id: planid,
    })
      .then(function (res) {
        if (res.errno === 0) {
          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '未找到相关方案',
              showCancel: false
            })
          } else {
            let planDetail = res.data.plan
            that.setData({
              planDetail: planDetail,
              goodsArr: res.data.items
            });
            wx.setNavigationBarTitle({
              title: planDetail.name,
            })
          }
        }
        wx.hideLoading()
      });
  },

  itemTapped(e) {
    let index = e.currentTarget.dataset.index;
    console.log(this.data.forCustomer);
    if (this.data.forCustomer) {
      this.checkItem(index);
    } else {
      let goods_id = this.data.goodsArr[index].goods_id;
      wx.navigateTo({
        url: `../../goods/goods?id=${goods_id}`,
      })
    }
  },

  checkItem(index) {
    let goodsArr = this.data.goodsArr;
    let checkStutas = goodsArr[index].checked
    if (checkStutas == undefined || !checkStutas) {
      goodsArr[index].checked = true
    } else {
      goodsArr[index].checked = false
    }
    this.setData({
      goodsArr: goodsArr
    })
  },

  bottomBtnTapped() {
    if (this.data.forCustomer) {
      let hasGoods = false
      for (let i in this.data.goodsArr) {
        let goods = this.data.goodsArr[i];
        if (goods.checked) {
          hasGoods = true
          break
        }
      }

      if (hasGoods) {
        // todo 下单
        wx.showModal({
          title: '提示',
          content: '用户下单待开发',
          showCancel: false
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您尚未选择宝贝',
          showCancel: false
        })
      }
    } else {
      wx.navigateTo({
        url: `../canvas/canvas?planid=${this.data.planDetail.id}`,
      })
    }
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
  
  }
})