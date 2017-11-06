<template>
  <transition name="slide">
    <div class="order-detail-wrapper">
      <div class="scroll-wrapper">
        <scroll ref="scroll" :pullUpLoad="pullUpLoad">
          <div class="order-info">
            <div class="info">订单号：{{orderCode}}</div>
            <div class="info">下单时间：{{applyDatetime | formatDate('yyyy-MM-dd hh:mm')}}</div>
            <div class="info">订单状态：{{status | formatStatus}}</div>
          </div>
          <div class="address-wrapper">
            <div class="inner">
              <div class="header">收货人：{{receiver}}<span>{{reMobile}}</span></div>
              <div class="address">收货地址：{{reAddress}}</div>
            </div>
          </div>
          <ul class="goods">
            <li class="border-bottom-1px" @click="goDetail">
              <div class="img"><img :src="imgUrl"></div>
              <div class="note">
                <div class="top">
                  <div class="name twoline-ellipsis">{{productName}}</div>
                  <div class="desc twoline-ellipsis">{{productDescription}}</div>
                </div>
                <div class="price">¥{{productAmount | formatAmount}}</div>
              </div>
            </li>
          </ul>
          <div class="amount-item">商品总额<span>¥{{productAmount | formatAmount}}</span></div>
          <div class="amount-item border-bottom-1px">运费<span>¥{{yunfei | formatAmount}}</span></div>
          <div class="pay-item">支付总价<span class="unit">¥</span><span>{{totalAmount | formatAmount}}</span></div>
          <div class="amount-item remark" v-show="payDesc"><label>支付说明：</label><div>{{payDesc}}</div></div>
          <div class="logistics" v-if="logisticsCode">
            <div class="name">物流公司：{{getCompany()}}</div>
            <div class="code">物流单号：{{logisticsCode}}</div>
          </div>
          <div class="amount-item remark" v-show="applyNote"><label>买家嘱咐：</label><div>{{applyNote}}</div></div>
          <div class="amount-item remark" v-show="remark"><label>备注：</label><div>{{remark}}</div></div>
        </scroll>
      </div>
      <div class="btns">
        <div class="btn cancel" v-show="showCancel()" @click="_cancelOrder">取消订单</div>
        <div class="btn cancel" v-show="showTk()" @click="_tkOrder">申请退款</div>
        <div class="btn" v-show="showRemind()" @click="_remindBtn">催货</div>
        <div class="btn" v-show="showPay()" @click="payOrder">立即支付</div>
        <div class="btn" v-show="showReceive()" @click="_receiveOrder">确认收货</div>
        <div class="btn" v-show="showRating()" @click="ratingOrder">立即评价</div>
        <div class="btn" v-show="showWatch()" @click="showOrderRating">查看评价</div>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <rating ref="rating" @ratingSuc="ratingSuccess" :orderCode="orderCode" :parentCode="parentCode"></rating>
      <confirm ref="confirm" :text="text" @confirm="handleConfirm"></confirm>
      <confirm ref="alert" :isAlert="isAlert" :text="ratingContent"></confirm>
      <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
      <toast :text="toastText" ref="toast"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_CURRENT_ORDER} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Toast from 'base/toast/toast';
  import {setTitle, isUnDefined, formatImg, formatAmount} from 'common/js/util';
  import {getDictList} from 'api/general';
  import {ORDER_STATUS} from '../orders/config';
  import {commonMixin} from 'common/js/mixin';
  import Rating from 'components/rating/rating';
  import {getOrder, cancelOrder, receiveOrder, tkOrder, getOrderRating, remindOrder} from 'api/biz';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        loadingFlag: true,
        productInfo: {},
        text: '',
        loadingText: '正在载入...',
        currentIndex: 0,
        ratingContent: '',
        inputText: '',
        toastText: ''
      };
    },
    computed: {
      parentCode() {
        return this.currentOrder && this.currentOrder.productOrderList[0].productCode;
      },
      orderCode() {
        return this.$route.params.id;
      },
      applyDatetime() {
        return this.currentOrder && this.currentOrder.applyDatetime;
      },
      status() {
        return this.currentOrder && this.currentOrder.status;
      },
      reMobile() {
        return this.currentOrder && this.currentOrder.reMobile;
      },
      receiver() {
        return this.currentOrder && this.currentOrder.receiver;
      },
      reAddress() {
        return this.currentOrder && this.currentOrder.reAddress;
      },
      imgUrl() {
        return formatImg(this.currentOrder && this.currentOrder.productOrderList[0].productPic || '');
      },
      productName() {
        return this.currentOrder && this.currentOrder.productOrderList[0].productName;
      },
      productDescription() {
        return this.currentOrder && this.currentOrder.productOrderList[0].productDescription;
      },
      productAmount() {
        return this.currentOrder && this.currentOrder.amount1 || 0;
      },
      yunfei() {
        return this.currentOrder && this.currentOrder.yunfei || 0;
      },
      logisticsCode() {
        return this.currentOrder && this.currentOrder.logisticsCode || '';
      },
      totalAmount() {
        if (this.currentOrder) {
          let amount = this.currentOrder.amount1;
          let yunfei = this.currentOrder.yunfei;
          return amount + yunfei;
        }
        return 0;
      },
      remark() {
        return this.currentOrder && this.currentOrder.remark || '';
      },
      applyNote() {
        return this.currentOrder && this.currentOrder.applyNote || '';
      },
      payDesc() {
        if (this.currentOrder) {
          let amount1 = this.currentOrder.payAmount1;
          let amount2 = this.currentOrder.payAmount2;
          let amount3 = this.currentOrder.payAmount3;
          if (amount1 || amount2 || amount3) {
            let str = [];
            amount1 && str.push(`人民币支付${formatAmount(amount1)}元`);
            amount2 && str.push(`积分消耗${formatAmount(amount2)}`);
            amount3 && str.push(`优惠券抵扣${formatAmount(amount3)}元`);
            return str.join(' + ');
          }
          return '';
        }
        return '';
      },
      ...mapGetters([
        'currentOrder',
        'orderList'
      ])
    },
    created() {
      this.pullUpLoad = null;
      this.first = true;
      this.code = this.$route.params.id;
      this.wlComps = null;
      this.getInitData();
      this.isAlert = true;
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (/\/user\/order\/[^/]+$/.test(this.$route.path)) {
          setTitle('订单详情');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this._getOrder();
        }
      },
      _getOrder() {
        Promise.all([
          getOrder(this.code),
          getDictList('back_kd_company')
        ]).then(([data, wlComps]) => {
          if (!this.currentOrder) {
            this.setCurrentOrder(data);
          }
          this.order = data;
          this.productInfo = data.product || {};
          this.wlComps = wlComps;
          this.loadingFlag = false;
          setTimeout(() => {
            this.$refs.scroll.refresh();
          }, 20);
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      showCancel() {
        if (this.currentOrder) {
          return this.currentOrder.status === '1';
        }
        return false;
      },
      showTk() {
        if (this.currentOrder) {
          return this.currentOrder.status === '2';
        }
        return false;
      },
      showRemind(status) {
        if (this.currentOrder) {
          return this.currentOrder.status === '2';
        }
        return false;
      },
      showPay() {
        if (this.currentOrder) {
          return this.currentOrder.status === '1';
        }
        return false;
      },
      showReceive() {
        if (this.currentOrder) {
          return this.currentOrder.status === '3';
        }
        return false;
      },
      showRating() {
        if (this.currentOrder) {
          return this.currentOrder.status === '4';
        }
        return false;
      },
      showWatch() {
        if (this.currentOrder) {
          return this.currentOrder.status === '5';
        }
        return false;
      },
      getCompany() {
        if (!this.wlComps || !this.currentOrder.logisticsCompany) {
          return '';
        }
        let orderComp = this.currentOrder.logisticsCompany;
        let index = this.wlComps.findIndex((item) => {
          return item.dkey === orderComp;
        });
        return ~index ? this.wlComps[index].dvalue : '未知';
      },
      _cancelOrder() {
        this.inputText = '取消原因';
        this.$refs.confirmInput.show();
      },
      handleInputConfirm(text) {
        this.loadingFlag = true;
        if (this.currentOrder.status === '1') {
          this.cancelOrder(text);
        } else if (this.currentOrder.status === '2') {
          this.tkOrder(text);
        }
      },
      handleConfirm(text) {
        this.loadingFlag = true;
        if (this.currentOrder.status === '2') {
          this.remindOrder(text);
        } else if (this.currentOrder.status === '3') {
          this.receiveOrder(text);
        }
      },
      receiveOrder() {
        this.loadingFlag = true;
        this.loadingText = '收货中...';
        receiveOrder(this.code).then(() => {
          this.loadingFlag = false;
          this.toastText = '收货成功';
          this.$refs.toast.show();
          this.editOrderListByReceived({
            code: this.code
          });
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      remindOrder() {
        this.loadingFlag = true;
        this.fetchText = '催货中...';
        remindOrder(this.code).then(() => {
          this.loadingFlag = false;
          this.toastText = '催货成功';
          this.$refs.toast.show();
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      tkOrder(text) {
        this.loadingText = '提交中...';
        tkOrder(this.code, text).then(() => {
          this.loadingFlag = false;
          this.toastText = '退款申请提交成功';
          this.$refs.toast.show();
          this.editOrderListByTk({
            code: this.code
          });
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      cancelOrder(text) {
        this.loadingText = '取消中...';
        cancelOrder(this.code, text).then(() => {
          this.loadingFlag = false;
          this.toastText = '取消成功';
          this.$refs.toast.show();
          this.editOrderListByCancel({
            code: this.code
          });
        }).catch(() => {
          this.loadingFlag = false;
        });
      },
      payOrder() {
        this.$router.push(`${this.$route.path}/pay?code=${this.$route.params.code}`);
      },
      ratingOrder() {
        this.$refs.rating.show();
      },
      showOrderRating() {
        getOrderRating(this.$route.params.id).then((data) => {
          if (data.status === 'A' || data.status === 'B') {
            this.ratingContent = data.content;
          } else {
            this.ratingContent = '您的评论存在敏感词，请耐心等待管理人员审核。';
          }
          this.$refs.alert.show();
        }).catch(() => {});
      },
      _receiveOrder() {
        this.text = '确认收货';
        this.$refs.confirm.show();
      },
      _tkOrder() {
        this.inputText = '申请退款原因';
        this.$refs.confirmInput.show();
      },
      _remindBtn(item) {
        this.text = '确认催货';
        this.$refs.confirm.show();
      },
      ratingSuccess(code) {
        this.editOrderListByRating({code});
      },
      goDetail() {
        if (this.currentOrder) {
          this.$router.push(this.$route.path + '/' + this.currentOrder.productOrderList[0].productCode);
        }
      },
      ...mapMutations({
        'setCurrentOrder': SET_CURRENT_ORDER
      }),
      ...mapActions([
        'editOrderListByRating',
        'editOrderListByCancel',
        'editOrderListByReceived',
        'editOrderListByTk'
      ])
    },
    filters: {
      formatStatus(status) {
        if (isUnDefined(status)) {
          return '未知';
        }
        return ORDER_STATUS[status];
      }
    },
    components: {
      Scroll,
      Rating,
      Toast,
      Confirm,
      ConfirmInput,
      FullLoading
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
        background-size: auto 0.04rem;
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

          img {
            width: 100%;
            height: 100%;
          }
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

    .scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      bottom: 1rem;
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

    .remark {
      display: flex;
      align-items: flex-start;
      margin-top: 0.2rem;

      label {
        white-space: nowrap;
      }

      div {
        line-height: 1.2;
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
