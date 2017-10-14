<template>
  <transition name="slide">
    <div class="edit-gender-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">性别</div>
          <div class="item-input-wrapper">
            <select class="item-input" v-model="gender">
              <option v-for="item in genderList" :value="item.value">
                {{item.text}}
              </option>
            </select>
            <i class="arrow"></i>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_changeGender">保存</button>
        </div>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_GENDER} from 'store/mutation-types';
  import {changeGender, getUser} from 'api/user';
  import {setTitle} from 'common/js/util';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        setting: false,
        genderList: [{
          text: '男',
          value: '1'
        }, {
          text: '女',
          value: '0'
        }],
        gender: '1'
      };
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    created() {
      setTitle('修改性别');
      this._getUser();
    },
    methods: {
      _getUser() {
        if (!this.user) {
          getUser().then((data) => {
            this.setUser(data);
            this.gender = data.gender || '1';
          }).catch(() => {});
        } else {
          this.gender = this.user.gender || '1';
        }
      },
      _changeGender() {
        this.setting = true;
        changeGender(this.gender).then(() => {
          this.$refs.toast.show();
          this.setGender(this.gender);
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setGender: SET_USER_GENDER
      })
    },
    components: {
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .edit-gender-wrapper {
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
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
