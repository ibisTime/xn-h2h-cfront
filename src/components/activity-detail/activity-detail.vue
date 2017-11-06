<template>
  <transition name="slide">
    <div class="charge-activity-wrapper">
      <div class="scroll-wrapper">
        <scroll ref="scroll" :pullUpLoad="pullUpLoad">
          <div ref="description" class="rich-text-description">
            <div v-html="content"></div>
          </div>
        </scroll>
      </div>
      <footer>
        <button @click="goPublish">我要报名</button>
      </footer>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex';
  import {SET_CURRENT_ACTIVITY} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import {setTitle} from 'common/js/util';
  import {getDiscountActivity} from 'api/biz';

  export default {
    computed: {
      content() {
        return this.currentActivity && this.currentActivity.description || '';
      },
      ...mapGetters([
        'currentActivity'
      ])
    },
    created() {
      this.first = true;
      this.pullUpLoad = null;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData () {
        if (/\/user\/activity\/[^/]+$/.test(this.$route.path)) {
          setTitle('活动');
          return this.first;
        }
        return false;
      },
      getInitData () {
        if (this.shouldGetData()) {
          this.first = false;
          this.getActivity();
        }
      },
      getActivity() {
        if (!this.currentActivity) {
          getDiscountActivity(this.$route.params.id).then((data) => {
            this.setCurActivity(data);
          });
        } else {
          setTimeout(() => {
            this._refreshScroll();
          }, 20);
        }
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
      },
      goPublish() {
        this.$router.push(this.$route.path + '/publish?act=' + this.$route.params.id);
      },
      ...mapMutations({
        setCurActivity: SET_CURRENT_ACTIVITY
      })
    },
    watch: {
      currentActivity() {
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
      display: flex;
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
