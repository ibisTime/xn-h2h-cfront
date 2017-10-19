<template>
  <transition name="slide">
    <div class="collection-wrapper">
      <scroll :data="list" :hasMore="hasMore" @pullingUp="getPageCollection">
        <mall-items :data="list"></mall-items>
      </scroll>
      <div v-show="!hasMore && !list.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无收藏的商品"></no-result>
      </div>
      <router-view @collect="handleUpdate"></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getPageCollection} from 'api/biz';
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
        if (this.$route.path === '/user/collection') {
          setTitle('我想要的');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.getPageCollection();
        }
      },
      getPageCollection() {
        getPageCollection(this.start, this.limit).then((data) => {
          let _list = data.list.map((item) => {
            return item.product;
          });
          this.list = this.list.concat(_list);
          if (data.list.length < this.limit || data.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.start++;
        }).catch(() => {});
      },
      handleUpdate(product, isLike) {
        if (!this.first) {
          if (isLike) {
            let index = this.list.findIndex((item) => {
              return item.code === product.code;
            });
            if (!~index) {
              this.list.unshift(product);
            }
          } else {
            let index = this.list.findIndex((item) => {
              return item.code === product.code;
            });
            if (~index) {
              this.list.splice(index, 1);
            }
          }
        }
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

  .collection-wrapper {
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
