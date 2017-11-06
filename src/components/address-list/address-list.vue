<template>
  <transition name="slide">
    <div class="address-list-wrapper">
      <div class="addr-scroll-wrapper">
        <scroll :data="addressList" :hasMore="hasMore">
          <ul>
            <li v-for="item in addressList" class="border-bottom-1px">
              <div class="content" @click="selectItem(item)">
                <div class="info">{{item.addressee}}<span>{{item.mobile}}</span></div>
                <div class="addr">{{item.province}} {{item.city}} {{item.district}} {{item.detailAddress}}</div>
              </div>
              <div class="opeator border-top-1px">
                <div class="default" @click.top="setDefault(item)">
                  <i class="icon-chose" :class="choseCls(item)"></i>
                  <span>默认地址</span>
                </div>
                <div class="edit" @click.top="goEdit(item)">
                  <i class="icon-edit"></i>
                  <span>编辑</span>
                </div>
                <div class="delete" @click.top="deleteItem(item)">
                  <i class="icon-delete"></i>
                  <span>删除</span>
                </div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <footer @click="goAdd">添加新地址</footer>
      <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !addressList.length" title="您尚未添加收货地址"></no-result>
      </div>
      <full-loading v-show="loadingFlag" :title="loadingText"></full-loading>
      <confirm ref="confirm" text="确定删除地址吗" @confirm="_deleteAddress"></confirm>
      <toast ref="toast" text="删除成功"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {SET_ADDRESS_LIST, SET_CURRENT_ADDR} from 'store/mutation-types';
  import {deleteAddress, getAddressList, setDefaultAddress} from 'api/user';
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    data() {
      return {
        hasMore: true,
        loadingFlag: false,
        loadingText: ''
      };
    },
    created() {
      this.currentItem = null;
      this.getAddress();
    },
    updated() {
      this.getAddress();
    },
    computed: {
      ...mapGetters([
        'addressList'
      ])
    },
    methods: {
      getAddress() {
        if (this.shouldGetData()) {
          if (!this.addressList.length) {
            getAddressList().then((data) => {
              this.hasMore = false;
              this.setAddressList(data);
            }).catch(() => {
              this.hasMore = false;
            });
          } else {
            this.hasMore = false;
          }
        }
      },
      shouldGetData() {
        if (/\/user\/[^/]+\/setting\/address/.test(this.$route.path) || this.$route.path === '/category/confirm/address') {
          setTitle('地址列表');
          return this.hasMore;
        }
      },
      setDefault(item) {
        if (item.isDefault !== '1') {
          this.loadingText = '设置中...';
          this.loadingFlag = true;
          setDefaultAddress(item.code).then(() => {
            this.loadingFlag = false;
            this.setDefaultAddress({
              code: item.code
            });
            item.isDefault = '1';
            this.setCurAddr(item);
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      goEdit(item) {
        this.$router.push(`${this.$route.path}/${item.code}`);
      },
      selectItem(item) {
        this.setCurAddr(item);
        if (this.$route.path === '/category/confirm/address') {
          this.$router.back();
        }
      },
      goAdd() {
        this.$router.push(this.$route.path + '/add');
      },
      choseCls(item) {
        return item.isDefault === '1' ? 'active' : '';
      },
      deleteItem(item) {
        this.currentItem = item;
        this.$refs.confirm.show();
      },
      _deleteAddress() {
        if (this.currentItem) {
          this.loadingText = '删除中...';
          this.loadingFlag = true;
          deleteAddress(this.currentItem.code).then(() => {
            this.loadingFlag = false;
            this.deleteAddress({
              code: this.currentItem.code
            });
          }).catch(() => {
            this.loadingFlag = false;
          });
        }
      },
      ...mapMutations({
        setAddressList: SET_ADDRESS_LIST,
        setCurAddr: SET_CURRENT_ADDR
      }),
      ...mapActions([
        'deleteAddress',
        'setDefaultAddress'
      ])
    },
    components: {
      Scroll,
      Toast,
      Confirm,
      FullLoading,
      NoResult
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .address-list-wrapper {
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
      transform: translate3d(100%, 0, 0);
    }

    ul {
      li {
        position: relative;
        @include border-bottom-1px($color-border);
        font-size: $font-size-small;
        background-color: #fff;

        &:last-child {
          @include border-none();
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 1.6rem;
          padding: 0 0.3rem;

          .info {
            font-size: $font-size-medium-x;

            span {
              padding-left: 0.2rem;
            }
          }

          .addr {
            padding-top: 0.2rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: $font-size-medium-s;
          }
        }

        .opeator {
          display: flex;
          align-items: center;
          height: 0.9rem;
          font-size: 0;
          @include border-top-1px($color-border);

          .default {
            flex: 1;

            .icon-chose {
              margin-left: 0.3rem;
              display: inline-block;
              vertical-align: middle;
              width: 0.34rem;
              height: 0.34rem;
              background-size: 0.34rem;
              @include bg-image('un-select');

              &.active {
                @include bg-image('selected');
              }
            }

            span {
              display: inline-block;
              vertical-align: middle;
              padding-left: 0.24rem;
              font-size: $font-size-small;
              color: $primary-color;
            }
          }

          .edit {
            padding: 0 0.3rem;

            .icon-edit {
              display: inline-block;
              vertical-align: middle;
              width: 0.38rem;
              height: 0.38rem;
              background-size: 0.38rem;
              background-repeat: no-repeat;
              background-position: center;
              @include bg-image('edit');
            }

            span {
              display: inline-block;
              vertical-align: middle;
              padding-left: 0.1rem;
              font-size: $font-size-small;
            }
          }

          .delete {
            padding: 0 0.3rem;

            .icon-delete {
              display: inline-block;
              vertical-align: middle;
              width: 0.38rem;
              height: 0.38rem;
              background-size: 0.38rem;
              background-repeat: no-repeat;
              @include bg-image('delete');
            }

            span {
              display: inline-block;
              vertical-align: middle;
              padding-left: 0.1rem;
              font-size: $font-size-small;
            }
          }
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 40%;
      left: 0;
      transform: translateY(-50%);
    }

    .addr-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      bottom: 0.98rem;
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0.98rem;
      line-height: 0.98rem;
      text-align: center;
      font-size: $font-size-large-s;
      color: #fff;
      background: $primary-color;
    }
  }
</style>
