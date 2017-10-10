<template>
  <transition name="modal-fade">
    <div class="mask-wrapper" v-show="showFlag" @click.stop="hide">
      <div class="content">
        <p>请点击右上角</p>
        <p>将它发送给指定朋友</p>
        <p>或分享到朋友圈</p>
      </div>
      <img src="./arrow.png" class="arrow">
    </div>
  </transition>
</template>
<script>
  export default {
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .mask-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    &.modal-fade-enter-active, &.modal-fade-leave-active {
      transition: all 0.3s;
    }

    &.modal-fade-enter, &.modal-fade-leave-to {
      opacity: 0;
    }

    .content {
      position: absolute;
      top: 1.8rem;
      left: 30%;
      text-align: center;
      color: #fff;
      line-height: 1.5;
      font-size: $font-size-large-xx;
    }

    .arrow {
      position: absolute;
      top: 0.2rem;
      right: 0.4rem;
      width: 1.6rem;
    }
  }
</style>
