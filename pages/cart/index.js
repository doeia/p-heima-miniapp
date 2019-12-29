// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
    const cart = wx.getStorageSync("cart") || [];

    this.setData({ address });
    this.setCart(cart);
  },

  async handleChooseAddress() {
    try {
      //1 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"]
      //2 判断权限状态 从新获取权限
      if (scopeAddress === false) {
        await openSetting();
      }
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }

  },

  //商品选中
  handleItemChange(e) {
    //1 获取商品id
    const goods_id = e.currentTarget.dataset.id;
    console.log(goods_id)
    //2 获取购物车数组
    let { cart } = this.data;
    //3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //4 状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart);

  },

  //设置购物车状态同时， 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    //总价格，总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice, totalNum, allChecked
    });
    wx.setStorageSync("cart", cart);
  },

  //全选-全反选
  handleItemAllChecked() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data;
    //2 修改值
    allChecked = !allChecked;
    //3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 填充回data或者缓存中
    this.setCart(cart);
  },

  //商品增减
  async handleItemNumEdit(e) {
    // 1 获取传过来的数据
    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    // 找到需修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      // 4 填充回data或者缓存中
      this.setCart(cart);
    }

  },

  //结算
  async handlePay() {
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" })
      return
    }

    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }

    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }



})