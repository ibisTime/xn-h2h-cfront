<template>
  <transition name="confirm-fade">
    <div class="loading-module-cont" v-show="showFlag">
      <span class="loading-module-text">{{text}}</span>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    delay: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      if(this.timer) {
        clearTimeout(this.timer);
      }
      this.showFlag = true;
      this.timer = setTimeout(() => {
        this.showFlag = false;
      }, this.delay);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .loading-module-cont {
    position: fixed;
    top: 40%;
    left: 50%;
    padding: 0.18rem 0.3rem;
    line-height: 1.5;
    transform: translate(-50%, -50%);
    min-width: 1.2rem;
    max-width: 60%;
    border-radius: 0.08rem;
    z-index: 998;
    word-wrap: break-word;
    font-size: 0;
    color: #fff;
    background-color: rgba(58,58,58,.9);

    &.toast-fade-enter-active {
      animation: toast-fadein 0.3s;
      .toast-content {
        animation: toast-zoom 0.3s;
      }
    }

    .loading-module-text{
      font-size: $font-size-medium;
    }
  }
  @keyframes toast-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes toast-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
