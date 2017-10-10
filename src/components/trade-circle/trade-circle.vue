<template>
  <div class="trades-wrapper">
    <scroll>
      <ul v-if="currentList">
        <li  class="trade-wrapper">
          <div class="trade-top">
            <div class="head-pic"></div>
            <div >
              <div>群群</div>
              <div>
                <span>大连</span>|<span>5小时前来过</span>
              </div>
            </div>
            <div >来自服装</div>
          </div>
          <!-- <div class="slider-wrapper">
            <slider :loop="loop">
              <div class="pic-slider" v-for="item in banners" :key="item.code">
                <a :href="item.url||'javascript:void(0)'" :style="(item.pic)"></a>
              </div>
            </slider>getImgSyl
          </div> -->
          <div></div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';

  export default {
    data() {
      return {
        banners: [
          {
            url: 'https://www.baidu.com',
            pic: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg'
          },
          {
            url: '',
            pic: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg'
          }
        ],
        currentList: true
      };
    },
    computed: {
      textCls() {
        return this.isAlert ? 'alert' : '';
      }
    },
    methods: {},
    components: {
      Scroll
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/variable";
  .trades-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: scroll;
    .trade-wrapper{
      border-top: 1px solid #eee;
      .trade-top{
        width: 100%;

      }
    }
  }
</style>
