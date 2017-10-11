<template>
  <transition name="slide">
    <div class="major-wrapper">
      <scroll :data="list">
        <ul>
          <li class="border-bottom-1px">
            <div class="img"><img src="./demo.png"/></div>
            <div class="text">手机</div>
            <div class="arrow"></div>
          </li>
          <li class="border-bottom-1px">
            <div class="img"><img src="./demo.png"/></div>
            <div class="text">手机</div>
            <div class="arrow"></div>
          </li>
          <li class="border-bottom-1px">
            <div class="img"><img src="./demo.png"/></div>
            <div class="text">手机</div>
            <div class="arrow"></div>
          </li>
        </ul>
      </scroll>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        list: []
      };
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .major-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    li {
      display: flex;
      align-items: center;
      height: 1rem;
      padding-left: 0.1rem;
      padding-right: 0.3rem;
      @include border-bottom-1px($color-border);

      &:last-child {
        @include border-none();
      }

      .img {
        width: 1rem;
        flex: 0 0 1rem;
        height: 1rem;
        padding: 0.2rem;
        font-size: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .text {
        flex: 1;
        font-size: $font-size-medium;
      }

      .arrow {
        flex: 0 0 0.3rem;
        height: 100%;
        background-repeat: no-repeat;
        background-position: right center;
        background-size: 0.12rem;
        @include bg-image('more');
      }
    }
  }
</style>
