<template>
  <transition name="slide">
    <div class="user-wrapper">
      <scroll :pullUpLoad="pullUpLoad" class="user-content">
        <div>
          <div class="setting-wrapper">
            <div to="/user/setting/avatar" class="setting-item border-bottom-1px">
              <h2>头像</h2>
              <img :src="getAvatar()"/>
              <i class="arrow"></i>
            </div>
            <div class="setting-item border-bottom-1px" @click="goNick">
              <h2>昵称</h2>
              <span v-if="user && user.nickname">{{user.nickname}}</span>
              <span v-else>设置昵称</span>
              <i class="arrow"></i>
            </div>
            <div class="setting-item border-bottom-1px" @click="goMobile">
              <h2>手机号</h2>
              <span v-if="user && user.mobile">{{user.mobile}}</span>
              <span v-else>绑定手机号</span>
              <i class="arrow"></i>
            </div>
            <router-link to="/user/setting/set-tradepwd" tag="div" class="setting-item border-bottom-1px">
              <h2>支付密码</h2>
              <span v-if="user && user.tradepwdFlag">修改密码</span>
              <span v-else>设置密码</span>
              <i class="arrow"></i>
            </router-link>
            <router-link to="/user/setting/set-birthday" tag="div" class="setting-item border-bottom-1px">
              <h2>生日</h2>
              <span v-if="user && user.birthday">{{user.birthday | formatDate('MM月dd日')}}</span>
              <span v-else>设置生日</span>
              <i class="arrow"></i>
            </router-link>
            <router-link to="/user/setting/address" tag="div" class="setting-item border-bottom-1px">
              <h2>收货地址</h2>
              <i class="arrow"></i>
            </router-link>
            <router-link to="/user/setting/bankcard" tag="div" class="setting-item border-bottom-1px">
              <h2>我的银行卡</h2>
              <i class="arrow"></i>
            </router-link>
            <router-link to="/user/setting/aboutus" class="setting-item border-bottom-1px" tag="div">
              <h2>关于我们</h2>
              <i class="arrow"></i>
            </router-link>
            <router-link to="/user/setting/notice" class="setting-item border-bottom-1px" tag="div">
              <h2>系统消息</h2>
              <i class="arrow"></i>
            </router-link>
          </div>
        </div>
        <!--<div class="set-btns">-->
        <!--<button @click="logout">退出登录</button>-->
        <!--</div>-->
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE} from 'store/mutation-types';
  import {getUser} from 'api/user';
  import {getAppId} from 'api/general';
  import {setTitle, clearUser, formatImg} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import Scroll from 'base/scroll/scroll';

  export default {
    mixins: [commonMixin],
    created() {
      this.pullUpLoad = null;
      if (this.shouldGetData()) {
        this._getUser();
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    updated() {
      if (this.shouldGetData()) {
        this._getUser();
      }
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/user/setting') {
          setTitle('设置');
          return !this.user;
        }
        return false;
      },
      _getUser() {
        getUser().then((data) => {
          this.setUser(data);
        }).catch(() => {});
      },
      goNick() {
        this.$router.push('/user/setting/nickname');
      },
      goMobile() {
        if (this.user && this.user.mobile) {
          this.$router.push('/user/setting/change-mobile');
        } else {
          this.$router.push('/user/setting/bind-mobile');
        }
      },
      logout() {
        clearUser();
        this._reloadPage();
      },
      getAvatar() {
        if (!this.user || !this.user.photo) {
          return require('./avatar@2x.png');
        }
        return formatImg(this.user.photo);
      },
      _reloadPage() {
        getAppId().then((data) => {
          let appId = data.cvalue;
          let redirectUri = encodeURIComponent(`${location.origin}?#/home`);
          let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
          let suffix = '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
          setTimeout(() => {
            location.replace(`${url}?appid=${appId}&redirect_uri=${redirectUri}${suffix}`);
          }, 100);
        });
      },
      ...mapMutations({
        setUser: SET_USER_STATE
      })
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .user-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 101;

    .user-content{
      position: relative;
      height: 100%;
      overflow: hidden;

      .setting-wrapper {
        .setting-item {
          position: relative;
          height: 1.16rem;
          line-height: 1.16rem;
          padding-left: 0.3rem;
          @include border-bottom-1px($color-border);

          h2 {
            font-size: $font-size-medium-x;
          }

          .arrow {
            position: absolute;
            right: 0;
            top: 0;
            width: 0.8rem;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 0.2rem;
            @include bg-image('more');
          }

          img {
            position: absolute;
            right: 0.8rem;
            width: 0.92rem;
            height: 0.92rem;
            top: 0.12rem;
            border-radius: 50%;
          }

          span {
            position: absolute;
            right: 0.8rem;
            left: 2rem;
            top: 50%;
            transform: translate(0, -50%);
            overflow: hidden;
            white-space: nowrap;
            text-align: right;
            text-overflow: ellipsis;
            font-size: $font-size-medium-x;
            color: $color-text-l;
          }
        }
      }

      .set-btns {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0.24rem 0.36rem;

        button {
          width: 100%;
          border-radius: 0.16rem;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: $font-size-medium;
          color: #fff;
          background-color: $color-cancel-background;
        }
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
