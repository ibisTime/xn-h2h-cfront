<template>
  <div class="order-confirm-wrapper">
    <scroll>
      <div class="address-wrapper">
        <div v-if="!addressList.length" class="no-result-wrapper">
          <div class="addr"></div>
          <div class="message">还没有收货地址<div class="button"><i class="add-icon"></i>添加</div></div>
        </div>
      </div>
      <div class="goods">
        <div class="img"><img src=""></div>
        <div class="content">
          <div class="top">
            <div class="title twoline-ellipsis">配送方式配送方式配送方式</div>
            <div class="text twoline-ellipsis">配送方式配送方式配送方式配送方式配送方式配送方式</div>
          </div>
          <div class="bottom">
            <span class="unit">¥</span><span class="sell">19.00</span>
            <span class="unit ori">¥</span><span class="ori">30.00</span>
          </div>
        </div>
      </div>
      <div class="psfs">配送方式<div>快递<span>¥8</span></div></div>
      <div class="infos">
        <div class="area">
          <div class="title">买家嘱咐</div>
          <textarea v-model="applyNote"></textarea>
        </div>
        <div class="price-info">
          <div class="item">商品总额<span>¥198.00</span></div>
          <div class="item">运费<span>¥8.00</span></div>
        </div>
      </div>
      <footer>
        <div class="price">总计:<span class="unit">¥</span><span>1901.00</span></div>
        <div class="button">
          <button>确认购买</button>
        </div>
      </footer>
    </scroll>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_ADDRESS_LIST, SET_CURRENT_ADDR_CODE} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        applyNote: ''
      };
    },
    computed: {
      ...mapGetters([
        'addressList',
        'currentAddrCode'
      ])
    },
    methods: {
      ...mapMutations({
        setAddressList: SET_ADDRESS_LIST,
        setCurAddrCode: SET_CURRENT_ADDR_CODE
      })
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .order-confirm-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    .address-wrapper {
      height: 1.8rem;
      background: #fff;

      .no-result-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;

        .addr {
          height: 0.7rem;
          width: 0.7rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: 0.7rem 0.7rem;
          @include bg-image('addr');
        }

        .message {
          margin-top: 0.2rem;
          display: flex;
          align-items: center;
          font-size: $font-size-medium-s;

          .button {
            margin-left: 0.32rem;
            width: 1.16rem;
            padding-left: 0.2rem;
            /*padding: 0.1rem 0;*/
            height: 0.42rem;
            line-height: 0.4rem;
            border: 1px dotted $primary-color;
            border-radius: 0.06rem;
            font-size: $font-size-small-s;
            color: $primary-color;
            background-size: 0.24rem;
            @include bg-image('add');
            background-repeat: no-repeat;
            text-align: center;
            background-position: 0.1rem center;
          }
        }
      }
    }
  }
</style>
