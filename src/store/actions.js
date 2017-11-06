import * as types from './mutation-types';
import {saveSearch, clearSearch, deleteSearch, saveChatData, updateChatData, saveUserMap} from 'common/js/cache';
import {isUnDefined} from 'common/js/util';

function _getOrderList(state, code, prevStatus, nextStatus) {
  let allList = null;
  let prevList = null;
  let nextList = null; // 置空下个状态

  // 如果有all的数据，并且有这个订单，则改变状态
  if (state.orderList.all) {
    allList = {
      ...state.orderList.all
    };
    let index = allList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      allList.data = allList.data.slice();
      let _item = {
        ...allList.data[index],
        status: nextStatus
      };
      allList.data.splice(index, 1, _item);
    }
  }
  if (prevStatus === '2' || prevStatus === '7') {
    prevStatus = '2||7';
  } else if (prevStatus === '5' || prevStatus === '8' || prevStatus === '91') {
    prevStatus = '5||8||91';
  }
  if (nextStatus === '2' || nextStatus === '7') {
    nextStatus = '2||7';
  } else if (nextStatus === '5' || nextStatus === '8' || nextStatus === '91') {
    nextStatus = '5||8||91';
  }
  // 如果有当前状态的数据，则删除这条订单
  if (state.orderList[prevStatus]) {
    prevList = {
      ...state.orderList[prevStatus]
    };
    let index = prevList.data.findIndex((order) => {
      return order.code === code;
    });
    if (index !== -1) {
      prevList.data = prevList.data.slice();
      prevList.data.splice(index, 1);
    }
  }
  let _orderList = {
    ...state.orderList,
    [prevStatus]: prevList,
    [nextStatus]: nextList,
    all: allList
  };
  return _orderList;
}

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

// 设置默认地址
export const setDefaultAddress = function ({commit, state}, {code}) {
  let addressList = state.addressList.slice();
  let idx0, idx1;
  addressList.forEach((address, idx) => {
    if (address.code === code) {
      idx1 = idx;
    } else if (address.isDefault === '1') {
      idx0 = idx;
    }
  });
  if (!isUnDefined(idx0)) {
    let addr0 = addressList[idx0];
    addressList.splice(idx0, 1, {
      ...addr0,
      isDefault: '0'
    });
  }
  let addr1 = addressList[idx1];
  addressList.splice(idx1, 1, {
    ...addr1,
    isDefault: '1'
  });
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

// 取消订单后，改变orderList
export const editOrderListByCancel = function({commit, state}, {code}) {
  let prevStatus = '1';
  let nextStatus = '91';
  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder && state.currentOrder.code === code) {
    let _order = {
      ...state.currentOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_ORDER, _order);
  }
};

// 支付订单后，改变orderList
export const editOrderListByPay = function({commit, state}, {code}) {
  let prevStatus = '1';
  let nextStatus = '2';

  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder) {
    if (state.currentOrder.code === code) {
      let _order = {
        ...state.currentOrder
      };
      _order.status = nextStatus;
      commit(types.SET_CURRENT_ORDER, _order);
    } else {
      commit(types.SET_CURRENT_ORDER, null);
    }
  }
};

// 订单退款申请提交成功后，改变orderList
export const editOrderListByTk = function ({commit, state}, {code}) {
  let prevStatus = '2';
  let nextStatus = '6';

  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder && state.currentOrder.code === code) {
    let _order = {
      ...state.currentOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_ORDER, _order);
  }
};

// 评论成功后，改变orderList
export const editOrderListByRating = function({commit, state}, {code}) {
  let prevStatus = '4';
  let nextStatus = '5';

  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder && state.currentOrder.code === code) {
    let _order = {
      ...state.currentOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_ORDER, _order);
  }
};

// 收货成功后，改变orderList
export const editOrderListByReceived = function({commit, state}, {code}) {
  let prevStatus = '3';
  let nextStatus = '4';

  let _orderList = _getOrderList(state, code, prevStatus, nextStatus);
  commit(types.SET_ORDER_LIST, _orderList);

  if (state.currentOrder && state.currentOrder.code === code) {
    let _order = {
      ...state.currentOrder
    };
    _order.status = nextStatus;
    commit(types.SET_CURRENT_ORDER, _order);
  }
};

// 保存所有聊天记录
export const saveChatHistory = function ({commit, state}, {msg, toUser, fromUser}) {
  if (state.curChatUserId === toUser) {
    let _list = state.curChatList.slice();
    let index = _list.findIndex((item) => {
      return item.uniqueId === msg.uniqueId;
    });
    if (~index) {
      _list.splice(index, 1, msg);
    } else {
      _list.push(msg);
    }
    commit(types.SET_CHAT_LIST, _list);
  }
  commit(types.SET_CHAT_DATA, saveChatData(msg, toUser, fromUser, state.curChatUserId === toUser));
};

// 更新localStorage的头像、昵称
export const updateMessages = function ({commit}, {sender, receiver}) {
  commit(types.SET_CHAT_DATA, updateChatData(sender, receiver));
  commit(types.SET_USER_MAP, saveUserMap(receiver));
};

export const updateUserMap = function ({commit}, user) {
  commit(types.SET_USER_MAP, saveUserMap(user));
};