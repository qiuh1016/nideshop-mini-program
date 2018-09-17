// pages/plan/canvas/canvas.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planid: '',
    planDetail: '',
    style: '',
    screenHeight: 0,
    screenWidth: 0,
    goodsArr: [],
    distance: 0,
    touchX: 0,
    touchY: 0,
    unit: 0,
    removeBtnShow: false,
    actionBarShow: false,
    canvasGoodsIndex: 0,
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
    });

    let style = options.style
    if (style) {
      this.setData({
        style: style
      })
    }

    let planid = options.planid;
    if (planid) {
      this.setData({
        planid: planid
      })
      this.getPlanDetail(planid)
    }
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
            let goodsArr = res.data.items;
            for (let i in goodsArr) {
              let goods = goodsArr[i];
              goods.scale = 1;
              goods.picwidth = goods.w;
              goods.picheight = goods.h;
              that.getImgInfo(goods.url, `pic${i}`)
            }
            that.setData({
              planDetail: res.data.plan,
              goodsArr: res.data.items
            });
          }
        }
        wx.hideLoading()
      });
  },

  toggleRemoveBtn() {
    this.setData({
      removeBtnShow: !this.data.removeBtnShow
    })
  },

  toggleActionBar(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      actionBarShow: !this.data.actionBarShow,
      canvasGoodsIndex: index
    })
  },

  /**
   * 商品缩略题点击之后 显示商品到画板，已显示的return
   */
  addToCanvas(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    if (goodsArr[index].enabled == 0) {
      goodsArr[index].enabled = 1;
      this.setData({
        goodsArr: goodsArr,
      })
    }
    this.setData({
      actionBarShow: false,
      removeBtnShow: false
    })
  },

  removeFromCanvas() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;
    goodsArr[index].enabled = 0;
    this.setData({
      goodsArr: goodsArr,
      actionBarShow: false
    })
  },

  increaseZ() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;
    let z = goodsArr[index].z
    if (z == goodsArr.length - 1) return;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.z == z + 1) {
        goods.z = z
        break
      }
    }
    goodsArr[index].z = z + 1;
    console.log(goodsArr)
    this.setData({
      goodsArr: goodsArr,
    })
  },

  decreaseZ() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;
    let z = goodsArr[index].z
    if (z == 0) return;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.z == z - 1) {
        goods.z = z
        break
      }
    }
    goodsArr[index].z = z - 1;
    console.log(goodsArr)
    this.setData({
      goodsArr: goodsArr,
    })
  },

  increaseScale() {
    console.log('increaseScale')
    let index = this.data.canvasGoodsIndex
    let goodsArr = this.data.goodsArr
    let goods = goodsArr[index]
    let newScale = goods.scale * 1.05
    // if (newScale > 2) return
    goods.scale = newScale
    goods.w = goods.picwidth * newScale
    goods.h = goods.picheight * newScale
    goods.x = goods.x - goods.picwidth * 0.025
    goods.y = goods.y - goods.picheight * 0.025
    console.log(goods.scale);
    this.setData({
      goodsArr: goodsArr,
    })
  },

  decreaseScale() {
    console.log('decreaseScale')
    let index = this.data.canvasGoodsIndex
    let goodsArr = this.data.goodsArr
    let goods = goodsArr[index]
    let newScale = goods.scale * 0.95
    // if (newScale < 0.5) return
    goods.scale = newScale
    goods.w = goods.picwidth * newScale
    goods.h = goods.picheight * newScale
    goods.x = goods.x + goods.picwidth * 0.025
    goods.y = goods.y + goods.picheight * 0.025
    this.setData({
      goodsArr: goodsArr,
    })
  },

  addGoods(goods) {
    let goodsArr = this.data.goodsArr;
    let width = this.data.screenWidth / 2;
    goods.picwidth = width;
    goods.picheight = width;
    goods.w = width;
    goods.h = width;
    goods.y = (this.data.screenWidth - goods.picwidth) / 2;
    goods.x = (this.data.screenWidth - goods.picheight) / 2;
    goods.scale = 1;
    goods.z = goodsArr.length;
    goods.enabled = 0;
    goods.scale = 1;
    goodsArr.push(goods);
    this.getImgInfo(goods.url, `pic${goodsArr.length - 1}`)
    this.setData({
      goodsArr: goodsArr,
      removeBtnShow: false
    })
  },

  removeGoods(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    let removeZ = goodsArr[index].z;
    goodsArr.splice(index, 1);
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      // 后面的z 全部剪1
      if (goods.z > removeZ) goods.z = goods.z - 1;
      // 缓存的图片地址 改一下key
      if (i >= index) {
        let j = i;
        let picurl = wx.getStorageSync(`pic${++j}`)
        wx.setStorageSync(`pic${--j}`, picurl)
      }
    }
    this.setData({
      goodsArr: goodsArr
    })
  },

  getImgInfo(netUrl, storageKeyUrl) {
    let that = this;
    wx.getImageInfo({
      src: netUrl,
      success: function (res) {
        wx.setStorage({
          key: storageKeyUrl,
          data: res.path,
        });
      }
    })
  },

  saveCanvas() {
    if (this.data.goodsArr.length == 0) return;
    wx.showLoading({
      title: '保存中...',
    })
    var unit = this.data.unit;
    var _this = this;
    var ctx = wx.createCanvasContext('customCanvas');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, _this.data.screenWidth * unit, _this.data.screenHeight * unit);
    var goodsArr = this.data.goodsArr;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.enabled == 1) {
        var imgurl = wx.getStorageSync('pic' + i);
        ctx.drawImage(imgurl, goods.x * unit, goods.y * unit, goods.w * unit, goods.h * unit);
      }
    }
    ctx.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.data.screenWidth * unit,
        height: _this.data.screenWidth * unit,
        destWidth: _this.data.screenWidth * unit,
        destHeight: _this.data.screenWidth * unit,
        canvasId: 'customCanvas',
        success: function (res) {
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          wx.hideLoading();
          
          wx.navigateTo({
            url: `../add/add?planid=${_this.data.planid}&style=${_this.data.style}&tempFilePath=${res.tempFilePath}`,
          })
          /*
          wx.uploadFile({
            url: api.PlanSave,
            filePath: res.tempFilePath,
            name: 'image',
            formData: {
              goodsArr: JSON.stringify(_this.data.goodsArr), //带上参数
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
                var pages = getCurrentPages();
                var planListPage = pages[pages.length - 3];
                planListPage.getPlanDataByStyle();
                wx.navigateBack({
                  delta: 2
                })
              }
            }
          })
          */
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

  ImgTouchStart() {
    this.setData({
      actionBarShow: false
    })
  },

  ImgTouchMove(e) {
    let clientX = e.touches[0].clientX
    let clientY = e.touches[0].clientY
    if (clientX > this.data.screenWidth || clientY > this.data.screenWidth) return;
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    let goods = goodsArr[index];
    if (e.touches.length == 1) {
      if (this.data.touchX != 0 || this.data.touchY != 0) {
        let diffX = clientX - this.data.touchX;
        let diffY = clientY - this.data.touchY;
        goods.x = goods.x + diffX;
        goods.y = goods.y + diffY;
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
        let diffScale = 0.005 * distanceDiff;
        let newScale = goods.scale + diffScale;
        // if (newScale > 2 || newScale < 0.5) {
        goods.scale = newScale;
        goods.w = goods.picwidth * newScale;
        goods.h = goods.picheight * newScale;
        goods.x = goods.x - goods.picwidth * diffScale / 2
        goods.y = goods.y - goods.picheight * diffScale / 2
        // }
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

  },

  /**
   * 模拟数据
   */
  getTestData() {
    let goodsTestArr = [{
      id: 1,
      url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/82523815/TB1bDJIeiMnBKNjSZFzXXc_qVXa_!!0-item_pic.jpg_360x360Q90.jpg',
    }, {
      id: 2,
      url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3864942132/TB2K_KssyQnBKNjSZFmXXcApVXa_!!3864942132-0-item_pic.jpg_360x360Q90.jpg'
    }, {
      id: 3,
      url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/96416556/TB2bvk2tCtYBeNjSspkXXbU8VXa_!!0-saturn_solar.jpg_360x360Q90.jpg'
    }, {
      id: 4,
      url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2055544716/TB2w3tlt29TBuNjy1zbXXXpepXa_!!2055544716-0-item_pic.jpg_360x360Q90.jpg'
    }];

    let goodsArr = this.data.goodsArr;
    for (let i in goodsTestArr) {
      let goods = goodsTestArr[i];
      this.addGoods(goods);
      this.getImgInfo(goods.url, 'pic' + i);
    }
  },
})