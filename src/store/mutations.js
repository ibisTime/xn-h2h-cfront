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
  }
};

export default mutations;
