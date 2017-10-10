<template>
  <transition name="slide-up">
    <div class="publish-wrapper">
      <m-header :border="border" title="发布" actText="取消" :showBack="showBack" @action="close"></m-header>
      <div class="main">
        <div class="photos-wrapper">
          <photo-scroll @updatePhotos="updatePhotos" :photos="photos"></photo-scroll>
        </div>
        <div class="split"></div>
        <div class="desc-wrapper">
          <div class="title">
            <input type="text" v-model="name" placeholder="商品名称">
          </div>
          <div class="desc">
            <textarea rows="4" placeholder="在这里写下宝贝的广告语吧" v-model="description"></textarea>
          </div>
          <div class="addr">
            <span>杭州 余杭</span>
            <div @click.stop="choseNew" class="new" :class="newCls">全新宝贝</div>
          </div>
        </div>
        <div class="split"></div>
        <div class="infos">
          <div class="info-item border-bottom-1px" @click="goCate">分类<div class="label icon-right">选择分类</div></div>
          <div class="info-item border-bottom-1px" @click="showPrice">价格
            <div class="label" :class="sellCls">{{sellText}}</div>
          </div>
          <div class="info-item">同步到圈子<div class="label">
            <switch-option class="option"></switch-option>
          </div></div>
        </div>
        <div class="bottom-btn">
          <button @click="publish">发布</button>
        </div>
      </div>
      <price-mask ref="priceMask" @confirm="updatePrice"></price-mask>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import SwitchOption from 'base/switch-option/switch-option';
  import MHeader from 'components/m-header/m-header';
  import PhotoScroll from 'components/photo-scroll/photo-scroll';
  import PriceMask from 'components/price-mask/price-mask';
  import {mapMutations, mapGetters} from 'vuex';
  import {SET_PUBLISH_MALL_CATE} from 'store/mutation-types';
  import {isUnDefined} from 'common/js/util';

  export default {
    data() {
      return {
        photos: [],
        name: '',
        description: '',
        isNew: false,
        sellPrice: '',
        oriPrice: '',
        freight: '',
        isFree: false
      };
    },
    created() {
      this.showBack = false;
      this.border = true;
      this.setMallCate([]);
    },
    computed: {
      newCls() {
        return this.isNew ? 'active' : '';
      },
      sellCls() {
        return isUnDefined(this.sellPrice) ? '' : 'text';
      },
      sellText() {
        return isUnDefined(this.sellPrice) ? '开个价' : this.sellPrice;
      },
      ...mapGetters([
        'publishMallCate'
      ])
    },
    methods: {
      choseNew() {
        this.isNew = !this.isNew;
      },
      goCate() {
        this.$router.push(this.$route.path + '/cate');
      },
      showPrice() {
        this.$refs.priceMask.show();
      },
      updatePhotos(photos) {
        this.photos = photos;
      },
      updatePrice(sellPrice, oriPrice, freight, isFree) {
        this.sellPrice = sellPrice;
        this.oriPrice = oriPrice;
        this.freight = freight;
        this.isFree = isFree;
      },
      publish() {
        console.log('click');
      },
      close() {
        this.$router.back();
      },
      ...mapMutations({
        setMallCate: SET_PUBLISH_MALL_CATE
      })
    },
    components: {
      MHeader,
      Scroll,
      PriceMask,
      PhotoScroll,
      SwitchOption
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .publish-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #fff;

    .main {
      position: absolute;
      top: 0.88rem;
      left: 0;
      width: 100%;
      bottom: 0;
      background-color: $color-background;

      .split {
        height: 0.2rem;
      }

      .desc-wrapper {
        padding: 0.45rem 0.3rem 0;
        background-color: #fff;

        .title {
          font-size: $font-size-large;

          input {
            width: 100%;
          }
        }

        .desc {
          padding-top: 0.32rem;
          font-size: $font-size-medium-x;

          textarea {
            width: 100%;
          }
        }

        .addr {
          display: flex;
          padding: 0.2rem 0 0.2rem 0.3rem;
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 0.22rem;
          @include bg-image('addr');
          font-size: $font-size-medium-x;

          span {
            flex: 1;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .new {
            padding-left: 0.4rem;
            font-size: $font-size-medium;
            background-repeat: no-repeat;
            background-position: left center;
            background-size: 0.3rem;
            @include bg-image('chose');

            &.active {
              @include bg-image('chose-act');
            }
          }
        }
      }

      .infos {
        background-color: #fff;

        .info-item {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-medium-x;
          padding: 0 0.3rem;

          &.border-bottom-1px {
            @include border-bottom-1px(#eee);
          }

          .label {
            float: right;
            color: $color-text-l;

            &.icon-right {
              padding-right: 0.3rem;
              background-repeat: no-repeat;
              background-size: 0.14rem;
              background-position: right center;
              @include bg-image('more');
            }

            .option {
              margin-top: 0.19rem;
            }

            &.text {
              color: $color-text;
            }
          }
        }
      }

      .bottom-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.2rem;
        padding: 0.15rem 0.3rem;
        font-size: 0;
        background-color: #fff;

        button {
          width: 100%;
          height: 0.9rem;
          border-radius: 0.1rem;
          text-align: center;
          font-size: $font-size-large;
          color: #fff;
          background-color: $primary-color;
        }
      }
    }

    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all 0.3s;
    }
    &.slide-up-enter, &.slide-up-leave-to {
      transform: translate3d(0, 100%, 0);
    }
  }
</style>
