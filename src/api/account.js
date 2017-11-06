import fetch from 'common/js/fetch';
import {getUserId} from 'common/js/util';

// 获取账户
export function getAccount() {
  return fetch(802503, {
    userId: getUserId()
  });
}

// 获取取现和消费金额
export function getAccountInfo(accountNumber) {
  return fetch(802903, {
    accountNumber
  });
}

/**
 * 账户余额微信充值
 * @param params: {amount, openId, activityCode}
 */
export function recharge(params) {
  return fetch(802710, {
    applyUser: getUserId(),
    channelType: 35,
    ...params
  });
}
/**
 * 提现
 * @param params: {accountNumber, payCardNo, amount, tradePwd, payCardInfo}
 */
export function withdraw(params) {
  return fetch(802750, {
    applyUser: getUserId(),
    ...params
  });
}

// 分页查询流水
export function getPageFlow(start, limit, accountNumber, bizType) {
  return fetch(802524, {
    start,
    limit,
    accountNumber,
    bizType
  });
}

// 获取银行数据字典列表
export function getBankCodeList() {
  return fetch(802116);
}
// 根据code获取银行卡详情
export function getBankCard(code) {
  return fetch(802017, {code});
}
/**
 * 添加银行卡
 * @param params {bankcardNumber, bankCode, bankName, subbranch, bindMobile, realName}
 */
export function addBankCard(params) {
  return fetch(802010, {
    userId: getUserId(),
    type: 1,
    currency: 'CNY',
    ...params
  });
}
// 删除银行卡
export function deleteBankCard(code) {
  return fetch(802011, {
    code
  });
}
/**
 * 修改银行卡
 * @param params {code, bankcardNumber, bankCode, bankName, subbranch, bindMobile, realName}
 */
export function editBankCard(params) {
  return fetch(802012, {
    status: 1,
    type: 1,
    currency: 'CNY',
    userId: getUserId(),
    ...params
  });
}
// 获取银行卡列表
export function getBankCardList() {
  return fetch(802016, {
    userId: getUserId(),
    status: 1
  });
}

// 获取签到积分
export function getSignIntegral(accountNumber, bizType) {
  return fetch(802900, {
    accountNumber,
    bizType
  });
}