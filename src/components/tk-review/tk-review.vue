<template>
  <transition name="review-fade">
    <div class="tk-review-input" v-show="showFlag" @click.stop>
      <div class="tk-review-wrapper">
        <div class="tk-review-content">
          <p class="text">退款审核</p>
          <div class="form-wrapper">
            <div class="form-item">
              <div class="item-label">是否通过</div>
              <div class="item-input-wrapper">
                <select class="item-input" v-model="result">
                  <option value="0">不通过</option>
                  <option value="1">通过</option>
                </select>
                <i class="arrow"></i>
              </div>
            </div>
            <div class="form-item">
              <div class="item-label">备注</div>
              <div class="item-input-wrapper">
                <input type="text" class="item-input" ref="input" v-model="remark" placeholder="请输入备注">
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
  export default {
    data() {
      return {
        showFlag: false,
        remark: '',
        result: '1'
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
      cancel() {
        this.hide();
        this.$emit('cancel');
      },
      confirm() {
        this.hide();
        this.$emit('confirm', this.result, this.remark);
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

  .tk-review-input {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: $color-background-d;

    &.review-fade-enter-active {
      animation: review-fadein 0.3s;
      .tk-review-content {
        animation: review-zoom 0.3s;
      }
    }

    .tk-review-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      .tk-review-content {
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
  @keyframes review-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes review-zoom {
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
