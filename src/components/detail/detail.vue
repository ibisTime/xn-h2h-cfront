<template>
  <transition name="slide">
    <div class="goods-detail-wrapper">
      <scroll>
        <header>
          <div class="top">
            <div class="name">1.5米大床</div>
            <div class="icon-like" :class="likeCls" @click="collection"></div>
          </div>
          <div class="center">
            <span class="unit">¥</span>
            <span class="price">100</span>
            <span class="text">原价¥100</span>
            <span class="text">运费¥10</span>
            <span class="text fr">浏览99</span>
          </div>
          <div class="bottom">
            <div class="inner">
              <i class="icon icon-addr"></i>
              <span>杭州 | 萧山</span>
              <i class="icon icon-right"></i>
            </div>
          </div>
        </header>
        <div class="description">
          <div class="text-content" :class="textCls">哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的哪日对粉丝的</div>
          <div class="up-down">展开<i class="icon down"></i></div>
          <div class="pic-wrapper">
            <div class="normal-pic">
              <img v-for="item in noramlPic" :src="item"/>
            </div>
            <div class="special-pic">
              <div class="spec-item" v-for="item in specialPic">
                <div class="inner" :style="getSyl(item)"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="img"><img src="./demo@2x.png"/></div>
          <div class="content">
            <div class="name">ISDFSSFF</div>
            <div class="info">90后 金牛座 女生 刚刚来过</div>
          </div>
          <div class="icon-right"></div>
        </div>
        <div class="message">
          <div class="title">互动（1）</div>
          <div v-show="!messages.length" class="no-result">
            <div class="img"></div>
            <div class="text">更多宝贝细节，帮大家问问卖家</div>
            <div class="button"><button>我要留言</button></div>
          </div>
          <ul class="ratings">
            <li class="mine">
              <div class="img"><img src="./demo@2x.png"></div>
              <div class="rating">说点什么吧，看对眼就上</div>
              <div class="button"><button>我要留言</button></div>
            </li>
            <li class="info border-bottom-1px" v-for="item in messages">
              <div class="img"><img src="./demo@2x.png"></div>
              <div class="text">
                <div class="name">{{item.name}}</div>
                <div class="msg">{{item.content}}</div>
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
  import Demo from './demo@2x.png';
  import Scroll from 'base/scroll/scroll';
