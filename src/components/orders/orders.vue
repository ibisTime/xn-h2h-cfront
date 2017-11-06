<template>
  <transition name="slide">
    <div class="orders-wrapper">
      <div class="category-wrapper">
        <category-scroll :currentIndex="currentIndex"
                         :categorys="categorys"
                         @select="selectCategory"></category-scroll>
      </div>
      <div class="orders-content">
        <scroll ref="scroll"
                :data="currentList.data"
                :hasMore="currentList.hasMore"
                @pullingUp="getPageOrders">
          <ul v-if="currentList">
            <li v-for="(item, index) in currentList.data" @click="goDetail(item)">
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
              </div>
              <div class="clearfix btns" v-show="showBtns(item.status)">
                <span class="btn fr" v-show="showPayBtn(item.status)" @click.stop="payOrder(item)">立即支付</span>
                <span class="btn cancel fr" v-show="showCancelBtn(item.status)" @click.stop="_cancelOrder(item)">取消订单</span>
                <span class="btn fr" v-show="showRemindBtn(item.status)" @click.stop="_remindBtn(item)">催货</span>
                <span class="btn cancel fr" v-show="showTkBtn(item.status)" @click.stop="_tkOrder(item)">申请退款</span>
                <span class="btn fr" v-show="showReceiveBtn(item.status)" @click.stop="_receiveOrder(item)">确认收货</span>
                <span class="btn fr" v-show="showRatingBtn(item.status)" @click.stop="ratingOrder(item)">立即评价</span>
              </div>
            </li>
          </ul>
          <no-result v-show="!currentList.hasMore && !(currentList.data && currentList.data.length)" title="暂无订单" class="no-result-wrapper"></no-result>
        </scroll>
      </div>
      <full-loading v-show="fetching" :title="fetchText"></full-loading>
      <confirm ref="confirm" :text="text" @confirm="handleConfirm"></confirm>
      <confirm ref="alert" :isAlert="isAlert" :text="ratingContent"></confirm>
      <confirm-input ref="confirmInput" :text="inputText" @confirm="handleInputConfirm"></confirm-input>
      <toast :text="toastText" ref="toast"></toast>
      <rating ref="rating" @ratingSuc="ratingSuccess" :parentCode="currentGoodsCode" :orderCode="currentCode"></rating>
      <router-view @updateNum="handleUpdateNum"></router-view>
    </div>
  </transition>
