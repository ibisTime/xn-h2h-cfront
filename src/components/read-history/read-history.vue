<template>
  <transition name="slide">
    <div class="read-history-wrapper">
      <scroll :data="list" :hasMore="hasMore" @pullingUp="getPageReads">
        <mall-items :data="list"></mall-items>
      </scroll>
      <div v-show="!hasMore && !list.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无浏览过的商品"></no-result>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getPageReads} from 'api/biz';
  import MallItems from 'components/mall-items/mall-items';

  export default {
    data() {
      return {
        list: [],
        start: 1,
        limit: 10,
        hasMore: true
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/history') {
          setTitle('我的足迹');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.getPageReads();
        }
      },
      getPageReads() {
        getPageReads(this.start, this.limit).then((data) => {
          let _list = [];
          data.list.map((item) => {
            if (item.code && item.product) {
              return _list.push(item.product);
            }
          });
          this.list = this.list.concat(_list);
          if (data.list.length < this.limit || data.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.start++;
        }).catch(() => {});
      }
    },
    components: {
      Scroll,
      NoResult,
      MallItems
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .read-history-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 101;
    background: $color-background;

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
