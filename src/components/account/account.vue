<template>
  <transition name="slide">
    <div class="user-account-wrapper">
      <div class="top-wrapper">
        <router-link to="/user/account/cny-flow" tag="div" class="remain">
          <div class="title">账户余额 (元)</div>
          <div class="price">{{cnyAmount}}</div>
          <i class="icon-right"></i>
        </router-link>
        <div class="buttons">
          <button @click="goRecharge">充值</button>
          <button @click="goWithdraw">提现</button>
        </div>
      </div>
      <div class="amounts">
        <router-link to="/user/account/cny-flowWTW_MALL" tag="div" class="item border-right-1px">
          <p class="price">{{outTotalAmount}}</p>
          <p class="title">消费金额</p>
        </router-link>
        <router-link to="/user/account/cny-flow11" tag="div" class="item border-right-1px">
          <p class="price">{{inTotalAmount}}</p>
          <p class="title">充值金额</p>
        </router-link>
        <router-link to="/user/account/cny-flow-11" tag="div" class="item">
          <p class="price">{{txTotalAmount}}</p>
          <p class="title">提现金额</p>
        </router-link>
      </div>
      <full-loading v-show="loadingFlag"></full-loading>
      <confirm ref="confirm" text="未设置支付密码" :isAlert="isAlert" @confirm="goTrade"></confirm>
      <router-view @amountUpdate="amountUpdate"></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_CNY_ACCOUNT, SET_USER_STATE, SET_JF_ACCOUNT} from 'store/mutation-types';
  import {getUser} from 'api/user';
  import {getAccount, getAccountInfo} from 'api/account';
  import {formatAmount, setTitle} from 'common/js/util';
  import Confirm from 'base/confirm/confirm';
  import FullLoading from 'base/full-loading/full-loading';

  export default {
    data() {
      return {
        accountInfo: null,
        loadingFlag: true
      };
    },
    computed: {
      cnyAmount() {
        return formatAmount(this.cnyAccount && this.cnyAccount.amount || 0);
      },
      outTotalAmount() {
        return formatAmount(this.accountInfo && this.accountInfo.outTotalAmount || 0);
      },
      inTotalAmount() {
        return formatAmount(this.accountInfo && this.accountInfo.inTotalAmount || 0);
      },
      txTotalAmount() {
        return formatAmount(this.accountInfo && this.accountInfo.txTotalAmount || 0);
      },
      ...mapGetters([
        'cnyAccount',
        'user'
      ])
    },
    created() {
      this.first = true;
      this.isAlert = true;
      this._getAccountAndUser();
    },
    updated() {
      this._getAccountAndUser();
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/account') {
          setTitle('我的账户');
          return this.first;
        }
        return false;
      },
      _getAccountAndUser() {
        if (this.shouldGetData()) {
          this.first = false;
          Promise.all([
            this._getAccount(),
            this._getUser()
          ]).then(() => {
            this.loadingFlag = false;
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      _getAccount() {
        if (this.cnyAccount) {
          if (!this.first) {
            return this._getAccountInfo(this.cnyAccount.accountNumber);
          }
          return Promise.all([
            getAccount(),
            this._getAccountInfo(this.cnyAccount.accountNumber)
          ]).then(([data]) => {
            this.setAccount(data);
          });
        }
        return getAccount().then((data) => {
          let accountNumber = this.setAccount(data);
          this._getAccountInfo(accountNumber);
        });
      },
      _getUser() {
        if (!this.user) {
          return getUser().then((data) => {
            this.setUser(data);
            return data;
          });
        }
        return Promise.resolve(this.user);
      },
      _getAccountInfo(accountNumber) {
        return getAccountInfo(accountNumber).then((data) => {
          this.accountInfo = data;
        });
      },
      setAccount(data) {
        let accountNumber;
        data.forEach((item) => {
          if (item.currency === 'CNY') {
            accountNumber = item.accountNumber;
            this.setCnyAccount(item);
          } else if (item.currency === 'JF') {
            this.setJfAccount(item);
          }
        });
        return accountNumber;
      },
      amountUpdate() {
        if (!this.first) {
          this.loadingFlag = true;
          Promise.all([
            getAccount(),
            this._getAccountInfo(this.cnyAccount.accountNumber)
          ]).then(([data]) => {
            this.setAccount(data);
            this.loadingFlag = false;
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      goTrade() {
        this.$router.push('/user/account/set-tradepwd');
      },
      goRecharge() {
        this.$router.push('/user/account/recharge');
      },
      goWithdraw() {
        if (!this.user.tradepwdFlag) {
          this.$refs.confirm.show();
        } else {
          this.$router.push('/user/account/withdraw');
        }
      },
      ...mapMutations({
        setCnyAccount: SET_CNY_ACCOUNT,
        setJfAccount: SET_JF_ACCOUNT,
        setUser: SET_USER_STATE
      })
    },
    components: {
      FullLoading,
      Confirm
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .user-account-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .top-wrapper {
      height: 3.99rem;
      padding: 0.56rem 0.75rem;
      background: $primary-color;

      .remain {
        position: relative;
        text-align: center;

        .title {
          font-size: $font-size-small;
          color: #f9f9f9;
        }

        .price {
          padding-top: 0.36rem;
          font-size: 0.7rem;
          color: #fff;
        }

        .icon-right {
          position: absolute;
          top: 50%;
          height: 0.56rem;
          width: 0.2rem;
          right: 0;
          transform: translate(0, -50%);
          background-repeat: no-repeat;
          background-position: center;
          background-size: 0.2rem;
          @include bg-image('more');
        }
      }

      .buttons {
        padding-top: 0.6rem;
        display: flex;
        justify-content: space-between;

        button {
          flex: 1;
          border: 1px solid #fff;
          height: 0.92rem;
          line-height: 0.9rem;
          border-radius: 0.06rem;
          font-size: $font-size-medium-x;
          background-color: transparent;
          color: #fff;

          &:first-child {
            margin-right: 0.5rem;
          }

          &:last-child {
            margin-left: 0.5rem;
          }
        }
      }
    }

    .amounts {
      display: flex;
      align-items: center;
      height: 1.6rem;
      background: #fff;

      .item {
        flex: 1;
        text-align: center;

        &.border-right-1px {
          @include border-right-1px($color-border);
        }

        .price {
          font-size: $font-size-large-s;
        }

        .title {
          padding-top: 0.2rem;
          font-size: $font-size-small;
          color: #666;
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-leave-to, &.slide-enter {
      left: 100%;
    }
  }
</style>
