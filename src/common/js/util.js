import {setCookie, getCookie, delCookie} from './cookie';

// 日期格式化
export function formatDate(date, fmt) {
  date = new Date(date);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 获取userId
export function getUserId() {
  return getCookie('userId') || '';
}

// 保存用户登录信息
export function setUser(data) {
  setCookie('userId', data.userId);
  setCookie('token', data.token);
  setCookie('__sig__', data.sig);
  setCookie('__accountType__', data.accountType);
  setCookie('__txAppCode__', data.txAppCode);
}

// 获取腾讯云登录的sig
export function getSig () {
  return getCookie('__sig__') || '';
}

// 获取腾讯云登录的accountType
export function getAccountType () {
  return getCookie('__accountType__') || '';
}

// 获取腾讯云登录的txAppCode
export function getTxAppCode () {
  return getCookie('__txAppCode__') || '';
}

// 获取腾讯云登录的参数
export function getTencentParams () {
  return {
    sig: getSig(),
    accountType: getAccountType(),
    txAppCode: getTxAppCode()
  };
}

// 删除用户登录信息
export function clearUser() {
  delCookie('userId');
  delCookie('token');
  delCookie('__sig__');
  delCookie('__accountType__');
  delCookie('__txAppCode__');
}

// 是否登录
export function isLogin() {
  return !!getUserId();
}

// 是否为空
export function isUnDefined(value) {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  return false;
}

// 格式化图片地址
export function formatImg(imgs, suffix = '?imageMogr2/auto-orient') {
  if(!imgs) {
    return '';
  }
  let img = imgs.split(/\|\|/)[0];

  if (!/^http|^data:image/i.test(img)) {
    let index = img.indexOf('?imageMogr2');
    if (index !== -1) {
      suffix = img.substr(index);
      img = img.substr(0, index);
    }
    img = PIC_PREFIX + encodeURIComponent(img) + suffix;
  }
  return img;
}

// 格式化头像
export function formatAvatar(img, suffix = '?imageMogr2/auto-orient') {
  if (!img) {
    let avatar = require('../image/avatar@2x.png');
    if (/^http|^data:image/i.test(avatar)) {
      return avatar;
    }
    return location.origin + avatar;
  }
  return formatImg(img, suffix);
}

// 获得分享图片
export function getShareImg(imgs) {
  if (!imgs) {
    let sharImg = require('../image/app.png');
    if (/data:image/.test(sharImg) || /http(?:s)?/.test(sharImg)) {
      return sharImg;
    }
    return location.origin + sharImg;
  }
  return formatImg(imgs);
}

// 格式化金额
export function formatAmount(amount, len = 2) {
  if (isUnDefined(amount)) {
    return '--';
  }
  amount = (+amount / 1000).toString();
  let reg = new RegExp('(\\.\\d{' + len + 1 + '})\\d*', 'ig');
  amount = +amount.replace(reg, '$1');
  return amount.toFixed(len);
}

// 判断是否 ios
export const ISIOS = /(iphone|ipod|ipad)/i.test(navigator.userAgent);

// 微信设置页面标题
export function setTitle(title) {
  if (document.title !== title) {
    document.title = title;
    if (ISIOS) {
      let iframe = document.createElement('iframe');
      iframe.src = '//m.baidu.com/favicon.ico';
      iframe.style.display = 'none';
      iframe.onload = () => {
        setTimeout(() => {
          iframe.remove();
        }, 9);
      };
      document.body.appendChild(iframe);
    }
  }
}

// 延时函数的执行
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 清除内容里的标签
export function clearTag(content) {
  return content.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>|&nbsp;/ig, '');
}

// 是否是function
export function isFunction(fn) {
  var getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
}

// 获取图片base64
export function getImgData(fileType, img, dir, next) {
  let image = new Image();
  image.onload = function() {
    let degree = 0;
    let drawWidth;
    let drawHeight;
    let width;
    let height;
    drawWidth = this.naturalWidth;
    drawHeight = this.naturalHeight;
    let canvas = document.createElement('canvas');
    canvas.width = width = drawWidth;
    canvas.height = height = drawHeight;
    let context = canvas.getContext('2d');
    // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
    switch(dir) {
      // iphone横屏拍摄，此时home键在左侧
      case 3:
        degree = 180;
        drawWidth = -width;
        drawHeight = -height;
        break;
      // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
      case 6:
        canvas.width = height;
        canvas.height = width;
        degree = 90;
        drawWidth = width;
        drawHeight = -height;
        break;
      // iphone竖屏拍摄，此时home键在上方
      case 8:
        canvas.width = height;
        canvas.height = width;
        degree = 270;
        drawWidth = -width;
        drawHeight = height;
        break;
    }
    // 使用canvas旋转校正
    context.rotate(degree * Math.PI / 180);
    context.drawImage(this, 0, 0, drawWidth, drawHeight);
    // 返回校正图片
    next(canvas.toDataURL(fileType, 0.8));
  };
  image.src = img;
}

// 设置微信登录时填写的手机号和验证码
export function setWxMobAndCapt (mobile, captcha) {
  sessionStorage.setItem('__mob__', mobile);
  sessionStorage.setItem('__capt__', captcha);
}

