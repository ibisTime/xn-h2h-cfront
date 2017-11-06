<template>
  <transition name="slide">
    <div class="charge-activity-wrapper">
      <div class="scroll-wrapper">
        <scroll ref="scroll" :pullUpLoad="pullUpLoad" :hasMore="loadingFlag">
          <div ref="description" class="rich-text-description">
            <div v-html="content"></div>
          </div>
        </scroll>
      </div>
      <div v-show="!loadingFlag && !content" class="no-result-wrapper">
        <no-result title="抱歉，暂无充值活动"></no-result>
      </div>
      <footer v-show="content || loadingFlag">
        <button @click="goCharge">我要充值</button>
      </footer>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getPageChargeActivity} from 'api/biz';

  export default {
    data() {
      return {
        content: '',
        loadingFlag: true,
        code: ''
      };
    },
    created() {
      setTitle('充值活动');
      this.pullUpLoad = null;
      getPageChargeActivity(1, 1).then((data) => {
        this.loadingFlag = false;
        if (data.list.length) {
          this.content = data.list[0].description;
          this.code = data.list[0].code;
        }
      }).catch(() => {
        this.loadingFlag = false;
      });
    },
    methods: {
      goCharge() {
        this.$router.push('/home/charge/charge?code=' + this.code);
      },
      _refreshScroll() {
        setTimeout(() => {
          this.$refs.scroll.refresh();
          let imgs = this.$refs.description.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            let _img = imgs[i];
            if (_img.complete) {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
              continue;
            }
            _img.onload = () => {
              setTimeout(() => {
                this.$refs.scroll.refresh();
              }, 20);
            };
          }
        }, 20);
      }
    },
    watch: {
      content() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll,
      NoResult
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .charge-activity-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .scroll-wrapper {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      bottom: 1.4rem;
      background: #fff;
    }

    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.2rem;
      padding: 0.15rem 0.3rem;
      font-size: 0;
      background: #fff;

      button {
        width: 100%;
        height: 0.9rem;
        line-height: 0.9rem;
        border-radius: 0.1rem;
        font-size: $font-size-large-s;
        color: #fff;
        background-color: $primary-color;
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
