<template>
  <transition name="slide">
    <div class="trade-pwd-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">手机号</div>
          <div class="inner-label">{{getMobile()}}</div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">验证码</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" @change="_captValid" placeholder="请输入验证码">
            <span v-show="captErr" class="error-tip">{{captErr}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha">{{captBtnText}}</button>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">支付密码</div>
          <div class="item-input-wrapper">
            <input type="password" class="item-input" v-model="tradePwd" @change="_tradeValid" placeholder="请输入支付密码">
            <span v-show="tradeErr" class="error-tip">{{tradeErr}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">确认密码</div>
          <div class="item-input-wrapper">
            <input type="password" class="item-input" v-model="reTradePwd" @change="_rePwdValid" placeholder="请再次输入支付密码">
            <span v-show="reTradeErr" class="error-tip">{{reTradeErr}}</span>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_setTradePwd">设置</button>
        </div>

        <full-loading v-show="!this.user"></full-loading>
        <confirm ref="confirm" :isAlert="isAlert" text="设置支付密码需要先绑定手机号" @confirm="goBindMobile"></confirm>
        <toast ref="toast" text="修改成功"></toast>
        <router-view></router-view>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_TRADE_PWD_FLAG} from 'store/mutation-types';
  import {getUser, setTradePwd} from 'api/user';
  import {sendCaptcha} from 'api/general';
  import {captValid, setTitle, tradeValid, rePwdValid} from 'common/js/util';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        sending: false,
        setting: false,
        captcha: '',
        captErr: '',
        captBtnText: '获取验证码',
        tradePwd: '',
        tradeErr: '',
        reTradePwd: '',
        reTradeErr: '',
        isAlert: true
      };
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      this.fetching = false;
    },
    mounted() {
      if (this.shouldGetData()) {
        this._getUser();
      }
    },
    methods: {
      shouldGetData() {
        if (/\/set-tradepwd\/?$/.test(this.$route.path)) {
          setTitle('设置支付密码');
          return !this.fetching;
        }
      },
      _getUser() {
        if (!this.user) {
          this.fetching = true;
          getUser().then((data) => {
            this.fetching = false;
            this.setUser(data);
            if (!data.mobile) {
              this.showConfirm();
            }
          }).catch(() => {
            this.fetching = false;
          });
        } else if (!this.user.mobile) {
          setTimeout(() => {
            this.showConfirm();
          });
        }
      },
      sendCaptcha() {
        if (this._mobileValid()) {
          this.sending = true;
          sendCaptcha(this.user.mobile, 805066).then(() => {
            this._setInterval();
          }).catch(() => {
            this._clearInterval();
          });
        }
      },
      getMobile() {
        if (this.user && this.user.mobile) {
          return this.user.mobile;
        }
        return '请先绑定手机号';
      },
      showConfirm() {
        this.$refs.confirm.show();
      },
      goBindMobile() {
        this.$router.push(`${this.$route.path}/bind-mobile`);
      },
      _setTradePwd() {
        if (this._valid()) {
          this.setting = true;
          setTradePwd(this.tradePwd, this.captcha)
            .then(() => {
              this.$refs.toast.show();
              this.setTradeFlag(true);
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.setting = false;
            });
        }
      },
      _valid() {
        let r1 = this._mobileValid();
        if (r1) {
          let r2 = this._captValid();
          let r3 = this._tradeValid();
          let r4 = this._rePwdValid();
          return r1 && r2 && r3 && r4;
        } else {
          return false;
        }
      },
      _mobileValid() {
        if (!this.user || !this.user.mobile) {
          this.showConfirm();
          return false;
        }
        return true;
      },
      _captValid() {
        let result = captValid(this.captcha);
        this.captErr = result.msg;
        return !result.err;
      },
      _tradeValid() {
        let result = tradeValid(this.tradePwd);
        this.tradeErr = result.msg;
        return !result.err;
      },
      _rePwdValid() {
        let result = rePwdValid(this.reTradePwd, this.tradePwd);
        this.reTradeErr = result.msg;
        return !result.err;
      },
      _setInterval() {
        let i = 60;
        this.timer = setInterval(() => {
          if (i === 0) {
            this._clearInterval();
          } else {
            this.captBtnText = i-- + 's';
          }
        }, 1000);
      },
      _clearInterval() {
        if (this.timer) {
          clearInterval(this.timer);
          this.sending = false;
          this.captBtnText = '获取验证码';
        }
      },
      beforeDestroy() {
        this.timer && clearInterval(this.timer);
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setTradeFlag: SET_USER_TRADE_PWD_FLAG
      })
    },
    updated() {
      if (this.shouldGetData()) {
        if (!this.user) {
          this._getUser();
        }
      }
    },
    components: {
      FullLoading,
      Confirm,
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .trade-pwd-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
