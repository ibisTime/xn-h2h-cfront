<template>
  <transition name="filter-fade">
    <div v-show="showFlag" class="filters-wrapper" @click="hide">
      <div class="content" @click.stop>
        <scroll :pullUpLoad="pullUpLoad" ref="scroll">
          <div class="title">快捷筛选（可多选）</div>
          <div class="items">
            <div class="item" :class="freeCls" @click="choseFree">包邮</div>
            <div class="item" :class="newCls" @click="choseNew">全新</div>
          </div>
          <div class="title">价格范围</div>
          <div class="price-select">
            <div class="price"><input type="tel" @input="handleMinInput" v-model="minPrice"/></div>
            <div class="split"></div>
            <div class="price"><input type="tel" @input="handleMaxInput" v-model="maxPrice"/></div>
          </div>
          <div class="items">
            <div v-for="(item,index) in priceList"
                 @click="chosePrice(index)"
                 class="item"
                 :class="priceCls(index)">{{item.text}}</div>
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
  import {isUnDefined} from 'common/js/util';

  export default {
    props: {
      outMinPrice: {
        type: String,
        default: ''
      },
      outMaxPrice: {
        type: String,
        default: ''
      },
      outPriceIndex: {
        type: Number,
        default: -1
      },
      outIsFree: {
        type: Boolean,
        default: false
      },
      outIsNew: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showFlag: false,
        priceIndex: -1,
        minPrice: '',
        maxPrice: '',
        isFree: false,
        isNew: false
      };
    },
    computed: {
      freeCls() {
        return this.isFree ? 'active' : '';
      },
      newCls() {
        return this.isNew ? 'active' : '';
      }
    },
    created() {
      this.priceList = [{
        text: '100元以下',
        value: '100000'
      }, {
        text: '300元以下',
        value: '300000'
      }, {
        text: '500元以下',
        value: '500000'
      }, {
        text: '1000元以下',
        value: '1000000'
      }, {
        text: '2000元以下',
        value: '2000000'
      }, {
        text: '3000元以下',
        value: '3000000'
      }];
      this.pullUpLoad = null;
    },
    methods: {
      isUndefined(value) {
        return isUnDefined(value);
      },
      initData() {
        this.isFree = this.outIsFree;
        this.isNew = this.outIsNew;
        this.priceIndex = this.outPriceIndex;
        if (~this.priceIndex) {
          this.minPrice = '';
          this.maxPrice = '';
        } else {
          if (!this.isUndefined(this.outMinPrice)) {
            this.minPrice = +this.outMinPrice / 1000;
          }
          if (!this.isUndefined(this.outMaxPrice)) {
            this.maxPrice = +this.outMaxPrice / 1000;
          }
        }
      },
      choseFree() {
        this.isFree = !this.isFree;
      },
      choseNew() {
        this.isNew = !this.isNew;
      },
      chosePrice(index) {
        this.priceIndex = this.priceIndex === index ? -1 : index;
        this.minPrice = this.maxPrice = '';
      },
      reset() {
        this.minPrice = this.maxPrice = '';
        this.isFree = this.isNew = false;
        this.priceIndex = -1;
      },
      confirm() {
        this.hide();
        let min = this.minPrice;
        let max = this.maxPrice;
        if (~this.priceIndex) {
          min = '0';
          max = this.priceList[this.priceIndex].value;
        } else {
          if (this.isUndefined(min) || this.isUndefined(max)) {
            if (!this.isUndefined(min)) {
              min = +min * 1000 + '';
            }
            if (!this.isUndefined(max)) {
              max = +max * 1000 + '';
            }
          } else {
            min = +min * 1000;
            max = +max * 1000;
            if (min > max) {
              [min, max] = [max + '', min + ''];
            } else {
              min += '';
              max += '';
            }
          }
        }
        this.$emit('confirm', min, max, this.priceIndex, this.isFree, this.isNew);
      },
      handleMinInput() {
        this.priceIndex = -1;
        this.minPrice = this.minPrice.replace(/[^\d]+/ig, '');
      },
      handleMaxInput() {
        this.priceIndex = -1;
        this.maxPrice = this.maxPrice.replace(/[^\d]+/ig, '');
      },
      hide() {
        this.showFlag = false;
      },
      show() {
        this.showFlag = true;
        this.initData();
      },
      priceCls(index) {
        return this.priceIndex === index ? 'active' : '';
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";

  .filters-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.6);

    &.filter-fade-enter-active {
      animation: filter-fadein 0.3s;
      .content {
        animation: filter-slide 0.3s;
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

      .price-select {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 0.46rem;
        margin-top: 0.35rem;
        padding-left: 0.2rem;
        height: 0.6rem;

        .price {
          display: flex;
          align-items: center;
          padding: 0 0.1rem;
          width: 2.6rem;
          height: 100%;
          border: 1px solid #dedede;

          input {
            width: 100%;
          }
        }

        .split {
          width: 0.2rem;
          flex: 0 0 0.2rem;
          height: 1px;
          background: #dedede;
        }
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

  @keyframes filter-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes filter-slide {
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
