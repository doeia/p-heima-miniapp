// pages/goods_detail/index.js

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  GoodsInfo: {},

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
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
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
  }
})