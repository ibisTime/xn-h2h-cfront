<template>
  <transition name="deliver-fade">
    <div class="deliver-input" v-show="showFlag" @click.stop>
      <div class="deliver-wrapper">
        <div class="deliver-content">
          <p class="text">发货</p>
          <div class="form-wrapper">
            <div class="form-item">
              <div class="item-label">物流公司</div>
              <div class="item-input-wrapper">
                <select class="item-input" v-model="deliver">
                  <option v-for="(item,index) in deliverList" :key="index" :value="item">
                    {{item.dvalue}}
                  </option>
                </select>
                <i class="arrow"></i>
              </div>
            </div>
            <div class="form-item">
              <div class="item-label">物流单号</div>
              <div class="item-input-wrapper">
                <input type="text" class="item-input" ref="input" v-model="code" @input="emptyValid" placeholder="请输入物流单号">
                <span v-show="codeErr" class="error-tip">{{codeErr}}</span>
              </div>
            </div>
          </div>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">取消</div>
            <div @click="confirm" class="operate-btn right">确定</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {emptyValid} from 'common/js/util';

  export default {
    props: {
      deliverList: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        showFlag: false,
        code: '',
        codeErr: '',
        deliver: null
      };
    },
    methods: {
      show() {
        this.code = '';
        this.codeErr = '';
        this.showFlag = true;
        setTimeout(() => {
          this.$refs.input.focus();
        }, 320);
      },
      hide() {
        this.showFlag = false;
      },
      emptyValid() {
        let result = emptyValid(this.code);
        this.codeErr = result.msg;
        return !result.err;
      },
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        if (this.emptyValid()) {
          this.hide();
          this.$emit('confirm', this.code, this.deliver);
        }
      }
    },
    watch: {
      deliverList(newVal) {
        this.deliver = newVal[0];
      }
    }
  };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .deliver-input {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    &.deliver-fade-enter-active {
      animation: deliver-fadein 0.3s;
      .deliver-content {
        animation: deliver-zoom 0.3s;
      }
    }

    .deliver-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .deliver-content {
        width: 5.4rem;
        border-radius: 0.26rem;
        background: $color-highlight-background;

        .arrow {
          position: absolute;
          right: 0.24rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          @include bg-image('arrow');
          width: 0.3rem;
          height: 0.3rem;
          top: 50%;
          transform: translate(0, -50%);
        }

        .text {
          padding: 0.38rem 0.3rem 0;
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
  @keyframes deliver-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes deliver-zoom {
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
