// pages/order/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: '全部订单',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ]
  },

  // onShow不同于onLoad 无法在形参上接收 options参数
  onShow: function (options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    //获取小程序的页面栈-数组 长度最大是10页
    let pages = getCurrentPages();
    console.log(pages)
    //数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options)
    const { type } = currentPage.options;
    //激活选中页面标题
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },

  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } })
    console.log(res)
    this.setData({
      orders: res.orders.map(v => ({ ...v, crate_time_cn: (new Date(v.crate_time * 1000).toLocaleString()) }))
    })
  },

  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  //从子组件传递过来的事件
  handleTabsItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求 type=1 index=0
    this.getOrders(index + 1)
  }

})