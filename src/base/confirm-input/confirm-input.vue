<template>
  <transition name="confirm-fade">
    <div class="confirm-input" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="input"><input ref="input" type="text" v-model="content" v-focus></div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn right">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    directives: {
      focus: {
        inserted: function (el) {
          el.focus();
        }
      }
    },
    data() {
      return {
        showFlag: false,
        content: ''
      };
    },
    methods: {
      show() {
        this.content = '';
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.input.focus();
        }, 320);
      },
      hide() {
        this.showFlag = false;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        this.hide();
        this.$emit('confirm', this.content);
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .confirm-input {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
      .confirm-content {
        animation: confirm-zoom 0.3s;
      }
    }

    .confirm-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .confirm-content {
        width: 5.4rem;
        border-radius: 0.26rem;
        background: $color-highlight-background;

        .text {
          padding: 0.38rem 0.3rem 0.2rem;
          line-height: 0.44rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: $color-text-l;
        }

        .input {
          margin: 0.2rem;
          margin-top: 0;
          height: 0.8rem;
          display: flex;
          align-items: center;
          line-height: 1;
          border: 1px solid $color-border;
          border-radius: 0.06rem;

          input {
            border: 0;
            width: 100%;
            font-size: $font-size-medium;
            padding: 0 0.2rem;
          }
        }

        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-large-s;

          .operate-btn {
            flex: 1;
            line-height: 0.44rem;
            padding: 0.2rem 0;
            border-top: 1px solid $color-background-d;
            color: $color-text-d;

            &.left {
              border-right: 1px solid $color-background-d;
            }

            &.right {
              color: $primary-color;
            }
          }
        }
      }
    }
  }
  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
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
