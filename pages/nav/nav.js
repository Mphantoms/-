const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  onLoad: function(){
    try {
      var plat = wx.getStorageSync('plat');
      console.log(plat);
      this.setData({
        plat: plat
      });
    } catch (e) {
      // Do something when catch error
    }
  },
  data: {
    plat: ''
  },
  toChangepwd: function(){
    wx.navigateTo({
      url: '../changepwd/index',
    })
  },
  toIndex: function(){
    if(this.data.plat == 'android'){
      wx.navigateTo({
        url: '../android/index',
      })
    }else{
      wx.navigateTo({
        url: '../ios/index',
      })
    }
  },
  toCancel: function(){
    wx.clearStorageSync();
    wx.reLaunch({
      url: '../login/login',
    })
  }
})