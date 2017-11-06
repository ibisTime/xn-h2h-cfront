<template>
  <div class="photo-scroll-wrapper" ref="scrollWrapper"> 
    <div class="scroll-wrapper" ref="photoGroup"> 
      <div class="item" v-for="item in data" ref="photoItem">
        <div class="inner" :style="getBg(item)">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatImg} from 'common/js/util';

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {};
    },
    mounted() {
      setTimeout(() => {
        this._setScrollWidth();
        this._initScroll();
      }, 20);
    },
    methods: {
      _setScrollWidth(isResize) {
        let width = 0;
        let cates = this.$refs.photoItem;
        for(let i = 0; i < cates.length; i++) {
          width += cates[i].clientWidth + 2;
        }
        this.$refs.photoGroup.style.width = width + 1 + 'px';
        if (this.scroll) {
          setTimeout(() => {
            this.scroll.refresh();
          }, 20);
        }
      },
      _initScroll() {
        this.scroll = new BScroll(this.$refs.scrollWrapper, {
          scrollX: true,
          scrollY: false,
          click: false
        });
      },
      getBg(photo) {
        return {
          backgroundImage: `url(${formatImg(photo)})`
        };
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .photo-scroll-wrapper {
    width: 100%;
    height: 2.24rem;
    overflow: hidden;
    .scroll-wrapper {
      white-space: nowrap;

      .item {
        float: left;
        overflow: hidden;
        text-align: center;
        display: inline-block;
        .inner {
          display: inline-block;
          width: 2.24rem;
          height: 2.24rem;
          margin-right: 0.02rem;        
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }      

      }
      
    }
  }  
</style>
