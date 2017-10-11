<template>
  <transition name="slide">
    <div class="list-wrapper">
      <header class="border-bottom-1px">
        <div class="back" @click="back"></div>
        <div class="search" @click="goSearch">
          <i class="search-icon"></i><span>鞋子</span>
        </div>
      </header>
      <div class="filter-wrapper">
        <div class="item active">区域<i class="down-icon icon"></i></div>
        <div class="item">小类</div>
        <div class="item">价格<div class="up-down"><i class="up-icon icon"></i><i class="icon down-icon"></i></div></div>
        <div class="item">筛选<i class="icon select-icon"></i></div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    methods: {
      back() {
        this.$router.back();
      },
      goSearch() {
        this.$router.push(this.$route.path + '/search');
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .list-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    header {
      display: flex;
      padding: 0.14rem 0.3rem;
      padding-left: 0;
      @include border-bottom-1px($color-border);
      background: #fff;

      .back {
        flex: 0 0 0.74rem;
        height: 0.6rem;
        background-repeat: no-repeat;
        background-size: 0.2rem;
        background-position: 0.3rem center;
        @include bg-image('back');
      }

      .search {
        flex: 1;
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

    .filter-wrapper {
      display: flex;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;

      .item {
        flex: 1;
        text-align: center;
        font-size: $font-size-medium;

        &:first-child {
          padding-left: 0.3rem;
          text-align: left;
        }

        &:last-child {
          padding-right: 0.3rem;
          text-align: right;
        }

        .icon {
          display: inline-block;
          width: 0.36rem;
          height: 100%;
          background-repeat: no-repeat;
        }

        .down-icon {
          vertical-align: middle;
          background-position: 0.12rem center;
          background-size: 0.2rem;
          @include bg-image('down');
        }

        .select-icon {
          vertical-align: middle;
          background-position: 0.12rem center;
          background-size: 0.24rem;
          @include bg-image('select');
        }

        .up-down {
          display: inline-block;
          vertical-align: middle;
          width: 0.36rem;
          height: 100%;
          font-size: 0;

          .icon {
            height: 50%;
          }

          .up-icon {
            vertical-align: middle;
            background-position: 0.12rem center;
            background-size: 0.2rem;
            @include bg-image('down');
            transform: rotate(180deg);
          }
        }

        &.active {
          .down-icon {
            @include bg-image('down-act');
          }
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-leave-to, &.slide-enter {
      left: 100%;
    }
  }
</style>
