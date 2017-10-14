<template>
  <transition name="slide">
    <div class="flow-wrapper">
      <scroll :data="flows" :hasMore="hasMore" @pullingUp="getPageFlow" class="flow-content">
        <div>
          <ul>
            <li class="border-bottom-1px" v-for="item in flows">
              <div class="date">
                <div class="day">{{item.createDatetime | formatDate('dd日')}}</div>
                <div class="time">{{item.createDatetime | formatDate('hh:mm')}}</div>
              </div>
              <div class="icon" :class="iconCls(item.transAmount)"></div>
              <div class="info">
                <p class="trans-amount" :class="iconCls(item.transAmount)">{{formatAmount(item.transAmount)}}</p>
                <p class="note">{{item.bizNote}}</p>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
      <div v-show="!hasMore && !flows.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无账单"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import {getPageFlow, getAccount} from 'api/account';
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_JF_ACCOUNT} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import {commonMixin} from 'common/js/mixin';
  import {setTitle, formatAmount} from 'common/js/util';

  const LIMIT = 20;

  export default {
    mixins: [commonMixin],
    data() {
      return {
        flows: [],
        start: 1,
        hasMore: true
      };
    },
    created() {
      setTitle('积分账单');
      this.pullup = true;
      if (this.jfAccount) {
        this.getPageFlow();
      } else {
        this.getAccount().then(() => {
          this.getPageFlow();
        });
      }
    },
    computed: {
      ...mapGetters([
        'jfAccount'
      ])
    },
    methods: {
      getAccount() {
        return getAccount().then((data) => {
          data.forEach((item) => {
            if (item.currency === 'JF') {
              this.setJFAccount(item);
            }
          });
          return data;
        });
      },
      getPageFlow() {
        if (this.hasMore) {
          return getPageFlow(this.start, LIMIT, this.jfAccount.accountNumber).then((data) => {
            if (data.list.length < LIMIT || data.totalCount <= LIMIT) {
              this.hasMore = false;
            }
            this.flows = this.flows.concat(data.list);
            this.start++;
          });
        }
      },
      formatAmount(amount) {
        let prefix = +amount > 0 ? '+' : '';
        return prefix + formatAmount(amount);
      },
      iconCls(amount) {
        return amount >= 0 ? 'in' : 'out';
      },
      ...mapMutations({
        'setJFAccount': SET_JF_ACCOUNT
      })
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .flow-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    .flow-content {
      position: relative;
      height: 100%;

      ul {
        padding: 0 0.36rem;

        li {
          display: flex;
          align-items: flex-start;
          padding: 0.3rem;
          @include border-bottom-1px($color-border);

          .date {
            white-space: nowrap;
            text-align: left;

            .day {
              padding-top: 0.04rem;
              font-size: $font-size-medium-xx;
            }

            .time {
              padding-top: 0.14rem;
              font-size: $font-size-small;
              color: $color-text-l;
            }
          }

          .icon {
            margin-left: 0.38rem;
            flex: 0 0 0.72rem;
            width: 0.72rem;
            height: 0.72rem;
            background-size: 100%;

            &.in {
              @include bg-image('in');
            }

            &.out {
              @include bg-image('out');
            }
          }

          .info {
            padding-left: 0.52rem;

            .note {
              padding-top: 0.18rem;
              line-height: 1.2;
              word-break: break-all;
              font-size: $font-size-small;
            }

            .trans-amount {
              font-size: $font-size-large-s;
              color: $color-red;

              &.out {
                color: $primary-color;
              }
            }
          }
        }

        .loading {
          padding-top: 0.4rem;
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
