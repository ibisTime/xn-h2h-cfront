<template>
  <transition name="slide-fade">
    <div v-show="showFlag" class="coupon-mask-wrapper" @click="hide">
      <div class="content" @click.stop>
        <div class="title">优惠券抵用</div>
        <div class="coupon-scroll">
          <scroll ref="scroll" :data="couponList" :hasMore="hasMore" @pullingUp="getPageCoupons">
            <ul>
              <li @click="choseCoupon(0)">
                <div class="inner border-bottom-1px">
                  <div class="name">不使用优惠券</div><i class="icon-chose" :class="getCls(0)"></i>
                </div>
              </li>
              <li v-for="(item,index) in couponList" @click="choseCoupon(index+1)">
                <div class="inner border-bottom-1px">
                  <div class="name">{{getTitle(item)}}</div>
                  <i class="icon-chose" :class="getCls(index+1)"></i>
                </div>
              </li>
            </ul>
          </scroll>
        </div>
        <div class="btns"><button @click="confirm">确定</button></div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {formatAmount} from 'common/js/util';
  import {getPageCoupons} from 'api/biz';

  export default {
    data() {
      return {
        showFlag: false,
        couponList: [],
        hasMore: true,
        start: 1,
        limit: 10,
        choseIndex: 0
      };
    },
    methods: {
      getTitle(item) {
        let price = item.parValue;
        return '减' + formatAmount(price) + '元';
      },
      getCls(idx) {
        return this.choseIndex === idx ? 'act' : '';
      },
      choseCoupon(idx) {
        this.choseIndex = idx;
      },
      show() {
        if (this.hasMore && !this.couponList.length) {
          this.getPageCoupons();
        }
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      getPageCoupons() {
        getPageCoupons(this.start, this.limit, 0).then((data) => {
          this.couponList = this.couponList.concat(data.list);
          if (data.totalCount <= this.limit || data.list.length < this.limit) {
            this.hasMore = false;
          }
          this.start++;
        }).catch(() => {});
      },
      confirm() {
        let item;
        if (this.choseIndex === 0) {
          item = {text: '不使用优惠券'};
        } else {
          let _item = this.couponList[this.choseIndex - 1];
          item = {
            text: this.getTitle(_item),
            code: _item.code
          };
        }
        this.$emit('confirm', item);
        this.hide();
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .coupon-mask-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);

    .content {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 8.36rem;
      width: 100%;
      background: #fff;

      .title {
        padding: 0.5rem 0;
        font-size: $font-size-medium-xx;
        text-align: center;
      }

      .coupon-scroll {
        position: absolute;
        top: 1.32rem;
        left: 0;
        bottom: 1.7rem;
        width: 100%;

        li {
          .inner {
            display: flex;
            padding: 0.32rem 0.3rem;
            @include border-bottom-1px($color-border);
          }

          .name {
            flex: 1;
            font-size: $font-size-medium;
            text-align: left;
          }

          &:last-child {
            .inner {
              @include border-none();
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
        }
      }

      .btns {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.7rem;
        padding: 0.4rem 0.3rem;

        button {
          width: 100%;
          height: 0.9rem;
          line-height: 0.9rem;
          border-radius: 0.1rem;
          font-size: $font-size-large-s;
          color: #fff;
          background: $primary-color;
        }
      }
    }

    &.slide-fade-enter-active {
      animation: slide-fadein 0.3s;

      .content {
        animation: slide-up 0.3s;
      }
    }
  }

  @keyframes slide-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes slide-up {
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
