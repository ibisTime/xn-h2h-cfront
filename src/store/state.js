import {loadSearch} from 'common/js/cache';

const state = {
  publishMallCate: [],
  searchHistory: loadSearch(),
  location: null
};

export default state;