//  import {formatImg} from 'common/js/util';

  export default {
    data() {
      return {
        noramlPic: [Demo, Demo, Demo],
        specialPic: [Demo, Demo, Demo, Demo],
        messages: [{
          content: '分三大发的',
          name: '爱对方'
        }, {
          content: '分三大发的',
          name: '爱对方'
        }, {
          content: '分三大发的',
          name: '爱对方'
        }],
        isLike: false,
        isShow: false
      };
    },
    computed: {
      likeCls() {
        return this.isLike ? 'active' : '';
      },
      textCls() {
        return this.isShow ? 'show' : '';
      }
    },
    methods: {
      collection() {
        this.isLike = !this.isLike;
      },
      getSyl(pic) {
        return {backgroundImage: `url(${pic})`};
//        return {backgroundImage: `url(${formatImg(pic)})`};
      }
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .goods-detail-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      left: 100%;
    }

    header {
      padding: 0.3rem;
      padding-bottom: 0.32rem;
      background: #fff;

      .top {
        display: flex;
        align-items: flex-start;

        .name {
          flex: 1;
          font-size: $font-size-large;
        }

        .icon-like {
          width: 0.6rem;
          height: 0.6rem;
          background-repeat: no-repeat;
          background-position: right top;
          background-size: 0.34rem;
          @include bg-image('like');

          &.active {
            @include bg-image('like-act');
          }
        }
      }

      .center {
        margin-top: 0.2rem;
        font-size: 0;

        .unit {
          font-size: $font-size-small;
          color: $color-red;
        }

        .price {
          padding-right: 0.3rem;
          font-size: $font-size-large-xxx;
          color: $color-red;
        }

        .text {
          padding-right: 0.1rem;
          font-size: $font-size-medium-s;
          color: $color-text-l;
        }

        .fr {
          float: right;
          margin-top: 0.2rem;
        }
      }

      .bottom {
        margin-top: 0.3rem;
        font-size: 0;

        .inner {
          display: inline-block;
          padding: 0 0.08rem;
          height: 0.46rem;
          line-height: 0.46rem;
          border-radius: 0.23rem;
          background-color: #f2f3f6;
          font-size: 0;

          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 0.44rem;
            height: 0.46rem;
            background-repeat: no-repeat;
            background-position: center;
          }

          .icon-addr {
            background-size: 0.2rem;
            @include bg-image('addr');
          }

          .icon-right {
            background-size: 0.14rem;
            @include bg-image('right');
          }

          span {
            display: inline-block;
            vertical-align: middle;
            max-width: 2.4rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: $font-size-small-s;
            color: $color-text-l;
          }
        }
      }
    }

    .description {
      margin-top: 0.2rem;
      padding: 0.4rem 0.3rem 0.1rem;
      background: #fff;

      .text-content {
        line-height: 1.4;
        font-size: $font-size-medium-x;
        max-height: 2.1rem;
        overflow: hidden;

        &.show {
          max-height: none;
        }
      }

      .up-down {
        padding-top: 0.3rem;
        padding-bottom: 0.34rem;
        text-align: center;
        font-size: $font-size-small;
        color: $color-text-l;

        .icon {
          display: inline-block;
          width: 0.36rem;
          height: 0.24rem;
          background-size: 0.2rem;
          background-repeat: no-repeat;
          background-position: center 0.06rem;
          @include bg-image('down');

          &.up {
            transform: rotate(180deg);
            background-position: center 0;
          }
        }
      }

      .pic-wrapper {
        font-size: 0;
        .normal-pic {
          img {
            margin-bottom: 0.2rem;
            width: 100%;
          }
        }

        .special-pic {
          .spec-item {
            display: inline-block;
            width: 50%;
            height: 3.45rem;
            padding-bottom: 0.2rem;

            &:nth-child(2n+1) {
              padding-right: 0.1rem;
            }

            &:nth-child(2n) {
              padding-left: 0.1rem;
            }

            .inner {
              width: 100%;
              height: 100%;
              background-position: center;
              background-size: cover;
            }
          }
        }
      }
    }

    .card {
      display: flex;
      align-items: center;
      margin: 0.2rem 0.3rem;
      padding: 0 0.3rem;
      height: 1.8rem;
      background: #fff;

      .img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        padding-left: 0.3rem;
        flex: 1;

        .name {
          font-size: $font-size-large-ss;
        }

        .info {
          margin-top: 0.18rem;
          font-size: $font-size-small;
          color: $color-text-l;
        }
      }

      .icon-right {
        display: inline-block;
        width: 0.3rem;
        height: 100%;
        background-position: right center;
        background-size: 0.14rem;
        background-repeat: no-repeat;
        @include bg-image('more');
      }
    }

    .message {
      background: #fff;

      .title {
        padding-top: 0.35rem;
        padding-bottom: 0.02rem;
        padding-left: 0.3rem;
        font-size: $font-size-large-ss;
      }

      .no-result {
        padding: 0.3rem;

        .img {
          height: 2rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 2rem;
          @include bg-image('no-message');
        }

        .text {
          padding: 0.3rem 0;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .button {
          padding-top: 0.06rem;
          padding-bottom: 0.16rem;
          text-align: center;
          font-size: 0;

          button {
            width: 2.1rem;
            line-height: 0.74rem;
            border-radius: 0.1rem;
            font-size: $font-size-medium-x;
            color: #fff;
            background: $primary-color;
          }
        }
      }

      .ratings {
        padding-top: 0.27rem;

        li {
          padding: 0 0.3rem;
          display: flex;
          align-items: center;
          font-size: 0;

          &.mine {
            padding: 0.27rem 0.3rem;
          }

          .img {
            flex: 0 0 0.64rem;
            height: 0.64rem;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
          .rating{
            margin-left: 0.2rem;
            padding-left: 0.24rem;
            flex: 1;
            height: 0.64rem;
            line-height: 0.64rem;
            font-size: $font-size-medium-s;
            background-size: 100% 100%;
            @include bg-image('rating');
          }

          .button{
            flex: 0 0 1.96rem;
            padding-left: 0.2rem;

            button {
              height: 0.64rem;
              line-height: 0.64rem;
              width: 100%;
              border-radius: 0.1rem;
              color: #fff;
              background: $primary-color;
            }
          }

          &.info {
            align-items: flex-start;
            padding-top: 0.27rem;
            .text {
              padding-bottom: 0.27rem;
              margin-left: 0.3rem;
              flex: 1;
              line-height: 1.2;
              @include border-bottom-1px($color-border);
            }

            .name {
              font-size: $font-size-medium;
              color: #808080;
            }

            .msg {
              padding-top: 0.12rem;
              font-size: $font-size-medium-x;
            }
          }

          &:last-child {
            .text {
              @include border-none();
            }
          }
        }
      }
    }
  }
</style>
