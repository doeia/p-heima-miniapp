// pages/goods_detail/index.js

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},

    isCollect: false
  },

  GoodsInfo: {},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options
    this.getGoodsDetail(goods_id);


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = goodsObj;

    //获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    //判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)

    //整理了需要的数据
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // 替换了苹果手机不能识别的图片格式
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },

  handlePreviewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    });
  },

  //点击加入购物车
  handleCartAdd() {
    // 2. 获取缓存中的购物车数据 数组格式
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3. 先判断 当前的商品是否已经存在于购物车
    if (index === -1) {
      // 4. 不存在 添加一个新元素 带上属性num
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    } else {
      // 5. 如果已经存在 数量++ 重新把购物车数组
      cart[index].num++
    }
    //6. 填充回缓存中
    wx.setStorageSync("cart", cart);

    wx.showToast({
      title: '加入成功',
      icon: 'sucess',
      mask: true
    });
  },
  //点击收藏商品
  handleCollect() {
    let isCollect = false;
    //1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //2 判断是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    //3 当index != -1 表示 已经收藏
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    //4 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    //5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
})