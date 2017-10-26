import {loadSearch, loadChatData, loadUserMap} from 'common/js/cache';

const state = {
  publishCategory: null,
  publishGoods: null,
  searchHistory: loadSearch(),
  location: null,
  isLocaErr: false,
  user: null,
  cnyAccount: null,
  jfAccount: null,
  bankcardList: null,
  addressList: [],
  currentAddr: null,
  orderList: {},
  currentOrder: null,
  logFLag: false,
  watchingUser: null,
  currentActivity: null,
  chatData: loadChatData(),
  curChatList: [],
  curChatUserId: '',
  tencentLogined: false,
  userMap: loadUserMap()
};

export default state;
