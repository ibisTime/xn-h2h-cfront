<template>
  <transition name="slide">
    <div class="bind-mobile-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">手机号</div>
          <div class="item-input-wrapper">
            <input v-focus type="tel" class="item-input" v-model="mobile" @change="_mobileValid" placeholder="请输入手机号">
            <span v-show="mobErr" class="error-tip">{{mobErr}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">验证码</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" @change="_captValid" placeholder="请输入验证码">
            <span v-show="captErr" class="error-tip">{{captErr}}</span>
          </div>
          <div class="item-btn">
            <button :disabled="sending" @click="sendCaptcha">{{captBtnText}}</button>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_bindMobile">确定绑定</button>
        </div>

        <div v-show="!this.user" class="loading-container">
          <div class="loading-wrapper">
            <loading></loading>
          </div>
        </div>
        <toast ref="toast" text="绑定成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_MOBILE} from 'store/mutation-types';
  import {sendCaptcha} from 'api/general';
  import {bindMobile, getUser} from 'api/user';
  import {mobileValid, captValid, setTitle} from 'common/js/util';
  import {directiveMixin} from 'common/js/mixin';
  import Loading from 'base/loading/loading';
  import Toast from 'base/toast/toast';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        sending: false,
        setting: false,
        captcha: '',
        captErr: '',
        captBtnText: '获取验证码',
        mobile: '',
        mobErr: ''
      };
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      setTitle('绑定手机号');
      this._getUser();
    },
    methods: {
      _getUser() {
        if (!this.user) {
          getUser().then((data) => {
            this.setUser(data);
          }).catch(() => {
          });
        }
      },
      sendCaptcha() {
        if (this._mobileValid()) {
          this.sending = true;
          sendCaptcha(this.mobile, 805060).then(() => {
            this._setInterval();
          }).catch(() => {
            this._clearInterval();
          });
        }
      },
      _bindMobile() {
        if (this._valid()) {
          this.setting = true;
          bindMobile(this.mobile, this.captcha)
            .then(() => {
              this.$refs.toast.show();
              this.setUserMobile(this.mobile);
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
        let r2 = this._captValid();
        return r1 && r2;
      },
      _mobileValid() {
        let result = mobileValid(this.mobile);
        this.mobErr = result.msg;
        return !result.err;
      },
      _captValid() {
        let result = captValid(this.captcha);
        this.captErr = result.msg;
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
      ...mapMutations({
        setUser: SET_USER_STATE,
        setUserMobile: SET_USER_MOBILE
      })
    },
    beforeDestroy() {
      this.timer && clearInterval(this.timer);
    },
    components: {
      Loading,
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .bind-mobile-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

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
