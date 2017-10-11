<template>
  <transition name="slide">
    <div class="cate-wrapper" @click.stop>
      <m-header class="cate-header" title="宝贝分类"></m-header>
      <div class="content">
        <scroll class="left-menu"
                ref="leftScroll"
                :pullUpLoad="pullUpLoad"
                :probeType="probeType"
                :data="list">
          <loading v-show="!list.length" class="loading" title=""></loading>
          <div v-for="(item,index) in list"
               class="menu-item"
               :class="leftCls(index)"
               @click="choseMenu(index)"
               ref="leftMenu">{{item.name}}</div>
        </scroll>
        <scroll class="right-menu"
                :data="rightList"
                :pullUpLoad="pullUpLoad"
                :probeType="probeType">
          <loading v-show="!rightList.length" class="loading" title=""></loading>
          <div class="right-item"
               :class="rightCls"
               v-for="item in rightList"
               @click="choseCate(item)">{{item.name}}</div>
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
  import {SET_PUBLISH_MALL_CATE} from 'store/mutation-types';

  export default {
    data() {
      return {
        list: [
          {
            name: '数码'
          }, {
            name: '数码1'
          }, {
            name: '数码2'
          }, {
            name: '交通工具'
          }, {
            name: '交通工具1'
          }, {
            name: '交通工具2'
          }, {
            name: '交通工具3'
          }
        ],
        rightData: {
          '数码2': [
            {
              name: '数码'
            }, {
              name: '数码1'
            }, {
              name: '数码2'
            }, {
              name: '交通工具'
            }, {
              name: '交通工具1'
            }, {
              name: '交通工具2'
            }, {
              name: '交通工具3'
            }
          ]
        },
        leftIndex: 0,
        rightIndex: -1,
        rLoadingFlag: true
      };
    },
    created() {
      this.probeType = 3;
      this.pullUpLoad = null;
    },
    computed: {
      rightList() {
        if (this.list.length) {
          let _leftName = this.list[this.leftIndex].name;
          let _rightData = this.rightData[_leftName] || [];
          return _rightData;
        }
        return [];
      },
      ...mapGetters([
        'publishMallCate'
      ])
    },
    methods: {
      choseMenu(index) {
        this.leftIndex = index;
        this.$refs.leftScroll.scrollToElement(this.$refs.leftMenu[index], 300, 0, 1);
      },
      choseCate(item) {
        this.$router.back();
      },
      leftCls(index) {
        return index === this.leftIndex ? 'active' : '';
      },
      rightCls(index) {
        return index === this.rightIndex ? 'active' : '';
      },
      ...mapMutations({
        setMallCate: SET_PUBLISH_MALL_CATE
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
