<template>
  <transition name="slide">
    <div class="order-detail-wrapper">
      <scroll :pullUpLoad="pullUpLoad">
        <div class="order-info">
          <div class="info">订单号：44444444444444</div>
          <div class="info">下单时间：2019-11-30</div>
          <div class="info">订单状态：待支付</div>
        </div>
        <div class="address-wrapper">
          <div class="inner">
            <div class="header">收货人：秀袖型<span>19999999999</span></div>
            <div class="address">收货地址：浙江省 杭州市 余杭区 仓前街道梦想小镇天使村8幢宜车叮叮2楼橙袋科技</div>
          </div>
        </div>
        <ul class="goods">
          <li class="border-bottom-1px">
            <div class="img"></div>
            <div class="note">
              <div class="top">
                <div class="name twoline-ellipsis">商品名称商品名称</div>
                <div class="desc twoline-ellipsis">商品简介商品简介商品简介</div>
              </div>
              <div class="price">¥20.00</div>
            </div>
          </li>
        </ul>
        <div class="amount-item">商品总额<span>¥20.00</span></div>
        <div class="amount-item border-bottom-1px">运费<span>+¥10.00</span></div>
        <div class="pay-item">支付总价<span class="unit">¥</span><span>30.00</span></div>
        <div class="logistics">
          <div class="name">物流公司：顺丰快递</div>
          <div class="code">物流单号：45554454545454</div>
        </div>
      </scroll>
      <div class="btns">
        <div class="btn cancel">取消</div>
        <div class="btn">支付</div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    created() {
      this.pullUpLoad = null;
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .order-detail-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 101;
    background: $color-background;

    .order-info {
      padding: 0.32rem 0.3rem;
      background: #fff;

      .info {
        font-size: $font-size-medium-s;

        &+.info {
          margin-top: 0.2rem;
        }
      }
    }

    .address-wrapper {
      margin-top: 0.2rem;
      background-color: #fff;

      .inner {
        padding: 0.32rem 0.3rem;
        background-repeat: repeat-x;
        background-position: 0 100%;
        @include bg-image('addr');
      }

      .header {
        font-size: $font-size-medium-x;

        span {
          float: right;
        }
      }

      .address {
        padding-top: 0.2rem;
        line-height: 1.2;
        font-size: $font-size-small;
      }
    }

    .goods {
      margin-top: 0.2rem;
      background: #fff;

      li {
        display: flex;
        align-items: flex-start;
        padding: 0.2rem 0.3rem;
        @include border-bottom-1px($color-border);

        .img {
          width: 1.8rem;
          flex: 0 0 1.8rem;
          height: 1.8rem;
          background-position: center;
          background-size: cover;
          background-image: url('./demo.png');
        }

        .note {
          padding-left: 0.28rem;
          flex: 1;
          min-height: 1.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          line-height: 1.2;
          font-size: $font-size-medium-s;

          .desc {
            padding-top: 0.1rem;
            color: $color-text-l;
          }

          .price {
            text-align: right;
          }
        }
      }
    }

    .amount-item {
      background-color: #fff;
      padding: 0.3rem;
      font-size: $font-size-medium-s;

      span {
        float: right;
      }

      &.border-bottom-1px {
        @include border-bottom-1px($color-border);
      }
    }

    .pay-item {
      background-color: #fff;
      padding: 0.3rem;
      text-align: right;
      font-size: $font-size-large-ss;

      .unit {
        padding-left: 0.2rem;
        font-size: $font-size-medium-s;
      }
    }

    .logistics {
      margin-top: 0.2rem;
      padding: 0.32rem 0.3rem;
      font-size: $font-size-medium-s;
      background: #fff;

      .code {
        padding-top: 0.2rem;
      }
    }

    .btns {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.98rem;
      line-height: 0.98rem;
      font-size: $font-size-large-s;
      color: #fff;

      .btn {
        flex: 1;
        text-align: center;
        background-color: $primary-color;

        &.cancel {
          color: $color-text;
          background: #fff;
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
