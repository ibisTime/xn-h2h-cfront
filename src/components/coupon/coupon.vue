<template>
  <transition name="slide">
    <div class="coupon-wrapper">
      <m-header actText="使用说明" title="我的优惠券" @action="showExplain"></m-header>
      <div class="coupon-content">
        <div class="content">
          <div class="top-category">
            <div @click="selectItem(0)" class="item" :class="itemCls(0)">
              <div class="inner">未使用</div>
            </div>
            <div @click="selectItem(1)" class="item" :class="itemCls(1)">
              <div class="inner">已使用</div>
            </div>
            <div @click="selectItem(2)" class="item" :class="itemCls(2)">
              <div class="inner">已过期</div>
            </div>
          </div>
          <div v-if="!hasMore && !currentList.length" class="no-result-wrapper">
            <div class="no-result">
              <div class="img"><img src="./no-result.png"></div>
              <p>暂无优惠券</p>
            </div>
          </div>
          <div v-else class="scroll-wrapper">
            <scroll :data="currentList" @pullingUp="getPageCoupons" :hasMore="hasMore">
              <ul>
                <li v-for="item in currentList" :class="{overdue: currentIndex===1 || currentIndex===2}">
                  <div class="left">
                    <div class="price">¥<span>{{item.parValue | formatAmount}}</span></div>
                    <div class="name">优惠券</div>
                  </div>
                  <div class="right">
                    <div class="remark">减{{item.parValue | formatAmount}}元</div>
                    <div class="date">截止日期：{{item.endDatetime | formatDate}}</div>
                  </div>
                </li>
              </ul>
            </scroll>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import MHeader from 'components/m-header/m-header';
  import Scroll from 'base/scroll/scroll';
  import {getPageCoupons} from 'api/biz';
  import {commonMixin} from 'common/js/mixin';
  import {setTitle} from 'common/js/util';

  const IDX2STATUS = ['0', '1', '3'];

  export default {
    mixins: [commonMixin],
    data() {
      return {
        couponObj: {},
        currentList: [],
        currentIndex: 0,
        hasMore: true
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/coupon') {
          setTitle('我的优惠券');
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          let status = IDX2STATUS[this.currentIndex];
          this.couponObj[status] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getPageCoupons();
        }
      },
      getPageCoupons() {
        let status = IDX2STATUS[this.currentIndex];
        let item = this.couponObj[status];
        getPageCoupons(item.start, item.limit, status).then((data) => {
          item.data = item.data.concat(data.list);
          if (data.list.length < item.limit || data.totalCount <= item.limit) {
            item.hasMore = false;
          }
          this.currentList = item.data;
          this.hasMore = item.hasMore;
          item.start++;
        }).catch(() => {});
      },
      selectItem(index) {
        this.currentIndex = index;
        let status = IDX2STATUS[this.currentIndex];

        if (!this.couponObj[status]) {
          this.currentList = [];
          this.couponObj[status] = {
            start: 1,
            limit: 10,
            hasMore: true,
            data: []
          };
          this.getPageCoupons();
        } else {
          this.currentList = this.couponObj[status].data;
        }
        this.hasMore = this.couponObj[status].hasMore;
      },
      itemCls(index) {
        return this.currentIndex === index ? 'active' : '';
      },
      showExplain() {
        this.$router.push('/user/coupon/note');
      }
    },
    filters: {
      formatAmount(amount) {
        return amount / 1000;
      }
    },
    components: {
      MHeader,
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .coupon-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    .coupon-content {
      position: absolute;
      top: 0.88rem;
      left: 0;
      bottom: 0;
      width: 100%;

      .no-result-wrapper {
        .no-result {
          margin-top: 2.16rem;

          .img {
            width: 4rem;
            margin: 0 auto;
            font-size: 0;

            img {
              width: 100%;
            }
          }

          p {
            margin-top: 0.52rem;
            text-align: center;
            font-size: $font-size-medium;
          }
        }
      }

      .content {
        .top-category {
          height: 0.9rem;
          line-height: 0.9rem;
          text-align: center;
          font-size: 0;
          background-color: #fff;

          .item {
            display: inline-block;
            padding: 0 0.38rem;
            font-size: $font-size-medium;

            .inner {
              position: relative;
            }

            &.active {
              color: $primary-color;

              .inner:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                height: 2px;
                width: 100%;
                background: $primary-color;
              }
            }
          }
        }

        .scroll-wrapper {
          position: absolute;
          top: 0.9rem;
          left: 0;
          width: 100%;
          bottom: 0;
          padding: 0.2rem 0.3rem;

          li {
            display: flex;
            align-items: center;
            margin-bottom: 0.2rem;
            height: 1.8rem;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            @include bg-image('bg-act');

            &.overdue {
              @include bg-image('bg');
            }

            .left {
              width: 1.96rem;
              flex: 0 0 1.96rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color: #fff;

              .price {
                font-size: $font-size-medium;

                span {
                  font-size: $font-size-large-xxx;
                }
              }

              .name {
                padding-top: 0.1rem;
                font-size: $font-size-medium-s;
              }
            }

            .right {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              font-size: $font-size-small;
              color: $color-text-l;

              .date {
                padding-top: 0.18rem;
              }
            }
          }
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
