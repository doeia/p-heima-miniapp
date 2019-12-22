// pages/category/index.js
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightContent: [],
    //左侧被点击的菜单
    currentIndex: 0,
    //右侧滚动条回到顶部
    scrollTop: 0
  },

  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 缓存：
    // 判断本地有数据否，没有过期就发送请求
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCates();
    } else {
      //有旧的数据 定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        console.log('重新发送请求')
        this.getCates()
      } else {
        //可以使用的旧数据
        console.log('可以使用的旧数据')
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  getCates() {
    request({
      url: 'https://api.zbztb.cn/api/public/v1/categories'
    })
      .then(res => {
        this.Cates = res.data.message;

        //把接口的数据存储到本地
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent
        })
      })
  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })

  }
})