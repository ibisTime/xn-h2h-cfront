<template>
  <transition name="slide">
    <div class="pay-wrapper">
      <div class="header">支付金额<span>¥{{totalAmount | formatAmount}}</span></div>
      <div class="title">支付方式</div>
      <div class="pay-types">
        <div class="pay-item" @click="choseYe">
          <i class="icon icon-cny"></i>
          <div>余额(可用余额：¥<label>{{(cnyAccount && cnyAccount.amount) | formatAmount}}</label>)</div>
          <i class="icon-chose" :class="yeCls"></i>
        </div>
        <div class="pay-item" @click="choseWx">
          <i class="icon icon-wx"></i>
          <div>微信支付</div>
          <i class="icon-chose" :class="wxCls"></i>
        </div>
        <div class="pay-item" @click="choseJf">
          <i class="icon icon-jf"></i>
          <div>积分 (可用积分：<label>{{(jfAccount && jfAccount.amount) | formatAmount}}，{{jfRule}}</label>积分抵扣1元人民币)</div>
          <i class="icon-chose" :class="jfCls"></i>
        </div>
        <div class="pay-item" @click="showCoupon">
          <i class="icon icon-yhq"></i>
          <div class="yhq-item"><span class="yhq-title">优惠券</span><span class="yhq-text">{{couponText}}</span></div>
          <i class="icon-more"></i>
        </div>
      </div>
      <div class="foot">
        <button @click="payOrder">立即支付</button>
      </div>
      <full-loading v-show="loadingFlag" ref="full-loading" :title="title"></full-loading>
      <toast ref="toast" :text="text"></toast>
      <coupon-mask ref="coupon" @confirm="handleConfirm"></coupon-mask>
    </div>
  </transition>
