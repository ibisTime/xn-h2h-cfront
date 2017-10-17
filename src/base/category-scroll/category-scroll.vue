<template>
  <div class="category" ref="category">
    <div class="category-group" :style="_getGroupBgColor()" ref="categoryGroup">
      <div
        v-for="(item,index) in categorys"
        :key="index"
        ref="cate"
        @click="_selectItem(index)"
        class="category-item"
        :class="{active: index===currentIndex}"
        :style="_getItemColor(index)">
        {{item.value}}
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  export default {
    props: {
      categorys: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      },
      deColor: {
        type: String,
        default: ''
      },
      acColor: {
        type: String,
        default: ''
      },
      bgColor: {
        type: String,
        default: ''
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initSlider();
        let ele = this.$refs.cate && this.$refs.cate[this.currentIndex];
        ele && this.scroll.scrollToElement(ele, 200, true);
      }, 20);

      window.addEventListener('resize', () => {
        if(!this.scroll) {
          return;
        }
        this._setSliderWidth();
      });
    },
    methods: {
      _selectItem(index) {
        this.scroll.scrollToElement(this.$refs.cate[index], 200, true);
        this.$emit('select', index);
      },
      _getGroupBgColor() {
        if (this.bgColor) {
          return {
            background: this.bgColor
          };
        } else {
          return null;
        }
      },
      _getItemColor(index) {
        if (this.deColor) {
          if (index === this.currentIndex) {
            if (this.acColor) {
              return {
                color: this.acColor
              };
            } else {
              return {
                color: '#beb098'
              };
            }
          }
          return {
            color: this.deColor
          };
        } else {
          return null;
        }
      },
      scrollToEleByIndex(index) {
        this.scroll.scrollToElement(this.$refs.cate[index], 200, true);
      },
      _setSliderWidth() {
        let width = 0;
        let cates = this.$refs.cate;
        for(let i = 0; i < this.categorys.length; i++) {
          width += cates[i].clientWidth;
        }
        this.$refs.categoryGroup.style.width = width + 1 + 'px';
        if (this.scroll) {
          setTimeout(() => {
            this.scroll.refresh();
          }, 20);
        }
      },
      _initSlider() {
        this.scroll = new BScroll(this.$refs.category, {
          scrollX: true,
          scrollY: false,
          click: true
        });
      }
    },
    watch: {
      categorys() {
        setTimeout(() => {
          this._setSliderWidth();
        }, 20);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/variable";

  .category {
    min-height: 1px;

    .category-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      color: $color-text;
      background: #fff;

      .category-item {
        float: left;
        text-align: center;
        font-size: $font-size-medium;
        padding: 0 0.3rem;

        &.active {
          color: $primary-color;
        }
      }
    }
  }
</style>
