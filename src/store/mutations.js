import * as types from './mutation-types';

const mutations = {
  [types.SET_PUBLISH_MALL_CATE](state, cate) {
    state.publishMallCate = cate;
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
  [types.SET_LOCATION](state, location) {
    state.location = location;
  },
  [types.SET_IS_LOCA_ERR](state, flag) {
    state.isLocaErr = flag;
  },
  [types.SET_USER_STATE](state, user) {
    state.user = user;
  },
  [types.SET_USER_MOBILE](state, mobile) {
    let user = state.user || {};
    user.mobile = mobile;
    state.user = user;
  },
  [types.SET_USER_NICKNAME](state, nickname) {
    let user = state.user || {};
    user.nickname = nickname;
    state.user = user;
  },
  [types.SET_USER_GENDER](state, gender) {
    let user = state.user || {};
    user.gender = gender;
    state.user = user;
  },
  [types.SET_USER_TRADE_PWD_FLAG](state, tradepwdFlag) {
    let user = state.user || {};
    user.tradepwdFlag = tradepwdFlag;
    state.user = user;
  },
  [types.SET_USER_BIRTHDAY](state, birthday) {
    let user = state.user || {};
    user.birthday = birthday;
    state.user = user;
  },
  [types.SET_CNY_ACCOUNT](state, account) {
    state.cnyAccount = account;
  },
  [types.SET_JF_ACCOUNT](state, account) {
    state.jfAccount = account;
  },
  [types.SET_BANKCARD_LIST](state, list) {
    state.bankcardList = list;
  },
  [types.SET_ADDRESS_LIST](state, list) {
    state.addressList = list;
  },
  [types.SET_CURRENT_ADDR_CODE](state, code) {
    state.currentAddrCode = code;
  },
  [types.SET_ORDER_LIST](state, list) {
    state.orderList = list;
  },
  [types.SET_CURRENT_ORDER](state, order) {
    state.currentOrder = order;
  }
};

export default mutations;
