<template>
  <transition name="slide">
    <div class="address-list-wrapper">
      <div class="addr-scroll-wrapper">
        <scroll :data="addressList" :hasMore="hasMore">
          <ul>
            <li v-for="(item,index) in addressList" class="border-bottom-1px">
              <div class="content"
                   ref="address"
                   @click="selectItem(item)"
                   @touchstart.stop.prevent="touchstart(index,$event)"
                   @touchmove.stop.prevent="touchmove($event)"
                   @touchend.stop.prevent="touchend($event)">
                <div class="info">{{item.addressee}}<span>{{item.mobile}}</span></div>
                <div class="addr">{{item.province}} {{item.city}} {{item.district}} {{item.detailAddress}}</div>
              </div>
              <div ref="deleteEle" class="delete" @click="deleteItem(item)">
                <p>删除</p>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <footer @click="goAdd">添加新地址</footer>
      <div class="no-result-wrapper">
        <no-result v-show="!hasMore && !addressList.length" title="您尚未添加收货地址"></no-result>
      </div>
      <div v-show="delLoading" class="loading-container">
        <div class="loading-wrapper">
          <loading title="删除中..."></loading>
        </div>
      </div>
      <confirm ref="confirm" text="确定删除地址吗" @confirm="_deleteAddress"></confirm>
      <toast ref="toast" text="删除成功"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';
  import NoResult from 'base/no-result/no-result';
  import {prefixStyle} from 'common/js/dom';
  import {setTitle} from 'common/js/util';
  import {SET_ADDRESS_LIST} from 'store/mutation-types';
  import {deleteAddress, getAddressList} from 'api/user';
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    data() {
      return {
        hasMore: true,
        delLoading: false
      };
    },
    created() {
      this.touch = {};
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
          getAddressList().then((data) => {
            this.hasMore = false;
            this.setAddressList(data);
          });
        }
      },
      shouldGetData() {
        if (this.$route.path === '/user/setting/address') {
          setTitle('地址列表');
          return this.hasMore;
        }
      },
      selectItem(item) {
        this.$router.push(`/user/setting/address/${item.code}`);
      },
      goAdd() {
        this.$router.push('/user/setting/address/add');
      },
      touchstart(index, event) {
        this.touch.initiated = true;
        // 用来判断是否是一次移动
        this.touch.moved = false;
        const touch = event.touches[0];
        this.touch[index] = this.touch[index] || {};
        this.touch[index].x1 = touch.pageX;
        this.touch[index].y1 = touch.pageY;
        this.touch[index].x2 = touch.pageX;
        this.touch[index].y2 = touch.pageY;
        this.touch[index].offset = this.touch[index].offset || 0;
        this.touch.currentIndex = index;
      },
      touchmove(event) {
        if (!this.touch.initiated) {
          return;
        }
        const touch = event.touches[0];
        const index = this.touch.currentIndex;
        this.touch[index].x2 = touch.pageX;
        this.touch[index].y2 = touch.pageY;
        const deltaX = touch.pageX - this.touch[index].x1;
        const deltaY = touch.pageY - this.touch[index].y1;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return;
        }
        if (!this.touch.moved) {
          this.touch.moved = true;
        }
        let offset = this.touch[index].offset + deltaX;
        this.$refs.address[index].style[transform] = `translate3d(${offset}px,0,0)`;
        this.$refs.deleteEle[index].style['zIndex'] = -1;
      },
      touchend() {
        const index = this.touch.currentIndex;
        let deltaX = this.touch[index].x2 - this.touch[index].x1;

        if (!this.touch.moved) {
          let deltaY = this.touch[index].y2 - this.touch[index].y1;
          if (Math.abs(deltaX) < 5 || Math.abs(deltaY)) {
            this.selectItem(this.addressList[index]);
          }
          return;
        }
        const currentElem = this.$refs.address[index];
        let zIndex = -1;

        if (deltaX <= 0) {
          if (deltaX <= -15) {
            currentElem.style[transform] = 'translate3d(-61px,0,0)';
            this.touch[index].offset = -61;
            zIndex = 0;
          } else {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          }
        } else {
          if (deltaX >= 15) {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          } else {
            currentElem.style[transform] = 'translate3d(0,0,0)';
            this.touch[index].offset = 0;
          }
        }
        currentElem.style[transitionDuration] = '300ms';
        currentElem.addEventListener('transitionend', () => {
          currentElem.style[transitionDuration] = '0ms';
        });
        this.$refs.deleteEle[index].style['zIndex'] = zIndex;
      },
      deleteItem(item) {
        this.currentItem = item;
        this.$refs.confirm.show();
      },
      _deleteAddress() {
        if (this.currentItem) {
          this.delLoading = true;
          deleteAddress(this.currentItem.code).then(() => {
            this.delLoading = false;
            this.deleteAddress({
              code: this.currentItem.code
            });
          }).catch(() => {
            this.delLoading = false;
          });
        }
      },
      ...mapMutations({
        setAddressList: SET_ADDRESS_LIST
      }),
      ...mapActions([
        'deleteAddress'
      ])
    },
    components: {
      Scroll,
      Toast,
      Confirm,
      Loading,
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

    ul {
      li {
        position: relative;
        height: 82px;
        @include border-bottom-1px($color-border);
        font-size: $font-size-small;

        &:last-child {
          @include border-none();
        }

        .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding: 0 15px;
          background-color: #fff;

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

        .delete {
          position: absolute;
          right: 1px;
          top: 1px;
          width: 61px;
          height: 80px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          z-index: -1;
          font-size: $font-size-medium;
          background: $color-red;
          color: #fff;

          p+p {
            margin-top: 12px;
          }
        }
      }
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
