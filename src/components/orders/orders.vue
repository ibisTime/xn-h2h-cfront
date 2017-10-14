<template>
  <transition name="slide">
    <div class="orders-wrapper">
      <div class="category-wrapper">
        <category-scroll :currentIndex="currentIndex"
                         :categorys="categorys"
                         @select="selectCategory"></category-scroll>
      </div>
      <scroll ref="scroll"
              :data="currentList.data"
              :hasMore="currentList.hasMore"
              @pullingUp="getPageOrders"
              class="orders-content">
        <div>
          <ul>
            <li @click="goDetail">
              <div class="time border-bottom-1px">
                <span class="fl">订单标号：2222222222222222222</span>
                <span class="fr">2010-11-11</span>
              </div>
              <div class="infos border-bottom-1px">
                <div class="img"></div>
                <div class="info">
                  <div class="top">
                    <div class="left">
                      <p class="name twoline-ellipsis">商品名称商品名称</p>
                      <p class="desc twoline-ellipsis">商品详情商品详情商品详情商品详情</p>
                    </div>
                    <div class="right">
                      <p>¥300.00</p>
                    </div>
                  </div>
                  <div class="bottom">总价：<span class="unit">¥</span><span class="price">300.00</span></div>
                </div>
              </div>
              <div class="clearfix btns">
                <span class="btn fr" @click.stop="payOrder(item)">立即支付</span>
                <span class="btn cancel fr" @click.stop="cancelOrder(item)">取消订单</span>
              </div>
            </li>
          </ul>
          <!--<ul v-if="currentList">-->
            <!--<li v-for="(item, index) in currentList.data" class="needsclick" :key="index" @click="goDetail(item)">-->
              <!--<p class="clearfix time">-->
                <!--<span class="fl">{{item.createDatetime | formatDate}}</span>-->
                <!--<span class="fr">{{item.type | formatType}}</span>-->
              <!--</p>-->
              <!--<p class="clearfix code">-->
                <!--<span class="fl">{{item.code}}</span>-->
                <!--<span class="fr">{{item.amount | formatMoney}}</span>-->
              <!--</p>-->
              <!--<p class="clearfix">-->
                <!--<span class="status fl">{{item.status | formatStatus}}</span>-->
                <!--<span class="btn fr needsclick" v-show="showPayBtn(item.status)" @click.stop="payOrder(item)">立即支付</span>-->
                <!--<span class="btn cancel fr needsclick" v-show="showCancelBtn(item.status)" @click.stop="cancelOrder(item)">取消订单</span>-->
                <!--<span class="btn fr needsclick" v-show="showRatingBtn(item.status)" @click.stop="ratingOrder(item)">立即评价</span>-->
                <!--<span class="btn fr needsclick" v-show="showReceiveBtn(item.status)" @click.stop="receiveOrder(item)">确认收货</span>-->
                <!--<span class="btn fr needsclick" v-show="item.status==='10'" @click.stop="goAdviser">联系顾问</span>-->
              <!--</p>-->
            <!--</li>-->
          <!--</ul>-->
        </div>
        <div v-show="!currentList.hasMore && !(currentList.data && currentList.data.length)" class="no-result-wrapper">
          <no-result title="抱歉，暂无订单"></no-result>
        </div>
      </scroll>
      <div v-show="fetching" class="loading-container">
        <div class="loading-wrapper">
          <loading title=""></loading>
        </div>
      </div>
      <confirm ref="confirm" :text="text" @confirm="handleConfirm"></confirm>
      <rating ref="rating" @ratingSuc="ratingSuccess" :orderCode="currentCode"></rating>
      <router-view @updateNum="handleUpdateNum"></router-view>
    </div>
  </transition>
