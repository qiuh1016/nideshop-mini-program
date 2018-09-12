// pages/plan/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    screenWidth: 0,
    goods: [],
    distance: 0,
    touchX: 0,
    touchY: 0,
    canvasHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var ctx = wx.createCanvasContext('customCanvas');
    // ctx.setFillStyle('#5F6FEE')//文字颜色：默认黑色
    // ctx.setFontSize(20)//设置字体大小，默认10
    // ctx.fillText("LXT", 20, 20)//绘制文本
    // //调用draw()开始绘制
    // ctx.draw()

    // ctx.drawImage("../../../static/images/wxpay.png", 0, 0, 100, 100)
    // ctx.draw()
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    this.getData();
  },

  getData() {
    let goods = [{
        id: 1,
        url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/82523815/TB1bDJIeiMnBKNjSZFzXXc_qVXa_!!0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 100,
        picheight: 100,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 2,
        url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3864942132/TB2K_KssyQnBKNjSZFmXXcApVXa_!!3864942132-0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 100,
        picheight: 100,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 3,
        url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/96416556/TB2bvk2tCtYBeNjSspkXXbU8VXa_!!0-saturn_solar.jpg_360x360Q90.jpg',
        picwidth: 80,
        picheight: 80,
        width: 80,
        height: 80,
        top: 0,
        left: 0,
        scale: 1
      }, {
        id: 4,
        url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2055544716/TB2w3tlt29TBuNjy1zbXXXpepXa_!!2055544716-0-item_pic.jpg_360x360Q90.jpg',
        picwidth: 100,
        picheight: 100,
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        scale: 1
    }];

    for (let i in goods) {
      let good = goods[i];
      good.selected = false;
      let _this = this;
      // setTimeout(function() {
      //   _this.getImgInfo(good.url, 'pic'+i);
      // }, 1000 * i);
    }

    this.setData({
      goods: goods
    })

    return;

    wx.getImageInfo({
      src: netUrl,
      success: (res) => { //请求接口成功后
        this.imgUrl = res.data.data;
        app.globalData.imgUrl = this.imgUrl;
        for (let i = 0; i < this.imgUrl.length; i++) { // 使用循环遍历出数组得数据
          for (let e = 0; e < this.imgUrl[i].length; e++) {
            wx.getImageInfo({ //保存网络图片
              src: "https://" + this.imgUrl[i][e].url, //请求的网络图片路径
              success: function (res) {
                //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
                app.globalData.imgUrl[i][e].localpic = res.path;
                if (i == 2 && e == that.imgUrl[2].length - 1) { //数据量太大时做一个加载判断，
                  that.setData({
                    show: 1
                  })
                }
              },
            })
          }
        }
      }
    })

  },

  getImgInfo(netUrl, storageKeyUrl) {
    console.log(storageKeyUrl);
    wx.getImageInfo({
      src: netUrl,
      success: function(res) {
        console.log('storageKeyUrl' + storageKeyUrl);
        wx.setStorage({
          key: storageKeyUrl,
          data: res.path,
        });
      }
    })
  },

  ImgTouchStart(e) {
    console.log(e.touches[0].clientX);
    console.log(e.touches[0].clientY);
  },

  ImgTouchMove(e) {
    let index = e.currentTarget.dataset.index;
    let goods = this.data.goods;
    let good = goods[index];
    if (e.touches.length == 1) {
      if (this.data.touchX != 0 || this.data.touchY != 0) {
        let diffX = e.touches[0].clientX - this.data.touchX;
        let diffY = e.touches[0].clientY - this.data.touchY;
        good.left = good.left + diffX;
        good.top = good.top + diffY;
        this.setData({
          goods: goods
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
        let newScale = good.scale + 0.005 * distanceDiff;
        if (newScale <= 2 && newScale >= 0.5) {
          good.scale = newScale;
          good.width = good.picwidth * good.scale;
          good.height = good.picheight * good.scale;
        }
      }
      this.setData({
        distance: distance,
        goods: goods
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
    wx.showLoading({
      title: '保存中...',
    })
    this.setData({
      canvasHidden: false
    })
    var _this = this;
    var ctx = wx.createCanvasContext('customCanvas');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, _this.data.screenWidth, _this.data.screenHeight);
    var unit = this.data.screenWidth / 375;
    var goods = this.data.goods;
    for (let i in goods) {
      let good = goods[i];
      if (good.selected) {
        var imgurl = wx.getStorageSync('pic' + i);
        console.log(imgurl);
        ctx.drawImage(imgurl, good.left, good.top, good.width, good.height);
        console.log('draw : ' + i);
      }
    }
    ctx.draw(false, function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.screenWidth,
        height: _this.data.screenHeight,
        canvasId: 'customCanvas',
        success: function(res) {
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          //画板路径保存成功后，调用方法吧图片保存到用户相册
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            //保存成功失败之后，都要隐藏画板，否则影响界面显示。
            success: (res) => {
              console.log(res)
              wx.hideLoading()
              _this.setData({
                canvasHidden: true
              })
            },
            fail: (err) => {
              console.log(err)
              wx.hideLoading()
              _this.setData({
                canvasHidden: true
              })
            }
          })
        }
      }, this)
    });
  },

  thumbnailTapped(e) {
    let index = e.currentTarget.dataset.index;
    let goods = this.data.goods;
    goods[index].selected = !goods[index].selected;
    this.setData({
      goods: goods
    })
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