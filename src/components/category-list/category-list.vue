<template>
  <transition name="slide">
    <div class="list-wrapper">
      <header class="border-bottom-1px">
        <div class="back" @click="back"></div>
        <div class="search" @click="goSearch">
          <i class="search-icon"></i><span>搜索</span>
        </div>
      </header>
      <div class="filter-wrapper">
        <div class="item area" :class="areaCls" @click="areaClick"><span>{{address}}</span><i class="down-icon icon"></i></div>
        <div class="item pr3" @click="smallClick">{{smallName}}</div>
        <div class="item price-item">价格<div class="up-down">
          <i class="up-icon icon" @click="upClick" :class="upCls"></i>
          <i class="icon down-icon" @click="downClick" :class="downCls"></i>
        </div></div>
        <div class="item" @click="filterClick">筛选<i class="icon select-icon"></i></div>
      </div>
      <div class="split"></div>
      <div class="content-wrapper">
        <scroll :hasMore="hasMore" @pullingUp="getPageGoods" :data="goodsList">
          <mall-items :data="goodsList"></mall-items>
          <no-result v-show="!goodsList.length && !hasMore" class="no-result-wrapper" title="抱歉，暂无商品"></no-result>
        </scroll>
      </div>
      <category-city ref="cityPicker"
                     @hide="handleHide"
                     :outProvIndex="provIndex"
                     :outCityIndex="cityIndex"
                     :outAreaIndex="areaIndex"
                     @cityChose="cityChose"></category-city>
      <category-small ref="smallCategory"
                      @hide="handleSmallHide"
                      @confirm="handleConfirm"
                      @firstUpdateBigName="firstUpdateBigName"
                      :outSmallCode="smallCode"
                      :outBigCode="bigCode"></category-small>
      <category-filter ref="filterCategory"
                       @confirm="handleFilter"
                       :outMinPrice="minPrice"
                       :outMaxPrice="maxPrice"
                       :outPriceIndex="priceIndex"
                       :outIsFree="isFree"
                       :outIsNew="isNew"></category-filter>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import Scroll from 'base/scroll/scroll';
  import NoResult from 'base/no-result/no-result';
  import MallItems from 'components/mall-items/mall-items';
  import CategoryCity from 'components/category-city/category-city';
  import CategorySmall from 'components/category-small/category-small';
  import CategoryFilter from 'components/category-filter/category-filter';
  import {getPageGoods} from 'api/biz';
  import {initShare} from 'common/js/weixin';
  import {setTitle, getShareImg} from 'common/js/util';

  const UP = 'UP';
  const DOWN = 'DOWN';

  export default {
    data() {
      return {
        areaActive: false,
        direction: '',
        province: '',
        provIndex: 0,
        city: '',
        cityIndex: 0,
        area: '',
        areaIndex: 0,
        minPrice: '',
        maxPrice: '',
        priceIndex: -1,
        bigCode: this.$route.query.code || '',
        smallCode: '',
        smallName: '全部',
        smallActive: false,
        isFree: false,
        isNew: false,
        start: 1,
        limit: 10,
        hasMore: true,
        goodsList: []
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
      areaCls() {
        return this.areaActive ? 'active' : '';
      },
      upCls() {
        return this.direction === UP ? 'active' : '';
      },
      downCls() {
        return this.direction === DOWN ? 'active' : '';
      },
      address() {
        if (!this.province) {
          return '全国';
        }
        return this.area || '全部';
      }
    },
    methods: {
      shouldGetData() {
        if (this.$route.path === '/category/list' || this.$route.path === '/category/categories/list') {
          setTitle('商品列表');
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
          this.getPageGoods();
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
      firstUpdateBigName(name) {
        this.smallName = name;
      },
      getPageGoods() {
        let param = {
          start: this.start,
          limit: this.limit,
          province: this.province,
          city: this.city,
          area: this.area,
          type: this.smallCode,
          category: this.bigCode,
          isNew: this.isNew ? '1' : '',
          yunfei: this.isFree ? 0 : '',
          minPrice: this.minPrice,
          maxPrice: this.maxPrice
        };
        if (this.direction) {
          param.orderColumn = 'price';
          param.orderDir = this.direction === UP ? 'asc' : 'desc';
        }
        if (this.$route.query.act) {
          param.isJoin = 1;
        }
        if (this.start === 1) {
          this.hasMore = true;
          this.goodsList = [];
        }
        getPageGoods(param).then((data) => {
          this.goodsList = this.goodsList.concat(data.list);
          if (this.limit > data.list.length || this.limit >= data.totalCount) {
            this.hasMore = false;
          }
          this.start++;
        });
      },
      areaClick() {
        this.areaActive = !this.areaActive;
        this.$refs.smallCategory.hide();
        if (this.areaActive) {
          this.$refs.cityPicker.show();
          this.$refs.cityPicker.initScroll();
        } else {
          this.$refs.cityPicker.hide();
        }
      },
      smallClick() {
        this.smallActive = !this.smallActive;
        this.$refs.cityPicker.hide();
        if (this.smallActive) {
          this.$refs.smallCategory.show();
          this.$refs.smallCategory.initData();
        } else {
          this.$refs.smallCategory.hide();
        }
      },
      upClick() {
        this.direction = this.direction === UP ? '' : UP;
        this.$refs.cityPicker.hide();
        this.$refs.smallCategory.hide();
        this.resetQuery();
      },
      downClick() {
        this.direction = this.direction === DOWN ? '' : DOWN;
        this.$refs.cityPicker.hide();
        this.$refs.smallCategory.hide();
        this.resetQuery();
      },
      filterClick() {
        this.$refs.cityPicker.hide();
        this.$refs.filterCategory.show();
        this.$refs.smallCategory.hide();
      },
      handleHide() {
        this.areaActive = false;
      },
      handleSmallHide() {
        this.smallActive = false;
      },
      cityChose(prov, city, area, provIdx, cityIdx, areaIdx) {
        this.province = prov;
        this.provIndex = provIdx;
        this.city = city;
        this.cityIndex = cityIdx;
        this.area = area;
        this.areaIndex = areaIdx;
        this.resetQuery();
      },
      handleConfirm(bigCode, smallCode, smallName) {
        this.bigCode = bigCode;
        this.smallCode = smallCode;
        this.smallName = smallName;
        this.resetQuery();
      },
      handleFilter(min, max, priceIndex, isFree, isNew) {
        this.minPrice = min;
        this.maxPrice = max;
        this.priceIndex = priceIndex;
        this.isFree = isFree;
        this.isNew = isNew;
        this.resetQuery();
      },
      resetQuery() {
        this.start = 1;
        this.getPageGoods();
      },
      back() {
        this.$router.back();
      },
      goSearch() {
        this.$router.push(this.$route.path + '/search');
      }
    },
    components: {
      Scroll,
      NoResult,
      MallItems,
      CategoryCity,
      CategorySmall,
      CategoryFilter
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .list-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color-background;

    header {
      display: flex;
      padding: 0.14rem 0.3rem;
      padding-left: 0;
      @include border-bottom-1px($color-border);
      background: #fff;

      .back {
        flex: 0 0 0.74rem;
        height: 0.6rem;
        background-repeat: no-repeat;
        background-size: 0.2rem;
        background-position: 0.3rem center;
        @include bg-image('back');
      }

      .search {
        flex: 1;
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

    .filter-wrapper {
      display: flex;
      height: 0.8rem;
      line-height: 0.8rem;
      background: #fff;

      .item {
        flex: 1;
        height: 0.8rem;
        text-align: center;
        font-size: $font-size-medium;

        &.area {
          display: flex;
          overflow: hidden;

          i {
            flex: 0 0 0.36rem;
          }

          span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &.pr3 {
          padding-right: 0.3rem;
        }

        &:first-child {
          padding-left: 0.3rem;
          text-align: left;

          &.active {
            color: $primary-color;
            .down-icon {
              @include bg-image('down-act');
            }
          }
        }

        &:last-child {
          padding-right: 0.3rem;
          text-align: right;
        }

        &.price-item {
          .icon.active {
            @include bg-image('down-act');
          }
        }

        .icon {
          display: inline-block;
          width: 0.36rem;
          height: 100%;
          background-repeat: no-repeat;
        }

        .down-icon {
          vertical-align: middle;
          background-position: 0.12rem center;
          background-size: 0.2rem;
          @include bg-image('down');
        }

        .select-icon {
          vertical-align: middle;
          background-position: 0.12rem center;
          background-size: 0.24rem;
          @include bg-image('select');
        }

        .up-down {
          display: inline-block;
          padding-left: 0.04rem;
          vertical-align: middle;
          width: 0.36rem;
          height: 100%;
          font-size: 0;
          line-height: 1;

          .icon {
            height: 50%;
          }

          .up-icon {
            vertical-align: middle;
            background-position: center 0.04rem;
            background-size: 0.2rem;
            @include bg-image('down');
            transform: rotate(180deg);
          }

          .down-icon {
            background-position: center 0.04rem;
          }
        }
      }
    }

    .split {
      height: 0.2rem;
    }

    .content-wrapper {
      position: absolute;
      top: 1.88rem;
      bottom: 0;
      left: 0;
      width: 100%;

      .no-result-wrapper {
        margin-top: 1.12rem;
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-leave-to, &.slide-enter {
      left: 100%;
    }
  }
</style>
