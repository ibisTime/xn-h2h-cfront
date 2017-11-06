<template>
  <transition name="slide">
    <div class="sell-orders-wrapper">
      <scroll ref="scroll"
              :data="orderList"
              :hasMore="hasMore"
              @pullingUp="getPageOrders">
        <ul>
          <li v-for="(item, index) in orderList" @click="goDetail(item)">
            <div class="time border-bottom-1px">
              <span class="fl">订单编号：{{item.code}}</span>
              <span class="fr">{{item.applyDatetime | formatDate('yyyy-MM-dd')}}</span>
            </div>
            <div class="infos border-bottom-1px">
              <div class="img"><img v-lazy="formatImg(item.productOrderList[0].productPic)"/></div>
              <div class="info">
                <div class="top">
                  <div class="left">
                    <p class="name twoline-ellipsis">{{item.productOrderList[0].productName}}</p>
                    <p class="desc twoline-ellipsis">{{item.productOrderList[0].productDescription}}</p>
                  </div>
                  <div class="right">
                    <p>¥{{item.amount1 | formatAmount}}</p>
                    <p class="status">{{item.status | formatStatus}}</p>
                  </div>
                </div>
                <div class="bottom">总价：<span class="unit">¥</span><span class="price">{{getTotalAmount(item) | formatAmount}}</span></div>
              </div>
              <i v-if="item.status==='5'" class="success-icon"></i>
            </div>
            <div class="clearfix btns" v-show="showBtns(item.status)">
              <span class="btn cancel fr" v-show="showCancelBtn(item.status)" @click.stop="_cancelOrder(item)">取消订单</span>
              <span class="btn fr" v-show="showFhBtn(item.status)" @click.stop="_fhOrder(item)">发货</span>
              <span class="btn fr" v-show="showHandleTkBtn(item.status)" @click.stop="_handleTkOrder(item)">退款处理</span>
              <span class="btn fr" v-show="showRatingBtn(item.status)" @click.stop="showOrderRating(item)">查看评价</span>
            </div>
          </li>
        </ul>
        <div v-show="!hasMore && !orderList.length" class="no-result-wrapper">
          <img src="./no-result.png"/><p>暂无订单</p>
        </div>
      </scroll>
      <full-loading v-show="fetching" :title="fetchText"></full-loading>
      <confirm ref="alert" :isAlert="isAlert" :text="ratingContent"></confirm>
      <confirm-input ref="confirmInput" text="取消原因" @confirm="cancelOrder"></confirm-input>
      <toast :text="toastText" ref="toast"></toast>
      <deliver-goods ref="deliver" @confirm="fhOrder" :deliverList="deliverList"></deliver-goods>
      <tk-review ref="review" @confirm="handleTkOrder"></tk-review>
      <router-view @updateOrder="updateOrder"></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapMutations} from 'vuex';
  import {SET_CURRENT_ORDER} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import Toast from 'base/toast/toast';
  import Confirm from 'base/confirm/confirm';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import FullLoading from 'base/full-loading/full-loading';
  import {setTitle, formatImg} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import {getPageSellOrders, sendOrder, tkReview, cancelOrder, getOrderRating} from 'api/biz';
  import {getDictList} from 'api/general';
  import {ORDER_STATUS} from '../orders/config';
  import DeliverGoods from 'components/deliver-goods/deliver-goods';
  import TkReview from 'components/tk-review/tk-review';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        orderList: [],
        deliverList: [],
        fetching: false,
        fetchText: '',
        text: '',
        ratingContent: '',
        inputText: '',
        toastText: '',
        start: 1,
        limit: 10,
        hasMore: true
      };
    },
    created() {
      this.first = true;
      this.isAlert = true;
      this.getInitData();
    },
    methods: {
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.getPageOrders();
        }
      },
      getPageOrders() {
        getPageSellOrders(this.start, this.limit).then((data) => {
          if (data.list.length < this.limit || data.totalCount <= this.limit) {
            this.hasMore = false;
          }
          this.orderList = this.orderList.concat(data.list);
          this.start++;
        });
      },
      cancelOrder(text) {
        this.fetching = true;
        this.fetchText = '取消中...';
        cancelOrder(this.curItem.code, text).then(() => {
          this.fetching = false;
          this.showToast('取消成功');
          let index = this.findIndex(this.curItem);
          let item = this.curItem;
          this.orderList.splice(index, 1, {
            ...item,
            status: '91'
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      fhOrder(code, company) {
        this.fetching = true;
        this.fetchText = '发货中...';
        sendOrder(this.curItem.code, code, company.dkey).then(() => {
          this.fetching = false;
          this.showToast('发货成功');
          let index = this.findIndex(this.curItem);
          let item = this.curItem;
          this.orderList.splice(index, 1, {
            ...item,
            status: '3'
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      showOrderRating(item) {
        this.fetching = true;
        this.fetchText = '正在载入...';
        getOrderRating(item.code).then((data) => {
          this.fetching = false;
          if (data.status === 'A' || data.status === 'B') {
            this.ratingContent = data.content;
          } else {
            this.ratingContent = '您的评论存在敏感词，请耐心等待管理人员审核。';
          }
          this.$refs.alert.show();
        }).catch(() => {
          this.fetching = false;
        });
      },
      showToast(text) {
        this.toastText = text;
        this.$refs.toast.show();
      },
      getTotalAmount(item) {
        return +item.amount1 + +item.yunfei;
      },
      formatImg(img) {
        return formatImg(img);
      },
      goDetail(item) {
        this.setCurrentOrder(item);
        this.$router.push(`/user/sell-order/${item.code}`);
      },
      handleTkOrder(result, remark) {
        this.fetching = true;
        this.fetchText = '审核中...';
        tkReview(this.curItem.code, result, remark).then(() => {
          this.fetching = false;
          this.showToast('审核成功');
          let index = this.findIndex(this.curItem);
          let item = this.curItem;
          let nextStatus = result === '1' ? '8' : '7';
          this.orderList.splice(index, 1, {
            ...item,
            status: nextStatus
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      _cancelOrder(item) {
        this.curItem = item;
        this.$refs.confirmInput.show();
      },
      _fhOrder(item) {
        this.curItem = item;
        if (!this.deliverList.length) {
          this.fetchText = '正在载入...';
          this.fetching = true;
          getDictList('back_kd_company').then((data) => {
            this.fetching = false;
            this.deliverList = data;
            this.$refs.deliver.show();
          }).catch(() => {
            this.fetching = false;
          });
        } else {
          this.$refs.deliver.show();
        }
      },
      _handleTkOrder(item) {
        this.curItem = item;
        this.$refs.review.show();
      },
      shouldGetData() {
        if (this.$route.path === '/user/sell-order') {
          setTitle('我卖出的');
          return this.first;
        }
        return false;
      },
      showBtns(status) {
        if (status !== '1' && status !== '2' && status !== '5' && status !== '6') {
          return false;
        }
        return true;
      },
      showCancelBtn(status) {
        return status === '1';
      },
      showFhBtn(status) {
        return status === '2';
      },
      showHandleTkBtn(status) {
        return status === '6';
      },
      showRatingBtn(status) {
        return status === '5';
      },
      findIndex(item) {
        return this.orderList.findIndex((order) => {
          return order.code === item.code;
        });
      },
      updateOrder(code, status, params) {
        if (this.orderList.length) {
          let index = this.findIndex({code});
          if (~index) {
            let item = this.orderList[index];
            this.orderList.splice(index, 1, {
              ...item,
              status,
              ...params
            });
          }
        }
      },
      ...mapMutations({
        'setCurrentOrder': SET_CURRENT_ORDER
      })
    },
    filters: {
      formatStatus(status) {
        return ORDER_STATUS[status];
      }
    },
    updated() {
      this.getInitData();
    },
    components: {
      Scroll,
      Toast,
      TkReview,
      Confirm,
      ConfirmInput,
      FullLoading,
      DeliverGoods
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .sell-orders-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .no-result-wrapper {
      text-align: center;
      padding-top: 2.1rem;
      img {
        width: 2.2rem;
      }
      p {
        margin-top: 0.3rem;
        font-size: $font-size-medium;
      }
    }


    ul {
      font-size: $font-size-medium;

      li {
        background: #fff;
        margin-top: 0.2rem;

        &:first-child {
          margin-top: 0;
        }

        .time {
          padding: 0 0.3rem;
          font-size: $font-size-small-s;
          color: $color-text-l;
          height: 0.6rem;
          line-height: 0.6rem;
          @include border-bottom-1px($color-border);
        }

        .fl {
          float: left;
        }

        .fr {
          float: right;
        }

        .infos {
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

          .info {
            padding-left: 0.2rem;
            flex: 1;
            min-height: 1.8rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .top {
              display: flex;
              width: 100%;

              .left {
                align-items: flex-start;
                flex: 1;
                padding-right: 0.2rem;
                line-height: 1.2;
                font-size: $font-size-medium-s;

                .desc {
                  padding-top: 0.1rem;
                  color: $color-text-l;
                }
              }
              .right {
                text-align: right;
                white-space: nowrap;
                font-size: $font-size-small;

                .status {
                  margin-top: 0.2rem;
                  color: $color-red;
                  font-size: $font-size-medium-s;
                }
              }
            }

            .bottom {
              padding-top: 0.1rem;
              text-align: right;
              font-size: $font-size-medium;

              .unit {
                font-size: $font-size-small-s;
                color: $color-red;
              }

              .price {
                font-size: $font-size-medium-x;
                color: $color-red;
              }
            }
          }

          .success-icon {
            position: absolute;
            bottom: 0.3rem;
            right: 0.2rem;
            width: 1rem;
            height: 1rem;
            background-size: 1rem;
            background-repeat: no-repeat;
            @include bg-image('sell');
          }
        }

        .btns {
          padding: 0.18rem 0.3rem;

          .btn {
            display: inline-block;
            margin-left: 0.2rem;
            padding: 0 0.2rem;
            height: 0.64rem;
            line-height: 0.64rem;
            border: 1px solid $primary-color;
            border-radius: 0.06rem;
            color: $primary-color;

            &.cancel {
              border-color: #ccc;
              color: $color-text-l;
            }
          }
        }
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
