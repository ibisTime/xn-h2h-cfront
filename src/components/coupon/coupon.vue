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
          <div v-if="!currentList.length" class="no-result-wrapper">
            <div class="no-result">
              <div class="img"><img src="./no-result.png"></div>
              <p>暂无优惠券</p>
            </div>
          </div>
          <div v-else class="scroll-wrapper">
            <scroll :data="currentList" :hasMore="hasMore">
              <ul>
                <li v-for="item in currentList">
                  <div class="left">
                    <div class="price">¥<span>50</span></div>
                    <div class="name">优惠券</div>
                  </div>
                  <div class="right">
                    <div class="remark">满500元及以上使用</div>
                    <div class="date">截止日期：2016-11-21</div>
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

  const IDX2STATUS = {
    0: '0',
    1: '1',
    2: '2'
  };

  export default {
    data() {
      return {
        couponList: [{
          status: '0'
        }, {
          status: '1'
        }],
        currentIndex: 0,
        hasMore: true
      };
    },
    created() {},
    computed: {
      currentList() {
        return this.couponList.filter((item) => {
          return item.status === IDX2STATUS[this.currentIndex];
        });
      }
    },
    methods: {
      selectItem(index) {
        this.currentIndex = index;
      },
      itemCls(index) {
        return this.currentIndex === index ? 'active' : '';
      },
      showExplain() {
        this.$router.push('/user/coupon/note');
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
