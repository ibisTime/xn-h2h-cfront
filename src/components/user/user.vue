<template>
  <div class="user-wrapper">
    <div class="top-wrapper">
      <div class="personal">
        <div class="head-bg">
          <p class="head-pic"></p>
        </div>
        <div class="person-info">
          <div class="name">ting</div>
          <div class="info">
            <span>关注：111 </span><span class="split">|</span><span> 粉丝：1111</span>
          </div>
        </div>
        <div class="more-w"></div>
      </div>
      <div class="money-info">
        <div class="remained">余额:<span> 44.00</span></div>
        <div class="integral">积分:<span> 500</span></div>
      </div>
    </div>
    <div class="my-order">
      <div class="order-title">
        <p>我的订单</p>
        <p class="more-g">查看更多<span></span></p>
      </div>
      <div class="order-content">
        <ul>
          <li class="item-payment"><div class="icon"></div><p>待付款</p></li>
          <li class="item-sendGoods"><div class="icon"></div><p>待发货</p></li>
          <li class="item-delivery"><div class="icon"></div><p>待收货</p></li>
          <li class="item-haveGoods"><div class="icon"></div><p>已收货</p></li>
          <li class="item-evaluation"><div class="icon"></div><p>已评价</p></li>
        </ul>
      </div>
    </div>
    <div class="rests">
      <ul>
        <li class="item-posted">我发布的</li>
        <li class="item-sell">我卖出的</li>
        <li class="item-enrollment">活动报名</li>
        <li class="item-want">我想要的</li>
        <li class="item-fotoPlace">我的足迹</li>
        <li class="item-coupons">优惠券</li>
      </ul>
    </div>
    <m-footer></m-footer>
  </div>
</template>
<script>
  import MFooter from 'components/m-footer/m-footer';

  export default {
    data () {
      return {};
    },
    created() {},
    methods: {},
    components: {
      MFooter
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .user-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;

    .top-wrapper{
      width: 100%;
      background-size: 100% 100%;
      @include bg-image('background');
      color: #fff;
      font-size: $font-size-medium-x;

      .personal{
        display: flex;
        padding: 0.7rem 0.3rem;
        align-items: center;
        width:100%;

        .head-bg{
          width: 1.28rem;
          height: 1.28rem;
          background: #fff;
          padding: 0.04rem;
          border-radius: 50%;
          .head-pic{
            width: 1.2rem;
            height: 1.2rem;
            @include bg-image('mine');
            background-size: 100% 100%;
            border-radius: 50%;
          }
        }

        .person-info{
          flex: 1;
          padding-left: 0.3rem;

          .name{
            font-size: $font-size-large-s;
          }

          .info{
            margin-top: 0.24rem;
            font-size: $font-size-medium;

            .split {
              padding: 0 0.2rem;
            }
          }
        }

        .more-w{
          width: 0.3rem;
          height: 1.28rem;
          @include bg-image('moreW');
          background-size: 0.2rem;
          background-position: center;
          background-repeat: no-repeat;
        }

      }

      .money-info{
        width: 100%;
        height: 1rem;
        padding: 0.2rem;
        background: #fff;
        line-height: 1rem;
        text-align: center;
        color: #666;

        div{
          float: left;
          display: inline-block;
          width: 50%;
          height: 0.6rem;
          line-height: 0.6rem;

          span{
            font-size: $font-size-large-s;
            color: #49b1fb;
          }
        }

        .remained{
          border-right: 1px solid #eee;
        }
      }

    }

    .my-order{
      margin-top: 0.2rem;
      width: 100%;
      height: 2.7rem;
      background: #fff;

      .order-title{
        width: 100%;
        height: 0.9rem;
        @include border-bottom-1px(#eee);

        p{
          display: inline-block;
          float: left;
          width: 75%;
          height: 0.9rem;
          padding: 0 0.3rem;
          line-height: 0.9rem;
          font-size: $font-size-medium-x;
        }

        .more-g{
          float: right;
          width: 25%;
          font-size: $font-size-small;
          color: #999;

          span{
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            margin-left: 0.1rem;
            @include bg-image('moreG');
            background-size: 50% 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }

      .order-content{
        width: 100%;
        height: 1.8rem;

        ul{
          display: flex;
          align-items: center;
          width: 100%;
          height: 1.8rem;

          li{
            flex: 1;
            text-align: center;
            display: inline-block;
            font-size: 0;

            .icon {
              height: 0.4rem;
              width: 0.4rem;
              display: inline-block;
              margin-bottom: 0.36rem;
              background-repeat: no-repeat;
              background-position: center;
              background-size: 0.4rem;
            }

            p {
              font-size: $font-size-small;
            }
          }
          .item-payment .icon {
            @include bg-image('payment');
          }
          .item-sendGoods .icon {
            @include bg-image('sendGoods');
          }
          .item-delivery .icon {
            @include bg-image('delivery');
          }
          .item-haveGoods .icon {
            @include bg-image('haveGoods');
          }
          .item-evaluation .icon {
            @include bg-image('evaluation');
          }
        }

      }
    }

    .rests{
      width: 100%;
      height:3.8rem;
      margin-top: 0.2rem;
      background: #fff;
      font-size: 0;
      li{
        padding-top: 1.2rem;
        width: 2.5rem;
        height: 1.9rem;
        display: inline-block;
        text-align: center;
        font-size: $font-size-small;
        color:#666;
        @include border-bottom-1px(#eee);
        @include border-right-1px(#eee);
        background-repeat: no-repeat;
        background-position: 50% 34%;;
        background-size: 0.4rem;
      }
      .item-posted{
        @include bg-image('posted');
      }
      .item-sell{
        @include bg-image('sell');
      }
      .item-enrollment{
        @include bg-image('enrollment');
      }
      .item-want{
        @include bg-image('want');
      }
      .item-fotoPlace{
        @include bg-image('fotoPlace');
      }
      .item-coupons{
        @include bg-image('coupons');
      }
    }

  }

</style>
