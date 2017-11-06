<template>
  <transition name="slide">
    <div class="bankcard-wrapper">
      <scroll class="bankcard-content" :hasMore="!bankcardList">
        <ul>
          <li v-for="(item,index) in bankcardList">
            <div class="content"
                 ref="bankcard"
                 @click="selectItem(item)"
                 @touchstart.stop.prevent="touchstart(index,$event)"
                 @touchmove.stop.prevent="touchmove($event)"
                 @touchend.stop.prevent="touchend($event)">
              <div class="bankname">{{item.bankName}}</div>
              <div class="bankcode">
                <h2>借记卡</h2>
                <p>{{formatBankcardNum( item.bankcardNumber)}}</p>
              </div>
            </div>
            <div ref="deleteEle" class="delete" @click="deleteItem(item)">
              <p>删除</p>
            </div>
          </li>
          <li v-show="!bankcardList || !bankcardList.length" @click="goAdd" class="add">
            <div class="content">新 增 银 行 卡</div>
          </li>
        </ul>
      </scroll>
      <full-loading v-show="delLoading" title="删除中..."></full-loading>
      <confirm ref="confirm" text="确定删除银行卡吗" @confirm="_deleteBankCard"></confirm>
      <toast ref="toast" text="删除成功"></toast>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapMutations, mapGetters, mapActions} from 'vuex';
  import Scroll from 'base/scroll/scroll';
  import FullLoading from 'base/full-loading/full-loading';
  import Confirm from 'base/confirm/confirm';
  import Toast from 'base/toast/toast';
  import {prefixStyle} from 'common/js/dom';
  import {setTitle} from 'common/js/util';
  import {getBankCardList, deleteBankCard} from 'api/account';
  import {SET_BANKCARD_LIST} from 'store/mutation-types';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    data() {
      return {
        delLoading: false
      };
    },
    created() {
      this.touch = {};
      this.currentItem = null;
      if (this.shouldGetData()) {
        this._getBankCardList();
      }
    },
    computed: {
      ...mapGetters([
        'bankcardList'
      ])
    },
    updated() {
      if (this.shouldGetData()) {
        this._getBankCardList();
      }
    },
    methods: {
      shouldGetData() {
        if (/\/user\/[^/]+\/setting\/bankcard/.test(this.$route.path)) {
          setTitle('银行卡列表');
          return !this.bankcardList;
        }
      },
      _getBankCardList() {
        getBankCardList().then((data) => {
          this.setBankcardList(data);
        }).catch(() => {});
      },
      deleteItem(item) {
        this.currentItem = item;
        this.$refs.confirm.show();
      },
      _deleteBankCard() {
        if (this.currentItem) {
          this.delLoading = true;
          deleteBankCard(this.currentItem.code).then(() => {
            this.delLoading = false;
            this.deleteBankCard({
              code: this.currentItem.code
            });
          }).catch(() => {
            this.delLoading = false;
          });
        }
      },
      selectItem(item) {
        this.$router.push(this.$route.path + '/' + item.code);
      },
      goAdd() {
        this.$router.push(this.$route.path + '/add');
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
        this.$refs.bankcard[index].style[transform] = `translate3d(${offset}px,0,0)`;
        this.$refs.deleteEle[index].style['zIndex'] = -1;
      },
      touchend(event) {
        const index = this.touch.currentIndex;
        let deltaX = this.touch[index].x2 - this.touch[index].x1;

        if (!this.touch.moved) {
          let deltaY = this.touch[index].y2 - this.touch[index].y1;
          if (Math.abs(deltaX) < 5 || Math.abs(deltaY)) {
            this.selectItem(this.bankcardList[index]);
          }
          return;
        }
        const currentElem = this.$refs.bankcard[index];
        let zIndex = -1;

        if (deltaX <= 0) {
          if (deltaX <= -15) {
            currentElem.style[transform] = 'translate3d(-78px,0,0)';
            this.touch[index].offset = -78;
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
      formatBankcardNum(num) {
        let reg = /^(\d{4})\d+(\d{4})$/;
        num = num.replace(reg, '**** **** **** $1');
        return num;
      },
      ...mapMutations({
        setBankcardList: SET_BANKCARD_LIST
      }),
      ...mapActions([
        'deleteBankCard'
      ])
    },
    components: {
      FullLoading,
      Scroll,
      Confirm,
      Toast
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .bankcard-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 19px 19px 0;
    background: #fff;
    z-index: 101;

    .bankcard-content{
      position: relative;
      height: 100%;
      overflow: hidden;
    }

    ul {
      li {
        position: relative;
        height: 82px;
        margin-bottom: 15px;
        border-radius: 8px;
        font-size: $font-size-small;

        &.add {
          font-size: $font-size-medium;
          color: $color-cancel-background;

          .content {
            background: transparent;
            border-style: dashed;
            justify-content: center;
          }
        }

        .content {
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 26px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #eee;

          .bankcode {
            flex: 1;
            text-align: right;

            h2 {
              padding-bottom: 13px;
            }
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
          border-radius: 8px;
          font-size: $font-size-medium;
          background: $color-text;
          color: #fff;

          p+p {
            margin-top: 12px;
          }
        }
      }
    }
    .bankcard-loading {
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .no-result-wrapper {
      margin-bottom: 20px;
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
