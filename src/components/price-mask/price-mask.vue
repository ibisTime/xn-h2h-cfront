<template>
  <transition name="price-fade">
    <div class="price-wrapper" v-show="showFlag" @click="hide">
      <div class="content" @click.stop>
        <div class="title">想卖多少钱<span @click="confirm">确认</span></div>
        <div class="sell-price border-bottom-1px">
          <input type="number" placeholder="¥0.00" v-model="sellPrice"/>
        </div>
        <div class="item border-bottom-1px">
          <label>原价</label>
          <div class="input-item">
            <input type="number" placeholder="¥0.00" v-model="oriPrice">
          </div>
        </div>
        <div class="item">
          <label>运费</label>
          <div class="input-item">
            <input type="number" placeholder="¥0.00" v-model="freight">
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
  export default {
    data() {
      return {
        showFlag: false,
        sellPrice: '',
        isFree: false,
        freight: '',
        oriPrice: ''
      };
    },
    computed: {
      freeCls() {
        return this.isFree ? 'active' : '';
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      choseFree() {
        this.isFree = !this.isFree;
      },
      confirm() {
        console.log('confirm');
        this.hide();
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
        font-size: $font-size-large;

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
          flex: 1;
          padding-right: 0.3rem;

          .free {
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
        @include border-bottom-1px(#eee);
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
