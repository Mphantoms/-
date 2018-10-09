//index.js
const app = getApp()

Page({
  onLoad: function(){
    console.log('进入安卓页面');
    this.getInitType();
    this.getInitLabel();
    this.getInitUid();
    this.setData({
      canvasWidth: 1000,
      canvasHeight: 1000,
    })
  },
  getInitUid: function(){
    var _this = this;
    wx.request({
      url: 'https://www.join-hov.com/person/upload/face_get_uniqid.php',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        _this.setData({
          uid: res.data.uid
        })
      }
    })
  },
  getInitType: function(){
    var _this = this;
    try {
      var user_id = wx.getStorageSync('user_id');
      var username = wx.getStorageSync('name');
      _this.setData({
        user_id: user_id,
        username: username
      })
    } catch (e) {

    }
    wx.request({
      url: 'https://www.join-hov.com/person/upload/get_face_type.php',
      header: {
        'content-type': 'application/x-www-form-urlencoded' 
      },
      data: {
        user_id: user_id
      },
      method: 'post',
      success: function (res) {
        _this.setData({
          items: res.data
        })
      }
    })
  },
  getInitLabel: function(){
    var _this = this;
    wx.request({
      url: 'https://www.join-hov.com/person/upload/get_lable.php',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        _this.setData({
          radioArr2: res.data
        })
      }
    })
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
    plat: '',
    items: [],
    canvasWidth: 0,
    user_id: 0,
    canvasHeight: 0,
    clickid: -1,
    imgwidth: 0,
    imgheight: 120,
    imgheight2: 128,
    imgwidth2: 0,
    username: '管理员',
    type: '',
    radioArr1: [
      { value: 1, name: '男', check: true},
      { value: 2, name: '女', check: false},
    ],
    scrollTops: 100,
    radioArr2: [],
    src: '',
    src2: '',
    src3: '',
    imgheight3: 128,
    imgwidth3: 0,
    src4: '',
    imgheight4: 128,
    imgwidth4: 0,
    session_id: '',
    face_index: '',
    uid: '',
    label: '',
    remark: '',
    id_img: '',
    id_name: '',
    id_sex: 1,
    id_number: '',
    id_birthday: '',
    address: '',
    date: '1980-01-01',
    imgarr: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //注销
  /*Logout: function(){
    try {
      wx.clearStorageSync();
      wx.reLaunch({
        url: '../login/login',
      })
    } catch (e) {
      // Do something when catch error
    }
  },*/


  //类型
  radioChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },
  //性别
  radioChange1: function (e) {
    this.setData({
      id_sex: e.detail.value
    })
  },
  //标签
  radioChange2: function (e) {
    this.setData({
      label: e.detail.value
    })
  },
  //备注
  remarkChange: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  //出生日期
  bindDateChange: function (e) {
    this.setData({
      id_birthday: e.detail.value,
      date: e.detail.value
    })
  },
  //姓名
  nameChange: function(e){
    this.setData({
      id_name: e.detail.value
    })
  },
  //证件号
  numChange: function (e) {
    this.setData({
      id_number: e.detail.value
    })
  },
  //户籍地址
  adressChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  //人像图片的处理
  clickToCamare(){
    var _this = this;
    console.log(1);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            _this.setData({
              clickid: '',
              face_index: ''
            })
            wx.showLoading({
              title: '正在上传...',
            })
            var bit = _this.data.imgheight / res.height;
            var widths = res.width * bit;
            var originWidth = res.width;
            var originHeight = res.height;
            var ctx = wx.createCanvasContext('photo_canvas');
            var maxWidth = originWidth, maxHeight = originHeight;
            var bit = originWidth / originHeight;
            //Math.sqrt(x)
            if (originWidth > originHeight) {
              if (originWidth > 1000) {
                maxWidth = 1000;
                maxHeight = originHeight / originWidth * maxWidth;
              }
            } else {
              if (originHeight > 1000) {
                maxHeight = 1000;
                maxWidth = originWidth / originHeight * maxHeight;
              }
            }
            console.log(originWidth, originHeight);
            console.log(maxWidth, maxHeight);
            _this.setData({
              imgwidth: widths,
              src: tempFilePaths,
              imgarr: [],
              session_id: ''
            })
            ctx.drawImage(tempFilePaths[0], 0, 0, maxWidth, maxHeight);
            ctx.draw(true,function(){
              setTimeout(function () {
                wx.canvasToTempFilePath({
                  canvasId: 'photo_canvas',
                  quality: 0.9,
                  x: 0,
                  y: 0,
                  width: maxWidth,
                  height: maxHeight,
                  destWidth: maxWidth,
                  destHeight: maxHeight,
                  fileType: 'jpg',
                  success: function (datas) {
                    setTimeout(function () {
                      wx.uploadFile({
                        url: 'https://www.join-hov.com/person/upload/face_detect_wechat.php',
                        filePath: datas.tempFilePath,
                        formData: {
                          'uid': _this.data.uid,
                        },
                        name: 'person_image',
                        success: function (res) {
                          console.log(res);
                          wx.hideLoading();
                          var data = JSON.parse(res.data);

                          if (data.faces.length == 0) {
                            wx.showToast({
                              title: '未识别到人脸',
                            });
                            return false;
                          }
                          if (data.faces.length == 1) {
                            _this.setData({
                              clickid: 0,
                              face_index: 0
                            })
                          };
                          _this.setData({
                            imgarr: data.faces,
                            session_id: data.session_id,
                          });
                          wx.showToast({
                            title: '上传成功',
                            icon: 'success'
                          })
                        }
                      })
                    }, 100)

                  },
                  fail: function (error) {
                    console.log(error)
                    wx.showToast({
                      title: '网络缓慢，上传失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              }, 100)
            });
          },
          fail: function (error) {
            console.log(error)
            wx.showToast({
              title: '网络缓慢，上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  //人像图片的处理
  clickToCamare3() {
    var _this = this;
    console.log(3);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;

        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            wx.showLoading({
              title: '正在上传...',
            })
            var bit = _this.data.imgheight3 / res.height;
            var widths = res.width * bit;
            var originWidth = res.width;
            var originHeight = res.height;
            var ctx = wx.createCanvasContext('photo_canvas');
            var maxWidth = originWidth, maxHeight = originHeight;
            var bit = originWidth / originHeight;
           
            //Math.sqrt(x)
            if (originWidth > originHeight) {
              if (originWidth > 1000) {
                maxWidth = 1000;
                maxHeight = originHeight / originWidth * maxWidth;
              }
            } else {
              if (originHeight > 1000) {
                maxHeight = 1000;
                maxWidth = originWidth / originHeight * maxHeight;
              }
            }
            _this.setData({
              imgwidth3: widths,
              src3: tempFilePaths,
            })
            ctx.drawImage(tempFilePaths[0], 0, 0, maxWidth, maxHeight);
            ctx.draw(true, function () {
              wx.canvasToTempFilePath({
                canvasId: 'photo_canvas',
                quality: 0.8,
                x: 0,
                y: 0,
                width: maxWidth,
                height: maxHeight,
                destWidth: maxWidth,
                destHeight: maxHeight,
                fileType: 'jpg',
                success: function (datas) {
                  wx.uploadFile({
                    url: 'https://www.join-hov.com/person/upload/upload_face.php',
                    filePath: datas.tempFilePath,
                    formData: {
                      'uid': _this.data.uid,
                      'img_index': 1
                    },
                    name: ' face_image',
                    success: function (res) {
                      wx.hideLoading();
                      var data = JSON.parse(res.data);
                      if (data.errormsg == 'succ') {
                        wx.showToast({
                          title: '上传成功',
                          icon: 'success'
                        })
                      }
                    }
                  })
                },
                fail: function (error) {
                  console.log(error)
                  wx.showToast({
                    title: '网络缓慢，上传失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            })

          },
          fail: function (error) {
            console.log(error)
            wx.showToast({
              title: '网络缓慢，上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },


  //人像图片的处理
  clickToCamare4() {
    var _this = this;
    console.log(4);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;

        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            wx.showLoading({
              title: '正在上传...',
            })
            var bit = _this.data.imgheight3 / res.height;
            var widths = res.width * bit;
            var originWidth = res.width;
            var originHeight = res.height;
            var ctx = wx.createCanvasContext('photo_canvas');
            var maxWidth = originWidth, maxHeight = originHeight;
            var bit = originWidth / originHeight;
            
            //Math.sqrt(x)
            //Math.sqrt(x)
            if (originWidth > originHeight) {
              if (originWidth > 1000) {
                maxWidth = 1000;
                maxHeight = originHeight / originWidth * maxWidth;
              }
            } else {
              if (originHeight > 1000) {
                maxHeight = 1000;
                maxWidth = originWidth / originHeight * maxHeight;
              }
            }
            _this.setData({
              imgwidth4: widths,
              src4: tempFilePaths,
            })
            ctx.drawImage(tempFilePaths[0], 0, 0, maxWidth, maxHeight);
            ctx.draw(false, function () {
              wx.canvasToTempFilePath({
                canvasId: 'photo_canvas',
                quality: 0.9,
                x: 0,
                y: 0,
                width: maxWidth,
                height: maxHeight,
                destWidth: maxWidth,
                destHeight: maxHeight,
                fileType: 'jpg',
                success: function (datas) {
                  wx.uploadFile({
                    url: 'https://www.join-hov.com/person/upload/upload_face.php',
                    filePath: datas.tempFilePath,
                    formData: {
                      'uid': _this.data.uid,
                      'img_index': 2
                    },
                    name: ' face_image',
                    success: function (res) {
                      wx.hideLoading();
                      var data = JSON.parse(res.data);
                      if (data.errormsg == 'succ'){
                        wx.showToast({
                          title: '上传成功',
                          icon: 'success'
                        })
                      }
                    }
                  })
                },
                fail: function (error) {
                  console.log(error)
                  wx.showToast({
                    title: '网络缓慢，上传失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            })

          },
          fail: function (error) {
            console.log(error)
            wx.showToast({
              title: '网络缓慢，上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },





  //身份证上传方法


  //身份证图片的处理
  clickToCamare2() {
    var _this = this;
    console.log(2);
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success: function (res) {
            _this.setData({
              id_name: '',
              id_sex: '',
              id_number: '',
              id_birthday: '1',
              address: '',
              date: '1980-01-01',
            })
            wx.showLoading({
              title: '正在上传...',
            })
            var originWidth = res.width;
            var originHeight = res.height;
            var imgbit = _this.data.imgheight2 / res.height;
            var imgwidth = res.width * imgbit;
            var ctx = wx.createCanvasContext('photo_canvas');
            var maxWidth = originWidth, maxHeight = originHeight;
            var bit = originWidth / originHeight;
            //Math.sqrt(x)
            //Math.sqrt(x)
            if (originWidth > originHeight) {
              if (originWidth > 1000) {
                maxWidth = 1000;
                maxHeight = originHeight / originWidth * maxWidth;
              }
            } else {
              if (originHeight > 1000) {
                maxHeight = 1000;
                maxWidth = originWidth / originHeight * maxHeight;
              }
            }
            console.log(originWidth, originHeight);
            console.log(maxHeight, maxWidth);
            _this.setData({
              imgwidth2: imgwidth
            })
            console.log(maxWidth, maxHeight, tempFilePaths[0]);
            ctx.drawImage(tempFilePaths[0], 0, 0, maxWidth, maxHeight);
            ctx.draw(false,function(){
              setTimeout(function(){
                wx.canvasToTempFilePath({
                  canvasId: 'photo_canvas',
                  quality: 0.9,
                  x: 0,
                  y: 0,
                  width: maxWidth,
                  height: maxHeight,
                  destWidth: maxWidth,
                  destHeight: maxHeight,
                  fileType: 'jpg',
                  success: function (datas) {
                    console.log(datas.tempFilePath);
                    setTimeout(function(){
                     wx.uploadFile({
                        url: 'https://www.join-hov.com/person/upload/id_ocr.php',
                        filePath: datas.tempFilePath,
                        formData: {
                          'uid': _this.data.uid
                        },
                        name: 'id_image',
                        success: function (res) {
                          wx.hideLoading();
                          console.log(res);
                          var data = JSON.parse(res.data);
                          if (data.res==0) {
                            
                            var sex = 0;
                            if (data.cards[0].gender == '男') {
                              sex = 1;
                              _this.data.radioArr1[0].check = true;
                              _this.data.radioArr1[1].check = false;
                            } else {
                              sex = 2;
                              _this.data.radioArr1[0].check = false;
                              _this.data.radioArr1[1].check = true;
                            }
                            _this.setData({
                              id_name: data.cards[0].name,
                              id_sex: sex,
                              id_number: data.cards[0].id_card_number,
                              id_birthday: data.cards[0].birthday,
                              address: data.cards[0].address,
                              date: data.cards[0].birthday,
                              radioArr1: _this.data.radioArr1
                            })
                            wx.showToast({
                              title: '上传成功',
                              icon: 'success'
                            })
                          }else{
                            wx.showToast({
                              title: '未识别到身份证信息',
                              icon: 'none'
                            })
                          }
                        }
                      })
                    },100)
                    
                  },
                  fail: function (error) {
                    console.log(error)
                    wx.showToast({
                      title: '网络缓慢，上传失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
              },100)
              
            });
          },
          fail: function (error) {
            console.log(error)
            wx.showToast({
              title: '网络缓慢，上传失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
        _this.setData({
          src2: tempFilePaths,
          id_img: tempFilePaths[0],
        });
      }
    })
  },
 
  clickToChangerColor: function (e){
    var ids = e.currentTarget.dataset.id;
    this.setData({
      clickid: ids,
      face_index: ids
    })
  },
  //验证身份证日期与输入日期是否相符合
  tqymd: function (idCard){
    var birthday = "";
    if (idCard != null && idCard != "") {
      if (idCard.length == 15) {
        birthday = "19" + idCard.substr(6, 6);
      } else if (idCard.length == 18) {
        birthday = idCard.substr(6, 8);
      }

      birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
    }
    return birthday;
  },
  //验证身份证
  IdentityCodeValid: function (code){
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      tip = "身份证号格式错误";
    }

    else if (!city[code.substr(0, 2)]) {
      tip = "身份证地址编码错误";
    }
    else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != code[17]) {
          tip = "身份证校验位错误";
        }
      }
    }
    return tip;
  },
  //跳到界面顶部
  scrollTopEvent: function(e){
    console.log(e.detail);
  },
  //清除数据
  clearData: function () {
    this.getInitUid();
    this.setData({
      clickid: -1,
      src: '',
      src2: '',
      session_id: '',
      face_index: '',
      uid: '',
      label: '',
      remark: '',
      id_img: '',
      id_name: '',
      id_sex: 1,
      id_number: '',
      id_birthday: '',
      address: '',
      date: '1980-01-01',
      imgarr: [],
      src3: '',
      src4: ''
    });
    wx.showToast({
      title: '重置成功',
    });
  },
  //提交数据到服务器
  clickToSer: function(){
    var _this = this;
    _this.setData({
      scrollTops: 0
    })
    if (_this.data.type==""){
      wx.showToast({
        title: '请选择类型',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (_this.data.face_index === "") {
      wx.showToast({
        title: '请选择头像',
        icon: 'none',
        duration: 2000
      })
      console.log(_this.data.face_index);
      return false;
    }
    if (_this.data.id_name == "") {
      wx.showToast({
        title: '名字不为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (_this.data.id_birthday < 6) {
      wx.showToast({
        title: '身份证信息错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      if (_this.tqymd(_this.data.id_number) != _this.data.id_birthday) {
        wx.showToast({
          title: '出生日期与身份证日期不匹配',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    if (_this.data.id_number.length < 15) {
      wx.showToast({
        title: '身份证号码长度不够',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      var msges = _this.IdentityCodeValid(_this.data.id_number);
      if (msges != "") {
        wx.showToast({
          title: msges,
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }
    if (_this.data.id_img!=""){
      wx.request({
        url: 'https://www.join-hov.com/person/upload/add_face_wechat.php',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          type: _this.data.type,
          session_id: _this.data.session_id,
          face_index: _this.data.face_index,
          uid: _this.data.uid,
          label: _this.data.label,
          remark: _this.data.remark,
          id_name: _this.data.id_name,
          id_sex: _this.data.id_sex,
          id_number: _this.data.id_number,
          id_birthday: _this.data.id_birthday,
          address: _this.data.address,
          user_id: _this.data.user_id
        },
        
        success: function (res) {
          console.log(res);
          
          if (res.data.res==0) {
            wx.showToast({
              title: res.data.errormsg,
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              _this.clearData();
              wx.pageScrollTo({
                scrollTop: 0
              })
            }, 3000)
          }else{
            wx.showToast({
              title: res.data.errormsg,
              icon: '提交失败' + res.data.res,
              duration: 2000
            })
          }
        }
      })
    }
  }
})
