<template>
  <div class="home-wrapper">
    <scroll :data="currentList" :hasMore="hasMore" @pullingUp="getPageData">
      <div class="slider-wrapper">
        <slider v-if="banners.length" :loop="loop">
          <div class="home-slider" v-for="item in banners" :key="item.code">
            <a :href="item.url||'javascript:void(0)'" :style="getImgSyl(item.pic)"></a>
          </div>
        </slider>
        <router-link tag="div" to="/home/sign" class="sign-wrapper">
          <i class="sign-icon"></i>
        </router-link>
      </div>
      <div class="cates-wrapper">
        <router-link tag="div" to="/category/list?act=1" class="cate-item">
          <i class="cate-icon activity-icon"></i>
          <p>优惠活动</p>
        </router-link>
        <router-link tag="div" to="/home/charge" class="cate-item">
          <i class="cate-icon recharge-icon"></i>
          <p>充值</p>
        </router-link>
        <router-link to="/home/recommend" class="cate-item" tag="div">
          <i class="cate-icon invitation-icon"></i>
          <p>邀请好友</p>
        </router-link>
      </div>
      <div class="notice-wrapper">
        <router-link tag="div" to="/home/notice" class="notice">
          <i class="icon-title"></i>
          <div class="content">{{noticeContent}}</div>
          <i class="icon-right"></i>
        </router-link>
      </div>
      <router-link to="/home/trade" tag="div">
        <div class="trade-wrapper">
          <div class="trade-icon" :style="getImgSyl(tradeIcon)"></div>
        </div>
      </router-link>
      <div class="split"></div>
      <div class="mall-cates border-bottom-1px">
        <div class="item" :class="item0Cls" @click="selectCategory(0)">
          <div class="text">热门推荐</div>
        </div>
        <div class="item" :class="item1Cls" @click="selectCategory(1)">
          <div class="text">附近商品</div>
        </div>
      </div>
      <div class="mall-content">
        <mall-items :data="currentList"></mall-items>
        <no-result v-show="!currentList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
      </div>
    </scroll>
    <toast ref="toast" :text="text"></toast>
    <m-footer @goPublish="goPublish"></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import Toast from 'base/toast/toast';
  import NoResult from 'base/no-result/no-result';
  import MFooter from 'components/m-footer/m-footer';
  import MallItems from 'components/mall-items/mall-items';
  import {formatImg, setTitle, getShareImg} from 'common/js/util';
  import {initShare} from 'common/js/weixin';
  import {getPageGoods, getPageNearbyGoods} from 'api/biz';
  import {getBannerList, getPageSysNotices, getTradeIconRule} from 'api/general';

  export default {
    data() {
      return {
        banners: [],
        tradeIcon: '',
        hasMore: true,
        currentIndex: 0,
        goodsObj: {},
        config: [{
          start: 1,
          limit: 10,
          location: 1,
          hasMore: true
        }, {
          start: 1,
          limit: 10,
          longitude: 0,
          latitude: 0,
          hasMore: true
        }],
        currentList: [],
        notice: null,
        text: ''
      };
    },
    created() {
      this.first = true;
      this.loop = true;
      this.isWxConfiging = false;
      this.wxData = null;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    computed: {
      item0Cls() {
        return this.currentIndex === 0 ? 'active' : '';
      },
      item1Cls() {
        return this.currentIndex === 1 ? 'active' : '';
      },
      noticeContent() {
        return this.notice && this.notice.smsTitle || '暂无公告';
      },
      ...mapGetters([
        'location',
        'isLocaErr'
      ])
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/home') {
          setTitle('二手买卖');
          // 当前页面,并且微信sdk未初始化
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          return this.first;
        }
        return false;
      },
      getInitWXSDKConfig() {
        this.isWxConfiging = true;
        initShare({
          title: '我淘网',
          desc: '二手买卖',
          link: location.href,
          imgUrl: getShareImg()
        }, (data) => {
          this.isWxConfiging = false;
          this.wxData = data;
        }, () => {
          this.isWxConfiging = false;
          this.wxData = null;
        });
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          this.getBannerList();
          this.getPageGoods();
          this.getPageNotices();
          this.getTradeIcon();
        }
      },
      getPageGoods() {
        getPageGoods({
          ...this.config[0]
        }).then((data) => {
          this.goodsObj[0] = this.goodsObj[0] || [];
          this.goodsObj[0] = this.goodsObj[0].concat(data.list);
          if (data.list.length < 10 || data.totalCount <= 10) {
            this.config[0].hasMore = false;
            if (this.currentIndex === 0) {
              this.hasMore = this.config[0].hasMore;
              this.currentList = this.goodsObj[0];
            }
            this.config[0].start++;
          }
        });
      },
      getPageNearbyGoods() {
        getPageNearbyGoods({
          ...this.config[1]
        }).then((data) => {
          this.goodsObj[1] = this.goodsObj[1] || [];
          this.goodsObj[1] = this.goodsObj[1].concat(data.list);
          if (data.list.length < 10 || data.totalCount <= 10) {
            this.config[1].hasMore = false;
            if (this.currentIndex === 1) {
              this.hasMore = this.config[1].hasMore;
              this.currentList = this.goodsObj[1];
            }
            this.config[1].start++;
          }
        });
      },
      getBannerList() {
        return getBannerList().then((data) => {
          this.banners = data;
        });
      },
      getPageNotices() {
        if (this.hasMore) {
          getPageSysNotices(1, 1).then((data) => {
            if (data.list.length) {
              this.notice = data.list[0];
            }
          });
        }
      },
      getTradeIcon() {
        return getTradeIconRule('tradeImg').then((data) => {
          this.tradeIcon = data.cvalue;
        });
      },
      selectCategory(index) {
        this.currentIndex = index;
        this.hasMore = this.config[index].hasMore;
        this.currentList = this.goodsObj[index] || [];
        if (!this.goodsObj[index]) {
          if (index === 1) {
            if (this.location) {
              this.config[1].longitude = this.location.position.lng;
              this.config[1].latitude = this.location.position.lat;
              this.getPageNearbyGoods();
            } else if (this.isLocaErr) {
              this.text = '定位失败';
              this.$refs.toast.show();
            } else {
              this.text = '定位中...';
              this.$refs.toast.show();
            }
          } else {
            this.getPageGoods();
          }
        }
      },
      getPageData() {
        if (this.currentIndex === 1) {
          this.getPageNearbyGoods();
        } else {
          this.getPageGoods();
        }
      },
      goPublish() {
        this.$router.push('/home/publish');
      },
      getImgSyl(imgs) {
        return {
          backgroundImage: `url(${formatImg(imgs)})`
        };
      }
    },
    watch: {
      location(newVal) {
        if (newVal && this.currentIndex === 1) {
          this.selectCategory(1);
        }
      },
      isLocaErr(newVal) {
        if (newVal && this.currentIndex === 1) {
          this.selectCategory(1);
        }
      }
    },
    components: {
      MFooter,
      Slider,
      Scroll,
      Toast,
      NoResult,
      MallItems
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
      width: 100%;

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

      .sign-wrapper {
        position: absolute;
        top: 0.2rem;
        right: 0.2rem;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        font-size: 0;
        background: rgba(0, 0, 0, 0.6);

        .sign-icon {
          display: inline-block;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: 55% 44%;
          background-size: 0.6rem;
          @include bg-image('sign');
        }
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
      @include border-bottom-1px($color-border);

      .item {
        flex: 1;
        text-align: center;
        font-size: 0;

        .text {
          display: inline-block;
          position: relative;
          font-size: $font-size-medium-xx;
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
    .no-result-wrapper {
      margin-top: 0.2rem;
    }
  }
</style>
