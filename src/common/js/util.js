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
};

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
}

// 删除用户登录信息
export function clearUser() {
  delCookie('userId');
  delCookie('token');
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
    let sharImg = require('../image/app.jpg');
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
  let reg = new RegExp('(\\.\\d{' + len + '})\\d*', 'ig');
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

// 清除内容里的标签
export function clearTag(content) {
  return content.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>|&nbsp;/ig, '');
}

// 是否是function
export function isFunction(fn) {
  var getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
}

// 校验短信验证码
export function captValid(capt) {
  let result = {
    err: 0,
    msg: ''
  };
  if (!capt) {
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
  if (!mobile) {
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
  if (!trade) {
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
  if (!rePwd) {
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
  if (!nickname) {
    result.err = 1;
    result.msg = '昵称不能为空';
  } else if (nickname.length > 6) {
    result.err = 1;
    result.msg = '昵称不能超过6位';
  }
  return result;
}

// 真实姓名校验
export function realNameValid(realName) {
  let result = {
    err: 0,
    msg: ''
  };
  if (!realName) {
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
  if (!subbranch) {
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
  if (!bankcardNumber) {
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
  if (!amount) {
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
  if (!value) {
    result.err = 1;
    result.msg = '不能为空';
  }
  return result;
}
