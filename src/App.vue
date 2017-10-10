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
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading';
  import {isLogin, setUser} from 'common/js/util';
  import {getAppId} from 'api/general';
  import {wxLogin} from 'api/user';

  export default {
    data() {
      return {
        loadingFlag: true
      };
    },
    created() {
      setUser({
        token: 'TU201708022049457128381TK201709251504487642621',
        userId: 'U1111111111111111'
      });
      if (!isLogin()) {
        if (/code=([^&]+)&state=/.exec(location.href)) {
          let code = RegExp.$1;
          let userReferee = '';
          if (/\?userReferee=([^&]+)/.test(location.hash)) {
            userReferee = RegExp.$1;
          }
          this.wxLogin(code, userReferee);
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
      }
    },
    methods: {
      wxLogin(code, userReferee) {
        wxLogin(code, userReferee).then((data) => {
          setUser(data);
          if (this.$route.path === '/user/recommend') {
            location.replace(`${location.origin}/?#/home`);
          } else {
            location.replace(`${location.origin}?#${this.$route.fullPath}`);
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
      }
    },
    components: {
      Loading
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
