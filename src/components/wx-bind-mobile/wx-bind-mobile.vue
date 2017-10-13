<template>
  <transition name="slide-up">
    <div class="bind-mobile-wrapper" v-show="showFlag">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">手机号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="mobile" @change="_mobileValid" placeholder="请输入手机号">
            <span v-show="mobErr" class="error-tip">{{mobErr}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">手机验证码</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="captcha" @change="_captValid" placeholder="请输入验证码">
            <span v-show="captErr" class="error-tip">{{captErr}}</span>
          </div>
          <div class="item-btn">
            <button @click="sendCaptcha" :disabled="disabled">{{captBtnText}}</button>
          </div>
        </div>

        <div class="form-btn">
          <button @click="_bindMobile">确认</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mobileValid, captValid, setWxMobAndCapt, setTitle} from 'common/js/util';
  import {sendCaptcha, getAppId} from 'api/general';

  export default {
    data() {
      return {
        showFlag: false,
        mobile: '',
        mobErr: '',
        captcha: '',
        captErr: '',
        captBtnText: '获取验证码',
        disabled: false
      };
    },
    methods: {
      show() {
        setTitle('绑定手机号');
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      sendCaptcha() {
        if (this._mobileValid()) {
          this.disabled = true;
          sendCaptcha(this.mobile, 805170).then(() => {
            this._setInterval();
          }).catch(() => {
            this.disabled = false;
            this._clearInterval();
          });
        }
      },
      _bindMobile() {
        if (this._valid()) {
          setWxMobAndCapt(this.mobile, this.captcha);
          getAppId().then((data) => {
            let appId = data.cvalue;
            let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
            let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
            setTimeout(() => {
              location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
            }, 100);
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
            this.captBtnText = i-- + '秒后重发';
          }
        }, 1000);
      },
      _clearInterval() {
        if (this.timer) {
          this.disabled = false;
          clearInterval(this.timer);
          this.captBtnText = '获取验证码';
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .bind-mobile-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }

    &.slide-up-enter, &.slide-up-leave-to {
      top: 100%;
    }
  }
</style>