</template>
<script>
  import {payOrder, getOrder} from 'api/biz';
  import {getAccount} from 'api/account';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_CNY_ACCOUNT, SET_JF_ACCOUNT} from 'store/mutation-types';
  import {commonMixin} from 'common/js/mixin';
  import {initPay} from 'common/js/weixin';
  import CouponMask from 'components/coupon-mask/coupon-mask';
  import {getTradeIconRule} from 'api/general';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        loadingFlag: true,
        currentIndex: 0,
        order: null,
        text: '',
        title: '正在载入...',
        cnyChose: true,
        wxChose: false,
        jfChose: false,
        couponCode: '',
        couponText: '不使用优惠券',
        jfRule: ''
      };
    },
    created() {
      Promise.all([
        this.getAccount(),
        this.getOrder(),
        this.getJFRule()
      ]).finally(() => {
        this.loadingFlag = false;
      });
    },
    computed: {
      totalAmount() {
        if (this.order) {
          let yf = +this.order.yunfei;
          let amount = +this.order.amount1;
          return yf + amount;
        }
        return '0.00';
      },
      yeCls() {
        return this.cnyChose ? 'act' : '';
      },
      wxCls() {
        return this.wxChose ? 'act' : '';
      },
      jfCls() {
        return this.jfChose ? 'act' : '';
      },
      ...mapGetters([
        'cnyAccount',
        'jfAccount'
      ])
    },
    methods: {
      getOrder() {
        return getOrder(this.$route.query.code).then((data) => {
          this.order = data;
          return data;
        });
      },
      getAccount() {
        if (!this.cnyAccount) {
          return getAccount().then((data) => {
            let index0 = 0;
            let index1 = 0;
            data.forEach((item, index) => {
              if (item.currency === 'CNY') {
                index0 = index;
              } else if (item.currency === 'JF') {
                index1 = index;
              }
            });
            this.setCnyAccount(data[index0]);
            this.setJfAccount(data[index1]);
            return Promise.resolve(data[index0], data[index1]);
          });
        }
        return Promise.resolve(this.cnyAccount, this.jfAccount);
      },
      choseYe() {
        this.cnyChose = !this.cnyChose;
        this.wxChose = false;
      },
      choseWx() {
        this.wxChose = !this.wxChose;
        this.cnyChose = false;
      },
      choseJf() {
        this.jfChose = !this.jfChose;
      },
      showCoupon() {
        this.$refs.coupon.show();
      },
      handleConfirm(item) {
        this.couponCode = item.code || '';
        this.couponText = item.text;
      },
      getPayType() {
        let type;
        if (this.jfChose) {
          if (this.wxChose) {
            if (this.couponCode) {
              type = 68;
            } else {
              type = 61;
            }
          } else if (this.couponCode) {
            if (this.cnyChose) {
              type = 69;
            } else {
              type = 63;
            }
          } else if (this.cnyChose) {
            type = 62;
          } else {
            type = 0;
          }
        } else if (this.cnyChose) {
          if (this.couponCode) {
            type = 65;
          } else {
            type = 1;
          }
        } else if (this.wxChose) {
          if (this.couponCode) {
            type = 64;
          } else {
            type = 5;
          }
        } else {
          type = 60;
        }
        return type;
      },
      payOrder() {
        this.title = '支付中...';
        this.loadingFlag = true;
        let payType = this.getPayType();
        let code = this.$route.query.code;
        payOrder(code, payType, this.couponCode).then((data) => {
          if (data.payCode) {
            this.wxPay(data, code);
          } else {
            this.loadingFlag = false;
            this.text = '支付成功';
            this.$refs.toast.show();
            this.editOrderListByPay({code});
            this.handleSuc();
          }
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      wxPay(data, code) {
        if (data && data.signType) {
          initPay(data, () => {
            this.loadingFlag = false;
            this.text = '支付成功';
            this.$refs.toast.show();
            this.editOrderListByPay({code});
            this.handleSuc();
          }, () => {
            this.loadingFlag = false;
            this.text = '支付失败';
            this.$refs.toast.show();
          }, () => {
            this.loadingFlag = false;
          });
        } else {
          this.loadingFlag = false;
          this.text = '支付失败';
          this.$refs.toast.show();
        }
      },
      handleSuc() {
        setTimeout(() => {
          if (this.$route.path === '/category/confirm/pay') {
            this.$router.replace('/user/order/' + this.$route.query.code);
          } else {
            this.$router.back();
          }
        }, 1000);
      },
      getJFRule() {
        getTradeIconRule('jf_dk_times').then((data) => {
          this.jfRule = data.cvalue;
        });
      },
      ...mapMutations({
        'setCnyAccount': SET_CNY_ACCOUNT,
        'setJfAccount': SET_JF_ACCOUNT
      }),
      ...mapActions([
        'editOrderListByPay'
      ])
    },
    components: {
      FullLoading,
      CouponMask,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .pay-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 102;
    background: $color-background;

    .header {
      height: 1rem;
      line-height: 1rem;
      padding: 0 0.3rem;
      font-size: $font-size-medium-x;
      background: #fff;

      span {
        float: right;
        font-size: $font-size-medium;
        color: $color-red;
      }
    }

    .title {
      margin-top: 0.2rem;
      padding-left: 0.3rem;
      line-height: 0.6rem;
      @include border-bottom-1px($color-border);
      font-size: $font-size-small;
      color: $color-text-l;
      background: #fff;
    }

    .pay-types {
      .pay-item {
        display: flex;
        align-items: center;
        height: 1rem;
        padding: 0 0.3rem;
        background-color: #fff;

        .icon {
          display: inline-block;
          width: 0.5rem;
          flex: 0 0 0.5rem;
          height: 0.5rem;
          background-size: 0.5rem 0.5rem;

          &.icon-wx {
            @include bg-image('weixin');
          }

          &.icon-cny {
            @include bg-image('cny');
          }

          &.icon-jf {
            @include bg-image('jf');
          }

          &.icon-yhq {
            @include bg-image('yhq');
          }
        }

        .icon-chose {
          display: inline-block;
          width: 0.44rem;
          flex: 0 0 0.44rem;
          height: 0.44rem;
          background-size: 0.44rem 0.44rem;
          @include bg-image('un-select');

          &.act {
            @include bg-image('selected');
          }
        }

        .icon-more {
          display: inline-block;
          width: 0.32rem;
          flex: 0 0 0.32rem;
          height: 0.44rem;
          background-size: 0.16rem;
          background-repeat: no-repeat;
          background-position: right center;
          @include bg-image('more');
        }

        div {
          padding-left: 0.2rem;
          flex: 1;
          font-size: $font-size-medium-s;
        }

        .yhq-item {
          display: flex;
          align-items: center;
          overflow: hidden;

          .yhq-title {
            flex: 0 0 1rem;
          }

          .yhq-text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: right;
            font-size: $font-size-medium-s;
          }
        }
      }
    }

    .foot {
      display: flex;
      align-items: center;
      margin-top: 0.7rem;
      height: 0.9rem;
      padding: 0 0.3rem;
      font-size: 0;

      button {
        width: 100%;
        height: 100%;
        line-height: 0.9rem;
        border-radius: 0.1rem;
        font-size: $font-size-medium-xx;
        color: #fff;
        background: $primary-color;
      }
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