// 获取微信登录时填写的手机号和验证码
export function getWxMobAndCapt () {
  let mobile = sessionStorage.getItem('__mob__');
  let captcha = sessionStorage.getItem('__capt__');
  sessionStorage.removeItem('__mob__');
  sessionStorage.removeItem('__capt__');
  if (mobile && captcha) {
    return {
      mobile,
      captcha
    };
  }
  return null;
}

// 校验短信验证码
export function captValid(capt) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(capt)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (!/^\d{4}$/.test(capt)) {
    result.err = 1;
    result.msg = '格式错误';
  }
  return result;
}

// 校验手机号
export function mobileValid(mobile) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(mobile)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (!/^1[3|4|5|7|8]\d{9}$/.test(mobile)) {
    result.err = 1;
    result.msg = '格式错误';
  }
  return result;
}

// 支付密码校验
export function tradeValid(trade) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(trade)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (trade.length < 6) {
    result.err = 1;
    result.msg = '长度不能小于6位';
  }
  return result;
}

// 校验第二次密码是否和第一次相同
export function rePwdValid(rePwd, pwd) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(rePwd)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (pwd !== rePwd) {
    result.err = 1;
    result.msg = '两次密码不同';
  }
  return result;
}

// 昵称校验
export function nicknameValid(nickname) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(nickname)) {
    result.err = 1;
    result.msg = '昵称不能为空';
  } else if (nickname.length > 10) {
    result.err = 1;
    result.msg = '昵称不能超过10位';
  }
  return result;
}

// 真实姓名校验
export function realNameValid(realName) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(realName)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (realName.length > 16) {
    result.err = 1;
    result.msg = '不能超过16位';
  }
  return result;
}
// 银行名称校验
export function bankNameValid(bankName) {
  return realNameValid(bankName);
}
// 支行校验
export function subbranchValid(subbranch) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(subbranch)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (subbranch.length > 255) {
    result.err = 1;
    result.msg = '不能超过255位';
  }
  return result;
}

// 银行卡号校验
export function bankcardNumberValid(bankcardNumber) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(bankcardNumber)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (!/^(\d{16}|\d{19})$/.test(bankcardNumber)) {
    result.err = 1;
    result.msg = '格式错误';
  }
  return result;
}

// 金额校验
export function amountValid(amount) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(amount)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (!/^\d+(?:\.\d{1,2})?$/.test(amount)) {
    result.err = 1;
    result.msg = '最多两位小数';
  }
  return result;
}

// 非空校验
export function emptyValid(value) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(value)) {
    result.err = 1;
    result.msg = '不能为空';
  }
  return result;
}

// 地址校验
export function addressValid(value) {
  let result = {
    err: 0,
    msg: ''
  };
  if (isUnDefined(value)) {
    result.err = 1;
    result.msg = '不能为空';
  } else if (value.length > 50) {
    result.err = 1;
    result.msg = '长度不能超过50位';
  }
  return result;
}

/**
 * 获取用户登录系统的时间间隔
 * @param {yyyy-MM-dd-hh-mm} beforeTime
 */
export function calcSpace (beforeTime) {
  let now = formatDate(new Date().getTime(), 'yyyy-MM-dd-hh-mm').split('-');
  let before = beforeTime.split('-');
  let nowYear = +now[0];
  let beforeYear = +before[0];
  let nowMonth = +now[1];
  let beforeMonth = +before[1];
  if (nowYear > beforeYear) {
    let diffY = nowYear - beforeYear;
    let diffM = diffY * 12 + nowMonth - beforeMonth;
    return diffM < 12 ? diffM + '月前来过' : diffY + '年前来过';
  }
  if (nowMonth > beforeMonth) {
    return nowMonth - beforeMonth + '月前来过';
  }
  let nowDay = now[2];
  let beforeDay = before[2];
  if (nowDay > beforeDay) {
    return nowDay - beforeDay + '天前来过';
  }
  let nowHour = now[3];
  let beforeHour = before[3];
  if (nowHour > beforeHour) {
    return nowHour - beforeHour + '小时前来过';
  }
  let nowMinute = now[4];
  let beforeMinute = before[4];
  let diffMinute = nowMinute - beforeMinute;
  return diffMinute <= 5 ? '刚刚来过' : diffMinute + '分钟前来过';
}

// 聊天日期格式化
export function formatChatDate(timeStamp, param) {
  let now = new Date();
  let nowStamp = now.getTime();
  let before = new Date(timeStamp);
  let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  let oneDay = 3600000 * 24;
  let sevenDay = 7 * oneDay;
  let twoDay = 2 * oneDay;
  if (nowStamp - timeStamp > sevenDay) {
    return param ? formatDate(timeStamp, 'yyyy年MM月dd日 hh:mm') : formatDate(timeStamp, 'yyyy/MM/dd');
  }
  if (nowStamp - timeStamp > twoDay) {
    return param ? week[before.getDay()] + ' ' + formatDate(timeStamp, 'hh:mm') : week[before.getDay()];
  }
  if (now.getDate() === before.getDate()) {
    return formatDate(timeStamp, 'hh:mm');
  }
  let _before = new Date(timeStamp);
  _before.setDate(_before.getDate() + 1);
  if (_before.getDate() === now.getDate()) {
    return param ? '昨天 ' + formatDate(timeStamp, 'hh:mm') : '昨天';
  }
  return param ? week[before.getDay()] + ' ' + formatDate(timeStamp, 'hh:mm') : week[before.getDay()];
}
