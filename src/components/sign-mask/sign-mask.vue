<template>
  <transition name="rule-fade">
    <div class="rule" v-show="showFlag" @click.stop>
      <div class="rule-wrapper">
        <div class="rule-content">
          <div class="title">
            <div class="title-content left">{{ruleTitle}}</div>
          </div>
          <p v-if="isHtml" class="text" :class="textCls" v-html='text'></p>
          <p v-else class="text" :class="textCls">{{text}}</p>
          <div class="operate">
            <div v-if="!isAlert" @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
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
      ruleTitle: {
        type: String,
        default: '签到规则'
      },
      cancelBtnText: {
        type: String,
        default: '我知道了'
      },
      isAlert: {
        type: Boolean,
        default: false
      },
      isHtml: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    computed: {
      textCls() {
        return this.isAlert ? 'alert' : '';
      }
    },
    methods: {
      show() {
        this.showFlag = true;
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
        this.$emit('confirm');
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/variable";

  .rule {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    &.rule-fade-enter-active {
      animation: rule-fadein 0.3s;
      .rule-content {
        animation: rule-zoom 0.3s;
      }
    }

    .rule-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .rule-content {
        width: 5.4rem;
        border-radius: 0.26rem;
        background: $color-highlight-background;

        .text {
          padding: 0.38rem 0.3rem;
          line-height: 0.44rem;
          text-align: center;
          font-size: $font-size-large-s;
          color: $color-text-l;

          &.alert {
            font-size: 0.3rem;
          }
        }

        .title{
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-medium-x;

          .title-content{
            flex: 1;
            padding: 0.2rem 0;
            border-bottom: 1px solid #eee;
          }
        }

        .operate {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: $font-size-medium;

          .operate-btn {
            flex: 1;
            width: 5rem;
            height: 0.7rem;
            margin: 0.2rem 0.56rem;
            line-height: 0.7rem;
            background: #48B0FB;
            border: 1px solid #48B0FB;
            border-radius: 0.1rem;
            color: #fff;

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
  @keyframes rule-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes rule-zoom {
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