</template>
<script>
  import {CATEGORYS, LIMIT, ORDER_STATUS} from './config';
  import CategoryScroll from 'base/category-scroll/category-scroll';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_ORDER_LIST, SET_CURRENT_ORDER} from 'store/mutation-types';
  import {getPageOrders, cancelOrder, receiveOrder} from 'api/biz';
  import {commonMixin} from 'common/js/mixin';
  import {formatAmount, setTitle} from 'common/js/util';
  import Rating from 'components/rating/rating';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        currentCode: '',
        fetching: false,
        categorys: CATEGORYS,
        currentIndex: +this.$route.query.index || 0,
        text: ''
      };
    },
    created() {
      this.first = true;
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
//          this.getPageOrders();
        }
      },
      getPageOrders() {
        let key = this.categorys[this.currentIndex].key;
        let status = key === 'all' ? '' : key;
        let statusList = status.split('||');
        if (statusList.length > 1) {
          status = statusList;
        }
        if (this.currentList.hasMore) {
          getPageOrders(this.currentList.start, this.currentList.limit, status).then((data) => {
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
      goDetail(item) {
//        this.setCurrentOrder(item);
//        this.$router.push(`/user/order/${item.code}`);
        this.$router.push('/user/order/111');
      },
      payOrder(item) {
        this.$router.push(`/user/order/pay?code=${item.code}`);
      },
      cancelOrder(item) {
        this.text = '确定取消订单吗';
        this.curItem = item;
        this.$refs.confirm.show();
      },
      handleConfirm() {
        this.fetching = true;
        let item = this.curItem;
        if (item.status === '7') {
          receiveOrder(item.code).then(() => {
            this.fetching = false;
            this.editOrderListByReceived({
              code: item.code
            }).then(() => {
              this.currentCode = item.code;
              item.status = '8';
              this.text = '收货成功，确定立即评价吗？';
              this.$refs.confirm.show();
            });
            this.$emit('updateNum', 'toReceiverOrder');
          }).catch(() => {
            this.fetching = false;
          });
        } else if (item.status === '8') {
          this.fetching = false;
          this.$refs.rating.show();
        } else {
          cancelOrder(item.code).then(() => {
            this.fetching = false;
            this.editOrderListByCancel({
              prevStatus: item.status,
              code: item.code
            });
            if (item.status === '1') {
              this.$emit('updateNum', 'toMeasureOrder');
            } else {
              this.$emit('updateNum', 'toPayOrder');
            }
          }).catch(() => {
            this.fetching = false;
          });
        }
      },
      ratingOrder(item) {
        this.currentCode = item.code;
        this.$refs.rating.show();
      },
      receiveOrder(item) {
        this.text = '确认收货';
        this.curItem = item;
        this.$refs.confirm.show();
      },
      goAdviser() {
        this.$router.push('/user/order/adviser');
      },
      showPayBtn(status) {
        if (status === '2') {
          return true;
        }
        return false;
      },
      showCancelBtn(status) {
        if (status === '1' || status === '2') {
          return true;
        }
        return false;
      },
      showRatingBtn(status) {
        if (status === '8') {
          return true;
        }
        return false;
      },
      showReceiveBtn(status) {
        if (status === '7') {
          return true;
        }
        return false;
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
        'editOrderListByReceived'
      ])
    },
    filters: {
      formatMoney(money) {
        let result = formatAmount(money);
        if (result === '--') {
          return '';
        }
        return `¥${result}`;
      },
      formatType(type) {
        if (type === '0') {
          return '衬衫';
        } else if (type === '1') {
          return 'H+';
        } else {
          return '';
        }
      },
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
      Loading,
      Confirm,
      Rating
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
    }

    .loading-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);

      .loading-wrapper {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translate3d(0, -50%, 0);
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
              background-position: center;
              background-size: cover;
              background-image: url('./demo.png');
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

          .status {
            display: inline-block;
            padding: 0.05rem 0.21rem 0.07rem;
            border-radius: 0.28rem;
            background: $primary-color;
            color: #fff;
          }
        }
      }

      .orders-loading {
        padding-top: 0.4rem;
      }

      .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
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
