<template>
  <transition name="slide">
    <div class="birthday-wrapper">
      <div class="form-wrapper">
        <div class="form-item">
          <div class="item-label">出生日期</div>
          <div class="item-input-wrapper">
            <date-picker class="item-input"
                         :year="year"
                         :month="month"
                         :day="day"
                         @change="updateDate"></date-picker>
            <span v-show="yearErr" class="error-tip">{{yearErr}}</span>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="_changeBirthday">保存</button>
        </div>
        <full-loading v-show="!user"></full-loading>
        <toast ref="toast" text="修改成功"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_USER_STATE, SET_USER_BIRTHDAY} from 'store/mutation-types';
  import {changeBirthday, getUser} from 'api/user';
  import {setTitle, emptyValid, formatDate} from 'common/js/util';
  import Toast from 'base/toast/toast';
  import FullLoading from 'base/full-loading/full-loading';
  import DatePicker from 'base/date-picker/date-picker';

  export default {
    data() {
      return {
        setting: false,
        year: '',
        month: '',
        day: '',
        yearErr: ''
      };
    },
    created() {
      setTitle('设置生日');
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
            this.getBirthday(data);
            this.setUser(data);
          }).catch(() => {});
        } else {
          this.getBirthday(this.user);
        }
      },
      getBirthday(data) {
        let birth = data.birthday;
        if (birth) {
          birth = formatDate(birth, 'yyyy-MM-dd').split('-');
          this.year = birth[0];
          this.month = birth[1];
          this.day = birth[2];
        }
      },
      updateDate (year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
        return this._yearValid();
      },
      _changeBirthday() {
        if (this._valid()) {
          this.setting = true;
          let birth = `${this.year}-${this.month}-${this.day}`;
          changeBirthday(birth).then(() => {
            this.$refs.toast.show();
            this.setBirthday(birth);
            setTimeout(() => {
              this.$router.back();
            }, 1000);
          }).catch(() => {
            this.setting = false;
          });
        }
      },
      _valid() {
        return this._yearValid();
      },
      _yearValid() {
        let result = emptyValid(this.year);
        this.yearErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setUser: SET_USER_STATE,
        setBirthday: SET_USER_BIRTHDAY
      })
    },
    components: {
      Toast,
      FullLoading,
      DatePicker
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";

  .birthday-wrapper {
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
