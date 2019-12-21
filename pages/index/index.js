import { request } from "../../request/index.js";
Page({
  data: {
    swiperList: []

  },
  //options(Object)
  onLoad: function (options) {
    // var reqTask = wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    //   fail: () => { },
    //   complete: () => { }
    // });

    request({ url: "https://api.zbztb.cn/api/public/v1/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })
  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});