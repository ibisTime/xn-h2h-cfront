<template>
  <transition name="slide">
    <div class="bankcard-edit-wrapper">
      <div class="form-wrapper">
        <div class="form-item border-bottom-1px">
          <div class="item-label">真实姓名</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="realName" @change="_realNameValid" placeholder="请输入真实姓名">
            <span v-show="realErr" class="error-tip">{{realErr}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">开户银行</div>
          <div class="item-input-wrapper">
            <select class="item-input" v-model="bankName" @change="_bankNameValid">
              <option v-for="(bankcode,index) in bankcodeList" :key="index" :value="bankcode">
                {{bankcode.bankName}}
              </option>
            </select>
            <i class="arrow"></i>
            <span v-show="bankErr" class="error-tip">{{bankErr}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">开户支行</div>
          <div class="item-input-wrapper">
            <input type="text" class="item-input" v-model="subbranch" @change="_subbranchValid" placeholder="请输入开户支行">
            <span v-show="subErr" class="error-tip">{{subErr}}</span>
          </div>
        </div>
        <div class="form-item border-bottom-1px">
          <div class="item-label">银行卡号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="bankcardNumber" @change="_bankcardNumberValid" placeholder="请输入银行卡号">
            <span v-show="cardErr" class="error-tip">{{cardErr}}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="item-label">手机号</div>
          <div class="item-input-wrapper">
            <input type="tel" class="item-input" v-model="bindMobile" @change="_mobileValid" placeholder="请输入预留手机号">
            <span v-show="mobErr" class="error-tip">{{mobErr}}</span>
          </div>
        </div>

        <div class="form-btn">
          <button :disabled="setting" @click="saveBankCard">保存</button>
        </div>
        <full-loading v-show="showLoading()"></full-loading>
        <toast ref="toast" :text="text"></toast>
      </div>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import {SET_BANKCARD_LIST} from 'store/mutation-types';
  import {getBankCardList, getBankCodeList, addBankCard, editBankCard} from 'api/account';
  import {mobileValid, realNameValid, subbranchValid, bankcardNumberValid, bankNameValid, setTitle} from 'common/js/util';
  import FullLoading from 'base/full-loading/full-loading';
  import Toast from 'base/toast/toast';

  export default {
    data() {
      return {
        bankcodeList: [],
        setting: false,
        realName: '',
        realErr: '',
        bankName: '',
        bankErr: '',
        subbranch: '',
        subErr: '',
        bankcardNumber: '',
        cardErr: '',
        bindMobile: '',
        mobErr: '',
        text: '新增成功'
      };
    },
    computed: {
      ...mapGetters([
        'bankcardList'
      ])
    },
    created() {
      if (this.$route.params.id) {
        setTitle('修改银行卡');
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(([bankCard, bankCode]) => {
          this._initPageData(bankCard, bankCode);
        }).catch(() => {});
      } else {
        setTitle('新增银行卡');
        Promise.all([
          this._getBankCardList(),
          this._getBankCodeList()
        ]).then(() => {}).catch(() => {});
      }
    },
    methods: {
      // 获取银行数据字典列表
      _getBankCodeList() {
        return getBankCodeList().then((data) => {
          this.bankcodeList = data;
          this.bankName = data[0];
          return data;
        });
      },
      _getBankCardList() {
        if (!this.bankcardList) {
          return getBankCardList().then((data) => {
            this.setBankCardList(data);
            return this._judgeBankCode(data);
          });
        } else {
          return this._judgeBankCode(this.bankcardList);
        }
      },
      _judgeBankCode(data) {
        if (this.$route.params.id) {
          let index = data.findIndex((item) => {
            return item.code === this.$route.params.id;
          });
          if (!~index) {
            this.text = '银行卡编号错误';
            setTimeout(() => {
              this.$refs.toast.show();
            }, 20);
            return Promise.reject('银行卡编号错误');
          }
          return Promise.resolve(data[index]);
        } else {
          return Promise.resolve(data);
        }
      },
      _initPageData(bankCard, bankCode) {
        setTimeout(() => {
          let index = bankCode.findIndex((item) => {
            return item.bankCode === bankCard.bankCode;
          });
          this.bankName = bankCode[index];
          this.realName = bankCard.realName;
          this.subbranch = bankCard.subbranch;
          this.bankcardNumber = bankCard.bankcardNumber;
          this.bindMobile = bankCard.bindMobile;
        }, 100);
      },
      showLoading() {
        if (!this.$route.params.id) {   // 新增
          return !this.bankcodeList.length;
        } else {   // 修改
          return !this.bankcodeList.length || !this.bankName;
        }
      },
      saveBankCard() {
        if (this._valid()) {
          this.setting = true;
          let param = {
            bankcardNumber: this.bankcardNumber,
            bankCode: this.bankName.bankCode,
            bankName: this.bankName.bankName,
            subbranch: this.subbranch,
            bindMobile: this.bindMobile,
            realName: this.realName
          };
          if (this.$route.params.id) {
            param.code = this.$route.params.id;
            this._editBankCard(param);
          } else {
            this._addBankCard(param);
          }
        }
      },
      _addBankCard(param) {
        addBankCard(param).then((code) => {
          this.setting = false;
          this.text = '新增成功';
          this.$refs.toast.show();
          if (this.bankcardList) {
            param.code = code;
            this.addBankCard({
              bankcard: param
            });
          }
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _editBankCard(param) {
        editBankCard(param).then(() => {
          this.setting = false;
          this.text = '修改成功';
          this.$refs.toast.show();
          this.editBankCard({
            bankcard: param
          });
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }).catch(() => {
          this.setting = false;
        });
      },
      _valid() {
        let r1 = this._realNameValid();
        let r2 = this._bankNameValid();
        let r3 = this._subbranchValid();
        let r4 = this._bankcardNumberValid();
        let r5 = this._mobileValid();
        return r1 && r2 && r3 && r4 && r5;
      },
      _realNameValid() {
        let result = realNameValid(this.realName);
        this.realErr = result.msg;
        return !result.err;
      },
      _bankNameValid() {
        let result = bankNameValid(this.bankName.bankName);
        this.bankErr = result.msg;
        return !result.err;
      },
      _subbranchValid() {
        let result = subbranchValid(this.subbranch);
        this.subErr = result.msg;
        return !result.err;
      },
      _bankcardNumberValid() {
        let result = bankcardNumberValid(this.bankcardNumber);
        this.cardErr = result.msg;
        return !result.err;
      },
      _mobileValid() {
        let result = mobileValid(this.bindMobile);
        this.mobErr = result.msg;
        return !result.err;
      },
      ...mapMutations({
        setBankCardList: SET_BANKCARD_LIST
      }),
      ...mapActions([
        'addBankCard',
        'editBankCard'
      ])
    },
    components: {
      FullLoading,
      Toast
    }
  };
</script>
<style lang="scss" scoped rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .bankcard-edit-wrapper {
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
