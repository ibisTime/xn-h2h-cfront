<template>
  <div class="cate-wrapper">
    <scroll ref="scroll" :data="goods" @pullingUp="getPageGoods" :hasMore="hasMore">
      <div class="header">
        <router-link class="search" to="/category/search" tag="div">
          <i class="search-icon"></i><span>搜索</span>
        </router-link>
      </div>
      <div class="cates clearfix">
        <div v-for="item in visiableList" class="item" @click="goList(item.code)">
          <img :src="item.pic | formatImg"/>
          <p>{{item.name}}</p>
        </div>
        <div v-if="showAll" class="item" @click="goAllCates">
          <img src="./all.png"/>
          <p>全部</p>
        </div>
      </div>
      <div class="split"></div>
      <mall-items :data="goods"></mall-items>
    </scroll>
    <m-footer @goPublish="goPublish"></m-footer>
    <router-view></router-view>
  </div>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import MFooter from 'components/m-footer/m-footer';
  import MallItems from 'components/mall-items/mall-items';
  import {getPageGoods, getCategories} from 'api/biz';
  import {commonMixin} from 'common/js/mixin';
  import {initShare} from 'common/js/weixin';
  import {setTitle, getShareImg} from 'common/js/util';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        categories: [],
        goods: [],
        start: 1,
        limit: 10,
        hasMore: true,
        showAll: false
      };
    },
    created() {
      this.first = true;
      this.isWxConfiging = false;
      this.wxData = null;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    computed: {
      visiableList() {
        if (this.categories.length > 7) {
          this.showAll = true;
        }
        return this.categories.slice(0, 7);
      }
    },
    methods: {
      shouldGetData() {
        if (/category$/.test(this.$route.path)) {
          setTitle('分类');
          // 当前页面,并且微信sdk未初始化
          if(!this.isWxConfiging && !this.wxData) {
            this.getInitWXSDKConfig();
          }
          return this.first;
        }
        return false;
      },
      getInitData() {
        if (this.shouldGetData()) {
          this.first = false;
          Promise.all([
            this.getPageGoods(),
            this.getCategories()
          ]).catch(() => {});
        }
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
      getPageGoods() {
        return getPageGoods({
          start: this.start,
          limit: this.limit
        }).then((data) => {
          this.goods = this.goods.concat(data.list);
          if (data.totalCount <= this.limit || data.list < this.limit) {
            this.hasMore = false;
          }
          this.start++;
        });
      },
      getCategories() {
        return getCategories(0).then((data) => {
          this.categories = data;
        });
      },
      goList(code) {
        this.$router.push(`/category/list?code=${code}`);
      },
      goAllCates() {
        this.$router.push('/category/categories');
      },
      goPublish() {
        this.$router.push('/category/publish');
      }
    },
    components: {
      Scroll,
      MFooter,
      MallItems
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .cate-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 1rem;

    .header {
      padding: 0.14rem 0.3rem;
      background: #fff;

      .search {
        border-radius: 0.3rem;
        background: #f3f4f8;
        line-height: 0.6rem;
        font-size: 0;
        text-align: center;

        .search-icon {
          display: inline-block;
          width: 0.3rem;
          height: 0.3rem;
          vertical-align: middle;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          @include bg-image('search');
        }

        span {
          padding-left: 0.1rem;
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
      }
    }

    .cates {
      padding: 0.38rem 0.25rem 0.12rem;
      background-color: #fff;

      .item {
        float: left;
        width: 1.75rem;
        margin-bottom: 0.3rem;
        text-align: center;
        overflow: hidden;
        font-size: 0;

        img {
          max-width: 100%;
          width: 0.8rem;
          height: 0.8rem;
        }

        p {
          padding-top: 0.15rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: $font-size-small-s;
        }
      }
    }

    .split {
      height: 0.2rem;
    }
  }
</style>
