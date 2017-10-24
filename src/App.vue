<template>
  <div id="app" @touchmove.prevent>
    <div v-if="!loadingFlag">
      <router-view></router-view>
    </div>
    <div v-if="loadingFlag" class="loading-container">
      <div class="loading-wrapper">
        <loading title=""></loading>
      </div>
    </div>
    <wx-bind-mobile ref="bindMobile"></wx-bind-mobile>
    <toast :text="text" ref="toast"></toast>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading';
  import Toast from 'base/toast/toast';
  import {isLogin, setUser, getWxMobAndCapt} from 'common/js/util';
  import {getLocation} from 'common/js/location';
  import {getAppId} from 'api/general';
  import {wxLogin, saveLoginLog} from 'api/user';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_LOCATION, SET_IS_LOCA_ERR, SET_LOG_FLAG} from 'store/mutation-types';
  import WxBindMobile from 'components/wx-bind-mobile/wx-bind-mobile';
  import {messageMixin} from 'common/js/message-mixin';

  export default {
    mixins: [messageMixin],
    data() {
      return {
        loadingFlag: true,
        text: ''
      };
    },
    computed: {
      ...mapGetters([
        'location',
        'logFLag'
      ])
    },
    created() {
      this.getLocation();
      if (!isLogin()) {
        if (/code=([^&]+)&state=/.exec(location.href)) {
          let code = RegExp.$1;
          let userReferee = '';
          let activityCode = '';
          if (/(?:\?|&)userReferee=([^&$]+)/.test(location.hash)) {
            userReferee = RegExp.$1;
          }
          if (/(?:\?|&)activityCode=([^&$]+)/.test(location.hash)) {
            activityCode = RegExp.$1;
          }
          this.wxLogin(code, userReferee, activityCode);
        } else {
          this.getAppId();
        }
      } else {
        if (/\/#\//.test(location.href)) {
          let hash = window.location.hash;
          let path = hash;
          if (hash === '' || hash === '#/') {
            path = '#/home';
          }
          path = path.substr(1);
          this.timer = setInterval(() => {
            if (this.$route.fullPath !== '/') {
              clearInterval(this.timer);
              if (/\/user\/recommend/.test(hash)) {
                location.replace(`${location.origin}/?#/home`);
              } else {
                location.replace(`${location.origin}/?#${path}`);
              }
            }
          }, 20);
        } else {
          this.loadingFlag = false;
        }
        this.tencentLogin();
        saveLoginLog().catch(() => {});
      }
    },
    methods: {
      getLocation() {
        if (!this.location) {
          getLocation().then((result) => {
            this.setLocation(result);
          }).catch(() => {
            this.setLocaErr(true);
            this.text = '定位失败';
            this.$refs.toast.show();
          });
        }
      },
      wxLogin(code, userReferee, activityCode) {
        let mobAndCapt = getWxMobAndCapt();
        let mobile;
        let smsCaptcha;
        if (mobAndCapt) {
          mobile = mobAndCapt.mobile;
          smsCaptcha = mobAndCapt.captcha;
        }
        wxLogin(code, userReferee, activityCode, mobile, smsCaptcha).then((data) => {
          if (data.isNeedMobile === '1') {
            this.text = '微信登录需要先绑定手机号';
            this.$refs.toast.show();
            this.$refs.bindMobile.show();
          } else {
            setUser(data);
            if (this.$route.path === '/user/recommend') {
              location.replace(`${location.origin}/?#/home`);
            } else {
              location.replace(`${location.origin}/?#${this.$route.fullPath}`);
            }
          }
        }).catch(() => {});
      },
      getAppId() {
        getAppId().then((data) => {
          let appId = data.cvalue;
          let redirectUri = encodeURIComponent(`${location.origin}?${location.hash}`);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          setTimeout(() => {
            location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
          }, 100);
        });
      },
      ...mapMutations({
        setLocation: SET_LOCATION,
        setLocaErr: SET_IS_LOCA_ERR,
        setLogFLag: SET_LOG_FLAG
      })
    },
    components: {
      Loading,
      Toast,
      WxBindMobile
    }
  };
</script>

<style lang="scss" scoped>
  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .loading-wrapper {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translate3d(0, -50%, 0);
    }
  }
</style>
