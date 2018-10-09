//index.js
const app = getApp()

Page({
  onLoad: function(){
    try{
      var phone = wx.getStorageSync('phone');
      this.setData({
        nowPass: phone,
      })
    }catch(e){

    }
  },
  data: {
    nowPass: '',
    newPass: '',
    newPass1: '',
    lastPass: ''
  },
  clearThis:function(e){
    var index = parseInt(e.target.dataset.index);
    if (index==1){
      wx.showToast({
        title: '此项不允许修改',
        icon: 'none'
      })
    } else if (index == 2){
      this.setData({
        newPass: ''
      })
    }else if(index == 3){
      this.setData({
        lastPass: ''
      })
    }else{
      this.setData({
        newPass1: ''
      })
    }
  },
  toServer: function(){
    var _this = this;
    if (_this.data.lastPass != _this.data.newPass1){
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
    }else{
      if (_this.data.lastPass.length < 6) {
        wx.showToast({
          title: '密码太短了，请输入6位及以上',
          icon: 'none'
        })
        return false;
      }
      wx.request({
        url: 'https://www.join-hov.com/person/upload/rlcj_change_pwd.php',
        data: {
          name: _this.data.nowPass,
          pwd: _this.data.newPass,
          new_pwd: _this.data.lastPass,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: 'post',
        success: function (res) {
          console.log(res.data);
          var data = res.data;
          if (data.res == 0) {
            wx.showToast({
              title: '密码修改成功',
              icon: 'success'
            });
            wx.clearStorageSync();
            setTimeout(function () {
              wx.reLaunch({
                url: '../login/login',
              })
            }, 2000);
          } else {
            wx.showToast({
              title: ' ' + data.res,
              icon: 'none'
            })
          }
        }
      })
    }
      
  },
  changnew: function(e){
    this.setData({
      newPass: e.detail.value
    })
  },
  changnew2: function (e) {
    this.setData({
      lastPass: e.detail.value
    })
  },
  changnew3: function(e){
    this.setData({
      newPass1: e.detail.value
    })
  }
 /* cancel: function(){
    wx.reLaunch({
      url: '../nav/nav',
    })
  }*/
})
