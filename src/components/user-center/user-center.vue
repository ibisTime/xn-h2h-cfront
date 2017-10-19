<template>
  <transition name="slide">
    <div class="user-center-wrapper">
      <div class="top-background"></div>
      <div class="top-wrapper">
        <div class="user-message">
          <span></span>
          <div>
            <p class="name">群群</p>
            <p class="time">4小时前来过</p>            
          </div>
        </div>
        <div class="user-introduce">
          <p>女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生女生</p>
          <a href="javascript:;"></a>
        </div>
      </div>
      <div class="sum-count"></div>
      <div class="goods-list"></div>
    </div>
  </transition>
</template>
<script>
  export default {};
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .user-center-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 101;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }

    .top-background{
      background: #558BFD;
      width: 100%;
      height: 2.7rem;
    }

    .top-wrapper{
      position: absolute;
      top: 0;
      left: 0;
      width: 92%;
      height: 4.2rem;
      margin: 1rem 0.3rem 0.2rem 0.3rem;
      background: #fff;

      .user-message{
        display: flex;
        padding: 0.3rem 0 0.26rem 0;
        margin: 0 0.3rem;
        @include border-bottom-1px(#eee);

        span{
          display: inline-block;
          width: 1.36rem;
          height: 1.36rem;
          margin-left: 0.1rem;
          @include bg-image('mine')
          background-size: 100%;
        }

        div{
          margin: 0.15rem 0 0 0.3rem;
        }

        .name{
          font-size: $font-size-large-xx;
          color: $color-text;
        }
        .time{
          margin-top: 0.27rem;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }

      .user-introduce{
        position: relative;
        padding: 0.3rem 0.3rem 0.4rem 0.4rem;

        p{
          display: inline-block;
          width: 100%;
          height: 100;
          font-size: $font-size-medium-x;
          color: $color-text;
        }

        a{
          position: absolute;
          right: 0;
          bottom: 0;
          width: 1.6rem;
          height: 0.54rem;
          margin: 0.35rem 0.3rem 0.4rem 0.3rem;
        }
      }
    }
  }
</style>
