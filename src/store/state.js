import {loadSearch} from 'common/js/cache';

const state = {
  publishMallCate: [],
  searchHistory: loadSearch(),
  location: null,
  isLocaErr: false,
  user: null,
  cnyAccount: null,
  jfAccount: null,
  bankcardList: null,
  addressList: [],
  currentAddrCode: ''
};

export default state;
