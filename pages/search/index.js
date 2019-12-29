// pages/search/index.js
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    //取消按钮是否显示
    isFocus: false,
    //输入框的值
    inpValue: ""
  },

  //防抖定时 防止重复请求
  //节流？
  TimeId: -1,

  handleInput(e) {
    const { value } = e.detail;
    //检查合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }

    this.setData({
      isFocus: true
    })

    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000);

  },

  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    console.log(res);
    this.setData({
      goods: res
    })
  },

  handleCancel() {
    this.setData({

      inpValue: "",
      isFocus: false,
      goods: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})