
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    //被收藏商品的数量
    collectNums: 0
  },
  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect") || [];
    this.setData({ userinfo, collectNums: collect.length })
  },
  handleGetUserInfo(e) {
    const { userInfo } = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})