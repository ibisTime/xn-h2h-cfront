<template>
  <transition name="slide">
    <div class="nickname-wrapper">
      <div class="form-wrapper">
        <div class="form-item">
          <div class="item-label">新昵称</div>
          <div class="item-input-wrapper">
            <input v-focus type="text" class="item-input" v-model="nickname" @change="_nicknameValid" placeholder="请输入新昵称(最多6位)">
            <span v-show="nickErr" class="error-tip">{{nickErr}}</span>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_changeNickname">保存</button>
        </div>
        <div v-show="!user" class="loading-container">
          <div class="loading-wrapper">
            <loading></loading>
          </div>
        </div>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_NICKNAME} from 'store/mutation-types';
  import {changeNickname, getUser} from 'api/user';
  import {nicknameValid, setTitle} from 'common/js/util';
  import Toast from 'base/toast/toast';
  import Loading from 'base/loading/loading';
  import {directiveMixin} from 'common/js/mixin';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        setting: false,
        nickname: '',
        nickErr: ''
      };
    },
    created() {
      setTitle('修改昵称');
      this._getUser();
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      _getUser() {
        if (!this.user) {
          getUser().then((data) => {
            this.nickname = data.nickname || '';
            this.setUser(data);
          }).catch(() => {});
        } else {
          this.nickname = this.user.nickname || '';
        }
      },
      _changeNickname() {
        if (this._valid()) {
          this.setting = true;
          changeNickname(this.nickname)
            .then(() => {
              this.$refs.toast.show();
              this.setNickname(this.nickname);
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.setting = false;
            });
        }
      },
      _valid() {
        return this._nicknameValid();
      },
      _nicknameValid() {
        let result = nicknameValid(this.nickname);
        this.nickErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setNickname: SET_USER_NICKNAME
      })
    },
    components: {
      Toast,
      Loading
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .nickname-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
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
</style>
