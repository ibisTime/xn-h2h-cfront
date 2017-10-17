import {loadSearch} from 'common/js/cache';

const state = {
  publishCategory: null,
  searchHistory: loadSearch(),
  location: null,
  isLocaErr: false,
  user: null,
  cnyAccount: null,
  jfAccount: null,
  bankcardList: null,
  addressList: [],
  currentAddrCode: '',
  orderList: {},
  currentOrder: null
};

export default state;
