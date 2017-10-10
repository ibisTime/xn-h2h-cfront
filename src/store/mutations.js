import * as types from './mutation-types';

const mutations = {
  [types.SET_PUBLISH_MALL_CATE](state, cate) {
    state.publishMallCate = cate;
  }
};

export default mutations;
