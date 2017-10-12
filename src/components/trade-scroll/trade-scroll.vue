<template>
  <div class="photo-scroll-wrapper" ref="scrollWrapper"> 
    <div class="scroll-wrapper" ref="photoGroup"> 
      <div class="item" v-for="(photo,index) in photos" ref="photoItem">
        <div class="inner" :style="getBg(photo)">
          <!-- <div v-if="index===0" class="title">图....</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatImg} from 'common/js/util';

  export default {
    data() {
      return {
        photos: [
          {
            key: '498b20a8-88bf-4e45-9ca4-1338b9abd0e4.jpg',
            ok: false,
            preview: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg',
            type: 'image/jpeg'
            // photo: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg'
          },
          {
            key: '498b20a8-88bf-4e45-9ca4-1338b9abd0e4.jpg',
            ok: false,
            preview: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg',
            type: 'image/jpeg'
            // photo: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg'
          },
          {
            key: '498b20a8-88bf-4e45-9ca4-1338b9abd0e4.jpg',
            ok: false,
            preview: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg',
            type: 'image/jpeg'
            // photo: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg'
          },
          {
            key: '498b20a8-88bf-4e45-9ca4-1338b9abd0e4.jpg',
            ok: false,
            preview: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg',
            type: 'image/jpeg'
            // photo: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg'
          }
        ],
        currentPageIndex: 0
      };
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

        for(let i = 0; i < this.photos.length; i++) {
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
          click: true
        });
      },
      getBg(photo) {
        let url = photo.preview || formatImg(photo.key);
        return {
          backgroundImage: `url(${url})`
        };
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .photo-scroll-wrapper {
    height: 100%;
    overflow: hidden;

    .scroll-wrapper {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        .inner {
          position: relative;
          display: inline-block;
          width: 2.24rem;
          height: 2.24rem;
          margin-right: 0.02rem;        
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        
        .title {
          display: block;
          width: 2.24rem;
          height: 2.24rem;
        }        

      }
      
    }
  }  
</style>
