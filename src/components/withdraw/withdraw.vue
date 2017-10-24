<template>
  <transition name="slide">
    <div class="withdraw-wrapper">
      <div class="form-wrapper">
        <div class="form-item mb20">
          <div class="item-label">银行卡</div>
          <div class="item-input-wrapper">
            <div class="real-name">{{cardName}}</div>
            <template v-if="bankcardList && bankcardList.length">
              <select class="item-input" v-model="payCardNo">
                <option v-for="bankcard in bankcardList" :value="bankcard">
                  {{bankcard.bankcardNumber}}
                </option>
              </select>
              <i class="arrow"></i>
            </template>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">提现金额</div>
          <div class="inner-label"></div>
        </div>
        <div class="form-item big-input">
          <label>¥</label>
          <input type="number" v-model="amount" @input="_amountValid"/>
          <span v-show="amountErr" class="error-tip">{{amountErr}}</span>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label1">可用金额{{_formatAmount()}}元</div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label2">本次提现手续费</div>
          <div class="inner-label inner-label1">{{rateAmount}}</div>
        </div>
        <div class="form-item">
          <div class="item-label">支付密码</div>
          <div class="item-input-wrapper">
            <input type="password" class="item-input" v-model="tradePwd" @change="_tradePwdValid" placeholder="请输入支付密码">
            <span v-show="tradeErr" class="error-tip">{{tradeErr}}</span>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_withdraw">提现</button>
        </div>
        <div class="rules">
          <p>提现规则：</p>
          <p>1、每月最大提现次数{{rechargeTimes}}次</p>
          <p>2、提现金额必须是{{times}}的倍数，单笔最高{{maxAmount}}元</p>
          <p>3、T+{{toAccount}}到账</p>
          <p>4、提现手续费率{{rate}}</p>
        </div>
        <full-loading v-show="!bankcardList || !cnyAccount || !rate"></full-loading>
        <confirm ref="confirm" :isAlert="isAlert" text="未设置银行卡" @confirm="goAddBankCard"></confirm>
        <toast ref="toast" text="提现成功"></toast>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_BANKCARD_LIST, SET_CNY_ACCOUNT} from 'store/mutation-types';
  import {getAccount, withdraw, getBankCardList} from 'api/account';
  import {getPageAccountSysConfig} from 'api/general';
  import {amountValid, tradeValid, formatAmount, setTitle} from 'common/js/util';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';

  export default {
    data() {
      return {
        payCardNo: '',
        amount: '',
        amountErr: '',
        tradePwd: '',
        tradeErr: '',
        setting: false,
        rechargeTimes: '',
        times: '',
        toAccount: '',
        maxAmount: '',
        rate: '',
        rateAmount: 0
      };
    },
    created() {
      this.isAlert = true;
      if (this.shouldGetData()) {
        this.getInitData();
      } else if (this.bankcardList) {
        this.payCardNo = this.bankcardList[0];
      }
    },
    computed: {
      cardName() {
        return this.payCardNo && this.payCardNo.bankName || '请选择银行卡';
      },
      ...mapGetters([
        'cnyAccount',
        'bankcardList'
      ])
    },
    updated() {
      if (this.shouldGetData()) {
        this.getInitData();
      }
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/account/withdraw') {
          setTitle('提现');
          return !this.cnyAccount || !this.bankcardList || !this.bankcardList.length || !this.rate;
        }
        return false;
      },
      getInitData() {
        if (!this.fetching) {
          this.fetching = true;
          Promise.all([
            this._getAccount(),
            this._getBankCardList(),
            this._getRules()
          ]).then(([account, cardList]) => {
            this.fetching = false;
            if (!cardList.length) {
              this.$refs.confirm.show();
            }
          }).catch(() => {
            this.fetching = false;
          });
        }
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
      _getBankCardList() {
        if (!this.bankcardList) {
          return getBankCardList().then((data) => {
            this.setBankCardList(data);
            return data;
          });
        } else {
          this.payCardNo = this.bankcardList[0];
          return Promise.resolve(this.bankcardList);
        }
      },
      _getRules() {
        return getPageAccountSysConfig(3).then((data) => {
          data.list.forEach((rule) => {
            if(rule.ckey === 'CUSERMONTIMES') {
              this.rechargeTimes = rule.cvalue;
            } else if(rule.ckey === 'CUSERQXBS') {
              this.times = rule.cvalue;
            } else if(rule.ckey === 'CUSERDZTS') {
              this.toAccount = rule.cvalue;
            } else if(rule.ckey === 'QXDBZDJE') {
              this.maxAmount = rule.cvalue;
            } else if(rule.ckey === 'CUSERQXFL') {   // 提现费率
              this.rate = +rule.cvalue;
            }
          });
        });
      },
      _formatAmount() {
        let _amount = this.cnyAccount && this.cnyAccount.amount || 0;
        return formatAmount(_amount);
      },
      goAddBankCard() {
        this.$router.push('/user/account/withdraw/add');
      },
      _withdraw() {
        if (this.valid()) {
          this.setting = true;
          withdraw({
            payCardNo: this.payCardNo.bankcardNumber,
            payCardInfo: this.payCardNo.bankCode,
            amount: +this.amount * 1000,
            tradePwd: this.tradePwd,
            accountNumber: this.cnyAccount.accountNumber
          }).then(() => {
            this.$refs.toast.show();
            this.$emit('amountUpdate');
            setTimeout(() => {
              this.$router.back();
            }, 1000);
          }).catch(() => {
            this.setting = false;
          });
        }
      },
      valid() {
        let r1 = this._payCardNoValid();
        let r2 = this._amountValid();
        let r3 = this._tradePwdValid();
        return r1 && r2 && r3;
      },
      _payCardNoValid() {
        if (!this.bankcardList || !this.bankcardList.length) {
          this.$refs.confirm.show();
          return false;
        } else if (this.payCardNo) {
          return true;
        }
        return false;
      },
      _amountValid() {
        let result = amountValid(this.amount);
        this.amountErr = result.msg;
        if (!result.err) {
          let enable = +this.cnyAccount.amount;
          let wAmount = +this.amount * 1000;
          if (wAmount > enable) {
            this.amountErr = '不能大于可用金额';
            return false;
          }
          return true;
        } else {
          return false;
        }
      },
      _tradePwdValid() {
        let result = tradeValid(this.tradePwd);
        this.tradeErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setBankCardList: SET_BANKCARD_LIST,
        setCnyAccount: SET_CNY_ACCOUNT
      })
    },
    watch: {
      amount(newAmount) {
        if (+newAmount) {
          let _amount = +this.rate * +newAmount;
          this.rateAmount = _amount.toFixed(2);
        } else {
          this.rateAmount = '--';
        }
      },
      bankcardList(newList) {
        this.payCardNo = newList[0];
      }
    },
    components: {
      Toast,
      FullLoading,
      Confirm
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .withdraw-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .arrow {
      position: absolute;
      right: 0.24rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      @include bg-image('arrow');
      width: 0.3rem;
      height: 0.3rem;
      top: 50%;
      transform: translate(0, -50%);
    }

    select.item-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
    }

    .content {
      display: flex;
      align-items: center;
      height: 1.64rem;
      width: 100%;
      margin: 0.3rem 0.3rem 0;
      padding: 0 0.52rem;
      border: 1px solid #ccc;
      border-radius: 0.16rem;
      background: #eee;
      justify-content: center;

      .bankcode {
        flex: 1;
        text-align: right;

        h2 {
          padding-bottom: 0.26rem;
        }
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

    .form-wrapper {
      padding-top: 0;
    }

    .item-label1 {
      padding: 0.3rem;
      font-size: $font-size-medium;
      color: $primary-color;
    }

    .item-label2 {
      padding: 0.3rem;
    }

    .inner-label1 {
      color: $primary-color;
    }

    .form-item {
      &.mb20 {
        margin-bottom: 0.2rem;
      }

      .item-label {
        flex: 0 0 1.6rem;
      }
    }

    .rules {
      padding: 0 0.3rem;
      margin-top: 0.4rem;
      line-height: 1.3;
      font-size: $font-size-medium;
      color: #999;
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
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
