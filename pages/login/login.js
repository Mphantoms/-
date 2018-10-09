//login.js
const app = getApp()

Page({
  onLoad: function(){
    var _this = this;
    var plat = _this.getSysIn();
    try {
      wx.setStorageSync('plat', plat);
      var phone = wx.getStorageSync('phone');
      var password = wx.getStorageSync('password');
      if (phone && password) {
        _this.setData({
          phone: phone,
          password: password
        });
        _this.login();
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  //获取手机型号
  getSysIn: function () {
    var _this = this;
    try {
      var res = wx.getSystemInfoSync()
      _this.setData({
        plat: res.platform
      })
    } catch (e) {
      _this.setData({
        plat: 'ios'
      })
    }
    return res.platform;
  },
  data: {
    phone: '',
    password: '',
    plat: ''
  },
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    var _this = this;
    if (this.data.phone.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if ( this.data.password.length == 0){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://www.join-hov.com/person/upload/rlcj_login.php',
        data: {
          name: _this.data.phone,
          pwd: _this.data.password
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if(res.data.res != 0){
            wx.showToast({
              title: res.data.errorstr,
              icon: 'none',
              duration: 2000
            })
          }else{
            wx.showLoading({
              title: '登录成功',
              icon: 'success'
            })
            try {
              wx.setStorageSync('name', res.data.name);
              wx.setStorageSync('phone', _this.data.phone);
              wx.setStorageSync('password', _this.data.password);
              wx.setStorageSync('user_id', res.data.user_id);
            } catch (e) {

            }
            setTimeout(function () {
              wx.hideLoading();
              console.log('当前手机为' + _this.data.plat);
              wx.reLaunch({
                url: '../nav/nav',
              })
            }, 2000);
          }
        }
      })
    }
  }
})