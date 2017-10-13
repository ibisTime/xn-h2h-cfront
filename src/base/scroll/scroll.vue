<template>
  <div class="scroll-content" ref="wrapper">
    <div>
      <slot></slot>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!hasMore && data.length">
            <img src="./end.png" alt=""><span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else-if="hasMore">
            <loading title=""></loading>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Loading from 'base/loading/loading';

  const DIRECTION_H = 'horizontal';
  const DIRECTION_V = 'vertical';

  export default {
    props: {
      data: {
        type: Array,
        default: function () {
          return [];
        }
      },
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      scrollbar: {
        type: null,
        default: false
      },
      pullUpLoad: {
        type: Object,
        default: () => {
          return {
            threshold: 40,
            txt: {
              more: '加载中...',
              noMore: '已经全部加载完毕'
            }
          };
        }
      },
      startY: {
        type: Number,
        default: 0
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      freeScroll: {
        type: Boolean,
        default: false
      },
      hasMore: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        beforePullDown: true,
        pulling: false,
        isPullUpLoad: false
      };
    },
    computed: {
      pullUpTxt() {
        return this.pullUpLoad && this.pullUpLoad.txt && this.pullUpLoad.txt.noMore;
      }
    },
    created() {},
    mounted() {
      setTimeout(() => {
        this.initScroll();
      }, 20);
    },
    methods: {
      initScroll() {
        let options = {
          probeType: this.probeType,
          click: this.click,
          scrollY: this.freeScroll || this.direction === DIRECTION_V,
          scrollX: this.freeScroll || this.direction === DIRECTION_H,
          scrollbar: this.scrollbar,
          pullUpLoad: this.pullUpLoad,
          startY: this.startY,
          freeScroll: this.freeScroll
        };

        this.scroll = new BScroll(this.$refs.wrapper, options);

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos);
          });
        }

        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart');
          });
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad();
        }
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      destroy() {
        this.scroll.destroy();
      },
      forceUpdate() {
        if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false;
          this.scroll.finishPullUp();
          this.refresh();
        } else {
          this.refresh();
        }
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true;
          if (this.hasMore) {
            this.$emit('pullingUp');
          }
        });
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate(true);
        }, this.refreshDelay);
      }
    },
    components: {
      Loading
    }
  };

</script>

<style lang="scss" scoped>

  .scroll-content {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .pullup-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.32rem 0;
    font-size: 0;

    .before-trigger {
      font-size: 0.24rem;

      img {
        width: 0.44rem;
        vertical-align: middle;
      }

      span {
        font-size: 0.24rem;
        color: #999;
        padding-left: 0.1rem;
      }
    }
  }
</style>
