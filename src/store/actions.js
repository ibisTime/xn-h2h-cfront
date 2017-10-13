import * as types from './mutation-types';
import {saveSearch, clearSearch, deleteSearch} from 'common/js/cache';

// 保存历史搜索
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

// 删除历史搜索
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

// 历史搜索
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

// 新增银行卡
export const addBankCard = function({commit, state}, {bankcard}) {
  let bankcardList = state.bankcardList.slice();
  bankcardList.unshift(bankcard);
  commit(types.SET_BANKCARD_LIST, bankcardList);
};

// 删除银行卡
export const deleteBankCard = function({commit, state}, {code}) {
  let bankcardList = state.bankcardList.slice();
  let index = bankcardList.findIndex((item) => {
    return item.code === code;
  });
  bankcardList.splice(index, 1);
  commit(types.SET_BANKCARD_LIST, bankcardList);
};

// 修改银行卡
export const editBankCard = function({commit, state}, {bankcard}) {
  let bankcardList = state.bankcardList.slice();
  let index = bankcardList.findIndex((item) => {
    return item.code === bankcard.code;
  });
  bankcardList.splice(index, 1, bankcard);
  commit(types.SET_BANKCARD_LIST, bankcardList);
};

// 新增地址
export const addAddress = function({commit, state}, {address}) {
  let addressList = state.addressList.slice();
  addressList.unshift(address);
  commit(types.SET_ADDRESS_LIST, addressList);
};

// 修改地址
export const editAddress = function({commit, state}, {address}) {
  let addressList = state.addressList.slice();
  let index = addressList.findIndex((item) => {
    return item.code === address.code;
  });
  addressList.splice(index, 1, address);
  commit(types.SET_ADDRESS_LIST, addressList);
};

// 删除地址
export const deleteAddress = function({commit, state}, {code}) {
  let addressList = state.addressList.slice();
  let index = addressList.findIndex((item) => {
    return item.code === code;
  });
  addressList.splice(index, 1);
  commit(types.SET_ADDRESS_LIST, addressList);
};
