<template>
  <transition name="slide">
    <div class="activity-wrapper">
      <scroll :data="list" :hasMore="hasMore" @pullingUp="getPageActivity">
        <div class="item" v-for="item in list" @click="goDetail(item)">
          <div class="img" :style="getSyl(item.advPic)"></div>
          <div class="info">{{item.endDatetime | formatDate}}<span class="read">查看详情 ></span></div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>
<script>
  import {mapMutations} from 'vuex';
  import {SET_CURRENT_ACTIVITY} from 'store/mutation-types';
  import Scroll from 'base/scroll/scroll';
  import {setTitle, formatImg} from 'common/js/util';
  import {commonMixin} from 'common/js/mixin';
  import {getPageDiscountActivity} from 'api/biz';

  export default {
    mixins: [commonMixin],
    data() {
      return {
        list: [],
        hasMore: true,
        start: 1,
        limit: 10
      };
    },
    created() {
      this.first = true;
      this.getInitData();
    },
    updated() {
      this.getInitData();
    },
    methods: {
      shouldGetData () {
        if (this.$route.path === '/user/activity') {
          setTitle('活动中心');
          return this.first;
        }
        return false;
      },
      getInitData () {
        if (this.shouldGetData()) {
          this.first = false;
          this.getPageActivity();
        }
      },
      getPageActivity() {
        getPageDiscountActivity(this.start, this.limit).then((data) => {
          this.list = this.list.concat(data.list);
          if (data.totalCount <= this.limit || data.list.length < this.limit) {
            this.hasMore = false;
          }
          this.start++;
        });
      },
      getSyl(pic) {
        return {
          backgroundImage: `url(${formatImg(pic)})`
        };
      },
      goDetail(item) {
        this.setCurActivity(item);
        this.$router.push('/user/activity/' + item.code);
      },
      ...mapMutations({
        setCurActivity: SET_CURRENT_ACTIVITY
      })
    },
    components: {
      Scroll
    }
  };
</script>
<style lang="scss" scoped>
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .activity-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $color-background;

    .item {
      padding: 0.2rem 0.3rem;
      margin-bottom: 0.2rem;
      background: #fff;

      .img {
        height: 3.6rem;
        background-position: center;
        background-size: cover;
      }

      .info {
        margin-top: 0.2rem;
        padding-left: 0.3rem;
        font-size: $font-size-small;
        background-position: left center;
        background-repeat: no-repeat;
        background-size: 0.2rem;
        @include bg-image('time');

        .read {
          float: right;
        }
      }
    }

    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
