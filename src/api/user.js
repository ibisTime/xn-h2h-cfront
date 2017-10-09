import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

// 微信登录
export function wxLogin(code, userReferee) {
  let params = {
    code,
    isNeedMobile: 0,
    kind: 'C',
    type: 'WX_H5'
  };
  if (userReferee) {
    params.userReferee = userReferee;
    params.userRefereeKind = 0;
  }
  return fetch(805170, params);
}

// 获取用户详情
export function getUser() {
  return fetch(805121, {
    userId: getUserId()
  });
}

// 分页获取用户
export function getPageChildren(start, limit) {
  return fetch(805120, {
    userReferee: getUserId(),
    start,
    limit
  });
}

// 购买会员
export function buyVIP(payType) {
  return fetch(620219, {
    payType,
    userId: getUserId()
  });
}

// 绑定手机号
export function bindMobile(mobile, smsCaptcha, isSendSms = '0') {
  return fetch(805060, {
    mobile,
    smsCaptcha,
    isSendSms,
    userId: getUserId()
  });
}

// 修改手机号
export function changeMobile(newMobile, smsCaptcha) {
  return fetch(805061, {
    newMobile,
    smsCaptcha,
    userId: getUserId()
  });
}

// 设置支付密码
export function setTradePwd(tradePwd, smsCaptcha) {
  return fetch(805066, {
    tradePwd,
    smsCaptcha,
    userId: getUserId()
  });
}

// 修改昵称
export function changeNickname(nickname) {
  return fetch(805082, {
    nickname,
    userId: getUserId()
  });
}

// 修改用户头像
export function changeAvatar(photo) {
  return fetch(805080, {
    photo,
    userId: getUserId()
  });
}

// 修改用户生日
export function changeBirthday (birthday) {
  return fetch(805096, {
    birthday,
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

// 删除收件地址
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

// 列表查询地址
export function getAddressList() {
  return fetch(805165, {
    userId: getUserId()
  });
}

// 详情查询地址
export function getAddress(code) {
  return fetch(805166, {code});
}
