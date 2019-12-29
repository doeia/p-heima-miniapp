// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({ address });

    //总价格，总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  //点击 支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      //const token = '2a7136e2a9180955af0a7ef92007e0f5'
      // 2 token
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }

      //3 创建订单
      //const header = { Authorizetion: token };
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))

      const orderParams = { order_price, consignee_addr, goods }
      // 4 创建订单 获取订单号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      // 5 发起 预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台 订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })

      await showToast({ title: "支付成功" })
      // 8 手动删除缓存中 已经支付的商品
      let newCart = wx.getStorageSync("cart");
      //过滤掉已被选中的
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync("cart", newCart);

      //9 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });

    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error)
    }
  }

})