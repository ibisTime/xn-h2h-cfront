import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';
import {setCookie} from 'common/js/cookie';

/**
 * 微信登录
 * @param {string} code
 * @param {string} userReferee
 * @param {string} mobile
 * @param {string} smsCaptcha
 */
export function wxLogin(code, userReferee, activityCode, mobile, smsCaptcha) {
  let params = {
    code,
    kind: 'C',
    type: 'wx_h5',
    isNeedMobile: '1',
    mobile,
    smsCaptcha
  };
  if (userReferee) {
    params.userReferee = userReferee;
    params.userRefereeKind = 'C';
  }
  if (activityCode) {
    params.activityCode = activityCode;
  }
  return fetch(805170, params);
}

/**
 * 获取腾讯云IM签名、账号
 */
export function getTencentParamsAPi() {
  return fetch(805953, {
    userId: getUserId()
  }).then((data) => {
    setCookie('__sig__', data.sig);
    setCookie('__accountType__', data.accountType);
    setCookie('__txAppCode__', data.txAppCode);
    return Promise.resolve(data);
  });
}

/**
 * 获取用户详情
 */
export function getUser() {
  return fetch(805121, {
    userId: getUserId()
  });
}

/**
 * 获取用户详情
 * @param {string} userId
 */
export function getUserById(userId) {
  return fetch(805121, { userId });
}

/**
 * 分页获取用户
 * @param {string} start
 * @param {string} limit
 */
export function getPageChildren(start, limit) {
  return fetch(805120, {
    userReferee: getUserId(),
    start,
    limit
  });
}

/**
 * 绑定手机号
 * @param {string} mobile
 * @param {string} smsCaptcha
 * @param {string} isSendSms
 */
export function bindMobile(mobile, smsCaptcha, isSendSms = '0') {
  return fetch(805060, {
    mobile,
    smsCaptcha,
    isSendSms,
    userId: getUserId()
  });
}

/**
 * 修改手机号
 * @param {string} newMobile
 * @param {string} smsCaptcha
 */
export function changeMobile(newMobile, smsCaptcha) {
  return fetch(805061, {
    newMobile,
    smsCaptcha,
    userId: getUserId()
  });
}

/**
 * 设置支付密码
 * @param {string} tradePwd
 * @param {string} smsCaptcha
 */
export function setTradePwd(tradePwd, smsCaptcha) {
  return fetch(805066, {
    tradePwd,
    smsCaptcha,
    userId: getUserId()
  });
}

/**
 * 修改昵称
 * @param {string} nickname
 */
export function changeNickname(nickname) {
  return fetch(805082, {
    nickname,
    userId: getUserId()
  });
}

/**
 * 修改用户头像
 * @param {string} photo
 */
export function changeAvatar(photo) {
  return fetch(805080, {
    photo,
    userId: getUserId()
  });
}

/**
 * 修改用户生日
 * @param {string} birthday
 */
export function changeBirthday (birthday) {
  return fetch(805096, {
    birthday,
    userId: getUserId()
  });
}

/**
 * 修改用户性别
 * @param {string} gender
 */
export function changeGender (gender) {
  return fetch(805097, {
    gender,
    userId: getUserId()
  });
}

/**
 * 新增收件地址
 * @param params {addressee, mobile, province, city, district, detailAddress, isDefault?}
 */
export function addAddress(params) {
  return fetch(805160, {
    userId: getUserId(),
    ...params
  });
}

/**
 * 删除收件地址
 * @param {string} code
 */
export function deleteAddress(code) {
  return fetch(805161, {code});
}

/**
 * 修改收件地址
 * @param  params {code, addressee, mobile, province, city, district, detailAddress, isDefault?}
 */
export function editAddress(params) {
  return fetch(805162, {
    userId: getUserId(),
    ...params
  });
}

/**
 * 设置默认收件地址
 * @param {string} code
 */
export function setDefaultAddress (code) {
  return fetch(805163, {code});
}

/**
 * 列表查询地址
 */
export function getAddressList() {
  return fetch(805165, {
    userId: getUserId()
  });
}

/**
 * 详情查询地址
 * @param {string} code
 */
export function getAddress(code) {
  return fetch(805166, {code});
}

/**
 * 签到查询
 * @param {string} location
 */
export function signQuery(location) {
  return fetch(805148, {
    location,
    userId: getUserId()
  });
}

/**
 * 签到
 * @param {string} location
 */
export function sign(location) {
  return fetch(805140, {
    location,
    userId: getUserId()
  });
}

/**
 * 签到天数
 * @param {string} start
 * @param {string} limit
 */
export function signNum(start, limit) {
  return fetch(805145, {
    start,
    limit,
    orderDir: 'desc',
    orderColumn: 'signDatetime',
    userId: getUserId()
  });
}

/**
 * 保存登录日志
 */
export function saveLoginLog () {
  return fetch(805350, {
    userId: getUserId()
  });
}

/**
 * 关注用户
 * @param {string} toUser
 */
export function followUser (toUser) {
  return fetch(805110, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 取消关注用户
 * @param {string} toUser
 */
export function unFollowUser (toUser) {
  return fetch(805111, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 是否关注
 * @param {string} toUser
 */
export function isFollowUser (toUser) {
  return fetch(805116, {
    toUser,
    userId: getUserId()
  });
}

/**
 * 分页查询关注
 * @param {string} start
 * @param {string} limit
 */
export function getPageFollowUsers (start, limit) {
  return fetch(805115, {
    start,
    limit,
    userId: getUserId()
  });
}

/**
 * 分页查询粉丝
 * @param {string} start
 * @param {string} limit
 */
export function getPageFans (start, limit) {
  return fetch(805115, {
    start,
    limit,
    toUser: getUserId()
  });
}

/**
 * 修改用户的个人简介
 * @param {string} introduce
 */
export function editIntroduce (introduce) {
  return fetch(805098, {
    introduce,
    userId: getUserId()
  });
}
