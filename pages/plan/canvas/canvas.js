// pages/plan/canvas/canvas.js
const api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    style: '',
    fit_group: '',
    fit_scene: '',
    desc: '',
    screenHeight: 0,
    screenWidth: 0,
    goodsArr: [],
    distance: 0,
    touchX: 0,
    touchY: 0,
    // canvasHidden: true,
    unit: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '制作方案'
    });
    let res = wx.getSystemInfoSync();
    this.setData({
      screenWidth: res.windowWidth,
      screenHeight: res.windowHeight,
      unit: 750 / res.windowWidth,
      name: options.name,
      style: options.style,
      fit_group: options.fit_group,
      fit_scene: options.fit_scene,
      desc: options.desc,
    });
    console.log(this.data);
  },

  getTestData() {
    let goodsArr = [{
        id: 1,
        url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/82523815/TB1bDJIeiMnBKNjSZFzXXc_qVXa_!!0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 200,
        picheight: 200,
        width: 200,
        height: 200,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 2,
        url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3864942132/TB2K_KssyQnBKNjSZFmXXcApVXa_!!3864942132-0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 200,
        picheight: 200,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 3,
        url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/96416556/TB2bvk2tCtYBeNjSspkXXbU8VXa_!!0-saturn_solar.jpg_360x360Q90.jpg',
        picwidth: 160,
        picheight: 160,
        width: 80,
        height: 80,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 4,
        url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2055544716/TB2w3tlt29TBuNjy1zbXXXpepXa_!!2055544716-0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 200,
        picheight: 200,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        scale: 1
    }];

    for (let i in goodsArr) {
      let goods = goodsArr[i];
      goods.selected = false;
      this.getImgInfo(goods.url, 'pic'+i);
    }

    this.setData({
      goodsArr: goodsArr
    })
  },

  addGoods(goods) {
    let goodsArr = this.data.goodsArr;
    goodsArr.push(goods);
    this.getImgInfo(goods.url, `pic${goodsArr.length - 1}`)
    this.setData({
      goodsArr: goodsArr
    })

    // wx.showToast({
    //   title: '添加成功',
    //   icon: 'success',
    //   duration: 2000
    // })
  },

  getImgInfo(netUrl, storageKeyUrl) {
    let that = this;
    wx.getImageInfo({
      src: netUrl,
      success: function(res) {
        wx.setStorage({
          key: storageKeyUrl,
          data: res.path,
        });
      }
    })
  },

  ImgTouchMove(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    let goods = goodsArr[index];
    if (e.touches.length == 1) {
      if (this.data.touchX != 0 || this.data.touchY != 0) {
        let diffX = e.touches[0].clientX - this.data.touchX;
        let diffY = e.touches[0].clientY - this.data.touchY;
        goods.left = goods.left + diffX;
        goods.top = goods.top + diffY;
        this.setData({
          goodsArr: goodsArr
        })
      }
      this.data.touchX = e.touches[0].clientX;
      this.data.touchY = e.touches[0].clientY;
    } else {
      let xMove = e.touches[1].clientX - e.touches[0].clientX;
      let yMove = e.touches[1].clientY - e.touches[0].clientY;
      let distance = Math.sqrt(xMove * xMove + yMove * yMove);
      if (this.data.distance != 0) {
        let distanceDiff = distance - this.data.distance;
        let newScale = goods.scale + 0.005 * distanceDiff;
        if (newScale <= 2 && newScale >= 0.5) {
          goods.scale = newScale;
          goods.width = goods.picwidth * goods.scale;
          goods.height = goods.picheight * goods.scale;
        }
      }
      this.setData({
        distance: distance,
        goodsArr: goodsArr
      })
    }
  },

  ImgTouchEnd() {
    this.setData({
      distance: 0,
      touchX: 0,
      touchY: 0
    })
  },

  saveCanvas() {
    if (this.data.goodsArr.length == 0) return;
    wx.showLoading({
      title: '保存中...',
    })
    // this.setData({
    //   canvasHidden: false
    // })
    var unit = this.data.unit;
    var _this = this;
    var ctx = wx.createCanvasContext('customCanvas');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, _this.data.screenWidth * unit, _this.data.screenHeight * unit);
    var goodsArr = this.data.goodsArr;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.selected) {
        var imgurl = wx.getStorageSync('pic' + i);
        ctx.drawImage(imgurl, goods.left * unit, goods.top * unit, goods.width * unit, goods.height * unit);
      }
    }
    ctx.draw(false, function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.screenWidth * unit,
        height: _this.data.screenWidth * unit,
        destWidth: _this.data.screenWidth * unit,
        destHeight: _this.data.screenWidth * unit,
        canvasId: 'customCanvas',
        success: function(res) {
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }

          wx.uploadFile({
            url: api.PlanSave,
            filePath: res.tempFilePath,
            name: 'image',
            formData: {
              goodsArr: JSON.stringify(_this.getGoodsJsonArr(_this.data.goodsArr)), //带上参数
              name: _this.data.name,
              style: _this.data.style,
              fit_group: _this.data.fit_group,
              fit_scene: _this.data.fit_scene,
              desc: _this.data.desc
            },  
            success: function (res) {
              wx.hideLoading()
              if (res.statusCode === 200) {
                var pages = getCurrentPages();
                var planListPage = pages[pages.length - 3];
                planListPage.getPlanDataByStyle();
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
          // //画板路径保存成功后，调用方法吧图片保存到用户相册
          // wx.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   //保存成功失败之后，都要隐藏画板，否则影响界面显示。
          //   success: (res) => {
          //     console.log(res)
          //     wx.hideLoading()
          //     _this.setData({
          //       canvasHidden: true
          //     })
          //   },
          //   fail: (err) => {
          //     console.log(err)
          //     wx.hideLoading()
          //     _this.setData({
          //       canvasHidden: true
          //     })
          //   }
          // })
        }
      }, this)
    });
  },

  thumbnailTapped(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    goodsArr[index].selected = !goodsArr[index].selected;
    this.setData({
      goodsArr: goodsArr
    })
  },

  getGoodsJsonArr(goodsArr) {
    let arr = [];
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      arr.push({
        id: goods.id,
        x: goods.left,
        y: goods.top,
        w: goods.width,
        h: goods.height,
        enable: goods.selected ? 1 : 0
      })
    }
    return arr;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})