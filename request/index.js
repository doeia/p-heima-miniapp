let ajaxTimes = 0;

export const request = (params) => {
    //判断url中是否有/my/ 有私有路径的 带上header token

    let header = { ...params.header };
    if (params.url.includes("/my/")) {
        header["Authorizetion"] = wx.getStorageSync("token");
    }

    //等待加载蒙版
    //请求多个时，每个请求累加
    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask: true
    });

    const baseUrl = "https://api.zbztb.cn/api/public/v1"
    return new Promise((resolve, reject) => {
        var reqTask = wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                //请求多个时，每完成一个请求就减去一个
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading()
                }

            }
        });
    })
}