</template>
<script>
  import {CATEGORYS, LIMIT, ORDER_STATUS} from './config';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import ConfirmInput from 'base/confirm-input/confirm-input';
  import Toast from 'base/toast/toast';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_ORDER_LIST, SET_CURRENT_ORDER} from 'store/mutation-types';
  import {getPageOrders, cancelOrder, receiveOrder, tkOrder, remindOrder} from 'api/biz';
  import {commonMixin} from 'common/js/mixin';
  import {formatImg, setTitle} from 'common/js/util';
  import Rating from 'components/rating/rating';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        currentCode: '',
        currentGoodsCode: '',
        fetching: false,
        fetchText: '',
        categorys: CATEGORYS,
        currentIndex: +this.$route.query.index || 0,
        text: '',
        ratingContent: '',
        inputText: '',
        toastText: ''
      };
    },
    created() {
      this.first = true;
      this.isAlert = true;
      this.getInitData();
    },
    computed: {
      currentList() {
        let _curListObj = this.orderList[this.categorys[this.currentIndex].key];
        if (!_curListObj) {
          _curListObj = {
            start: 1,
            limit: LIMIT,
            hasMore: true,
            data: [],
            key: this.categorys[this.currentIndex].key
          };
        }
        return _curListObj;
      },
      ...mapGetters(['orderList'])
    },
    methods: {
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          // 清除缓存的订单列表数据
          this.setOrderList({});
          this.getPageOrders();
        }
      },
      getPageOrders() {
        let key = this.categorys[this.currentIndex].key;
        let statusList = key === 'all' ? [] : key.split('||');
        if (this.currentList.hasMore) {
          getPageOrders(this.currentList.start, this.currentList.limit, statusList).then((data) => {
            let _orderOri = this.orderList[key];
            let _order;
            if (!_orderOri) {
              _order = {
                start: 1,
                limit: LIMIT,
                hasMore: true,
                data: [],
                key: key
              };
            } else {
              _order = {
                ..._orderOri
              };
            }
            if (data.list.length < _order.limit || data.totalCount <= _order.limit) {
              _order.hasMore = false;
            }
            _order.start++;
            let _currentList = {
              ..._order
            };
            _currentList.data = _currentList.data.concat(data.list);
            let _orderList = {
              ...this.orderList,
              [_currentList['key']]: _currentList
            };
            this.setOrderList(_orderList);
          });
        }
      },
      selectCategory(index) {
        this.currentIndex = index;
        this.$refs.scroll.scrollTo(0, 0);
        if (!this.currentList.data.length && this.currentList.hasMore) {
          this.getPageOrders();
        }
      },
      getTotalAmount(item) {
        return +item.amount1 + +item.yunfei;
      },
      formatImg(img) {
        return formatImg(img);
      },
      goDetail(item) {
        this.setCurrentOrder(item);
        this.$router.push(`/user/order/${item.code}`);
      },
      payOrder(item) {
        this.$router.push(`/user/order/pay?code=${item.code}`);
      },
      _cancelOrder(item) {
        this.inputText = '取消原因';
        this.curItem = item;
        this.$refs.confirmInput.show();
      },
      _tkOrder(item) {
        this.inputText = '申请退款原因';
        this.curItem = item;
        this.$refs.confirmInput.show();
      },
      remindOrder() {
        this.fetching = true;
        this.fetchText = '催货中...';
        remindOrder(this.curItem.code).then(() => {
          this.fetching = false;
        }).catch(() => {
          this.fetching = false;
        });
      },
      receiveOrder() {
        this.fetching = true;
        this.fetchText = '收货中...';
        receiveOrder(this.curItem.code).then(() => {
          this.fetching = false;
          this.editOrderListByReceived({
            code: this.curItem.code
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      handleConfirm(text) {
        this.fetching = true;
        if (this.curItem.status === '2') {
          this.remindOrder(text);
        } else if (this.curItem.status === '3') {
          this.receiveOrder(text);
        }
      },
      handleInputConfirm(text) {
        this.fetching = true;
        if (this.curItem.status === '1') {
          this.cancelOrder(text);
        } else if (this.curItem.status === '2') {
          this.tkOrder(text);
        }
      },
      cancelOrder(text) {
        this.fetchText = '取消中...';
        cancelOrder(this.curItem.code, text).then(() => {
          this.fetching = false;
          this.editOrderListByCancel({
            code: this.curItem.code
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      tkOrder(text) {
        this.fetchText = '提交中...';
        tkOrder(this.curItem.code, text).then(() => {
          this.fetching = false;
          this.toastText = '退款申请提交成功';
          this.$refs.toast.show();
          this.editOrderListByTk({
            code: this.curItem.code
          });
        }).catch(() => {
          this.fetching = false;
        });
      },
      ratingOrder(item) {
        this.currentCode = item.code;
        this.currentGoodsCode = item.productOrderList[0].productCode;
        this.$refs.rating.show();
      },
      _remindBtn(item) {
        this.text = '确认催货';
        this.curItem = item;
        this.$refs.confirm.show();
      },
      _receiveOrder(item) {
        this.text = '确认收货';
        this.curItem = item;
        this.$refs.confirm.show();
      },
      showBtns(status) {
        if (status !== '1' && status !== '2' && status !== '3' && status !== '4') {
          return false;
        }
        return true;
      },
      showPayBtn(status) {
        return status === '1';
      },
      showCancelBtn(status) {
        return status === '1';
      },
      showRemindBtn(status) {
        return status === '2';
      },
      showTkBtn(status) {
        return status === '2';
      },
      showRatingBtn(status) {
        return status === '4';
      },
      showReceiveBtn(status) {
        return status === '3';
      },
      shouldGetData() {
        if (this.$route.path === '/user/order') {
          setTitle('订单列表');
          return this.first;
        }
        return false;
      },
      ratingSuccess(code) {
        this.editOrderListByRating({code});
        this.$emit('updateNum', 'toCommentOrder');
      },
      handleUpdateNum(type) {
        this.$emit('updateNum', type);
      },
      ...mapMutations({
        'setOrderList': SET_ORDER_LIST,
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
        return ORDER_STATUS[status];
      }
    },
    updated() {
      this.getInitData();
    },
    components: {
      CategoryScroll,
      Scroll,
      NoResult,
      FullLoading,
      Confirm,
      Rating,
      Toast,
      ConfirmInput
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .orders-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .category-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      overflow: hidden;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;
      border-bottom: 1px solid $color-border;
    }

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

    .orders-content {
      position: absolute;
      top: 0.8rem;
      left: 0;
      width: 100%;
      bottom: 0;

      ul {
        font-size: $font-size-medium;

        li {
          background: #fff;
          margin-top: 0.2rem;

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
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
