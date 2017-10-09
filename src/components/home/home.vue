<template>
  <div class="home-wrapper">
    <scroll>
      <div class="slider-wrapper">
        <slider :loop="loop">
          <div class="home-slider" v-for="item in banners" :key="item.code">
            <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
          </div>
        </slider>
      </div>
      <div class="cates-wrapper">
        <div class="cate-item">
          <i class="cate-icon activity-icon"></i>
          <p>优惠活动</p>
        </div>
        <div class="cate-item">
          <i class="cate-icon recharge-icon"></i>
          <p>充值</p>
        </div>
        <router-link to="/home/recommend" class="cate-item" tag="div">
          <i class="cate-icon invitation-icon"></i>
          <p>邀请好友</p>
        </router-link>
      </div>
      <div class="notice-wrapper">
        <div class="notice">
          <i class="icon-title"></i>
          <div class="content">头条头体哦啊三大发</div>
          <i class="icon-right"></i>
        </div>
      </div>
      <div class="trade-wrapper">
        <div class="trade-icon"></div>
      </div>
      <div class="split"></div>
      <div class="mall-cates border-bottom-1px">
        <div class="item active">
          <div class="text">热门推荐</div>
        </div>
        <div class="item">
          <div class="text">附近商品</div>
        </div>
      </div>
      <div class="mall-content">
        <ul class="content">
          <li>
            <div class="img-wrap">
              <img src="./demo@2x.png"/>
            </div>
            <div class="info">
              <h2>标题标题标题标题标题标题标题标题标题标题标题标题标题标题</h2>
              <div class="label">
                <label>来自电脑</label>
                <label>全新</label>
              </div>
              <div class="price">
                <label>¥</label>39.00<span>原价：¥49</span>
              </div>
              <div class="addr">杭州 | 萧山</div>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
    <m-footer></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import MFooter from 'components/m-footer/m-footer';
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
          }
        ]
      };
    },
    created() {
      this.loop = true;
    },
    methods: {
      getImgSyl(imgs) {
        return {
          backgroundImage: `url(${formatImg(imgs)})`
        };
      }
    },
    components: {
      MFooter,
      Slider,
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .home-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;

    .slider-wrapper {
      position: relative;
      height: 3.7rem;

      .slider, .home-slider {
        height: 100%;
      }

      a {
        display: block;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }

    .cates-wrapper {
      height: 1.74rem;
      background: #fff;
      display: flex;
      align-items: center;

      .cate-item {
        flex: 1;
        text-align: center;
        font-size: 0;

        .cate-icon {
          display: inline-block;
          width: 0.9rem;
          height: 0.9rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;

          &.activity-icon {
            @include bg-image('activity');
          }

          &.recharge-icon {
            @include bg-image('recharge');
          }

          &.invitation-icon {
            @include bg-image('invitation');
          }
        }

        p {
          padding-top: 0.2rem;
          font-size: $font-size-small;
        }
      }
    }

    .notice-wrapper {
      height: 1rem;
      padding: 0 0.3rem;
      background-color: #fff;

      .notice {
        height: 100%;
        display: flex;
        align-items: center;
        border: 1px solid #e6e6e6;

        i {
          display: inline-block;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;

          &.icon-title {
            width: 1.1rem;
            background-size: 0.7rem;
            @include bg-image('notice');
          }

          &.icon-right {
            width: 0.54rem;
            background-size: 0.14rem;
            @include bg-image('more');
          }
        }

        .content {
          flex: 1;
          font-size: $font-size-medium;
          padding-left: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .trade-wrapper {
      background-color: #fff;
      padding: 0 0 0.1rem;

      .trade-icon {
        height: 1.6rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        @include bg-image('trade');
      }
    }

    .split {
      height: 0.2rem;
    }

    .mall-cates {
      display: flex;
      line-height: 0.9rem;
      height: 0.9rem;
      background-color: #fff;
      @include border-bottom-1px(#eee)

      .item {
        flex: 1;
        text-align: center;
        font-size: 0;

        .text {
          display: inline-block;
          position: relative;
          font-size: $font-size-medium-x;
        }

        &.active {
          .text {
            color: $primary-color;

            &:after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 3px;
              background-color: $primary-color;
            }
          }
        }
      }
    }

    .mall-content {
      background: #fff;

      li {
        display: flex;
        padding: 0.3rem;

        .img-wrap {
          width: 2.4rem;
          flex: 0 0 2.4rem;
          height: 2.4rem;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .info {
          padding: 0.1rem 0 0.1rem 0.2rem;

          h2 {
            line-height: 1.2;
            font-size: $font-size-medium;
          }

          .label {
            margin-top: 0.18rem;
            font-size: 0;

            label {
              display: inline-block;
              vertical-align: top;
              padding: 0.08rem 0.12rem;
              border-radius: 3px;
              font-size: 0.22rem;

              &+label {
                margin-left: 0.2rem;
              }

              &:nth-child(2n) {
                color: $primary-color;
                border: 1px solid $primary-color;
              }

              &:nth-child(2n + 1) {
                color: $second-color;
                border: 1px solid $second-color;
              }
            }
          }

          .price {
            margin-top: 0.22rem;
            font-size: $font-size-large-s;

            label {
              font-size: $font-size-small-s;
            }

            span {
              padding-left: 0.35rem;
              font-size: $font-size-small-s;
              color: $color-text-l;
            }
          }

          .addr {
            margin-top: 0.18rem;
            padding-left: 0.28rem;
            font-size: $font-size-small-s;
            color: $color-text-l;
            background-repeat: no-repeat;
            background-position: left center;
            background-size: 0.2rem;
            @include bg-image('addr');
          }
        }
      }
    }
  }
</style>
