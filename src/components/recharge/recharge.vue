<template>
  <transition name="slide">
    <div class="recharge-wrapper">
      <div class="form-wrapper">
        <div class="form-item">
          <div class="item-label">充值金额</div>
          <div class="inner-label"></div>
        </div>
        <div class="form-item big-input">
          <label>¥</label>
          <input type="number" v-model="amount" @input="_amountValid"/>
          <span v-show="amountErr" class="error-tip">{{amountErr}}</span>
        </div>
        <div class="split"></div>
        <div class="small-title">支付方式</div>
        <div class="pay-types">
          <div class="pay-type"><img src="./weixin@2x.png">微信支付<i class="chose-icon"></i></div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="_recharge">充值</button>
        </div>
        <full-loading v-show="!user || !cnyAccount || setting"></full-loading>
        <toast ref="toast" :text="text"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_CNY_ACCOUNT} from 'store/mutation-types';
  import {getUser} from 'api/user';
  import {getAccount, recharge} from 'api/account';
  import {amountValid, setTitle} from 'common/js/util';
  import {initPay} from 'common/js/weixin';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';

  export default {
    data() {
      return {
        text: '充值成功',
        setting: false,
        amount: '',
        amountErr: ''
      };
    },
    created() {
      setTitle('充值');
      this.getInitData();
    },
    computed: {
      ...mapGetters([
        'user',
        'cnyAccount'
      ])
    },
    methods: {
      getInitData() {
        Promise.all([
          this._getAccount(),
          this._getUser()
        ]).then(() => {}).catch(() => {});
      },
      weixinPay(config) {
        initPay(config, () => {
          this.setting = false;
          this.text = '充值成功';
          this.$refs.toast.show();
          this.$emit('amountUpdate');
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }, () => {
          this.setting = false;
          this.text = '充值失败';
          this.$refs.toast.show();
        }, () => {
          this.setting = false;
        });
      },
      _getAccount() {
        if (!this.cnyAccount) {
          return getAccount().then((data) => {
            let index = data.findIndex((item) => {
              return item.currency === 'CNY';
            });
            this.setCnyAccount(data[index]);
            return data[index];
          });
        }
        return Promise.resolve(this.cnyAccount);
      },
      _getUser() {
        if (!this.user) {
          return getUser().then((data) => {
            this.setUser(data);
            return data;
          }).catch(() => {});
        }
        return Promise.resolve(this.user);
      },
      _recharge() {
        if (this._amountValid()) {
          this.setting = true;
          recharge({
            amount: +this.amount * 1000,
            openId: this.user.h5OpenId,
            activityCode: this.$route.query.code || ''
          }).then((data) => {
            this.weixinPay(data);
          }).catch(() => {
            this.setting = false;
          });
        }
      },
      _amountValid() {
        let result = amountValid(this.amount);
        this.amountErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setCnyAccount: SET_CNY_ACCOUNT
      })
    },
    components: {
      Toast,
      FullLoading
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .recharge-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .form-wrapper {
      padding-top: 0;

      .small-title {
        padding-left: 0.3rem;
        height: 0.6rem;
        line-height: 0.6rem;
        font-size: $font-size-small;
        color: $color-text-l;
      }

      .pay-types {
        padding: 0 0.3rem;
        background-color: #fff;

        .pay-type {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-medium-x;

          img {
            width: 0.6rem;
            height: 0.6rem;
            vertical-align: middle;
            margin-right: 0.2rem;
          }

          .chose-icon {
            float: right;
            margin-top: 0.28rem;
            width: 0.44rem;
            height: 0.44rem;
            background-size: 0.44rem 0.44rem;
            @include bg-image('selected');
          }
        }
      }

      .split {
        height: 0.3rem;
        background-color: #fff;
      }
    }

    .big-input {
      padding-left: 0.3rem;
      font-size: $font-size-large-xxxx;
      color: #333;

      input {
        flex: 1;
        padding-left: 0.04rem;
        padding-right: 0.3rem;
      }

      .error-tip {
        position: absolute;
        right: 0.16rem;
        top: 0.38rem;
        white-space: nowrap;
        font-size: $font-size-medium;
        color: #ff0000;
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
