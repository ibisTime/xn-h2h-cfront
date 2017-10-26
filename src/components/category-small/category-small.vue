<template>
  <transition name="small-fade">
    <div v-show="showFlag" class="small-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll class="left-menu"
                ref="leftScroll"
                :pullUpLoad="pullUpLoad"
                :data="bigList"
                :class="leftWrapCls">
          <loading v-show="!bigList.length" class="loading" title=""></loading>
          <div v-for="(item,index) in bigList"
               class="menu-item"
               :class="leftCls(item.code)"
               @click="choseMenu(item.code,index)"
               ref="leftMenu">{{item.name}}</div>
        </scroll>
        <scroll class="right-menu"
                ref="rightScroll"
                :data="smallList"
                :pullUpLoad="pullUpLoad"
                :class="rightWrapCls">
          <loading v-show="rLoadingFlag" class="loading" title=""></loading>
          <div class="right-item"
               :class="rightCls(item.code)"
               v-for="(item,index) in smallList"
               @click="choseCate(item.code,index)"
               ref="rightMenu">{{item.name}}</div>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {getCategories} from 'api/biz';

  export default {
    props: {
      outBigCode: {
        type: String,
        default: ''
      },
      outSmallCode: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showFlag: false,
        smallCode: '',
        bigCode: '',
        bigList: [],
        smallData: {},
        smallList: [],
        rLoadingFlag: true
      };
    },
    computed: {
      leftWrapCls() {
        return this.bigCode ? '' : 'flex1';
      },
      rightWrapCls() {
        return this.bigCode ? '' : 'flex0';
      }
    },
    created() {
      this.pullUpLoad = null;
      this.getInitData();
    },
    methods: {
      getInitData() {
        if (this.outBigCode) {
          Promise.all([
            getCategories(0),
            this.getSmallCategories(this.outBigCode)
          ]).then(([left]) => {
            left.forEach(item => {
              if (item.code === this.outBigCode) {
                this.$emit('firstUpdateBigName', item.name);
              }
            });
            this.bigList = left;
            this.bigList.unshift({
              code: '',
              name: '全部'
            });
          }).catch(() => {
            this.rLoadingFlag = false;
          });
        } else {
          getCategories(0).then((data) => {
            this.bigList = data;
            this.bigList.unshift({
              code: '',
              name: '全部'
            });
          });
        }
      },
      getSmallCategories(code) {
        if (this.smallData[code]) {
          this.smallList = this.smallData[code];
          this.rLoadingFlag = false;
          return Promise.resolve(this.smallData[code]);
        }
        this.smallList = [];
        this.rLoadingFlag = true;
        return getCategories(code).then((data) => {
          data.unshift({
            code: '',
            name: '全部'
          });
          if (this.bigCode === code) {
            this.smallList = data;
          }
          this.smallData[code] = data;
          this.rLoadingFlag = false;
        }).catch(() => {
          this.rLoadingFlag = false;
        });
      },
      choseMenu(code, index) {
        this.bigCode = code;
        this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[index], 200, false, true);
        if (code) {
          this.getSmallCategories(code);
        } else {
          this.$emit('confirm', '', '', '全部');
          this.hide();
        }
      },
      choseCate(code, index) {
        this.$refs.rightScroll.scrollToElement(this.$refs.rightMenu[index], 200, false, true);
        this.smallCode = code;
        let name = '';
        if (this.bigCode) {
          if (this.smallCode) {
            let index = this.smallList.findIndex((item) => {
              return item.code === this.smallCode;
            });
            name = this.smallList[index].name;
          } else {
            let index = this.bigList.findIndex((item) => {
              return item.code === this.bigCode;
            });
            name = this.bigList[index].name;
          }
        } else {
          name = '全部';
        }
        this.$emit('confirm', this.bigCode, this.smallCode, name);
        this.hide();
      },
      initData() {
        this.bigCode = this.outBigCode;
        this.smallCode = this.outSmallCode;
        let bigIndex = this.bigList.findIndex((item) => {
          return item.code === this.bigCode;
        });
        setTimeout(() => {
          this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[bigIndex], 200, false, true);
        }, 20);
        if (this.bigCode) {
          if (!this.smallData[this.bigCode]) {
            this.getSmallCategories(this.bigCode);
          } else {
            this.smallList = this.smallData[this.bigCode];
          }
        } else {
          this.smallList = [];
          this.rLoadingFlag = false;
        }
        if (this.smallCode) {
          this.smallList = this.smallData[this.bigCode];
          let smallIndex = this.smallList.findIndex((item) => {
            return item.code === this.smallCode;
          });
          setTimeout(() => {
            this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[bigIndex], 200, false, true);
            this.$refs.rightScroll.scrollToElement(this.$refs.rightMenu[smallIndex], 200, false, true);
          }, 20);
        }
      },
      choseSmall(code) {
        this.smallCode = this.smallCode === code ? '' : code;
      },
      reset() {
        this.smallCode = '';
      },
      hide() {
        this.showFlag = false;
        this.$emit('hide');
      },
      show() {
        this.showFlag = true;
        this.initData();
      },
      leftCls(code) {
        return code === this.bigCode ? 'active' : '';
      },
      rightCls(code) {
        return code === this.smallCode ? 'active' : '';
      }
    },
    components: {
      Scroll,
      Loading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .small-wrapper {
    position: absolute;
    top: 1.68rem;
    left: 0;
    width: 100%;
    bottom: 0;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);

    &.small-fade-enter-active {
      animation: small-fadein 0.3s;
      .content {
        animation: small-slide 0.3s;
      }
    }

    .content {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      height: 7.2rem;
      width: 100%;
      overflow: hidden;
      font-size: $font-size-medium-s;
      background: #fff;

      .left-menu {
        flex: 0 0 1.8rem;
        background: $color-background;
        color: $color-text-l;

        &.flex1 {
          flex: 1;
        }

        .menu-item {
          height: 0.8rem;
          line-height: 0.8rem;
          padding-left: 0.3rem;

          &.active {
            background: #fff;
            color: $color-text;
          }
        }
      }

      .right-menu {
        flex: 1;
        background: #fff;
        color: $color-text-l;

        &.flex0 {
          flex: 0;
        }

        .right-item {
          height: 0.8rem;
          line-height: 0.8rem;
          padding-left: 0.6rem;

          &.active {
            color: $color-text;
          }
        }
      }
    }
  }

  @keyframes small-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes small-slide {
    0% {
      transform: translate3d(0, -100%, 0);
    }
    50% {
      ransform: translate3d(0, -50%, 0);
    }
    100% {
      ransform: translate3d(0, 0, 0);
    }
  }
</style>
