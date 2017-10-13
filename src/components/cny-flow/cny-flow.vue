<template>
  <transition name="slide">
    <div class="flow-wrapper">
      <scroll :data="flows" :hasMore="hasMore" @pullingUp="getPageFlow" class="flow-content">
        <div>
          <ul>
            <li class="border-bottom-1px" v-for="item in flows">
              <div class="time">{{item.createDatetime | formatDate('yy/MM/dd')}}</div>
              <div class="info">
                <p class="note">{{item.bizNote}}</p>
                <p class="trans-amount">¥ {{formatAmount(item.transAmount)}}</p>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
      <div v-show="!hasMore && !flows.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无明细"></no-result>
      </div>
    </div>
  </transition>
</template>
<script>
  import {getPageFlow, getAccount} from 'api/account';
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_CNY_ACCOUNT} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import {commonMixin} from 'common/js/mixin';
  import {formatAmount, setTitle} from 'common/js/util';

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
      setTitle('人民币账单');
      this.pullup = true;
      if (this.cnyAccount) {
        this.getPageFlow();
      } else {
        this.getAccount().then(() => {
          this.getPageFlow();
        });
      }
    },
    computed: {
      ...mapGetters([
        'cnyAccount'
      ])
    },
    methods: {
      getAccount() {
        return getAccount().then((data) => {
          data.forEach((item) => {
            if (item.currency === 'CNY') {
              this.setCnyAccount(item);
            }
          });
          return data;
        });
      },
      getPageFlow() {
        if (this.hasMore) {
          return getPageFlow(this.start, LIMIT, this.cnyAccount.accountNumber).then((data) => {
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
      ...mapMutations({
        'setCnyAccount': SET_CNY_ACCOUNT
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
          padding: 0.36rem 0 0.36rem 0.36rem;
          @include border-bottom-1px($color-border);

          .time {
            font-size: 0.26rem;
          }

          .info {
            padding-left: 0.36rem;

            .note {
              font-size: 0.26rem;
            }

            .trans-amount {
              padding-top: 0.14rem;
              font-size: $font-size-medium-x;
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
