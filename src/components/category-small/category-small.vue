<template>
  <transition name="small-fade">
    <div v-show="showFlag" class="small-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :data="smallList" :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="title">商品类别</div>
          <div class="items">
            <div v-for="(item,index) in smallList"
                 @click="choseSmall(item.code)"
                 class="item"
                 :class="smallCls(item.code)">{{item.name}}</div>
          </div>
        </scroll>
        <div class="footer" @click.stop>
          <div class="reset" @click="reset">重置</div>
          <div class="confirm" @click="confirm">确认</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';

  export default {
    props: {
      outSmallCode: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        showFlag: false,
        smallList: [{
          name: '毛衣',
          code: 'x'
        }, {
          name: '毛衣1',
          code: 'xx'
        }, {
          name: '毛衣2',
          code: 'xxx'
        }, {
          name: '毛衣3',
          code: 'xxxx'
        }, {
          name: '毛衣4',
          code: 'xxxxx'
        }, {
          name: '毛衣5',
          code: 'xxxxxx'
        }, {
          name: '毛衣6',
          code: 'xxxxxxx'
        }],
        smallCode: ''
      };
    },
    created() {
      this.pullUpLoad = null;
    },
    methods: {
      initData() {
        this.smallCode = this.outSmallCode;
      },
      choseSmall(code) {
        this.smallCode = this.smallCode === code ? '' : code;
      },
      reset() {
        this.smallCode = '';
      },
      confirm() {
        this.hide();
        let smallName = '全部';
        if (this.smallCode) {
          this.smallList.forEach((item) => {
            if (item.code === this.smallCode) {
              smallName = item.name;
            }
          });
        }
        this.$emit('confirm', this.smallCode, smallName);
      },
      hide() {
        this.showFlag = false;
      },
      show() {
        this.showFlag = true;
        this.initData();
      },
      smallCls(code) {
        return this.smallCode === code ? 'active' : '';
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .small-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);

    &.small-fade-enter-active {
      animation: small-fadein 0.3s;
      .content {
        animation: small-slide 0.3s;
      }
    }

    .content {
      position: absolute;
      right: 0;
      height: 100%;
      width: 6.7rem;
      padding-right: 0.3rem;
      font-size: $font-size-medium-s;
      background: #fff;

      .title {
        padding-top: 0.25rem;
        padding-left: 0.2rem;
      }

      .items {
        padding-top: 0.3rem;

        .item {
          display: inline-block;
          margin-left: 0.2rem;
          margin-bottom: 0.2rem;
          min-width: 1.8rem;
          height: 0.6rem;
          line-height: 0.6rem;
          border-radius: 0.05rem;
          text-align: center;
          background: #f2f3f7;

          &.active {
            color: $primary-color;
            background: #eaf6fe;
          }
        }
      }

      .footer {
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 0.9rem;
        line-height: 0.9rem;
        font-size: $font-size-medium-xx;

        .reset {
          flex: 1;
          text-align: center;
          color: $color-text-l;
          background: #f2f3f7;
        }

        .confirm {
          width: 4.5rem;
          text-align: center;
          color: #fff;
          background: $primary-color;
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
      transform: translate3d(100%, 0, 0);
    }
    50% {
      ransform: translate3d(50%, 0, 0);
    }
    100% {
      ransform: translate3d(0, 0, 0);
    }
  }
</style>
