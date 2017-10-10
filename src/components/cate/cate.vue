<template>
  <div class="cate-wrapper">
    <scroll>
      <div class="header">
        <div class="search">
          <i class="search-icon"></i><span>鞋子</span>
        </div>
      </div>
      <div class="cates">
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
      </div>
    </scroll>
    <m-footer @goPublish="goPublish"></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data() {
      return {};
    },
    methods: {
      goPublish() {
        this.$router.push('/cate/publish');
      }
    },
    components: {
      Scroll,
      MFooter
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .cate-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;

    .header {
      padding: 0.14rem 0.3rem;
      background: #fff;

      .search {
        border-radius: 0.3rem;
        background: #f3f4f8;
        line-height: 0.6rem;
        font-size: 0;
        text-align: center;

        .search-icon {
          display: inline-block;
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: middle;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          @include bg-image('search');
        }

        span {
          padding-left: 0.1rem;
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }
  }
</style>
