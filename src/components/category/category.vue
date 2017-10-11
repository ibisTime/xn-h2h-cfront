<template>
  <div class="cate-wrapper">
    <scroll>
      <div class="header">
        <router-link class="search" to="/category/search" tag="div">
          <i class="search-icon"></i><span>鞋子</span>
        </router-link>
      </div>
      <div class="cates clearfix">
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item">
          <img src="./demo.png"/>
          <p>数码</p>
        </div>
        <div class="item" @click="goAllCates">
          <img src="./all.png"/>
          <p>全部</p>
        </div>
      </div>
      <div class="split"></div>
      <mall-items></mall-items>
    </scroll>
    <m-footer @goPublish="goPublish"></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MFooter from 'components/m-footer/m-footer';
  import MallItems from 'components/mall-items/mall-items';

  export default {
    data() {
      return {};
    },
    methods: {
      goAllCates() {
        this.$router.push('/category/categories');
      },
      goPublish() {
        this.$router.push('/category/publish');
      }
    },
    components: {
      Scroll,
      MFooter,
      MallItems
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

    .cates {
      padding: 0.38rem 0.25rem 0.12rem;
      background-color: #fff;

      .item {
        float: left;
        width: 1.75rem;
        margin-bottom: 0.3rem;
        text-align: center;
        overflow: hidden;
        font-size: 0;

        img {
          max-width: 100%;
          width: 0.8rem;
          height: 0.8rem;
        }

        p {
          padding-top: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: $font-size-small-s;
        }
      }
    }

    .split {
      height: 0.2rem;
    }
  }
</style>
