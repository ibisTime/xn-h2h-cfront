<template>
  <transition name="slide">
    <div class="introduce-wrapper">
      <div class="form-wrapper">
        <div class="form-item is-textarea">
          <div class="item-input-wrapper">
            <textarea v-model="introduce" @input="_introduceValid" rows="4" class="item-input" placeholder="请输入个人简介"></textarea>
            <span v-show="introduceErr" class="error-tip">{{introduceErr}}</span>
          </div>
        </div>
        <div class="form-btn">
          <button :disabled="setting" @click="_changeIntroduce">保存</button>
        </div>
        <full-loading v-show="!user"></full-loading>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_INTRODUCE} from 'store/mutation-types';
  import {editIntroduce, getUser} from 'api/user';
  import {subbranchValid, setTitle} from 'common/js/util';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import {directiveMixin} from 'common/js/mixin';

  export default {
    mixins: [directiveMixin],
    data() {
      return {
        setting: false,
        introduce: '',
        introduceErr: ''
      };
    },
    created() {
      setTitle('修改简介');
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
            this.introduce = data.introduce || '';
            this.setUser(data);
          }).catch(() => {});
        } else {
          this.introduce = this.user.introduce || '';
        }
      },
      _changeIntroduce() {
        if (this._valid()) {
          this.setting = true;
          editIntroduce(this.introduce)
            .then(() => {
              this.$refs.toast.show();
              this.setIntroduce(this.introduce);
              setTimeout(() => {
                this.$router.back();
              }, 1000);
            }).catch(() => {
              this.setting = false;
            });
        }
      },
      _valid() {
        return this._introduceValid();
      },
      _introduceValid() {
        let result = subbranchValid(this.introduce);
        this.introduceErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setIntroduce: SET_USER_INTRODUCE
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

  .introduce-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .item-input-wrapper {
      height: auto !important;
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }
  }
</style>
