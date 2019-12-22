// pages/auth/index.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from "../../utils/asyncWx.js"
Page({
  //获取用户信息
  async handleGetUserInfo(e) {

    try {
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code }
      // 获取token
      const token = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
      console.log(token);
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error)
    }
  }
})