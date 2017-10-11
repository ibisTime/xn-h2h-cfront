<template>
  <div class="trades-wrapper">
    <scroll>
      <ul>
        <li  class="trade-wrapper">
          <div class="trade-top">
            <div class="head-pic"></div>
            <div class="person-info">
              <div class="name">群群</div>
              <div class="area">
                <span>大连 </span>|<span> 5小时前来过</span>
              </div>
            </div>
            <div class="clothes">来自服装</div>
          </div>
          <div class="slider-wrapper">
            <slider :showDots="showDots" :autoPlay="autoPlay">
              <div class="pic-slider" v-for="item in banners" :key="item.code">
                <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
              </div>
            </slider>
          </div>
          <div class="trade-bottom">
            <div>女款连衣裙 尺码:XL | 身高:160-175 胸围:85-...</div>
            <div class="goods-price">￥<span>20</span></div>
            <ul class="operate-icon">
              <li class="want"></li>
              <li class="message"></li>
              <li class="more"></li>
            </ul>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import {formatImg} from 'common/js/util';
  export default {
    data() {
      return {
        banners: [
          {
            url: '',
            pic: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-23_1506124776097.jpg'
          },
          {
            url: '',
            pic: 'http://opf6b9y6y.bkt.clouddn.com/0907修改内容-25_1506124833120.jpg'
          },
          {
            url: '',
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
    created() {
      this.showDots = false;
      this.autoPlay = false;
    },
    methods: {
      getImgSyl(imgs) {
        return {
          backgroundImage: `url(${formatImg(imgs)})`
        };
      }
    },
    components: {
      Scroll,
      Slider
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";
  .trades-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F5F5F5;
    overflow: scroll;
    .trade-wrapper{
      border-top: 1px solid #eee;
      background: #fff;
      width: 100%;
      font-size: $font-size-medium-x;

      .trade-top{
        display: flex;
        height: 1.5rem;

        .head-pic{
          width: 0.9rem;
          height: 0.9rem;
          margin: 0.3rem 0.24rem 0.2rem 0.3rem;
          @include bg-image('th');
          background-size: 100% 100%;
          border-radius: 50%;
        }
        
        .person-info{
          flex: 2;
          padding-top: 0.45rem;
          .name{
            color: #484848;
          }

          .area{
            margin-top: 0.1rem;
            color: #999899;
            font-size: $font-size-small;            
          }
        }

        .clothes{ 
          margin-right: 0.3rem;
          line-height: 1.5rem;
          color: #48b0fb;         
        }
      }

      .slider-wrapper {
        position: relative;
        height: 2.24rem;
        margin-left: 0.3rem;
        overflow: hidden;

        .slider, .pic-slider {
          height: 2.24rem;
          width: 2.24rem;
        }

        a {
          display: block;
          height: 2.24rem;
          width: 2.24rem;
          display: inline-block;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }      
    
      .trade-bottom{
        margin:0.2rem 0.3rem 0;
        color: #484848;

        .goods-price{
          margin: 0.3rem 0;
          display: inline-block;
          width: 30%;
          color: #ff5000;
          font-size: $font-size-small;
          span{
            font-size: $font-size-large-xx;
          }
        }

        .operate-icon{
          display: inline-block;
          float: right;
          li{
            float: left;
            width: 0.52rem;
            height:0.45rem;            
            background-repeat: no-repeat;
            background-position: center;
            margin-left: 0.4rem;
            margin-top: 0.3rem;            
          }
          .want{
            @include bg-image('want');
          }
          .message{
            @include bg-image('message');
          }          
          .more{
            @include bg-image('more');
          }          
        }

      }

    }
  }
</style>
