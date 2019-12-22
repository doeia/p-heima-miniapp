// pages/goods_list/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  //接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  //总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList()
  },

  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParams });
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      //下拉拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    wx.stopPullDownRefresh();
  },

  //从子组件传递过来的事件
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '到底了',
        icon: 'none',
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  }
})