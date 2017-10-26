<template>
  <transition name="slide">
    <div class="rule-wrapper">
      <scroll ref="scroll" :hasMore="loadingFlag">
        <div ref="description" class="rich-text-description">
          <div v-html="text"></div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import {setTitle} from 'common/js/util';
  import {getUserSystemConfig} from 'api/general';

  export default {
    data () {
      return {
        text: '',
        loadingFlag: true
      };
    },
    created() {
      setTitle('签到规则');
      this.showRule();
    },
    methods: {
      showRule () {
        getUserSystemConfig('signRegulation').then((data) => {
          this.loadingFlag = false;
          this.text = data.cvalue;
        }).catch(() => {
          this.loadingFlag = false;
        });
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
      text() {
        this._refreshScroll();
      }
    },
    components: {
      Scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .rule-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    .rule-content{
      font-size: 0.24rem;
    }
  }
</style>
