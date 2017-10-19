<template>
  <transition name="slide">
    <div class="about-wrapper">
      <scroll ref="scroll" :hasMore="loadingFlag">
        <div ref="description" class="rich-text-description">
          <div v-html="content"></div>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import {setTitle} from 'common/js/util';
  import {getUserSystemConfig} from 'api/general';

  export default {
    data() {
      return {
        content: '',
        loadingFlag: true
      };
    },
    created() {
      setTitle('使用说明');
      this.pullUpLoad = null;
      getUserSystemConfig('cardsTradition').then((data) => {
        this.loadingFlag = false;
        this.content = data.cvalue;
      }).catch(() => {
        this.loadingFlag = false;
      });
    },
    methods: {
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
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .about-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;

    .rich-text-description {
      a {
        line-height: 1;
        color: $color-text;
        text-decoration: underline;
      }
    }

    .other-info {
      padding-top: 0.6rem;

      p {
        line-height: 1;
      }
    }
  }
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
