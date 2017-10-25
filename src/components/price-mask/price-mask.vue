<template>
  <transition name="price-fade">
    <div class="price-wrapper" v-show="showFlag" @click="hide">
      <div class="content" @click.stop>
        <div class="title">想卖多少钱<span @click="confirm">确认</span></div>
        <div class="sell-price border-bottom-1px">
          <input type="number" placeholder="¥0.00" @input="validSellPrice" v-model="sellPrice"/>
          <span v-show="spErr" class="error-tip">{{spErr}}</span>
        </div>
        <div class="item border-bottom-1px">
          <label>原价</label>
          <div class="input-item">
            <input type="number" placeholder="¥0.00" @input="validOriPrice" v-model="oriPrice">
            <span v-show="oriErr" class="error-tip">{{oriErr}}</span>
          </div>
        </div>
        <div class="item">
          <label>运费</label>
          <div class="input-item freight">
            <input type="number" placeholder="¥0.00" @input="validFreight" v-model="freight">
            <span v-show="frErr" class="error-tip">{{frErr}}</span>
          </div>
          <div class="input-item">
            <div @click.stop="choseFree" class="free" :class="freeCls">包邮</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import {amountValid, emptyValid} from 'common/js/util';

  export default {
    data() {
      return {
        showFlag: false,
        sellPrice: '',
        spErr: '',
        isFree: false,
        freight: '',
        frErr: '',
        oriPrice: '',
        oriErr: ''
      };
    },
    computed: {
      freeCls() {
        return this.isFree ? 'active' : '';
      }
    },
    methods: {
      updateData(sellPrice, isFree, freight, oriPrice) {
        this.sellPrice = sellPrice;
        this.isFree = isFree;
        this.freight = freight;
        this.oriPrice = oriPrice;
      },
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      choseFree() {
        this.isFree = !this.isFree;
        if (this.isFree) {
          this.freight = '0';
          this.frErr = '';
        }
      },
      confirm() {
        if (this.valid()) {
          this.$emit('confirm', this.sellPrice, this.oriPrice, this.freight, this.isFree);
          this.hide();
        }
      },
      valid() {
        let r1 = this.validSellPrice();
        let r2 = this.validOriPrice();
        let r3 = this.validFreight();
        return r1 && r2 && r3;
      },
      validSellPrice() {
        let result = amountValid(this.sellPrice);
        this.spErr = result.msg;
        return !result.err;
      },
      validOriPrice() {
        let result = amountValid(this.oriPrice);
        this.oriErr = result.msg;
        return !result.err;
      },
      validFreight() {
        let result = emptyValid(this.freight);
        if (!result.err) {
          this.isFree = false;
          result = amountValid(this.freight);
          this.frErr = result.msg;
          return !result.err;
        }
        return true;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .price-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);

    &.price-fade-enter-active {
      animation: price-fadein 0.3s;
      .content {
        animation: price-slide 0.3s;
      }
    }

    .content {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3.3rem;
      width: 100%;
      background: #fff;

      .error-tip {
        font-size: $font-size-medium-s;
        white-space: nowrap;
        color: $color-red;
      }

      .title {
        padding: 0.2rem 0.3rem;
        font-size: $font-size-small;

        span {
          position: absolute;
          right: 0;
          top: 0;
          padding: 0.17rem 0.3rem;
          font-size: 0.3rem;
          color: $primary-color;
        }
      }

      .sell-price {
        padding: 0.05rem 0.3rem 0.25rem;
        font-size: $font-size-large-s;
        display: flex;
        align-items: center;

        input {
          width: 100%;
        }
      }

      .item {
        display: flex;
        align-items: center;
        height: 1rem;
        padding: 0 0.3rem;
        font-size: $font-size-medium;

        label {
          flex: 0 0 1rem;
        }

        .input-item {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;

          &.freight {
            .error-tip {
              position: absolute;
              right: 0.3rem;
              top: 0.06rem;
            }
          }

          input {
            flex: 1;
          }

          .free {
            flex: 1;
            font-size: $font-size-medium;
            background-repeat: no-repeat;
            background-position: 1rem center;
            background-size: 0.28rem;
            @include bg-image('chose');

            &.active {
              @include bg-image('chose-act');
            }
          }
        }
      }

      .border-bottom-1px {
        @include border-bottom-1px($color-border);
      }
    }
  }

  @keyframes price-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes price-slide {
    0% {
      transform: translate3d(0, 100%, 0);
    }
    50% {
      ransform: translate3d(0, 50%, 0);
    }
    100% {
      ransform: translate3d(0, 0, 0);
    }
  }
</style>
