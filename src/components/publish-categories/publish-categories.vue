<template>
  <transition name="slide">
    <div class="cate-wrapper" @click.stop>
      <m-header class="cate-header" title="宝贝分类"></m-header>
      <div class="content">
        <scroll class="left-menu"
                ref="leftScroll"
                :pullUpLoad="pullUpLoad"
                :data="list">
          <loading v-show="!list.length" class="loading" title=""></loading>
          <div v-for="(item,index) in list"
               class="menu-item"
               :class="leftCls(item.code)"
               @click="choseMenu(item.code,index)"
               ref="leftMenu">{{item.name}}</div>
        </scroll>
        <scroll class="right-menu"
                ref="rightScroll"
                :data="rightList"
                :pullUpLoad="pullUpLoad">
          <loading v-show="rLoadingFlag" class="loading" title=""></loading>
          <div class="right-item"
               :class="rightCls(item.code)"
               v-for="(item,index) in rightList"
               @click="choseCate(item,index)"
               ref="rightMenu">{{item.name}}</div>
        </scroll>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import MHeader from 'components/m-header/m-header';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_PUBLISH_CATEGORY} from 'store/mutation-types';
  import {getCategories} from 'api/biz';

  export default {
    data() {
      return {
        list: [],
        rightData: {},
        leftCode: '',
        rightCode: '',
        rLoadingFlag: true,
        rightList: []
      };
    },
    created() {
      this.pullUpLoad = null;
      this.getInitData();
    },
    computed: {
      ...mapGetters([
        'publishCategory'
      ])
    },
    methods: {
      getInitData() {
        if (this.publishCategory) {
          this.leftCode = this.publishCategory.parentCode;
          Promise.all([
            getCategories(0),
            this.getSmallCategories(this.publishCategory.parentCode)
          ]).then(([left]) => {
            this.list = left;
          }).catch(() => {
            this.rLoadingFlag = false;
          });
        } else {
          getCategories(0).then((data) => {
            this.list = data;
            if (data.length) {
              this.leftCode = data[0].code;
              this.getSmallCategories(data[0].code);
            }
          });
        }
      },
      getSmallCategories(code) {
        if (this.rightData[code]) {
          this.rightList = this.rightData[code];
          this.rLoadingFlag = false;
          return Promise.resolve(this.rightData[code]);
        }
        this.rightList = [];
        this.rLoadingFlag = true;
        return getCategories(code).then((data) => {
          this.rightData[code] = data;
          if (!this.list || this.leftCode === code) {
            this.rightList = data;
          }
          this.rLoadingFlag = false;
          if (this.publishCategory && this.publishCategory.parentCode === code) {
            this.rightCode = this.publishCategory.code;
          } else {
            this.rightCode = '';
          }
        }).catch(() => {
          this.rLoadingFlag = false;
        });
      },
      choseMenu(code, index) {
        this.leftCode = code;
        this.getSmallCategories(code);
        this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[index], 200, false, true);
      },
      choseCate(item, index) {
        this.$refs.rightScroll.scrollToElement(this.$refs.rightMenu[index], 200, false, true);
        this.setCategory(item);
        setTimeout(() => {
          this.$router.back();
        }, 210);
      },
      leftCls(code) {
        return code === this.leftCode ? 'active' : '';
      },
      rightCls(code) {
        return code === this.rightCode ? 'active' : '';
      },
      ...mapMutations({
        setCategory: SET_PUBLISH_CATEGORY
      })
    },
    components: {
      MHeader,
      Scroll,
      Loading
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .cate-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .cate-header {
      position: absolute;
    }

    .content {
      position: absolute;
      top: 0.88rem;
      left: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      font-size: $font-size-medium-s;

      .left-menu {
        flex: 0 0 1.8rem;
        background: $color-background;
        color: $color-text-l;

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

        .right-item {
          height: 0.8rem;
          line-height: 0.8rem;
          padding-left: 0.6rem;

          &.active {
            color: $color-text;
          }
        }
      }

      .loading {
        padding-top: 0.2rem;
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }
  }
</style>
